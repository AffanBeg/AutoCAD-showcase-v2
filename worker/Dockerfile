FROM python:3.11-slim

RUN apt-get update && apt-get install -y git wget ca-certificates && rm -rf /var/lib/apt/lists/*

# (Optional) Install FreeCAD CLI if available via apt; many use containerized FreeCAD or headless builds.
# You may instead mount FreeCAD via a separate image or use freecad/freecad base.

WORKDIR /app
COPY worker.py convert_to_stl.py /app/

RUN pip install --no-cache-dir supabase==2.4.0

CMD [ "python", "worker.py" ]
