# Multi-stage production Dockerfile for Vantage AI FastAPI Backend
# Lightweight, hardened, deployable to Render Free Tier or Google Cloud Run
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    APP_ENV=production

WORKDIR /app

# Install minimal OS dependencies for network & crypto
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Expose port (Render & Cloud Run inject PORT env var)
EXPOSE 8000

# Run uvicorn server with production flags
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
