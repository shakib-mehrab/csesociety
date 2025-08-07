import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          CSE Society
        </Link>

        {/* Center - Navigation Links */}
        <div className="space-x-4 text-gray-700 font-medium">
          <Link to="/clubs" className="hover:text-blue-600 transition">Clubs</Link>
          <Link to="/events" className="hover:text-blue-600 transition">Events</Link>
          <Link to="/notices" className="hover:text-blue-600 transition">Notices</Link>
          <Link to="/scholarships" className="hover:text-blue-600 transition">Scholarships</Link>
        </div>

        {/* Right - Auth / User Controls */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* User name with green dot for online status */}
              <div className="flex items-center space-x-1 relative">
                <span className="text-sm text-gray-600 italic truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="absolute top-0 right-[-10px] h-2 w-2 rounded-full bg-green-500 animate-pulse border-2 border-white"></span>
              </div>

              <Link to="/dashboard" title="Dashboard">
                <LayoutDashboard className="w-5 h-5 hover:text-blue-600 transition" />
              </Link>

              <Link to="/profile" title="Profile">
                <User className="w-5 h-5 hover:text-blue-600 transition" />
              </Link>

              <button onClick={logout} title="Logout">
                <LogOut className="w-5 h-5 hover:text-red-600 transition" />
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-blue-600 transition">Sign In</Link>
              <Link to="/signup" className="hover:text-blue-600 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
