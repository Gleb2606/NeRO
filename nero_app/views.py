from django.shortcuts import render

# Создание представления формирования обучающей выборки
def dataset(request):
    return render(request, 'nero_app/dataset.html')

# Создание представления обучения модели ИНС
def train(request):
    return render(request, 'nero_app/train.html')

# Создание представления моделировния ПП
def calculation(request):
    return render(request, 'nero_app/calculation.html')