import { useEffect, useState } from 'react';
import { HOME, THEME_LABEL } from '../i18n';
import { SUN, MOON } from '../lib/icons.js';
import { Logo, Arrow, Icon } from './Icons.jsx';
import './Header.css';

const LANGS = [['fr', 'FR'], ['en', 'EN'], ['ar', 'ع']];

export default function Header({ t, lang, theme, page, menu, setMenu, setLang, toggleTheme }) {
  const [sp, setSp] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement.scrollHeight - innerHeight; setSp(h > 0 ? Math.min(100, scrollY / h * 100) : 0); };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  const links = [['home', HOME[lang]], ['services', t.nav[0]], ['method', t.nav[1]], ['projects', t.nav[2]], ['team', t.nav[4]], ['contact', t.nav[3]]];
  const on = id => page === id || page.startsWith(id + '/');
  const themeLabel = THEME_LABEL[theme][lang];
  const themeIcon = <Icon d={theme === 'light' ? MOON : SUN} size={20} />;

  return (
    <header className="hdr">
      <div className="wrap hdr-bar">
        <a href="#home" aria-label="Atlas Flow" className="hdr-logo"><Logo /><span>Atlas Flow</span></a>
        <nav aria-label="Main" className="hdr-nav desk">
          {links.slice(0, 5).map(([id, label]) => (
            <a key={id} href={'#' + id} aria-current={on(id) ? 'page' : 'false'} className={on(id) ? 'on' : ''}>{label}</a>
          ))}
        </nav>
        <div className="hdr-tools">
          <button className="icon-btn desk" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>{themeIcon}</button>
          <div role="group" aria-label="Language" className="hdr-langs">
            {LANGS.map(([code, label]) => (
              <button key={code} lang={code} aria-pressed={lang === code} className={lang === code ? 'on' : ''} onClick={() => setLang(code)}>{label}</button>
            ))}
          </div>
          <a href="#contact" className="btn desk hdr-cta">{t.cta}</a>
          <button className="icon-btn mob" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d={menu ? 'M4 4l12 12M16 4L4 16' : 'M3 5h14M3 10h14M3 15h14'} />
            </svg>
          </button>
        </div>
      </div>
      {menu && (
        <nav aria-label="Mobile" className="mdn mob hdr-mnav">
          {links.map(([id, label], i) => (
            <a key={id} className={'mi' + (on(id) ? ' on' : '')} href={'#' + id} onClick={() => setMenu(false)} aria-current={on(id) ? 'page' : 'false'} style={{ animationDelay: (0.05 + i * 0.07) + 's' }}>
              <span className="num">{'0' + (i + 1)}</span><span className="lbl">{label}</span><Arrow size={22} />
            </a>
          ))}
          <a className="mi btn hdr-mcta" href="#contact" onClick={() => setMenu(false)} style={{ animationDelay: '0.4s' }}>{t.cta}</a>
          <button className="mi hdr-mtheme" onClick={toggleTheme} style={{ animationDelay: '0.45s' }}>{themeIcon}{themeLabel}</button>
          <div className="mi hdr-mloc" style={{ animationDelay: '0.5s' }}>{t.loc}</div>
        </nav>
      )}
      <div aria-hidden="true" className="hdr-progress" style={{ width: sp + '%' }} />
    </header>
  );
}
