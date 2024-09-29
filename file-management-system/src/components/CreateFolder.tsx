import React, { useState } from 'react';

interface CreateFolderProps {
  token: string;
  parentId: number | null;
  onCreateComplete: () => void;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ token, parentId, onCreateComplete }) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/filesystem/folder/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          parent_id: parentId,
        }),
      });
      if (response.ok) {
        setFolderName('');
        onCreateComplete();
      } else {
        throw new Error('Folder creation failed');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="folderName" className="block mb-2">Folder Name:</label>
        <input
          type="text"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Create Folder
      </button>
    </form>
  );
};

export default CreateFolder;
