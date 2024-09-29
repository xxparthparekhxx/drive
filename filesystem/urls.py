
from django.urls import path
from . import views

urlpatterns = [
    path('root/', views.ListRootView.as_view(), name='list-root'),
    path('folder/<int:id>/', views.ListFolderContentsView.as_view(), name='list-folder-contents'),
    path('folder/create/', views.CreateFolderView.as_view(), name='create-folder'),
    path('file/upload/', views.UploadFileView.as_view(), name='upload-file'),
    path('file/delete/<int:id>/', views.DeleteFileView.as_view(), name='delete-file'),
    path('update-visibility/', views.UpdateVisibilityView.as_view(), name='update-visibility'),
    path("download/<int:id>/",views.DownloadFileView.as_view(),name="download-file"),
]
