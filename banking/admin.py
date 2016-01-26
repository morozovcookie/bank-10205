from django.contrib import admin
from .models import *


# class ParticipantInline(admin.TabularInline):
#     model = Participation
#     extra = 0


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'rate', 'balance')
    # inlines = [ParticipantInline]
    fields = ('password', 'username', 'first_name', 'last_name', 'email',
              'user_permissions', 'rate', )
    filter_horizontal = ('user_permissions',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    pass


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'date', 'credit', 'debit')


admin.site.register(EventTemplate)
admin.site.register(Transfer)
