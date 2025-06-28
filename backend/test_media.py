#!/usr/bin/env python
"""
Test script to verify media file serving in production
Run this after deploying to Railway to test if images are accessible
"""
import requests
import json
import sys

def test_backend_endpoints():
    # Update this with your actual Railway backend URL
    BACKEND_URL = "https://valiant-creativity-production.up.railway.app"
    
    print("🧪 Testing UniBlog Backend Media Serving...")
    print(f"Backend URL: {BACKEND_URL}")
    print("-" * 50)
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/health/")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: API root
    print("\n2. Testing API root...")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API root accessible")
            print(f"   Debug mode: {data.get('debug', 'Unknown')}")
        else:
            print(f"❌ API root failed: {response.status_code}")
    except Exception as e:
        print(f"❌ API root error: {e}")
    
    # Test 3: Media debug endpoint
    print("\n3. Testing media debug endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/debug/media/")
        if response.status_code == 200:
            data = response.json()
            print("✅ Media debug endpoint accessible")
            print(f"   Media root: {data.get('media_root', 'Not found')}")
            print(f"   Media URL: {data.get('media_url', 'Not found')}")
            print(f"   Total files: {data.get('total_files', 0)}")
            
            if data.get('files'):
                print("   Sample files:")
                for file in data['files'][:3]:
                    print(f"     - {file['filename']} -> {file['full_url']}")
        else:
            print(f"❌ Media debug failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Media debug error: {e}")
    
    # Test 4: Try to access a sample image
    print("\n4. Testing sample image access...")
    sample_images = [
        "/media/blog_images/ad.jpg",
        "/media/blog_images/bp.jpg", 
        "/media/profile_pics/dks.jpg"
    ]
    
    for image_path in sample_images:
        try:
            image_url = f"{BACKEND_URL}{image_path}"
            response = requests.get(image_url)
            if response.status_code == 200:
                print(f"✅ Image accessible: {image_path}")
                print(f"   Content-Type: {response.headers.get('content-type', 'Unknown')}")
                print(f"   Size: {len(response.content)} bytes")
                break
            else:
                print(f"❌ Image not accessible: {image_path} (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Error accessing {image_path}: {e}")
    
    print("\n" + "=" * 50)
    print("🚀 Test completed!")
    print("\n📋 Next steps if images are not accessible:")
    print("1. Ensure Railway Volume is mounted at /app/media")
    print("2. Re-upload images after volume is attached")
    print("3. Check Railway deployment logs for errors")
    print("4. Verify environment variables are set correctly")

if __name__ == "__main__":
    test_backend_endpoints()
