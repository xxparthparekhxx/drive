import React from 'react';
import DownloadButton from './DownloadButton';

interface FolderContentsProps {
  folder: any;
  token: string;
  onFolderClick: (folder: any) => void;
  onBack: () => void;
}

const FolderContents: React.FC<FolderContentsProps> = ({ folder, token, onFolderClick, onBack }) => {
  const handleDeleteFile = async (fileId: number) => {
    try {
      await fetch(`http://localhost:8000/filesystem/file/delete/${fileId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });
      // Refresh folder contents after deletion
      onFolderClick(folder);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleUpdateVisibility = async (itemId: number, itemType: 'folder' | 'file') => {
    try {
      await fetch(`http://localhost:8000/filesystem/update-visibility/?id=${itemId}&type=${itemType}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Token ${token}` },
      });
      // Refresh folder contents after updating visibility
      onFolderClick(folder);
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  return (
    <div>
      {folder?.parent && (
        <button onClick={onBack} className="mb-4 bg-gray-200 px-4 py-2 rounded">
          Back
        </button>
      )}
      <ul className="space-y-2">
        {folder?.subfolders?.map((subfolder: any) => (
          <li key={subfolder.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="cursor-pointer" onClick={() => onFolderClick(subfolder)}>
              📁 {subfolder.name}
            </span>
            <button
              onClick={() => handleUpdateVisibility(subfolder.id, 'folder')}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              {subfolder.is_public ? 'Make Private' : 'Make Public'}
            </button>
          </li>
        ))}
        {folder?.files?.map((file: any) => (
          <li key={file.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span>📄 {file.name}</span>
            <div className='flex flex-row'>
              <button
                onClick={() => handleUpdateVisibility(file.id, 'file')}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
              >
                {file.is_public ? 'Make Private' : 'Make Public'}
              </button>
              <button
                onClick={() => handleDeleteFile(file.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
              <DownloadButton
                fileId={file.id}
                fileName={file.name}
                authToken={localStorage.getItem('token') || ''}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderContents;
