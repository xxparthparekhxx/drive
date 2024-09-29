import React, { useState } from 'react';

interface UploadFileProps {
  token: string;
  folderId: number | null;
  onUploadComplete: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ token, folderId, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setFileName(selectedFile.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('content', file);
    formData.append('name', fileName);
    if (folderId) formData.append('folder_id', folderId.toString());

    try {
      const response = await fetch('http://localhost:8000/filesystem/file/upload/', {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
        body: formData,
      });
      if (response.ok) {
        setFile(null);
        setFileName('');
        onUploadComplete();
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fileInput" className="block mb-2">Select File:</label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Upload File
      </button>
    </form>
  );
};

export default UploadFile;