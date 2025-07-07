from django.contrib import messages
from django.shortcuts import render,redirect
from .models import Contact





def home(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')

        # Save the contact information to the database
        Contact.objects.create(
            name=name,
            email=email,
            phone=phone,
            message=message
        )
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home')


    return render(request, 'index.html')
