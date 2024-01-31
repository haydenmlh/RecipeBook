from rest_framework import permissions

class IsObjectOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == "DELETE": 
            # check here if the user is owner of the post or comment
            return obj.user == request.user

        # else always return True.
        if request.method in ["PUT", "PATCH", "POST"]:
            return obj.user == request.user
        
        return True