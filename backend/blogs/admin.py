from django.contrib import admin
from .models import Blog, Tag, SavedBlog, ReportedBlog

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'blog_title', 'author', 'is_draft', 'views_count', 'created_at']
    list_filter = ['is_draft', 'created_at']
    search_fields = ['blog_title', 'blog_desc', 'author__username']

@admin.register(SavedBlog)
class SavedBlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'blog', 'saved_at']

@admin.register(ReportedBlog)
class ReportedBlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'blog', 'reported_at']