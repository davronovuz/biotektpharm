from django.contrib import admin
from .models import HeroSection,Contact,FeatureCard



@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("__str__", "is_active")
    list_filter  = ("is_active",)
    fieldsets = (
        ("UZ", {"fields": ("title_uz", "subtitle_uz")}),
        ("RU", {"fields": ("title_ru", "subtitle_ru")}),
        ("EN", {"fields": ("title_en", "subtitle_en")}),
        ("Media & Status", {"fields": ("background", "is_active")}),
    )



@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'message')



@admin.register(FeatureCard)
class FeatureCardAdmin(admin.ModelAdmin):
    list_display = ('title_uz', 'icon_type', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title_uz','title_ru','title_en')




from django.contrib import admin
from .models import AboutSection


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ("overline_uz", "is_active")
    list_filter = ("is_active",)
    search_fields = ("overline_uz", "title_line1_uz", "title_line2_uz")
    fieldsets = (
        ("Ko‘rinish", {
            "fields": ("is_active", "hero_image")
        }),
        ("Overline", {
            "fields": ("overline_uz", "overline_ru", "overline_en")
        }),
        ("Sarlavha – 1 qator", {
            "fields": ("title_line1_uz", "title_line1_ru", "title_line1_en")
        }),
        ("Sarlavha – 2 qator", {
            "fields": ("title_line2_uz", "title_line2_ru", "title_line2_en")
        }),
        ("Qisqa kirish matn", {
            "fields": ("intro_uz", "intro_ru", "intro_en")
        }),
    )

    # ixtiyoriy: About bitta bo‘lsin desangiz — qo‘shimcha guard
    def has_add_permission(self, request):
        if AboutSection.objects.count() >= 1:
            return False
        return super().has_add_permission(request)


# apps/about/admin.py
from django.contrib import admin
from .models import CompanyIntro, HistoryCard

@admin.register(CompanyIntro)
class CompanyIntroAdmin(admin.ModelAdmin):
    list_display = ("title_uz", "is_active")
    list_editable = ("is_active",)
    fieldsets = (
        (None, {"fields": ("is_active",)}),
        ("Sarlavha", {"fields": ("title_uz","title_ru","title_en")}),
        ("Matn", {"fields": ("text_uz","text_ru","text_en")}),
        ("Rasm", {"fields": ("photo",)}),
    )

@admin.register(HistoryCard)
class HistoryCardAdmin(admin.ModelAdmin):
    list_display = ("order","year","title_uz","is_active")
    search_fields = ("title_uz","year")
    list_filter = ("is_active",)
    fieldsets = (
        (None, {"fields": ("is_active","order","year")}),
        ("Sarlavha", {"fields": ("title_uz","title_ru","title_en")}),
        ("Matn", {"fields": ("text_uz","text_ru","text_en")}),
        ("Ikon", {"fields": ("icon_type","fa_class","icon_image")}),
        ("Rasm", {"fields": ("photo",)}),
    )




from django.contrib import admin
from .models import ServiceCard, PartnerCard

@admin.register(ServiceCard)
class ServiceCardAdmin(admin.ModelAdmin):
    list_display  = ("order", "title_uz", "icon_type", "is_active")
    list_filter   = ("is_active", "icon_type")
    search_fields = ("title_uz", "title_ru", "title_en", "text_uz", "text_ru", "text_en")
    fieldsets = (
        ("Ko‘rinish", {"fields": ("is_active", "order")}),
        ("Matnlar", {"fields": (
            ("title_uz", "title_ru", "title_en"),
            ("text_uz", "text_ru", "text_en"),
        )}),
        ("Belgi (ikon)", {"fields": ("icon_type", "fa_class", "icon_image"),
                          "description": "FA ishlatsangiz faqat <b>fa_class</b> to‘ldiring; rasm ishlatsangiz <b>icon_image</b> yuklang."}),
    )


@admin.register(PartnerCard)
class PartnerCardAdmin(admin.ModelAdmin):
    list_display  = ("order", "name_uz", "url", "is_active")
    list_filter   = ("is_active",)
    search_fields = ("name_uz", "name_ru", "name_en")
    readonly_fields = ()
    fieldsets = (
        ("Ko‘rinish", {"fields": ("is_active", "order")}),
        ("Nom va izoh", {"fields": (
            ("name_uz", "name_ru", "name_en"),
            ("note_uz", "note_ru", "note_en"),
        )}),
        ("Logo va havola", {"fields": ("logo", "url"),
                            "description": "Logo: SVG/PNG, 320×160 tavsiya. Havola ixtiyoriy."}),
    )



# main/admin.py
from django.contrib import admin
from .models import Location

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display  = ("region","phone","is_active")
    list_editable = ("is_active",)
    search_fields = ("name_uz","name_ru","name_en","address_uz","address_ru","address_en","phone")
    list_filter   = ("is_active","region")
    fieldsets = (
        ("Asosiy", {"fields": ("region","is_active")}),
        ("Nom (3 til)", {"fields": ("name_uz","name_ru","name_en")}),
        ("Manzil (3 til)", {"fields": ("address_uz","address_ru","address_en")}),
        ("Telefon / Ish vaqti", {"fields": ("phone","time_uz","time_ru","time_en")}),
    )
