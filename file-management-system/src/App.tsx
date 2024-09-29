import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import FileSystem from './components/FileSystem';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">File Management System</h1>
      </header>
      <main className="p-4">
        {!token ? (
          <Login setToken={(e)=>{setToken(e);localStorage.setItem('token', e)}} />
        ) : (
          <FileSystem token={token} />
        )}
      </main>
    </div>
  );
};

export default App;
