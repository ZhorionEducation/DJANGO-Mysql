from django.urls import path
from . import views

app_name = 'auth_client'

urlpatterns = [
    # el path esta vacio porque es la pagina pricipal del modulo de autenticacion, es decir, la pagina de login
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    ##path('register/', views.register_view, name='register'),
]