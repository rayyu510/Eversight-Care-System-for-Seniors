import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App'; // App.tsx is in src/, not src/renderer/

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);
