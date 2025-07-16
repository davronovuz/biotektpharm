from .views import home,product_list
from django.urls import path

urlpatterns = [
    path('', home, name='home'),
    path('products/',product_list, name='product_list'),
]