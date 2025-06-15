from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    - Admins can do anything
    - Everyone else can only GET / HEAD / OPTIONS
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and getattr(request.user, "user_role", None) == "admin"
        )
