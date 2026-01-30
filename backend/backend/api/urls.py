from django.urls import path
from .views import pdfs, roadmaps,interview_questions,pdf_download, roadmap_download, interview_download


urlpatterns = [
    path("pdfs/", pdfs),
    path("roadmaps/", roadmaps),
    path("interviews/",interview_questions),

    # ✅ download counters
    path("pdfs/<int:pk>/download/", pdf_download),
    path("roadmaps/<int:pk>/download/", roadmap_download),
    path("interviews/<int:pk>/download/", interview_download),
]