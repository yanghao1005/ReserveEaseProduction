from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthenticatedOrAdmin(BasePermission):
    """
    Custom permission to allow access if the user is either authenticated or an admin.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.is_authenticated or request.user.is_staff)
