from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Ссылка на приложение
    path('', include('nero_app.urls')),
]
