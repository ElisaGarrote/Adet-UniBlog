# Production Dockerfile for Django Backend

# Build stage: compile dependencies into wheels
FROM python:3.11-slim AS builder

WORKDIR /wheels
COPY requirements.txt ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && pip wheel --no-cache-dir --wheel-dir . -r requirements.txt \
    && rm -rf /var/lib/apt/lists/*

# Final stage: runtime image
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install only runtime dependencies from built wheels
COPY --from=builder /wheels /wheels
COPY requirements.txt ./
RUN pip install --no-index --no-cache-dir --find-links /wheels -r requirements.txt

# Copy application code
COPY . .

# Create media and static directories
RUN mkdir -p /app/media /app/staticfiles \
    && chmod -R 755 /app/media /app/staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy entrypoint script and make it executable
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port (Railway uses PORT env var)
EXPOSE 8000

# Run migrations and start Gunicorn via entrypoint
ENTRYPOINT ["/start.sh"]
