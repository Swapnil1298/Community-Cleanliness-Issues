

import React from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import logo from '../assets/Logo.png';
import { Helmet } from 'react-helmet';
import { FaWhatsapp } from 'react-icons/fa';
export default function Footer({
  siteName = 'CleanCity',
  
  links = [],
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900  text-gray-800 dark:text-gray-200">
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Brand */}
          <div className="md:col-span-1">
            <NavLink
              to="/"
              className="flex items-center gap-2 animate__animated animate__slideInDown mb-4"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-16 h-16 rounded-full animate__animated animate__bounceIn"
              />
              <span className="hidden sm:flex text-2xl font-bold">
                <span className="text-red-500">C</span>
                <span className="text-orange-500">C</span>
                <span className="text-yellow-400">I</span>
                <span className="text-green-300">R</span>
                <span className="text-blue-200">P</span>
              </span>
            </NavLink>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Building stronger communities through collaborative issue reporting and resolution.
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Project Holder: Vivekanand Tripathi
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 mb-4">
              <a
                href="https://wa.me/917879539174"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              {(links.length
                ? links
                : [
                    { text: 'Home', href: '/' },
                    { text: 'All Issues', href: '/allissues' },
                    { text: 'About', href: '/about' },
                    { text: 'Contact', href: '/contact' },
                  ]
              ).map((l, idx) => (
                <li key={idx}>
                  <Link
                    to={l.href}
                    className="hover:underline hover:text-green-600 dark:hover:text-green-400"
                  >
                    {l.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📧 vivektripathi3405@gmail.com</p>
              <p>📞 +91 7879539174</p>
              <p>📍 India</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {year} {siteName}. All rights reserved. · Vivekanand Tripathi
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/terms" className="hover:underline">
                Terms
              </Link>
              <Link to="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
