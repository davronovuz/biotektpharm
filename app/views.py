from django.contrib import messages
from django.shortcuts import render, redirect
from .models import Contact, HeroSection


def home(request):
    hero = HeroSection.objects.filter(is_active=True).first()

    if request.method == 'POST':
        Contact.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            message=request.POST.get('message')
        )
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home')

    return render(request, 'index.html', {'hero': hero})
