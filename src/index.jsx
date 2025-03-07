// Add this to your main entry file to ensure the tsParticles library is loaded

import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Set up tsParticles as a global variable
window.tsParticles = window.tsParticles || {};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
