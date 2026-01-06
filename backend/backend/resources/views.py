from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PDF, Roadmap
from .serializers import *

@api_view(['GET','POST'])
def pdfs(request):
    if request.method == 'POST':
        serializer = PDFSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
    return Response(PDFSerializer(PDF.objects.all(), many=True).data)

@api_view(['GET','POST'])
def roadmaps(request):
    if request.method == 'POST':
        serializer = RoadmapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
    return Response(RoadmapSerializer(Roadmap.objects.all(), many=True).data)
