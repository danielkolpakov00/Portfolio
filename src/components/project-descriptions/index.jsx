import WeatherDescription from './WeatherDescription';
import PlinkoDescription from './PlinkoDescription';
import BedroomDescription from './BedroomDescription';
import MusicDescription from './MusicDescription';
import MailDescription from './MailDescription';
import GradientDemoDescription from './GradientDemoDescription';
import LastFmDemoDescription from './LastFmDemoDescription';

export const getProjectDescription = (id) => {
  const descriptions = {
    1: WeatherDescription,
    2: PlinkoDescription,
    3: BedroomDescription,
    4: MusicDescription,
    5: MailDescription,
    "gradient-generator": GradientDemoDescription,
    "lastfm-app": LastFmDemoDescription
  };
  return descriptions[id] || (() => <p>Description not available</p>);
};

export {
  WeatherDescription,
  PlinkoDescription,
  BedroomDescription,
  MusicDescription,
  MailDescription,
  GradientDemoDescription,
  LastFmDemoDescription
};
