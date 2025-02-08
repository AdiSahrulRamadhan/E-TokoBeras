import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#4C8BF5' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          E-Toko Beras
        </Link>
        {role && (
          <div className="ml-auto">
            <span className="text-white">Welcome, {role}</span>
            <button className="btn btn-danger ml-3" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
