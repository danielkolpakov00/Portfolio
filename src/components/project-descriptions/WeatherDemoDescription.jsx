import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud } from '@fortawesome/free-solid-svg-icons';

const WeatherDemoDescription = () => {
  return (
    <div className="bg-blue2/40 p-4 rounded-lg space-y-4">
      <h4 className="text-lg font-semibold text-white">How It Works</h4>
      <p className="text-base leading-relaxed text-white">
        I built a 3D environment that connects to real weather APIs and transforms that data into visual elements. When it's raining in your city, you'll see actual raindrops falling in the scene. If it's sunny, you'll see a brilliant sun with realistic lighting effects. It's weather forecasting that you can actually experience, not just read.
      </p>
      
      <h4 className="text-lg font-semibold text-white">Key Features</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue2/40 p-4 rounded-lg border border-white/20">
          <FontAwesomeIcon icon={faSun} className="text-2xl text-white mb-2" />
          <h5 className="text-base font-medium text-white">Day/Night Cycle</h5>
          <p className="text-sm leading-relaxed text-white">The scene's lighting changes based on the actual time in Vancouver. Morning has a soft golden glow, noon is bright and clear, and night brings a serene moonlit atmosphere.</p>
        </div>
        
        <div className="bg-blue2/40 p-4 rounded-lg border border-white/20">
          <FontAwesomeIcon icon={faCloud} className="text-2xl text-white mb-2" />
          <h5 className="text-base font-medium text-white">Dynamic Weather Effects</h5>
          <p className="text-sm leading-relaxed text-white">Weather conditions are visualized in real-time with advanced particle systems and lighting effects.</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDemoDescription;
