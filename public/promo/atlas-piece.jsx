const W = 1920, H = 1080;
const C = { bg:'#07090F', card:'#0E1220', line:'#1B2236', ink:'#F2F4FA', mute:'#9AA6C2', blue:'#2E6BFF', band:'#1F5BFF', neon:'#C8FF3A' };
const HEAD = "'Bricolage Grotesque',sans-serif", BODY = "'IBM Plex Sans',sans-serif";
const lerp = (a, b, k) => a + (b - a) * k;

// the three motion helpers
const P = (T, a, b, ease = Easing.easeOutCubic) => animate({ from:0, to:1, start:a, end:b, ease })(T);
const enter = (T, a, d = 0.9) => { const p = P(T, a, a + d); return { opacity:p, transform:`translateY(${(1 - p) * 44}px)` }; };
const pop = (T, a) => { const p = P(T, a, a + 0.7, Easing.easeOutBack); return { opacity:Math.min(1, p * 2), transform:`scale(${0.86 + 0.14 * p})` }; };
const vis = (T, a, b) => P(T, a, a + 0.6) * (1 - P(T, b - 0.5, b));

function Mark({ T, c, color }) {
  const d = P(T, 0.2, 2.0, Easing.easeInOutCubic), n = P(T, 1.7, 2.4, Easing.easeOutBack);
  const st = { fill:'none', stroke:color, strokeWidth:2.8, strokeLinecap:'round', strokeLinejoin:'round', strokeDasharray:1, strokeDashoffset:1 - d };
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ overflow:'visible' }}>
      <path pathLength="1" d="M7 46L22 17L33 35L42 23L57 46" style={st} />
      <path pathLength="1" d="M7 56C15 50 21 62 30 56C39 50 45 62 57 56" style={st} />
      {[[22,17],[33,35],[42,23]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4 * n} fill={C.bg} stroke={color} strokeWidth="2.8" />)}
      {[[7,46],[57,46]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 * n} fill={color} />)}
    </svg>
  );
}

function Brand({ T, CUES }) {
  const out = P(T, CUES.Problem - 0.1, CUES.Problem + 0.9, Easing.easeInOutCubic);
  const back = P(T, CUES.Close - 0.4, CUES.Close + 0.8, Easing.easeInOutCubic);
  const k = out - back;
  const band = P(T, CUES.Method - 0.2, CUES.Method + 0.8) - P(T, CUES.Close - 0.2, CUES.Close + 0.8);
  const col = band > 0.5 ? '#FFFFFF' : C.neon;
  const s = lerp(2.4, 0.8, k), nat = 280;
  return (
    <div style={{ position:'absolute', left:lerp(W / 2 - nat * s / 2, 96, k), top:lerp(300, 60, k), transform:`scale(${s})`, transformOrigin:'0 0', display:'flex', alignItems:'center', gap:14, width:nat }}>
      <Mark T={T} color={col} />
      <div style={{ fontFamily:HEAD, fontWeight:700, fontSize:36, letterSpacing:'-0.02em', color:C.ink, whiteSpace:'nowrap', opacity:P(T, 1.4, 2.2) }}>Atlas Flow</div>
    </div>
  );
}

const Txt = ({ style, children }) => <div style={{ position:'absolute', ...style }}>{children}</div>;
const Eyebrow = ({ style, children, color = C.neon }) => <Txt style={{ fontFamily:BODY, fontWeight:600, fontSize:26, letterSpacing:'0.16em', textTransform:'uppercase', color, ...style }}>{children}</Txt>;

function Problem({ T, CUES }) {
  const a = CUES.Problem, o = CUES.Flow;
  const items = ['Messages sans réponse', 'Données éparpillées', 'Tâches répétitives'];
  return (
    <div style={{ opacity:vis(T, a + 0.5, o) }}>
      <Txt style={{ left:96, top:230, width:1500, fontFamily:HEAD, fontWeight:700, fontSize:112, lineHeight:1.02, letterSpacing:'-0.035em', color:C.ink, ...enter(T, a + 0.7) }}>Chaque tâche manuelle vous coûte du temps.</Txt>
      {items.map((t, i) => {
        const st = P(T, a + 3.0 + i * 0.25, a + 3.5 + i * 0.25, Easing.easeInOutCubic);
        return (
          <div key={i} style={{ position:'absolute', left:96 + i * 560, top:610, ...enter(T, a + 1.6 + i * 0.35) }}>
            <div style={{ position:'relative', border:`1px solid ${C.line}`, background:C.card, borderRadius:16, padding:'20px 32px', fontFamily:BODY, fontSize:34, color:C.mute, whiteSpace:'nowrap' }}>
              {t}
              <div style={{ position:'absolute', left:20, top:'50%', width:`calc((100% - 40px) * ${st})`, height:3, background:C.neon }} />
            </div>
          </div>
        );
      })}
      <Txt style={{ left:96, top:800, fontFamily:HEAD, fontWeight:700, fontSize:96, letterSpacing:'-0.03em', color:C.neon, ...enter(T, a + 3.7) }}>Automatisons-les.</Txt>
    </div>
  );
}

