from django.urls import path
from .views import pdfs, roadmaps,interview_questions

urlpatterns = [
    path("pdfs/", pdfs),
    path("roadmaps/", roadmaps),
    path("interviews/",interview_questions),
]