import React from 'react';

function LogoutButton() {
  const handleLogout = () => {
    try {
        window.location.href = "http://localhost:8080/logout";
    } catch(error) {
        console.log("Error logging out: " + error.getMessage());
    }
  };

  return (
    <button className="btn btn-dark" onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