const STEPS = [
  ['Le client écrit sur WhatsApp', 'Une demande arrive à toute heure.'],
  ['Le chatbot IA comprend et qualifie', 'Besoin, urgence et budget identifiés.'],
  ['Données enregistrées, CRM à jour', 'Sans aucune saisie manuelle.'],
  ['Relance automatique', 'Le bon message, au bon moment.']
];
function Flow({ T, CUES }) {
  const f = CUES.Flow, o = CUES.Services;
  const cx = [330, 770, 1210, 1650], y = 400, cw = 360, ch = 390, lane = y - 50;
  const dotX = interpolate([f + 1.8, f + 3.0, f + 3.4, f + 4.6, f + 5.0, f + 6.2], [cx[0], cx[1], cx[1], cx[2], cx[2], cx[3]], Easing.easeInOutCubic)(T);
  const arrive = [f + 1.8, f + 3.0, f + 4.6, f + 6.2];
  return (
    <div style={{ opacity:vis(T, f + 0.3, o) }}>
      <Txt style={{ left:96, top:180, fontFamily:HEAD, fontWeight:700, fontSize:96, letterSpacing:'-0.03em', color:C.ink, ...enter(T, f + 0.3) }}>Un flux, de bout en bout.</Txt>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position:'absolute', left:cx[i], top:lane - 1.5, height:3, width:(cx[i + 1] - cx[i]) * P(T, f + 1.2 + i * 1.5, f + 2.2 + i * 1.5, Easing.easeInOutCubic), background:C.line }} />
      ))}
      {STEPS.map(([t, d], i) => {
        const lit = P(T, arrive[i], arrive[i] + 0.3);
        return (
          <div key={i} style={{ position:'absolute', left:cx[i] - cw / 2, top:y, width:cw, height:ch, boxSizing:'border-box', background:C.card, border:`2px solid ${lit > 0.5 ? C.neon : C.line}`, borderRadius:24, padding:32, ...pop(T, f + 0.9 + i * 1.5) }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:lit > 0.5 ? C.neon : 'transparent', border:`2px solid ${C.neon}`, color:lit > 0.5 ? C.bg : C.neon, fontFamily:HEAD, fontWeight:700, fontSize:28, display:'flex', alignItems:'center', justifyContent:'center' }}>{i + 1}</div>
            <div style={{ fontFamily:HEAD, fontWeight:700, fontSize:36, lineHeight:1.15, color:C.ink, marginTop:26 }}>{t}</div>
            <div style={{ fontFamily:BODY, fontSize:26, lineHeight:1.4, color:C.mute, marginTop:14 }}>{d}</div>
          </div>
        );
      })}
      <div style={{ position:'absolute', left:dotX - 14, top:lane - 14, width:28, height:28, borderRadius:'50%', background:C.neon, boxShadow:'0 0 0 10px rgba(200,255,58,0.18)', opacity:P(T, f + 1.6, f + 1.9) * (1 - P(T, f + 6.4, f + 6.8)) }} />
      <Txt style={{ left:96, top:850, fontFamily:BODY, fontSize:40, color:C.mute, ...enter(T, f + 6.6) }}>Aucune ressaisie. Aucun message perdu.</Txt>
    </div>
  );
}

