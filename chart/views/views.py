from django.shortcuts import render


# Create your views here.
def home(request):
    dates = tuple([i for i in range(1, 13)])
    return render(request, 'chart/home.html', {'dates': dates})
