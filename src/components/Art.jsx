import { useEffect, useRef } from 'react';

// Visuel 3D vivant (three.js chargé à la demande) ; kind = index dans SHAPES de lib/project-art.js.
export default function Art({ kind, label, className = 'pj-img' }) {
  const ref = useRef();
  useEffect(() => {
    let stop, dead = false;
    import('../lib/project-art.js').then(m => { if (!dead) stop = m.mountArt(ref.current, kind); });
    return () => { dead = true; if (stop) stop(); };
  }, [kind]);
  return <div className={className}><canvas ref={ref} role="img" aria-label={label} /></div>;
}
