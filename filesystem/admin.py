from django.contrib import admin
from .models import Folder, File
# Register your models here.
admin.site.register([Folder, File])