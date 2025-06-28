# Production Dockerfile for Django Backend

FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create media and static directories
RUN mkdir -p /app/media /app/staticfiles
RUN chmod -R 755 /app/media /app/staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy and set entrypoint script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port (Railway uses PORT env var)
EXPOSE 8000

# Start script handles migrations & server launch
ENTRYPOINT ["/start.sh"]
