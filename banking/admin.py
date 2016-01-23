from django.contrib import admin
# from django.contrib.auth import models as authm
from .models import *


class ParticipantInline(admin.StackedInline):
    model = Participation
    extra = 0


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'rate')
    fieldsets = (
        (None, {'fields': ('balance', 'rate', 'user')}),
    )
    inlines = [ParticipantInline]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    exclude = ('participants',)
    inlines = [ParticipantInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    fields = ['user', 'event', 'credit', 'debit']
    list_display = ('user', 'event', 'credit', 'debit',)


admin.site.register(EventTemplate)
admin.site.register(Participation)
