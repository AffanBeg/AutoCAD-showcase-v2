FROM python:3.11-slim

# Install FreeCAD and dependencies
RUN apt-get update && apt-get install -y \
    freecad \
    freecad-python3 \
    git \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set up Python environment
ENV PYTHONPATH=/usr/lib/freecad-python3/lib:$PYTHONPATH
ENV LD_LIBRARY_PATH=/usr/lib/freecad-python3/lib:$LD_LIBRARY_PATH
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy worker code
COPY worker.py convert_to_stl.py /app/

# Run worker
CMD ["python", "worker.py"]
