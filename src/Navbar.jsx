import React from 'react';
import { Link } from 'react-router-dom';
import { scaleRotate as Menu } from 'react-burger-menu';
import './Navbar.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Navbar = ({ isOpen, setIsOpen }) => {
  const handleMenuToggle = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Custom Toggle Button */}
      <button
        onClick={handleMenuToggle}
        className="fixed top-4 left-4 z-20 p-2 text-blue3 text-3xl font-georama font-semibold italic transition-transform transform hover:scale-110"
      >
        ☰
      </button>

      {/* Burger Menu with scaleRotate effect */}
      <Menu
        isOpen={isOpen}
        onStateChange={({ isOpen }) => setIsOpen(isOpen)}
        left
        customBurgerIcon={false}
        customCrossIcon={false}
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        styles={{
          bmBurgerButton: { display: 'none' },
          bmMenu: {
            background: '#F5FDFF',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
          },
          bmItemList: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly', // Evenly space out the items
            alignItems: 'center',
            height: '100%',
          },
          bmOverlay: { background: 'rgba(0, 0, 0, 0.3)' },
        }}
      >
        {/* Custom Close Button */}
        <button
          onClick={handleMenuToggle}
          className="absolute top-4 right-4 text-blue3 text-2xl font-georama font-semibold italic transition-transform transform hover:scale-110"
        >
          ✕
        </button>

        {/* Navbar Links */}
        <div className="flex flex-col items-center justify-evenly h-full">
          <Link to="/" className="text-blue2 text-xl font-georama block font-semibold italic hover:text-blue3 transition duration-300 ease-in-out" onClick={handleMenuToggle}>
            Home
          </Link>
          <Link to="/about" className="text-blue2 text-xl font-georama block font-semibold italic hover:text-blue3 transition duration-300 ease-in-out" onClick={handleMenuToggle}>
            About
          </Link>
          <Link to="/portfolio" className="text-blue2 text-xl font-georama block font-semibold italic hover:text-blue3 transition duration-300 ease-in-out" onClick={handleMenuToggle}>
            Portfolio
          </Link>
          <Link to="/contact" className="text-blue2 text-xl font-georama block font-semibold italic hover:text-blue3 transition duration-300 ease-in-out" onClick={handleMenuToggle}>
            Contact
          </Link>
        </div>
      </Menu>
    </div>
  );
};

export default Navbar;
