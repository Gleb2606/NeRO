from django.urls import path
from . import views

urlpatterns = [
    # Страница создания обучающего набора данных
    path('dataset/', views.dataset, name='dataset'),

    # Страница обучения модели ИНС
    path('train/', views.train, name='train'),

    # Страница моделирования переходных процессов
    path('calculation/', views.calculation, name='calculation'),

    # Страница аутентификации пользователя
    path('', views.user_login, name='login'),

    # Страница аутентификации пользователя
    path('seed/', views.seed_db, name='seed')
]