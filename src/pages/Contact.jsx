import { useState } from 'react';
import { CITIES } from '../i18n';
import { Icon, Send } from '../components/Icons.jsx';
import './Contact.css';

// À remplacer par les vraies coordonnées.
const EMAIL = '[YOUR EMAIL]';
const PHONE = '[YOUR NUMBER]';

export default function Contact({ t, lang, theme }) {
  const [sent, setSent] = useState(false);
  const [city, setCity] = useState('all');

  const info = [
    { k: t.ck[0], v: EMAIL, dir: 'ltr', icon: 'M3 6h18v12H3zM3 7l9 6 9-6' },
    { k: t.ck[1], v: PHONE, dir: 'ltr', icon: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z' },
    { k: t.ck[2], v: t.loc, dir: 'auto', icon: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  ];

  // shortcut: le formulaire affiche seulement un message de confirmation, rien n'est envoyé ; brancher un service (e-mail, API, n8n) avant la mise en ligne.
  const submit = e => { e.preventDefault(); setSent(true); };

  return (
    <>
      <div className="ct">
        <section id="contact" className="ct-info">
          <div>
            <div className="eyebrow ct-eyebrow">{t.nav[3]}</div>
            <h1 className="head">{t.contactTitle}</h1>
            <p className="ct-sub">{t.contactSub}</p>
          </div>
          <ul className="ct-list">
            {info.map(ci => (
              <li key={ci.k}>
                <span className="ct-ico"><Icon d={ci.icon} size={22} style={{ color: 'var(--acc,#C8FF3A)' }} /></span>
                <div style={{ minWidth: 0 }}><div className="ct-k">{ci.k}</div><div className="head ct-v"><span dir={ci.dir}>{ci.v}</span></div></div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'auto' }}>
            <div className="ct-k" style={{ marginBottom: 14 }}>{t.nextTitle}</div>
            <ol className="ct-next">{t.next.map((x, i) => <li key={i}><span>{i + 1}</span><span>{x}</span></li>)}</ol>
          </div>
        </section>

        <div className="ct-form-side"><div className="ct-form-wrap">
          {!sent ? (
            <form onSubmit={submit} className="ct-form">
              <h2 className="head">{t.fFormTitle}</h2>
              <div className="ct-row">
                <div className="field"><label htmlFor="f-name">{t.fName}</label><input id="f-name" name="name" required autoComplete="name" /></div>
                <div className="field"><label htmlFor="f-email">{t.fEmail}</label><input id="f-email" name="email" type="email" required autoComplete="email" className="ltr" /></div>
              </div>
              <div className="field"><label htmlFor="f-service">{t.fService}</label>
                <select id="f-service" name="service">{t.opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
              </div>
              <div className="field"><label htmlFor="f-msg">{t.fMsg}</label><textarea id="f-msg" name="message" rows="6" required /></div>
              <button type="submit" className="ct-submit">{t.fSend}<Send /></button>
            </form>
          ) : (
            <div role="status" className="ct-done">
              <span><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#07090F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
              <h2 className="head">{t.fThanks}</h2>
              <button className="btn-outline" onClick={() => setSent(false)}>{t.fAgain}</button>
            </div>
          )}
        </div></div>
      </div>

      <div className="dark-band ct-map-band">
        <div className="wrap ct-map-grid">
          <div>
            <div className="eyebrow">{t.mapEyebrow}</div>
            <h2 className="head ct-map-title">{t.mapTitle}</h2>
            <p className="ct-map-sub">{t.mapSub}</p>
            <div className="ct-cities">
              {CITIES.map(c => (
                <div key={c.id} className={'ct-city' + (city === c.id ? ' on' : '')}>
                  <button onClick={() => setCity(c.id)} aria-pressed={city === c.id}>
                    <span className="ct-pin" />
                    <span><span className="head ct-city-name">{c.name[lang]}</span><span className="ct-region">{t.mapRegion}</span></span>
                  </button>
                  <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.q + ', Morocco')} target="_blank" rel="noopener">
                    {t.mapOpen}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
                  </a>
                </div>
              ))}
              <button className="btn-outline ct-both" onClick={() => setCity('all')}>{t.mapBoth}</button>
            </div>
          </div>
          <div className="ct-map">
            <iframe src={`/map.html?lang=${lang}&theme=${theme}#${city}`} title={t.mapTitle} loading="lazy" />
          </div>
        </div>
      </div>
    </>
  );
}
