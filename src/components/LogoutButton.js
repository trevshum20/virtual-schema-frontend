import React from 'react';
import { clearToken } from '../auth/token';

function LogoutButton() {
  const handleLogout = () => {
    try {
        clearToken();
        window.location.href = '/login';
    } catch(error) {
        console.log("Error logging out: " + error.getMessage());
    }
  };

  return (
    <button className="btn btn-dark" onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
