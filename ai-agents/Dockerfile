FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies including hyperon from source
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install git+https://github.com/singularitynet-ai/hyperon-python.git

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["python", "src/aidroute_agent.py"]
