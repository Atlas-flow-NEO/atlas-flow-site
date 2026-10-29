export default function Footer({ t }) {
  return (
    <footer style={{ position: 'relative', zIndex: 1, background: 'var(--bg,#07090F)', color: 'var(--ink,#FFFFFF)', borderTop: '1px solid var(--line,#1B2236)' }}>
      <div className="wrap" style={{ padding: '28px 24px', display: 'flex', flexWrap: 'wrap', gap: '12px 32px', justifyContent: 'space-between', color: 'var(--mute,#9AA6C2)', fontSize: 15 }}>
        <span>{t.copy}</span><span>{t.loc}</span>
      </div>
    </footer>
  );
}