const SERV = [
  ['Chatbots & agents IA', 'Chatbots & assistants IA', ['WhatsApp', 'RAG', 'LangGraph', 'CrewAI']],
  ['Data', 'Data & automatisation', ['n8n', 'ETL', 'Power BI', 'Python']],
  ['Plateformes & sites web', 'Sites & plateformes sur mesure', ['React', 'SaaS', 'E-commerce', 'SEO']]
];
function Services({ T, CUES }) {
  const s = CUES.Services, o = CUES.Method;
  return (
    <div style={{ opacity:vis(T, s + 0.3, o) }}>
      <Txt style={{ left:96, top:180, fontFamily:HEAD, fontWeight:700, fontSize:96, letterSpacing:'-0.03em', color:C.ink, ...enter(T, s + 0.3) }}>Trois expertises.</Txt>
      {SERV.map(([lab, title, tags], i) => {
        const a = s + 0.9 + i * 1.0, drift = P(T, a, o, Easing.linear) * -16;
        return (
          <div key={i} style={{ position:'absolute', left:96 + i * 600, top:380, width:560, height:520, boxSizing:'border-box', background:C.card, border:`1px solid ${C.line}`, borderRadius:28, padding:40, ...enter(T, a, 1.0), marginTop:drift }}>
            <div style={{ fontFamily:BODY, fontWeight:600, fontSize:22, letterSpacing:'0.14em', textTransform:'uppercase', color:C.neon }}>{lab}</div>
            <div style={{ fontFamily:HEAD, fontWeight:700, fontSize:52, lineHeight:1.1, letterSpacing:'-0.02em', color:C.ink, marginTop:22 }}>{title}</div>
            <div style={{ position:'absolute', left:40, right:40, bottom:40, display:'flex', flexWrap:'wrap', gap:12 }}>
              {tags.map((t, j) => <span key={j} style={{ border:`1px solid ${C.line}`, background:C.bg, borderRadius:999, padding:'8px 22px', fontFamily:BODY, fontSize:26, color:C.mute, ...pop(T, a + 0.6 + j * 0.18) }}>{t}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const MET = [['Écouter', 'On comprend votre activité.'], ['Concevoir', 'Périmètre et calendrier clairs.'], ['Construire', 'Par étapes, avec démos.'], ['Accompagner', 'Lancement, formation, suivi.']];
function Method({ T, CUES }) {
  const m = CUES.Method, o = CUES.Close;
  return (
    <div style={{ opacity:vis(T, m + 0.5, o) }}>
      <Txt style={{ left:96, top:180, fontFamily:HEAD, fontWeight:700, fontSize:96, letterSpacing:'-0.03em', color:'#fff', ...enter(T, m + 0.6) }}>Une méthode simple.</Txt>
      <div style={{ position:'absolute', left:96, top:520, height:4, width:1700 * P(T, m + 1.0, m + 3.0, Easing.easeInOutCubic), background:'#fff' }} />
      {MET.map(([t, d], i) => (
        <div key={i} style={{ position:'absolute', left:96 + i * 450, top:490, width:400, ...enter(T, m + 1.0 + i * 0.5) }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'#fff', color:C.band, fontFamily:HEAD, fontWeight:700, fontSize:30, display:'flex', alignItems:'center', justifyContent:'center', marginTop:-16 }}>{i + 1}</div>
          <div style={{ fontFamily:HEAD, fontWeight:700, fontSize:56, color:'#fff', marginTop:36, letterSpacing:'-0.02em' }}>{t}</div>
          <div style={{ fontFamily:BODY, fontSize:30, lineHeight:1.4, color:'#fff', marginTop:12 }}>{d}</div>
        </div>
      ))}
    </div>
  );
}

function Close({ T, CUES, total }) {
  const c = CUES.Close, pulse = 1 + 0.025 * Math.sin((T - c) * 4);
  return (
    <div style={{ opacity:P(T, c + 0.4, c + 0.9) }}>
      <Txt style={{ left:0, width:W, top:600, textAlign:'center', fontFamily:HEAD, fontWeight:700, fontSize:112, letterSpacing:'-0.035em', color:C.ink, ...enter(T, c + 1.0) }}>Parlons de votre projet.</Txt>
      <Txt style={{ left:0, width:W, top:760, textAlign:'center', fontFamily:BODY, fontSize:38, color:C.mute, ...enter(T, c + 1.6) }}>Settat · Casablanca, Maroc · Clients au Maroc et à l'international</Txt>
      <Txt style={{ left:W / 2 - 190, top:850, width:380, textAlign:'center', background:C.neon, color:C.bg, borderRadius:16, padding:'20px 0', fontFamily:BODY, fontWeight:600, fontSize:34, ...pop(T, c + 2.2), transform:`scale(${pulse})` }}>Réserver un appel</Txt>
    </div>
  );
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const band = P(T, CUES.Method - 0.2, CUES.Method + 0.8, Easing.easeInOutCubic), bandOut = P(T, CUES.Close - 0.2, CUES.Close + 0.8, Easing.easeInOutCubic);
  const tag = P(T, 2.6, 3.4) * (1 - P(T, CUES.Problem - 0.4, CUES.Problem));
  return (
    <div style={{ position:'absolute', inset:0, width:W, height:H, overflow:'hidden', background:C.bg, opacity:1 - P(T, authoredTotal - 0.5, authoredTotal) }}>
      <div style={{ position:'absolute', inset:-60, backgroundImage:`radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize:'60px 60px', transform:`translate(${-(T * 5) % 60}px, ${-(T * 3) % 60}px)`, opacity:0.8 }} />
      <div style={{ position:'absolute', inset:0, background:C.band, clipPath:`inset(${(1 - band) * 100}% 0 ${bandOut * 100}% 0)` }} />
      <Eyebrow style={{ left:0, width:W, top:640, textAlign:'center', opacity:tag, transform:`translateY(${(1 - tag) * 20}px)` }}>Agence tech · Maroc</Eyebrow>
      <Problem T={T} CUES={CUES} />
      <Flow T={T} CUES={CUES} />
      <Services T={T} CUES={CUES} />
      <Method T={T} CUES={CUES} />
      <Close T={T} CUES={CUES} />
      <Brand T={T} CUES={CUES} />
    </div>
  );
}

function AtlasPiece() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
        <Piece />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Timeline" />
        <TweakToggle label="Motion editor" value={tw.motionEditor} onChange={v => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </>
  );
}
window.AtlasPiece = AtlasPiece;
