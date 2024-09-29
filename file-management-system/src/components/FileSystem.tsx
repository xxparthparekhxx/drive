import React, { useState, useEffect } from 'react';
import FolderContents from './FolderContents';
import UploadFile from './UploadFile';
import CreateFolder from './CreateFolder';

interface FileSystemProps {
  token: string;
}

const FileSystem: React.FC<FileSystemProps> = ({ token }) => {
  const [rootFolder, setRootFolder] = useState<any>(null);
  const [currentFolder, setCurrentFolder] = useState<any>(null);

  useEffect(() => {
    fetchRootFolder();
  }, []);

  const fetchRootFolder = async () => {
    try {
      const response = await fetch('http://localhost:8000/filesystem/root/', {
        headers: { 'Authorization': `Token ${token}` },
      });
      const data = await response.json();
      const res = await fetch(`http://localhost:8000/filesystem/folder/${data[0].id}/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      const folders = await res.json();
      setRootFolder({...data[0],"subfolders":folders});
      setCurrentFolder({...data[0],"subfolders":folders});
    } catch (error) {
      console.error('Error fetching root folder:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Current Folder: {currentFolder?.name}</h2>
        <FolderContents
          folder={currentFolder}
          token={token}
          onFolderClick={async(e)=>{await setCurrentFolder(e);}}
          onBack={() => setCurrentFolder(rootFolder)}
        />
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Upload File</h2>
        <UploadFile token={token} folderId={currentFolder?.id} onUploadComplete={fetchRootFolder} />
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create Folder</h2>
        <CreateFolder token={token} parentId={currentFolder?.id} onCreateComplete={fetchRootFolder} />
      </div>
    </div>
  );
};

export default FileSystem;
