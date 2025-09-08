from django.contrib import admin
from .models import HeroSection,Contact,FeatureCard

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active")
    list_editable = ("is_active",)



@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'message')



@admin.register(FeatureCard)
class FeatureCardAdmin(admin.ModelAdmin):
    list_display = ('title_uz', 'icon_type', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title_uz','title_ru','title_en')




