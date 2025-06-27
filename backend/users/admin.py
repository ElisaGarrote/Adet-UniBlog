from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ("id", "username", "first_name", "last_name", "colored_user_role", "is_active", "date_joined")
    list_filter = ("user_role", "is_active", "is_staff", "date_joined")
    search_fields = ("username", "first_name", "last_name", "organization", "department")
    ordering = ("id",)
    list_editable = ("is_active",)  # Only allow editing is_active from list view
    list_per_page = 25
    
    def colored_user_role(self, obj):
        """Display user role with color coding"""
        colors = {
            'admin': '#dc3545',     # Red
            'writer': '#007bff',    # Blue  
            'reader': '#28a745',    # Green
        }
        color = colors.get(obj.user_role, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_user_role_display()
        )
    colored_user_role.short_description = 'Role'
    colored_user_role.admin_order_field = 'user_role'
    
    # Add custom actions for bulk role changes
    actions = ['make_writers', 'make_readers', 'make_admins']
    
    def make_writers(self, request, queryset):
        updated = queryset.update(user_role='writer')
        self.message_user(request, f'{updated} users were successfully changed to Writer role.')
    make_writers.short_description = "Change selected users to Writer role"
    
    def make_readers(self, request, queryset):
        updated = queryset.update(user_role='reader')
        self.message_user(request, f'{updated} users were successfully changed to Reader role.')
    make_readers.short_description = "Change selected users to Reader role"
    
    def make_admins(self, request, queryset):
        updated = queryset.update(user_role='admin')
        self.message_user(request, f'{updated} users were successfully changed to Admin role.')
    make_admins.short_description = "Change selected users to Admin role"

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "profilepic")}),
        ("Organization", {"fields": ("organization", "department")}),
        ("Role & Permissions", {"fields": ("user_role", "is_active", "is_staff", "is_superuser")}),
        ("Advanced Permissions", {
            "classes": ("collapse",),
            "fields": ("groups", "user_permissions")
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username", "password1", "password2",
                "first_name", "last_name",
                "organization", "department",
                "user_role", "profilepic"
            ),
        }),
    )
