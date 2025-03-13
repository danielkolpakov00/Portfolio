import WeatherDescription from './WeatherDescription';
import PlinkoDescription from './PlinkoDescription';
import BedroomDescription from './BedroomDescription';
import MusicDescription from './MusicDescription';

export const getProjectDescription = (id) => {
  const descriptions = {
    1: WeatherDescription,
    2: PlinkoDescription,
    3: BedroomDescription,
    4: MusicDescription
  };
  return descriptions[id] || (() => <p>Description not available</p>);
};

export {
  WeatherDescription,
  PlinkoDescription,
  BedroomDescription,
  MusicDescription
};
