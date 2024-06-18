from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Client, Reservation
from .serializers import UserSerializer, ClientSerializer, ReservationSerializer
from rest_framework.views import APIView
from .permissions import IsAuthenticatedOrAdmin

class UserCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        """
        Create a new user.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'user_id': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)  # Filtrar por usuario autenticado

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)  # Filtrar por usuario autenticado

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)
