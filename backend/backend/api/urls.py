from django.urls import path
from .views import *


urlpatterns = [
    path("pdfs/", pdfs),
    path("roadmaps/", roadmaps),
    path("interviews/",interview_questions),

    # ✅ download counters
    path("pdfs/<int:pk>/download/", pdf_download),
    path("roadmaps/<int:pk>/download/", roadmap_download),
    path("interviews/<int:pk>/download/", interview_download),

    # view counters

    path("pdfs/<int:pk>/view/", increment_pdf_view),
    path("roadmaps/<int:pk>/view/", increment_roadmap_view),
    path("interviews/<int:pk>/view/", increment_interview_view),
]