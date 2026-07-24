from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.venues.services.owner.dashboard_service import OwnerDashboardService

from api.v1.accounts.permissions import IsVenueOwner
from api.v1.owner.serializers import OwnerDashboardSerializer


class OwnerDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsVenueOwner]

    def get(self, request):
        dashboard = OwnerDashboardService.get_dashboard(request.user)
        serializer = OwnerDashboardSerializer(dashboard)

        return Response(serializer.data)
