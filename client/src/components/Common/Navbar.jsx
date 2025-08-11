import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav
      className="shadow-lg sticky top-0 z-50 border-b border-[#01457e]"
      style={{
        background: 'linear-gradient(90deg, #002147, #01457e, #6aa9d0, #004983)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left - Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white hover:text-[#6aa9d0] transition duration-300 select-none"
          aria-label="Homepage"
        >
          CSE Society
        </Link>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-8 font-semibold text-white tracking-wide">
          {['Clubs', 'Events', 'Notices', 'Scholarships'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative group px-2 py-1 rounded-md hover:text-[#6aa9d0] transition duration-300"
            >
              {item}
              <span
                className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#6aa9d0] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Right - Auth / User Controls */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="flex items-center space-x-3 relative group cursor-pointer select-none max-w-[140px] truncate">
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm truncate" title={user?.name}>
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-300 italic truncate" title={user?.email}>
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
                className="p-2 rounded-md hover:bg-[#01457e] transition"
                aria-label="Go to Dashboard"
              >
                <LayoutDashboard className="w-6 h-6 text-[#6aa9d0]" />
              </Link>

              <Link
                to="/profile"
                title="Profile"
                className="p-2 rounded-md hover:bg-[#01457e] transition"
                aria-label="Go to Profile"
              >
                <User className="w-6 h-6 text-[#6aa9d0]" />
              </Link>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-md hover:bg-red-100 transition"
                aria-label="Logout"
                type="button"
              >
                <LogOut className="w-6 h-6 text-red-500" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-[#6aa9d0] font-semibold px-3 py-1 rounded-md hover:bg-[#01457e] hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="ml-2 bg-[#6aa9d0] text-white font-semibold px-4 py-1 rounded-md shadow-md hover:bg-[#004983] transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu placeholder */}
        <div className="md:hidden">
          {/* Hamburger can go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
