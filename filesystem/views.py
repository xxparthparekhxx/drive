from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Folder, File
from .serializers import FolderSerializer, FileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from django.shortcuts import get_object_or_404

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

class ListRootView(generics.ListAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        dirs =  Folder.objects.filter(parent=None,user=self.request.user)
        print(dirs.count())
        if dirs.count() == 0:
            Folder.objects.create(name='root',user=self.request.user)
        return Folder.objects.filter(parent=None,user=self.request.user)

class ListFolderContentsView(generics.ListAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def get_queryset(self):
        folder_id = self.kwargs['id']
        return Folder.objects.filter(parent=folder_id)


class CreateFolderView(generics.CreateAPIView):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={**request.data,"user":request.user.id})
        if serializer.is_valid():
            parent_id = request.data.get('parent_id')
            parent = Folder.objects.get(id=parent_id) if parent_id else None
            serializer.save(parent=parent, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        folder_id = request.data.get('folder_id')
        file_name = request.data.get('name')
        file_obj = request.FILES.get('content')
        
        print(request)
        
        folder = Folder.objects.get(id=folder_id) if folder_id else None
        
        if not file_obj:
            return Response({'error': 'No file was submitted'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the file to storage
        
        # Create the file object
        file_data = {
            "name": file_name,
            'folder': folder.id if folder else None,
            'user': request.user.id,
            "content": file_obj
        }
        
        file_serializer = FileSerializer(data=file_data)
        
        if file_serializer.is_valid():
            file_serializer.save(folder=folder)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteFileView(generics.DestroyAPIView):
    queryset = File.objects.all()
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

class UpdateVisibilityView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def patch(self, request, *args, **kwargs):
        item_id = request.query_params.get('id')
        item_type = request.query_params.get('type', 'folder')

        if item_type == 'folder':
            item = Folder.objects.filter(id=item_id).first()
            serializer = FolderSerializer
        else:
            item = File.objects.filter(id=item_id).first()
            serializer = FileSerializer

        if not item:
            return Response({'error': f'{item_type.capitalize()} not found'}, status=status.HTTP_404_NOT_FOUND)

        item.is_public = True
        item.save()

        return Response(serializer(item).data, status=status.HTTP_200_OK)
    
class DownloadFileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        file_id = kwargs.get('id')
        file = get_object_or_404(File, id=file_id)

        # Open the file in binary mode
        file_handle = file.content.open('rb')

        # Create a FileResponse
        response = FileResponse(file_handle, content_type='application/octet-stream')

        # Set the Content-Disposition header to force download
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'

        return response