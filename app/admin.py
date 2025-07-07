from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """
    Admin interface for managing contact information.
    """
    list_display = ('name', 'email', 'phone', 'subject')
    search_fields = ('name', 'email', 'subject')
    list_filter = ('subject',)
    ordering = ('-id',)

    def has_add_permission(self, request):
        return False
