# views.py
from django.contrib import messages
from django.shortcuts import render, redirect
from django.utils.translation import get_language

from .models import (
    Contact, HeroSection, FeatureCard, AboutSection, CompanyIntro,
    HistoryCard, ServiceCard, PartnerCard,
    Location, Region,   # <<— YANGI
)

def home(request):

    hero = HeroSection.objects.filter(is_active=True).first()
    features = FeatureCard.objects.filter(is_active=True).order_by('order')
    about_manager = AboutSection.objects
    about_qs = about_manager.active() if callable(getattr(about_manager, "active", None)) else about_manager.all()
    about = about_qs.first()
    intro = CompanyIntro.objects.filter(is_active=True).first()
    history_cards = HistoryCard.objects.filter(is_active=True).order_by("order")
    service_cards = ServiceCard.objects.filter(is_active=True).order_by("order")
    partner_cards = PartnerCard.objects.filter(is_active=True).order_by("order")

    # --- kontakt form POST ---
    if request.method == 'POST':
        Contact.objects.create(
            name=request.POST.get('name', '').strip(),
            email=request.POST.get('email', '').strip(),
            phone=request.POST.get('phone', '').strip(),
            message=request.POST.get('message', '').strip()
        )
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home')


    wanted = [Region.KHOREZM, Region.SAMARKAND, Region.TASHKENT, Region.FERGHANA]
    loc_qs = Location.objects.filter(is_active=True, region__in=wanted)
    loc_map = {loc.region: loc for loc in loc_qs}

    # Fallback’li payload tayyorlovchi helper
    def payload(obj, default_name):
        if not obj:
            return {
                "name_uz": default_name, "name_ru": default_name, "name_en": default_name,
                "address_uz": "", "address_ru": "", "address_en": "",
                "phone": "", "time_uz": "", "time_ru": "", "time_en": ""
            }
        return {
            "name_uz": obj.name_uz or default_name,
            "name_ru": obj.name_ru or obj.name_uz or default_name,
            "name_en": obj.name_en or obj.name_uz or default_name,
            "address_uz": obj.address_uz or "",
            "address_ru": obj.address_ru or "",
            "address_en": obj.address_en or "",
            "phone": obj.phone or "",
            "time_uz": obj.time_uz or "",
            "time_ru": obj.time_ru or "",
            "time_en": obj.time_en or "",
        }

    locs = {
        "khorezm":  payload(loc_map.get(Region.KHOREZM),  "Xorazm"),
        "samarkand":payload(loc_map.get(Region.SAMARKAND),"Samarqand"),
        "tashkent": payload(loc_map.get(Region.TASHKENT), "Toshkent"),
        "ferghana": payload(loc_map.get(Region.FERGHANA), "Farg‘ona"),
    }

    # joriy til (template’dagi i18n-db uchun kerak bo‘lsa)
    lang = (get_language() or "uz")[:2]

    context = {
        'hero': hero,
        'features': features,
        "about": about,
        "intro": intro,
        "history_cards": history_cards,
        "service_cards": service_cards,
        "partner_cards": partner_cards,

        # YANGI:
        "locs": locs,
        "lang": lang,
    }
    return render(request, 'index.html', context)
