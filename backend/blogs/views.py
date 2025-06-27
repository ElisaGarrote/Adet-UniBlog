from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins
from .models import Blog, Tag
from .serializers import BlogSerializer, TagSerializer

class BlogViewSet(viewsets.ModelViewSet):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Blog.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class TagViewSet(
    mixins.ListModelMixin,     # GET /tags/
    mixins.RetrieveModelMixin, # GET /tags/<id>/
    mixins.CreateModelMixin,   # POST /tags/
    mixins.UpdateModelMixin,   # PUT/PATCH
    mixins.DestroyModelMixin,  # DELETE
    viewsets.GenericViewSet
):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]             # ✅ Anyone can read
        return [permissions.IsAdminUser()]  
