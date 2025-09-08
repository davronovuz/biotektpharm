from django.contrib import messages
from django.shortcuts import render, redirect
from .models import Contact, HeroSection,FeatureCard, AboutSection, TimelineItem


def home(request):
    hero = HeroSection.objects.filter(is_active=True).first()
    features = FeatureCard.objects.filter(is_active=True).order_by('order')
    about = AboutSection.objects.active().first()  # bo‘lsa – olamiz
    timeline = TimelineItem.objects.active().order_by("order")

    if request.method == 'POST':
        Contact.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            message=request.POST.get('message')
        )
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home')

    context={
        'hero': hero,
        'features': features,
        "about": about,
        "timeline": timeline,
    }

    return render(request, 'index.html', context)
