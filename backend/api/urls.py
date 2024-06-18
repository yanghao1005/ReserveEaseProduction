from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserCreateView, ClientViewSet, ReservationViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'reservations', ReservationViewSet, basename='reservation')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserCreateView.as_view(), name='create_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
