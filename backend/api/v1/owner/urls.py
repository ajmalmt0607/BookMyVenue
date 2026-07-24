from django.urls import path

from api.v1.owner.views import OwnerDashboardAPIView

urlpatterns = [
    path("dashboard/", OwnerDashboardAPIView.as_view(), name="owner-dashboard"),
]
