import fr from './fr.js';
import en from './en.js';
import ar from './ar.js';

export const D = { fr, en, ar };
export { CH, SYS } from './chat.js';

// Libellés courts qui n'existent pas dans les fichiers de langue.
export const HOME = { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' };
export const THEME_LABEL = {
  light: { fr: 'Mode sombre', en: 'Dark mode', ar: 'الوضع الداكن' },
  dark: { fr: 'Mode clair', en: 'Light mode', ar: 'الوضع الفاتح' },
};
export const CITIES = [
  { id: 'casablanca', q: 'Casablanca', name: { fr: 'Casablanca', en: 'Casablanca', ar: 'الدار البيضاء' } },
  { id: 'settat', q: 'Settat', name: { fr: 'Settat', en: 'Settat', ar: 'سطات' } },
];
