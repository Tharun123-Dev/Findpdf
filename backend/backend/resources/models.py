

# Create your models here.
from django.db import models

class PDF(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='pdfs/')
    image = models.ImageField(upload_to='pdf_images/')
  

class Roadmap(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='roadmaps/')

