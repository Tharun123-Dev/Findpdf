from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login_user(request):
    user = authenticate(
        username=request.data['username'],
        password=request.data['password']
    )
    if user:
        return Response({"success": True})
    return Response({"success": False})
