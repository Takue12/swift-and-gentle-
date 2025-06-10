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

export default App;


