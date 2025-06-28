#!/usr/bin/env python
"""
Script to test media configuration locally before deploying
This helps verify that your settings are working correctly
"""
import os
import django
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage
import requests

def test_local_media_config():
    print("🧪 Testing Local Media Configuration...")
    print("-" * 50)
    
    print(f"DEBUG: {settings.DEBUG}")
    print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
    print(f"MEDIA_URL: {settings.MEDIA_URL}")
    print(f"BACKEND_HOST: {getattr(settings, 'BACKEND_HOST', 'Not set')}")
    
    # Check if media directory exists
    media_root = settings.MEDIA_ROOT
    if os.path.exists(media_root):
        print(f"✅ Media directory exists: {media_root}")
        
        # List blog images
        blog_images_dir = os.path.join(media_root, 'blog_images')
        if os.path.exists(blog_images_dir):
            images = os.listdir(blog_images_dir)
            print(f"✅ Found {len(images)} blog images:")
            for img in images[:5]:  # Show first 5
                print(f"   - {img}")
                # Test URL generation
                relative_path = f"blog_images/{img}"
                full_url = settings.MEDIA_URL + relative_path
                print(f"     URL: {full_url}")
        
        # List profile pics
        profile_pics_dir = os.path.join(media_root, 'profile_pics')
        if os.path.exists(profile_pics_dir):
            pics = os.listdir(profile_pics_dir)
            print(f"✅ Found {len(pics)} profile pictures")
    else:
        print(f"❌ Media directory does not exist: {media_root}")
    
    print("\n" + "=" * 50)
    print("📋 Next Steps:")
    print("1. Start local development server: python manage.py runserver")
    print("2. Test image access at: http://localhost:8000/media/blog_images/ad.jpg")
    print("3. Check debug endpoint: http://localhost:8000/debug/media/")
    print("4. If working locally, deploy to Railway with Volume setup")

if __name__ == "__main__":
    test_local_media_config()
