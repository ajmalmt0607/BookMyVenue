from rest_framework.permissions import BasePermission


class IsVenueOwner(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_venue_owner
        )
