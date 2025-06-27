from django.contrib import admin
from .models import Blog, Tag, SavedBlog, ReportedBlog, BlogView, ReadingHistory

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

@admin.register(BlogView)
class BlogViewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'blog', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['user__username', 'blog__blog_title', 'ip_address']

@admin.register(ReadingHistory)
class ReadingHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'blog', 'read_at']
    list_filter = ['read_at']
    search_fields = ['user__username', 'blog__blog_title']