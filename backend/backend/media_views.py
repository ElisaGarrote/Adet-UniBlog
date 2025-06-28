from django.http import HttpResponse, Http404
from django.conf import settings
from django.views.static import serve
import os

def serve_media(request, path):
    """
    Custom media file serving for production
    """
    try:
        # Construct the full file path
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        
        # Check if file exists
        if os.path.exists(file_path):
            return serve(request, path, document_root=settings.MEDIA_ROOT)
        else:
            # Return 404 if file doesn't exist
            raise Http404("Media file not found")
    except Exception as e:
        raise Http404("Error serving media file")
