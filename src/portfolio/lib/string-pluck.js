const NOTES = [146.83, 164.81, 196, 220, 261.63, 293.66, 329.63, 392];
const RESONATORS = [
  { frequency: 100, q: 1.2, gain: 0.5 },
  { frequency: 220, q: 2, gain: 0.3 }
];
let ctx = null;
let master = null;
let verbSend = null;
let walk = 0;
function ensureAudio() {
  if (ctx) {
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }
  const Ctor = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 1;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 12;
  comp.ratio.value = 4;
  comp.attack.value = 6e-3;
  comp.release.value = 0.22;
  master.connect(comp);
  comp.connect(ctx.destination);
  const len = Math.floor(2.2 * ctx.sampleRate);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i += 1) {
      const t = i / len;
      data[i] = (2 * Math.random() - 1) * Math.pow(1 - t, 1.8);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = ir;
  verbSend = ctx.createGain();
  verbSend.gain.value = 0.42;
  verbSend.connect(convolver);
  convolver.connect(master);
  return ctx;
}
function pluck(amp) {
  const t = ensureAudio();
  if (!t || !master || !verbSend) return;
  const velocity = Math.min(Math.abs(amp) / 60, 1);
  if (velocity < 0.05) return;
  walk = (walk + 1 + Math.floor(2 * Math.random())) % NOTES.length;
  const drift = 1 + (2 * Math.random() - 1) * 4e-3;
  const freq = NOTES[walk] * drift;
  const sr = t.sampleRate;
  const period = Math.max(2, Math.floor(sr / freq));
  const len = Math.floor(3.2 * sr);
  const buffer = t.createBuffer(1, len, sr);
  const data = buffer.getChannelData(0);
  const excite = new Float32Array(period);
  let smooth = 0;
  const sweep = 0.1 + 0.12 * velocity;
  for (let i = 0; i < period; i += 1) {
    const noise = 2 * Math.random() - 1;
    smooth += (noise - smooth) * sweep;
    const ramp = Math.min(1, i / (0.4 * period));
    excite[i] = smooth * ramp;
  }
  const decay = 0.996 - (1 - velocity) * 3e-3;
  let prevOut = 0;
  let ring = 0;
  for (let i = 0; i < len; i += 1) {
    const raw = excite[ring];
    const next = 0.75 * ((raw + excite[(ring + 1) % period]) * 0.5) + 0.25 * prevOut;
    prevOut = next;
    excite[ring] = next * decay;
    data[i] = raw;
    ring = (ring + 1) % period;
  }
  const source = t.createBufferSource();
  source.buffer = buffer;
  const lowpass = t.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 750 + 700 * velocity;
  lowpass.Q.value = 0.5;
  const highpass = t.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 70;
  source.connect(lowpass);
  lowpass.connect(highpass);
  const tone = t.createGain();
  tone.gain.value = 1;
  highpass.connect(tone);
  for (const { frequency, q, gain } of RESONATORS) {
    const band = t.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = frequency;
    band.Q.value = q;
    const bandGain = t.createGain();
    bandGain.gain.value = gain;
    highpass.connect(band);
    band.connect(bandGain);
    bandGain.connect(tone);
  }
  const env = t.createGain();
  const peak = 0.16 + 0.34 * velocity;
  const now = t.currentTime;
  env.gain.setValueAtTime(1e-4, now);
  env.gain.exponentialRampToValueAtTime(peak, now + 0.025);
  env.gain.exponentialRampToValueAtTime(0.45 * peak, now + 0.6);
  env.gain.exponentialRampToValueAtTime(1e-4, now + 3.2);
  tone.connect(env);
  const panner = t.createStereoPanner ? t.createStereoPanner() : null;
  if (panner) {
    panner.pan.value = (2 * Math.random() - 1) * 0.35;
    env.connect(panner);
    panner.connect(master);
    panner.connect(verbSend);
  } else {
    env.connect(master);
    env.connect(verbSend);
  }
  source.start(now);
  source.stop(now + 3.2);
  source.onended = () => {
    source.disconnect();
    lowpass.disconnect();
    highpass.disconnect();
    tone.disconnect();
    env.disconnect();
    panner?.disconnect();
  };
}
export {
  pluck
};
