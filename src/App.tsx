import React, { useState, useEffect } from 'react';
import Login from './login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // TEMPORARY test block to confirm login rendering works
  return (
    <div style={{ padding: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>
      ✅ Logged in! Rendering started.
    </div>
  );
}
return (
  <div className="min-h-screen py-8 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            🚚
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Swift & Gentle
          </h1>
        </div>
        <p className="text-xl text-gray-600 font-medium">Advanced Job Cost Analyzer</p>
        <p className="text-gray-500 mt-2">Comprehensive profit analysis with detailed business metrics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="glass-card p-2 rounded-2xl">
          <div className="flex gap-2">
            <button className="px-6 py-3 rounded-xl bg-blue-600 text-white shadow-lg">Job Analysis</button>
            <button className="px-6 py-3 rounded-xl bg-white text-gray-600">Manage Employees</button>
          </div>
        </div>
      </div>

      <div className="text-center font-semibold text-green-600">✅ Header + Tabs Rendered Successfully</div>
    </div>
  </div>
);


export default App;


