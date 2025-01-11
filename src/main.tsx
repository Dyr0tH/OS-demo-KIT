import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const setFavicon = () => {
  // Create an offscreen canvas to render the icon
  const canvas = document.createElement('canvas');
  canvas.width = 64;  // Size of the favicon (adjust if needed)
  canvas.height = 64;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Optional: Set background color for better contrast
  ctx.fillStyle = '#182132';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create SVG for the Terminal icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>`;

  // Create an image to load the SVG and draw it onto the canvas
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL and set it as the favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = canvas.toDataURL('image/png');
    document.head.appendChild(favicon);
  };
  
  img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
};

const AppWithFavicon = () => {
  useEffect(() => {
    setFavicon();  // Set the favicon when the app loads
  }, []);

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithFavicon />
  </StrictMode>
);
