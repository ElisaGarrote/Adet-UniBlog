import os
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def debug_media(request):
    """Debug endpoint to list media files"""
    try:
        media_root = settings.MEDIA_ROOT
        media_url = settings.MEDIA_URL
        
        # Check if media directory exists
        if not os.path.exists(media_root):
            return JsonResponse({
                'error': 'Media directory does not exist',
                'media_root': media_root,
                'media_url': media_url
            })
        
        # List all files in media directory
        files = []
        for root, dirs, filenames in os.walk(media_root):
            for filename in filenames:
                file_path = os.path.join(root, filename)
                relative_path = os.path.relpath(file_path, media_root)
                file_url = media_url + relative_path.replace('\\', '/')
                files.append({
                    'filename': filename,
                    'relative_path': relative_path,
                    'full_url': file_url,
                    'size': os.path.getsize(file_path)
                })
        
        return JsonResponse({
            'media_root': media_root,
            'media_url': media_url,
            'total_files': len(files),
            'files': files[:20]  # Limit to first 20 files
        })
    
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'media_root': getattr(settings, 'MEDIA_ROOT', 'Not set'),
            'media_url': getattr(settings, 'MEDIA_URL', 'Not set')
        })