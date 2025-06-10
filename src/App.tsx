import React, { useState, useEffect } from 'react';
import Login from './login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'employees'>('analysis');

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
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
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'analysis'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                Job Analysis
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'employees'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                Manage Employees
              </button>
            </div>
          </div>
        </div>

        {/* TEMP Test Output */}
        <div className="text-center font-semibold text-green-600 text-lg">
          ✅ Header + Tabs Rendered Successfully
        </div>
      </div>
    </div>
  );
}

export default App;


