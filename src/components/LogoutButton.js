import React from 'react';

function LogoutButton() {
  const handleLogout = () => {
    try {
        let newUrl = process.env.REACT_APP_FRONTEND_BASE_URL + '/logout';
        window.location.href = newUrl;
    } catch(error) {
        console.log("Error logging out: " + error.getMessage());
    }
  };

  return (
    <button className="btn btn-dark" onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
