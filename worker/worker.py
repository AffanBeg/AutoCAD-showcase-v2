# Minimal poller skeleton. Backend/Infra Claude will implement the real logic.
import os, time

POLL_INTERVAL = int(os.getenv("POLL_INTERVAL_SECONDS", "5"))

def poll_once():
    print("[worker] polling for new jobs...")
    # TODO: fetch jobs from Supabase, download from cad-uploaded, call convert, upload to cad-converted, update status
    return

if __name__ == "__main__":
    print("[worker] starting...")
    while True:
        try:
            poll_once()
        except Exception as e:
            print("[worker] error:", e)
        time.sleep(POLL_INTERVAL)
