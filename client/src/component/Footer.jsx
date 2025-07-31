import React from 'react';
import { FaFacebookF } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0d1b2a] text-white mt-8 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">LaptopStore</h4>
            <p className="text-sm">
              We provide the best deals on latest laptops, accessories, and gadgets. 
              Quality service and affordable prices — just for you.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><a href="" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-sm">Email: support@smartbazaar.com</p>
            <p className="text-sm">Phone: +977-9800580015</p>
            <p className="text-sm">Address: Kathmandu, Nepal</p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="https://www.facebook.com/poshanbista18" target="_blank" rel="noreferrer" className="hover:text-blue-500"><FaFacebookF /></a>
              <a href="https://www.instagram.com/poshanbista/" target="_blank" rel="noreferrer" className="hover:text-pink-500"><FaInstagramSquare /></a>
              <a href="https://github.com/Poshanbista" target="_blank" rel="noreferrer" className="hover:text-gray-400"><FaGithub /></a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>© 2024 Smart Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
