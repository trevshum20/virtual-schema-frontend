import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3">
      <div className="container-fluid">
        {/* App Title as Link */}
        <Link to="/" className="navbar-brand mb-0 text-dark text-decoration-none">
          <h3 className="mb-0">Virtual Schema Manager</h3>
        </Link>

        {/* Links Section */}
        <div className="d-flex ms-auto">
          <Link to="/" className="nav-link text-primary">
            Home
          </Link>
          <Link to="/about" className="nav-link text-primary">
            About
          </Link>
          <a
            href="https://trevorshumway.com"
            className="nav-link text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            trevorshumway.com
          </a>
          <LogoutButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
