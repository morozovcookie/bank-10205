from django.contrib import admin
# from django.contrib.auth import models as authm
from .models import *


class ParticipantInline(admin.StackedInline):
    model = Participation


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

admin.site.register(EventTemplate)
admin.site.register(Transactions)
admin.site.register(Participation)
