import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscPerson, VscFolderLibrary } from 'react-icons/vsc';
import Dock from './components/ReactBits/Dock';
import { useCursorTooltip } from './components/CursorTooltip';

const Navbar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { showTooltip, hideTooltip, setTooltipText } = useCursorTooltip();

  const items = [
    { 
      icon: <div className="md:rotate-90"><VscHome size={24} className="text-blue2" /></div>, 
      tooltip: 'home_page',
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/');
        if (setIsOpen) setIsOpen(false);
      }
    },
    { 
      icon: <div className="md:rotate-90"><VscPerson size={24} className="text-blue2" /></div>, 
      tooltip: 'about_page',
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/about');
        if (setIsOpen) setIsOpen(false);
      }
    },
    { 
      icon: <div className="md:rotate-90"><VscFolderLibrary size={24} className="text-blue2" /></div>, 
      tooltip: 'my_work',
      className: "bg-white/90 border-blue2",
      onClick: () => {
        navigate('/portfolio');
        if (setIsOpen) setIsOpen(false);
      }
    },
  ];

  // Create enhanced items with tooltip functionality
  const enhancedItems = items.map(item => ({
    ...item,
    onMouseEnter: () => {
      setTooltipText(item.tooltip);
      showTooltip();
    },
    onMouseLeave: hideTooltip
  }));

  return (
    <div className="fixed bottom-4 left-0 right-0 z-20">
      <div className="relative w-fit mx-auto md:mx-0 md:fixed md:left-12 md:top-1/2 md:-translate-y-1/2">
        <div className="md:rotate-[270deg] md:origin-center transform-gpu">
          <Dock 
            items={enhancedItems} 
            panelHeight={{ base: 68}}
            baseItemSize={{ base: 50}}
            magnification={{ base: 65}}
            className="bg-white/70 backdrop-blur-sm md:bg-white/80 md:backdrop-blur-md md:shadow-lg"
            distance={100}
            spring={{ mass: 0.5, stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;