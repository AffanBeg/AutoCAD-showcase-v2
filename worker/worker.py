import os
import time
import tempfile
from supabase import create_client, Client
from typing import Optional, Dict, Any
from convert_to_stl import convert_to_stl

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL_SECONDS", "5"))

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def download_file(input_path: str) -> str:
    """Download file from cad-uploaded bucket to /tmp"""
    try:
        print(f"[worker] downloading {input_path}")

        # Download file from storage
        response = supabase.storage.from_("cad-uploaded").download(input_path)

        # Save to temp file
        file_ext = input_path.split('.')[-1]
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}")
        temp_file.write(response)
        temp_file.close()

        print(f"[worker] saved to {temp_file.name}")
        return temp_file.name

    except Exception as e:
        raise Exception(f"Download failed: {e}")

def upload_converted_file(local_path: str, user_id: str, job_id: str) -> str:
    """Upload converted STL to cad-converted bucket"""
    try:
        print(f"[worker] uploading {local_path}")

        # Generate output path
        filename = f"{job_id}.stl"
        output_path = f"{user_id}/{filename}"

        # Read file
        with open(local_path, 'rb') as f:
            file_data = f.read()

        # Upload to cad-converted bucket
        response = supabase.storage.from_("cad-converted").upload(
            output_path,
            file_data,
            {"content-type": "model/stl"}
        )

        print(f"[worker] uploaded to {output_path}")
        return output_path

    except Exception as e:
        raise Exception(f"Upload failed: {e}")

def poll_once():
    """Poll for queued jobs and process them"""
    print("[worker] polling for new jobs...")

    try:
        # Fetch oldest queued job
        response = supabase.table("jobs").select("*").eq("status", "queued").order("created_at", desc=False).limit(1).execute()

        if not response.data or len(response.data) == 0:
            print("[worker] no jobs in queue")
            return

        job = response.data[0]
        print(f"[worker] found job {job['id']}")

        # Claim job by updating status to 'running'
        supabase.table("jobs").update({
            "status": "running",
            "started_at": "now()"
        }).eq("id", job["id"]).eq("status", "queued").execute()

        # Process job
        process_job(job)

    except Exception as e:
        print(f"[worker] error in poll_once: {e}")

def process_job(job: Dict[str, Any]):
    """Process a single job: download -> convert -> upload -> update status"""
    job_id = job["id"]
    showcase_id = job["showcase_id"]
    input_path = job["input_path"]

    try:
        print(f"[worker] processing job {job_id}")

        # Extract user_id from input_path (format: user_id/filename.ext)
        user_id = input_path.split('/')[0]

        # 1. Download file from cad-uploaded bucket
        local_input = download_file(input_path)

        # 2. Convert to STL using FreeCAD
        local_output = local_input.replace(os.path.splitext(local_input)[1], ".stl")
        convert_to_stl(local_input, local_output)

        # 3. Upload to cad-converted bucket
        output_path = upload_converted_file(local_output, user_id, job_id)

        # 4. Update job status to complete
        supabase.table("jobs").update({
            "status": "complete",
            "output_path": output_path,
            "finished_at": "now()"
        }).eq("id", job_id).execute()

        # 5. Update showcase status to ready
        supabase.table("showcases").update({
            "status": "ready",
            "output_path": output_path
        }).eq("id", showcase_id).execute()

        print(f"[worker] job {job_id} completed successfully")

        # 6. Clean up temp files
        os.remove(local_input)
        os.remove(local_output)

    except Exception as e:
        print(f"[worker] job {job_id} failed: {e}")

        # Update job status to failed
        supabase.table("jobs").update({
            "status": "failed",
            "finished_at": "now()",
            "error": str(e)
        }).eq("id", job_id).execute()

        # Update showcase status to failed
        supabase.table("showcases").update({
            "status": "failed"
        }).eq("id", showcase_id).execute()

if __name__ == "__main__":
    print("[worker] starting...")
    print(f"[worker] Supabase URL: {SUPABASE_URL}")
    print(f"[worker] Poll interval: {POLL_INTERVAL}s")

    # Test connection
    try:
        response = supabase.table("jobs").select("count").limit(1).execute()
        print("[worker] Supabase connection successful")
    except Exception as e:
        print(f"[worker] Supabase connection failed: {e}")
        exit(1)

    while True:
        try:
            poll_once()
        except Exception as e:
            print(f"[worker] error: {e}")
        time.sleep(POLL_INTERVAL)
