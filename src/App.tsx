import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Notepad } from './components/Notepad';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <Notepad onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}

export default App;