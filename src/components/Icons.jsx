// Icônes SVG partagées (logo, flèche, coche).
const LINE = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const MARK_PEAKS = 'M7 46L22 17L33 35L42 23L57 46';
export const MARK_WAVE = 'M7 56C15 50 21 62 30 56C39 50 45 62 57 56';

export function Logo({ size = 42 }) {
  return (
    <svg style={{ color: 'var(--acc,#C8FF3A)' }} width={size} height={size} viewBox="0 0 64 64" strokeWidth="3" {...LINE}>
      <path d={MARK_PEAKS} /><path d={MARK_WAVE} />
      {[[22, 17], [33, 35], [42, 23]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="4" style={{ fill: 'var(--bg,#07090F)' }} />)}
      <circle cx="7" cy="46" r="3" fill="currentColor" stroke="none" />
      <circle cx="57" cy="46" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Marque animée utilisée dans le widget de chat.
export function Mark({ size, width = 4, color = 'var(--acc,#C8FF3A)', animated = true }) {
  return (
    <svg style={{ color }} width={size} height={size} viewBox="0 0 64 64" strokeWidth={width} {...LINE}>
      <path d={MARK_PEAKS} /><path className={animated ? 'lw' : undefined} d={MARK_WAVE} />
    </svg>
  );
}

export function Arrow({ size = 18, d = 'M4 10h12M11 5l5 5-5 5', width = 2 }) {
  return <svg className="flip" width={size} height={size} viewBox="0 0 20 20" strokeWidth={width} {...LINE}><path d={d} /></svg>;
}

export const Send = ({ size = 20 }) => <Arrow size={size} d="M3 10h13M11 4l6 6-6 6" width={2.2} />;

export const Close = ({ size = 18, width = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" strokeWidth={width} {...LINE}><path d="M3 3l12 12M15 3L3 15" /></svg>
);

export const Icon = ({ d, size = 24, width = 1.8, style }) => (
  <svg style={style} width={size} height={size} viewBox="0 0 24 24" strokeWidth={width} {...LINE}><path d={d} /></svg>
);

export const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" {...LINE}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.6 2.6L16 9.5" /></svg>
);

export function CheckList({ items }) {
  return <ul className="check-list">{items.map(x => <li key={x}><Check /><span>{x}</span></li>)}</ul>;
}
