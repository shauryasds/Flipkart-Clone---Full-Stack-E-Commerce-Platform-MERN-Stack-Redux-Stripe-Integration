// src/Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-950 mt-4 p-6 text-white text-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        

        {/* Contact Us Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <p>Phone: <span className="font-medium">123-456-7890</span></p>
          <p>Email: <span className="font-medium">ecommerce@ecommerce.com</span></p>
          <p>Address: <span className="font-medium">123 Main Street, City</span></p>
        </div>

        {/* Follow Us Section */}
        <div className='flex flex-col items-center'>
          <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-300 transition-colors">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300 transition-colors">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-300 transition-colors">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-300 transition-colors">
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="mt-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Developed By <span className='text-yellow-400'>Shaurya deep shukla</span> . All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;