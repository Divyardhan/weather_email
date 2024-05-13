from django.urls import path
from . import views

urlpatterns = [
    path('update_location/', views.update_location, name='update_location'),
    path('verify_email_send/', views.verify_email_send, name='verify_email_send'),
    path('verify/<str:email>/', views.verify, name='verify'),
    path('pwdreset/<str:email>/', views.pwdreset, name='pwdreset'),
    path('pwdreset/', views.pwdreset, name='pwdreset'),
    path('', views.show_user_db, name='show_user_db'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('dashbboard/', views.dashboard, name='dashboard'),
    path('download/', views.download, name='download'),
    path('delete/', views.delete, name='delete'),
    path('edit/', views.edit, name='edit'),
    path('fpwd/', views.fpwd, name='fpwd'),
    path('send_pwd_email/', views.send_pwd_email, name='send_pwd_email'),
    path('weather_report/<str:location>/', views.weather_report, name='weather_report'),
    path('query/', views.query, name='query'),
    path('getAllQuery/<str:email>/', views.getAllQuery, name='get_all_query'), 
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin_dashboard/<str:word>/', views.admin_dashboard, name='admin_dashboard'),
    path('search_user/<str:word>/', views.search_user, name='search_user'),
    path('disableUser/<str:email>/', views.disableUser, name='disableUser'),
    path('queryUpdate/<str:queryid>/', views.queryUpdate, name='queryUpdate'),
]
