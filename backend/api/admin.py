from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import User, Restaurant, Client, Reservation

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('restaurant',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()

class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'created_at')
    search_fields = ('name', 'email')
    ordering = ('-created_at',)

class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'restaurant', 'created_at')
    search_fields = ('name', 'phone_number', 'email')
    list_filter = ('restaurant',)
    ordering = ('-created_at',)

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('client', 'restaurant', 'reservation_date', 'guest_count', 'status', 'created_at')
    list_filter = ('status', 'reservation_date', 'restaurant')
    search_fields = ('client__name', 'restaurant__name')
    ordering = ('-reservation_date',)

# Register the customized Admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Restaurant, RestaurantAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Reservation, ReservationAdmin)

# Unregister the Group model from admin as we are not using it
admin.site.unregister(Group)
