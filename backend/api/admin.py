from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import User, Client, Reservation

class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'phone_number', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'phone_number')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'name', 'phone_number'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)
    filter_horizontal = ()
    readonly_fields = ('created_at',)

class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'email', 'user', 'created_at')
    search_fields = ('name', 'phone_number', 'email')
    list_filter = ('user',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('client', 'user', 'reservation_date', 'guest_count', 'status', 'created_at')
    list_filter = ('status', 'reservation_date', 'user')
    search_fields = ('client__name', 'user__name')
    ordering = ('-reservation_date',)
    readonly_fields = ('created_at',)

# Register the customized Admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Reservation, ReservationAdmin)

# Unregister the Group model from admin as we are not using it
admin.site.unregister(Group)
