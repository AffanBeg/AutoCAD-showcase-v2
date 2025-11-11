FROM python:3.11-slim
RUN apt-get update && apt-get install -y git wget ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY worker.py convert_to_stl.py /app/
RUN pip install --no-cache-dir supabase==2.4.0
CMD [ "python", "worker.py" ]
