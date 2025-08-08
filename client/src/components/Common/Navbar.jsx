import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-blue-700 hover:text-blue-800 transition duration-300 select-none"
          aria-label="Homepage"
        >
          CSE Society
        </Link>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-8 font-semibold text-gray-700 tracking-wide">
          {['Clubs', 'Events', 'Notices', 'Scholarships'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative group px-2 py-1 rounded-md hover:text-blue-700 transition duration-300"
            >
              {item}
              <span
                className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Right - Auth / User Controls */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {/* User name with online status */}
              <div className="flex items-center space-x-3 relative group cursor-pointer select-none max-w-[140px] truncate">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-semibold text-sm truncate" title={user?.name}>
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500 italic truncate" title={user?.email}>
                    {user?.email}
                  </span>
                </div>
                <span
                  className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse"
                  aria-label="Online status"
                ></span>
              </div>

              <Link
                to="/dashboard"
                title="Dashboard"
                className="p-2 rounded-md hover:bg-blue-100 transition"
                aria-label="Go to Dashboard"
              >
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
              </Link>

              <Link
                to="/profile"
                title="Profile"
                className="p-2 rounded-md hover:bg-blue-100 transition"
                aria-label="Go to Profile"
              >
                <User className="w-6 h-6 text-blue-600" />
              </Link>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-md hover:bg-red-100 transition"
                aria-label="Logout"
                type="button"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-blue-600 font-semibold px-3 py-1 rounded-md hover:bg-blue-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="ml-2 bg-blue-600 text-white font-semibold px-4 py-1 rounded-md shadow-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu placeholder */}
        <div className="md:hidden">
          {/* Could add hamburger menu here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
