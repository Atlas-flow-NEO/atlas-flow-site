import { useEffect, useRef, useState } from 'react';
import { CH } from '../../i18n';
import { CHIP_ICONS } from '../../lib/icons.js';
import { askAssistant } from '../../lib/assistant.js';
import { Mark, Close, Send, Icon, Arrow } from '../Icons.jsx';
import './ChatWidget.css';

export default function ChatWidget({ lang, store, stored }) {
  const ch = CH[lang];
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [tip, setTip] = useState(false);
  const [msgs, setMsgs] = useState([]); // { role, content, shown? } ; shown = caractères affichés (effet machine à écrire)
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null), tw = useRef(), ct = useRef();

  useEffect(() => {
    const tt = setTimeout(() => { if (!stored('af-tip')) setTip(true); }, 4000);
    return () => { clearTimeout(tt); clearTimeout(ct.current); clearInterval(tw.current); };
  }, []);

  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; });

  const close = () => {
    if (!open || closing) return;
    setClosing(true); clearTimeout(ct.current);
    ct.current = setTimeout(() => { setOpen(false); setClosing(false); }, 280);
  };
  const toggle = () => { if (open) close(); else { store('af-tip', '1'); setOpen(true); setClosing(false); setTip(false); } };

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  });

  const ask = async text => {
    text = (text || '').trim(); if (!text || busy) return;
    const next = [...msgs, { role: 'user', content: text }];
    setMsgs(next); setInput(''); setBusy(true);
    let reply;
    try { reply = await askAssistant(next.map(m => ({ role: m.role, content: m.content })), lang); } catch { reply = ch.err; }
    const idx = next.length;
    setMsgs(m => [...m, { role: 'assistant', content: reply, shown: 0 }]); setBusy(false);
    clearInterval(tw.current);
    tw.current = setInterval(() => setMsgs(m => {
      const cur = m[idx];
      if (!cur || cur.shown >= cur.content.length) { clearInterval(tw.current); return m; }
      const arr = m.slice(); arr[idx] = { ...cur, shown: Math.min(cur.content.length, cur.shown + 3) }; return arr;
    }), 20);
  };

  const reset = () => { clearInterval(tw.current); setMsgs([]); setBusy(false); setInput(''); };
  const hideTip = () => { store('af-tip', '1'); setTip(false); };
  const hasInput = !!input.trim();

  return (
    <div className="chat-dock">
      {open && (
        <div className={'chat-panel ' + (closing ? 'cpOut' : 'cpIn')} role="dialog" aria-label={ch.title}>
          <div className="chat-head">
            <div className="chat-avatar">
              <span className="orbRing" style={{ animationDuration: busy ? '.9s' : '3s' }} />
              <span className="chat-avatar-in"><Mark size={24} /></span>
            </div>
            <div className="chat-title">
              <div className="head">{ch.title}</div>
              <div className="chat-status"><span className="cd2" />{ch.status}</div>
            </div>
            <button className="chat-icon" onClick={reset} aria-label={ch.reset} title={ch.reset}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            </button>
            <button className="chat-icon" onClick={close} aria-label={ch.close}><Close /></button>
          </div>

          <div ref={listRef} aria-live="polite" className="chat-list">
            {msgs.length === 0 && (
              <>
                <div className="cw chat-welcome">
                  <div className="chat-orb">
                    <span className="orbHalo" /><span className="orbHalo" style={{ animationDelay: '1.2s' }} />
                    <span className="orbRing" /><span className="orbRing2" />
                    <span className="chat-orb-core"><Mark size={30} /></span>
                  </div>
                  <div className="head chat-welcome-title">{ch.welcome}</div>
                  <div className="chat-welcome-sub">{ch.welcomeSub}</div>
                </div>
                <div className="chat-chips">
                  {ch.chips.map((c, i) => (
                    <button key={c} className="cc2" onClick={() => ask(c)} style={{ animationDelay: (0.25 + i * 0.08) + 's' }}>
                      <span><Icon d={CHIP_ICONS[i % CHIP_ICONS.length]} size={16} width={2} style={{ color: 'var(--acc,#C8FF3A)' }} /></span>{c}
                    </button>
                  ))}
                </div>
              </>
            )}
            {msgs.map((m, i) => {
              const typing = m.shown !== undefined && m.shown < m.content.length;
              return (
                <div key={i} className={'cm chat-msg ' + m.role}>
                  {m.role === 'assistant' && <span className="chat-msg-av"><Mark size={14} width={6} animated={false} /></span>}
                  <div className="chat-bubble">{m.shown === undefined ? m.content : m.content.slice(0, m.shown)}{typing && <span className="caret" />}</div>
                </div>
              );
            })}
            {busy && (
              <div className="cm chat-busy" aria-label={ch.typing}>
                <span className="chat-busy-orb"><span className="orbRing" /><span /></span>
                <div className="chat-busy-box">
                  <span className="chat-wave">{[0, 1, 2, 3, 4].map(i => <span key={i} className="wv" style={{ animationDelay: i * 0.12 + 's', background: i === 2 ? '#2E6BFF' : undefined }} />)}</span>
                  <span className="shim">{ch.thinking}</span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-foot">
            <form onSubmit={e => { e.preventDefault(); ask(input); }} className="chat-form">
              <input aria-label={ch.placeholder} placeholder={ch.placeholder} value={input} onChange={e => setInput(e.target.value)} />
              <button type="submit" className={hasInput ? 'sendOn on' : ''} aria-label={ch.send}><Send /></button>
            </form>
            <div className="chat-note">
              <span>{ch.note}</span>
              <a href="#contact" onClick={close}>{ch.book}<Arrow size={14} width={2.2} /></a>
            </div>
          </div>
        </div>
      )}

      <div className="lb chat-launch">
        {tip && !open && (
          <div className="tip chat-tip" role="status">
            {ch.tip}
            <button onClick={hideTip} aria-label={ch.tipClose}><Close size={14} width={2.2} /></button>
          </div>
        )}
        <button className="chat-toggle" onClick={toggle} aria-label={ch.title} aria-expanded={open}>
          {!open && <span className="chat-label">{ch.label}</span>}
          <span className="chat-fab">
            {!open && <span className="lping chat-ping" />}
            <span className="orbRing chat-fab-ring" />
            <span className="chat-fab-core">
              <span className="chat-fab-ico" style={{ opacity: open ? 0 : 1, transform: open ? 'rotate(-90deg) scale(.6)' : 'none' }}><Mark size={32} width={5} color="#07090F" /></span>
              <span className="chat-fab-ico" style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'rotate(90deg) scale(.6)', color: '#07090F' }}><Close size={22} width={2.4} /></span>
            </span>
            {!open && <span className="cd2 chat-online" />}
          </span>
        </button>
      </div>
    </div>
  );
}
