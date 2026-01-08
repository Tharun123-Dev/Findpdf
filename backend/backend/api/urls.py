from django.urls import path
from .views import pdfs, roadmaps

urlpatterns = [
    path("pdfs/", pdfs),
    path("roadmaps/", roadmaps),
]