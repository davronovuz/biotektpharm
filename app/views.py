from django.contrib import messages
from django.shortcuts import render,redirect
from .models import Contact,ProductCategory,Product





def home(request):
    categories = ProductCategory.objects.all()
    products = Product.objects.all()[:3]

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

    context = {
        'categories': categories,
        'products': products
    }


    return render(request, 'index.html',context)


from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from .models import Product, ProductCategory, Contact


def product_list(request):
    # Barcha mahsulotlarni olish
    products = Product.objects.all().order_by('-created_at')

    # Kategoriya bo'yicha filtr
    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category__id=category_id)

    # Qidiruv funksiyasi
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(title__icontains=search_query)

    # Paginatsiya (sahifalash)
    paginator = Paginator(products, 4)  # Har bir sahifada 12 ta mahsulot
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Barcha kategoriyalarni olish
    categories = ProductCategory.objects.all()

    context = {
        'products': page_obj,
        'categories': categories,
        'selected_category': int(category_id) if category_id else None,
        'search_query': search_query if search_query else ''
    }
    return render(request, 'product_list.html', context)