import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscPerson, VscFolderLibrary } from 'react-icons/vsc';
import Dock from './components/ReactBits/Dock';

const Navbar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const items = [
    { 
      icon: <div className="md:rotate-90"><VscHome size={24} className="text-blue2" /></div>, 
      label: 'Home', 
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/');
        if (setIsOpen) setIsOpen(false);
      }
    },
    { 
      icon: <div className="md:rotate-90"><VscPerson size={24} className="text-blue2" /></div>, 
      label: 'About',
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/about');
        if (setIsOpen) setIsOpen(false);
      }
    },
    { 
      icon: <div className="md:rotate-90"><VscFolderLibrary size={24} className="text-blue2" /></div>, 
      label: 'Portfolio',
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/portfolio');
        if (setIsOpen) setIsOpen(false);
      }
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 w-full md:left-12 lg:left-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-auto z-20">
      <div className="md:rotate-[270deg] md:origin-center transform-gpu">
        <Dock 
          items={items} 
          panelHeight={{ base: 68}}
          baseItemSize={{ base: 50}}
          magnification={{ base: 65}}
          className="bg-white/70 backdrop-blur-sm md:bg-white/80 md:backdrop-blur-md md:shadow-lg"
          distance={100}
          spring={{ mass: 0.5, stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default Navbar;