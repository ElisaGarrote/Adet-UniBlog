# Production Dockerfile

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    pkg-config \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create necessary directories
RUN mkdir -p staticfiles
RUN mkdir -p media
RUN mkdir -p media/blog_images
RUN mkdir -p media/profile_pics

# Set permissions for media directory
RUN chmod -R 755 media

# Collect static files (skip on errors)
RUN python manage.py collectstatic --noinput || echo "Static file collection failed, continuing..."

CMD ["sh", "-c", "python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT"]
