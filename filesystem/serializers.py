from rest_framework import serializers
from .models import Folder, File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'folder', 'user', 'content', 'is_public', 'created_at', 'updated_at'] 

class FolderSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)
    class Meta:
        model = Folder
        fields = ['id', 'name', 'user', 'parent', 'is_public', 'created_at', 'updated_at',"files"]

