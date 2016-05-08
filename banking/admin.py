from django.contrib import admin
from .models import *


# class ParticipantInline(admin.TabularInline):
#     model = Participation
#     extra = 0


@admin.register(Account)
class UserAdmin(admin.ModelAdmin):
    pass
    list_display = ('user', 'rate', 'balance')
    # inlines = [ParticipantInline]
    # fields = ('password', 'username', 'first_name', 'last_name', 'email',
    #           'user_permissions', 'rate', )
    # filter_horizontal = ('user_permissions',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'price', 'rest')
    pass


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('participation', 'date', 'credit', 'debit', 'type')


@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('date', 'event', 'account', 'parts', 'active')

admin.site.register(EventTemplate)
admin.site.register(Transfer)
