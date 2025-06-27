from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Blog, Tag, SavedBlog, ReportedBlog
from .serializers import BlogSerializer, TagSerializer, SavedBlogSerializer, ReportedBlogSerializer

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

class SavedBlogViewSet(viewsets.ModelViewSet):
    serializer_class = SavedBlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedBlog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if blog is already saved by this user
        blog_id = serializer.validated_data['blog'].id
        if SavedBlog.objects.filter(user=self.request.user, blog_id=blog_id).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You have already saved this blog.")
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_by_blog(self, request):
        """Remove a saved blog by blog ID"""
        blog_id = request.data.get('blog')
        if not blog_id:
            return Response({'error': 'Blog ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            saved_blog = SavedBlog.objects.get(user=request.user, blog_id=blog_id)
            saved_blog.delete()
            return Response({'message': 'Blog removed from saved list'}, status=status.HTTP_204_NO_CONTENT)
        except SavedBlog.DoesNotExist:
            return Response({'error': 'Saved blog not found'}, status=status.HTTP_404_NOT_FOUND)

class ReportedBlogViewSet(viewsets.ModelViewSet):
    serializer_class = ReportedBlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin can see all reported blogs, users can see only their own reports
        if self.request.user.is_staff:
            return ReportedBlog.objects.all()
        return ReportedBlog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
