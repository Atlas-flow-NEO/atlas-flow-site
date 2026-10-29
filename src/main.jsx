import { createRoot } from 'react-dom/client';
import './styles/global.css'; // avant App : les CSS des composants doivent pouvoir le surcharger
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
