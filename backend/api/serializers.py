from rest_framework import serializers
from .models import User, Client, Reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'phone_number', 'email', 'created_at']
        read_only_fields = ['created_at']

class ReservationSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True
    )

    class Meta:
        model = Reservation
        fields = ['id', 'client', 'client_id', 'reservation_date', 'guest_count', 'status', 'created_at', 'notes']
        read_only_fields = ['created_at']
