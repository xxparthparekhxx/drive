import React, { useState } from 'react';

interface DownloadButtonProps {
  fileId: number;
  fileName: string;
  authToken: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ fileId, fileName, authToken }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/filesystem/download/${fileId}`, {
        method: 'GET',
        headers: { Authorization: `Token ${authToken}` },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-500 text-white px-2 py-1 rounded text-sm ml-2 flex items-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {isLoading ? 'Downloading...' : 'Download'}
    </button>
  );
};

export default DownloadButton;
