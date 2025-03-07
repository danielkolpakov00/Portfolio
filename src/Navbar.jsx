import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scaleRotate as Menu } from 'react-burger-menu';

const Navbar = ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      // Store current scroll position
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isOpen]);

  const handleMenuToggle = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Custom Toggle Button - Only show when menu is closed */}
      {!isOpen && (
        <button
          onClick={handleMenuToggle}
          className="fixed top-4 left-4 z-20 p-2 text-blue2 text-3xl font-georama font-semibold transition-transform transform hover:scale-110 bg-none rounded-xl p-4 border-2 border-blue2 transition-display duration-300"
        >
          ☰
        </button>
      )}

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
            opacity: 0.85,
          },
          bmItemList: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Center the items
            alignItems: 'center',
            height: '100%',
          },
          bmOverlay: { background: 'rgba(0, 0, 0, 0.3)' },
        }}
      >
        {/* Custom Close Button */}
        <button
          onClick={handleMenuToggle}
          className="absolute top-4 right-4 text-blue2 text-2xl font-georama font-semibold transition-transform transform hover:scale-110"
        >
          ✕
        </button>

        {/* Navbar Links */}
        <div className="flex flex-col justify-center h-full">
        <Link to="/" className="my-12 text-white text-5xl font-georama block font-semibold italic hover:text-blue2 transition duration-300 ease-in-out" onClick={handleMenuToggle} style={{ textShadow: '1px 1px 0px #1B69FA, -1px -1px 0px #1B69FA, 1px -1px 0px #1B69FA, -1px 1px 0px #1B69FA' }}>
  Home
</Link>
     
          <Link to="/about" className="my-12 text-white text-5xl font-georama block font-semibold italic hover:text-blue2 transition duration-300 ease-in-out" onClick={handleMenuToggle} style={{ textShadow: '1px 1px 0px #1B69FA, -1px -1px 0px #1B69FA, 1px -1px 0px #1B69FA, -1px 1px 0px #1B69FA' }}>
            About
          </Link>
          <Link to="/portfolio" className="my-12 text-white text-5xl font-georama block font-semibold italic hover:text-blue2 transition duration-300 ease-in-out" onClick={handleMenuToggle} style={{ textShadow: '1px 1px 0px #1B69FA, -1px -1px 0px #1B69FA, 1px -1px 0px #1B69FA, -1px 1px 0px #1B69FA' }}>
            Portfolio
          </Link>
         
        </div>
      </Menu>
    </div>
  );
};

export default Navbar;