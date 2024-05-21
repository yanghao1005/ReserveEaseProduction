from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Restaurant, User, Client, Reservation
from .serializers import RestaurantSerializer, UserSerializer, ClientSerializer, ReservationSerializer
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
    
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticatedOrAdmin]

    def delete(self, request, pk, format=None):
        """
        Delete a user by ID.
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# View for listing all restaurants (admin only) and creating a restaurant
class RestaurantListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get(self, request, format=None):
        """
        List all restaurants (admin only).
        """
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Create a new restaurant and link it to the user.
        Ensure that the user does not already have a restaurant.
        """
        # Check if the user already has a restaurant
        if hasattr(request.user, 'restaurant') and request.user.restaurant:
            return Response({"detail": "User already has a restaurant."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            restaurant = serializer.save()
            # Link the restaurant to the user
            request.user.restaurant = restaurant
            request.user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for retrieving, updating, and deleting a specific restaurant
class RestaurantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request):
        """
        Helper method to get the user's restaurant.
        """
        try:
            return request.user.restaurant
        except Restaurant.DoesNotExist:
            return None

    def get(self, request, format=None):
        """
        Retrieve the user's restaurant.
        """
        restaurant = self.get_object(request)
        if restaurant is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

    def put(self, request, format=None):
        """
        Update the user's restaurant.
        """
        restaurant = self.get_object(request)
        if restaurant is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        """
        Delete the user's restaurant.
        """
        restaurant = self.get_object(request)
        if restaurant is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        restaurant.delete()
        request.user.restaurant = None
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    def perform_create(self, serializer):
        """
        Override perform_create to set the restaurant based on the authenticated user.
        """
        user = self.request.user
        if not user.restaurant:
            raise serializers.ValidationError("User does not have an associated restaurant.")
        serializer.save(restaurant=user.restaurant)

class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        """
        Override perform_create to set the restaurant based on the authenticated user.
        """
        user = self.request.user
        if not user.restaurant:
            raise serializers.ValidationError("User does not have an associated restaurant.")
        serializer.save(restaurant=user.restaurant)