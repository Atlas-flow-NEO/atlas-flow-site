import { lazy, Suspense, useEffect, useState } from 'react';
import { D } from './i18n';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Method from './pages/Method.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Team from './pages/Team.jsx';
import { TEAM } from './portfolio/people.js';

const PortfolioPage = lazy(() => import('./portfolio/PortfolioPage.jsx'));

const PAGES = { services: Services, method: Method, projects: Projects, contact: Contact, team: Team };
// #team/<id> : portfolio d'un membre de l'équipe.
const readPage = () => { const h = location.hash.slice(1); return PAGES[h] || TEAM.some(id => h === 'team/' + id) ? h : 'home'; };
const stored = k => { try { return localStorage.getItem(k); } catch { return null; } };
const store = (k, v) => { try { localStorage.setItem(k, v); } catch { /* stockage indisponible */ } };

export default function App() {
  const [lang, setLangState] = useState(() => (D[stored('af-lang')] ? stored('af-lang') : 'fr'));
  const [theme, setThemeState] = useState(() => (stored('af-theme') === 'light' ? 'light' : 'dark'));
  const [page, setPage] = useState(readPage);
  const [menu, setMenu] = useState(false);

  // Navigation par ancre (#services, #method…) comme la maquette d'origine.
  useEffect(() => {
    const read = () => { setPage(readPage()); setMenu(false); window.scrollTo(0, 0); };
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);

  useEffect(() => {
    document.body.style.background = theme === 'light' ? '#F7F8FB' : '#07090F';
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const setLang = c => { store('af-lang', c); setLangState(c); };
  const toggleTheme = () => { const th = theme === 'light' ? 'dark' : 'light'; store('af-theme', th); setThemeState(th); };

  const t = D[lang];
  const ctx = { t, lang, theme };
  const Page = PAGES[page] || Home;
  const member = page.startsWith('team/') ? page.slice(5) : null;

  return (
    <div className={'app' + (menu ? ' menu-open' : '')} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} data-theme={theme}>
      <Header {...ctx} page={page} menu={menu} setMenu={setMenu} setLang={setLang} toggleTheme={toggleTheme} />
      <main id="top">
        {member
          ? <Suspense fallback={<div style={{ minHeight: '100vh' }} />}><PortfolioPage key={member} id={member} /></Suspense>
          : <Page key={page === 'contact' ? lang : page} {...ctx} />}
      </main>
      <Footer t={t} />
      <ChatWidget lang={lang} store={store} stored={stored} />
    </div>
  );
}
