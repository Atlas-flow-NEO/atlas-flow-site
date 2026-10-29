import { useEffect, useState } from 'react';
import { CheckList } from '../components/Icons.jsx';
import Art from '../components/Art.jsx';
import Words from '../components/Words.jsx';
import './Method.css';

function goStep(i) {
  const el = document.getElementById('m-step-' + (i + 1)); if (!el) return;
  const hh = (document.querySelector('header') || {}).offsetHeight || 0;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hh - 12, behavior: 'smooth' });
}

export default function Method({ t }) {
  // mp : progression de la ligne (0-100) ; ma : nombre d'étapes atteintes.
  const [{ mp, ma }, setProg] = useState({ mp: 0, ma: 0 });
  useEffect(() => {
    const on = () => {
      const tl = document.getElementById('m-tl'); if (!tl) return;
      const r = tl.getBoundingClientRect(), mid = innerHeight * 0.55;
      let k = 0;
      for (let i = 1; i <= 4; i++) { const el = document.getElementById('m-step-' + i); if (el && el.getBoundingClientRect().top + 50 < mid) k = i; }
      setProg({ mp: Math.max(0, Math.min(100, (mid - r.top) / r.height * 100)), ma: k });
    };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <div className="dark-band">
        <div className="m-intro">
          <div className="eyebrow m-eyebrow">{t.nav[1]}</div>
          <h1 className="head kin" aria-label={t.mTitle}><Words text={t.mTitle} /></h1>
          <p>{t.mIntro}</p>
          <div className="m-steps-nav">
            <svg aria-hidden="true" height="4" className="flip"><line className="lw" x1="0" y1="2" x2="100%" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" /></svg>
            <ol>
              {t.steps.map(([title], i) => (
                <li key={i}><button onClick={() => goStep(i)}><span className="head m-dot">{'0' + (i + 1)}</span><span className="head">{title}</span></button></li>
              ))}
            </ol>
          </div>
        </div>

        <div id="m-tl" className="m-tl">
          <div aria-hidden="true" className="m-line" />
          <div aria-hidden="true" className="m-line m-fill" style={{ height: `calc((100% - 152px) * ${(mp / 100).toFixed(3)})` }} />
          {t.steps.map(([title, text], i) => {
            const [dos, gets, role] = t.mSteps[i];
            return (
              <div key={i} id={'m-step-' + (i + 1)} className={'m-step' + (ma > i ? ' on' : '') + (i % 2 ? ' right' : '')}>
                <div className="head m-node">{'0' + (i + 1)}</div>
                <Art kind={6 + i} label={title} className="pj-img m-art art-host" />
                <article className="rv m-card">
                  <h2 className="head">{title}</h2>
                  <p className="m-text">{text}</p>
                  <div className="m-cols">
                    <div><div className="label m-lbl">{t.mDoL}</div><CheckList items={dos} /></div>
                    <div><div className="label m-lbl">{t.mGetL}</div><ul className="m-pills">{gets.map(x => <li key={x} className="pill">{x}</li>)}</ul></div>
                  </div>
                  <div className="m-role">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" /></svg>
                    <div><div className="label">{t.mRoleL}</div><div className="m-role-text">{role}</div></div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      <div className="m-cta"><div className="m-cta-in">
        <div><h2 className="head">{t.contactTitle}</h2><p>{t.contactSub}</p></div>
        <a href="#contact">{t.cta}</a>
      </div></div>
    </>
  );
}
