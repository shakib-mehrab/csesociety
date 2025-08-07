import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">CSE Society</Link>
        <div>
          <Link to="/clubs" className="p-2">Clubs</Link>
          <Link to="/events" className="p-2">Events</Link>
          <Link to="/notices" className="p-2">Notices</Link>
          <Link to="/scholarships" className="p-2">Scholarships</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="p-2">Dashboard</Link>
              <Link to="/profile" className="p-2">Profile</Link>
              <button onClick={logout} className="p-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="p-2">Sign In</Link>
              <Link to="/signup" className="p-2">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
