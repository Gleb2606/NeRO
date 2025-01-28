from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label="Имя пользователя", max_length=150,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))

    password = forms.CharField(label="Пароль",
                               widget=forms.PasswordInput(attrs={'class': 'form-control'}))

# Создание представления аутентификации пользователя
def user_login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/dataset')  # Перенаправление на главную страницу
            else:
                messages.error(request, "Неверное имя пользователя или пароль.")
    else:
        form = LoginForm()  # Если запрос GET, создаем пустую форму

    return render(request, 'nero_app/login.html', {'form': form})

# Создание представления формирования обучающей выборки
def dataset(request):
    return render(request, 'nero_app/dataset.html')

# Создание представления обучения модели ИНС
def train(request):
    return render(request, 'nero_app/train.html')

# Создание представления моделирования ПП
def calculation(request):
    return render(request, 'nero_app/calculation.html')

# Создание представления для заполнения БД
def seed_db(request):
    return render(request, 'nero_app/seed_database.html')