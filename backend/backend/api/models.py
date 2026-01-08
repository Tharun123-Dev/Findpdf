

# Create your models here.
from django.db import models

class PDF(models.Model):
    title = models.CharField(max_length=200)
    file_url = models.URLField()
    image_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

class Roadmap(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)