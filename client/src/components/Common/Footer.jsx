import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12 border-t border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className="text-sm md:text-base select-none">
          &copy; {new Date().getFullYear()} CoU CSE Society. All Rights Reserved.
        </p>
        <div className="flex space-x-6 mt-3 md:mt-0">
          <a href="/privacy" className="hover:text-white transition text-sm md:text-base">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition text-sm md:text-base">
            Terms of Service
          </a>
          <a
            href="mailto:contact@cse-society.edu"
            className="hover:text-white transition text-sm md:text-base"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
