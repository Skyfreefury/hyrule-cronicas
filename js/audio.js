// Música y efectos generados con Web Audio API. Composición original, sin archivos de audio.
(() => {
  const KEY = "hyrule-sound";
  const btns = () => document.querySelectorAll("[data-sound-toggle]");
  let ctx, master, musicBus, musicFilter, sfxBus, reverbSend, noiseBuf;
  let on = false, started = false, schedTimer = null, nextNote = 0, step = 0, triumph = false;

  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  // Progresión en re dórico (noche) y re mayor (amanecer tras desenvainar).
  const NIGHT = [[50, 53, 57, 60, 64], [46, 50, 53, 57, 62], [48, 52, 55, 62, 64], [45, 48, 52, 55, 60]];
  const DAWN = [[50, 54, 57, 61, 64], [43, 47, 50, 54, 59], [45, 49, 52, 57, 64], [47, 50, 54, 57, 62]];
  const BEAT = 60 / 72 / 2; // corcheas a 72 ppm
  const BAR = BEAT * 16;    // un acorde cada 2 compases

  function impulse(sec = 3.2) {
    const len = ctx.sampleRate * sec, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.connect(ctx.destination);
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(comp);

    const verb = ctx.createConvolver();
    verb.buffer = impulse();
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.45;
    reverbSend.connect(verb).connect(master);

    musicFilter = ctx.createBiquadFilter();
    musicFilter.type = "lowpass";
    musicFilter.frequency.value = 900;
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.9;
    musicBus.connect(musicFilter);
    musicFilter.connect(master);
    musicFilter.connect(reverbSend);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.9;
    sfxBus.connect(master);
    sfxBus.connect(reverbSend);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  // ---------- Bloques de sonido ----------
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(freq, t, { type = "sine", a = 0.005, d = 1, peak = 0.2, bus = sfxBus, detune = 0 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    env(g, t, a, peak, d);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + a + d + 0.05);
    return o;
  }
  function noise(t, dur, { type = "bandpass", f0 = 1000, f1 = 1000, q = 1, peak = 0.3, a = 0.01, bus = sfxBus } = {}) {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf;
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a, peak, dur);
    src.connect(f).connect(g).connect(bus);
    src.start(t);
    src.stop(t + dur + a + 0.05);
  }

  // ---------- Música generativa ----------
  function pad(chord, t) {
    chord.forEach((n) => {
      [-7, 7].forEach((det) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sawtooth";
        o.frequency.value = midi(n);
        o.detune.value = det;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.018, t + 2.2);
        g.gain.setValueAtTime(0.018, t + BAR - 1.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t + BAR + 2);
        o.connect(g).connect(musicBus);
        o.start(t);
        o.stop(t + BAR + 2.1);
      });
    });
  }
  function harp(n, t, vel = 1) {
    tone(midi(n), t, { type: "triangle", d: 1.6, peak: 0.07 * vel, bus: musicBus });
    tone(midi(n + 12), t, { type: "sine", d: 0.9, peak: 0.025 * vel, bus: musicBus });
  }
  function scheduler() {
    while (nextNote < ctx.currentTime + 0.25) {
      const prog = triumph ? DAWN : NIGHT;
      const chord = prog[Math.floor(step / 16) % prog.length];
      if (step % 16 === 0) pad(chord, nextNote);
      // Arpegio ascendente con huecos aleatorios.
      const i = step % 8;
      if (i < 5 || Math.random() < 0.35) {
        const n = chord[i % chord.length] + 12 + (i >= 5 ? 12 : 0);
        harp(n, nextNote, i === 0 ? 1 : 0.7);
      }
      nextNote += BEAT;
      step++;
    }
  }
  function wind() {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    src.buffer = noiseBuf;
    src.loop = true;
    f.type = "bandpass";
    f.frequency.value = 450;
    f.Q.value = 0.8;
    g.gain.value = 0.035;
    lfo.frequency.value = 0.08;
    lfoG.gain.value = 250;
    lfo.connect(lfoG).connect(f.frequency);
    src.connect(f).connect(g).connect(master);
    src.start();
    lfo.start();
  }

  // ---------- Efectos ----------
  const FX = {
    tick(t) { tone(2100, t, { d: 0.04, peak: 0.025 }); },
    select(t) { tone(midi(81), t, { type: "triangle", d: 0.35, peak: 0.08 }); tone(midi(88), t + 0.06, { type: "triangle", d: 0.5, peak: 0.07 }); },
    flip(t) { noise(t, 0.28, { f0: 700, f1: 3200, q: 0.9, peak: 0.12 }); },
    grab(t) {
      tone(95, t, { d: 0.18, peak: 0.25 }).frequency.exponentialRampToValueAtTime(50, t + 0.18);
      noise(t, 0.08, { f0: 1800, f1: 900, q: 2, peak: 0.08 });
    },
    draw(t) {
      noise(t, 0.6, { f0: 1400, f1: 7500, q: 6, peak: 0.22, a: 0.02 });
      [2200, 3170, 4410, 5930].forEach((f, i) => tone(f, t + 0.12, { d: 1.8 - i * 0.25, peak: 0.05 - i * 0.008 }));
    },
    swoosh(t) {
      noise(t, 0.35, { type: "lowpass", f0: 300, f1: 2600, q: 1, peak: 0.25, a: 0.05 });
      noise(t + 0.35, 0.4, { type: "lowpass", f0: 2600, f1: 400, q: 1, peak: 0.12 });
    },
    glow(t) {
      tone(55, t, { d: 2.2, peak: 0.35, a: 0.02 });
      [74, 78, 81, 86, 90, 93].forEach((n, i) => {
        tone(midi(n), t + 0.1 + i * 0.09, { d: 2.4, peak: 0.07 });
        tone(midi(n) * 2.01, t + 0.1 + i * 0.09, { d: 1.2, peak: 0.015 });
      });
      noise(t + 0.2, 2.2, { type: "highpass", f0: 6000, f1: 9000, q: 0.5, peak: 0.05, a: 0.4 });
    },
    result(t) {
      [67, 72, 76, 79].forEach((n, i) => tone(midi(n), t + i * 0.12, { type: "triangle", d: 0.5, peak: 0.09 }));
      [72, 76, 79, 84].forEach((n) => tone(midi(n), t + 0.5, { type: "triangle", d: 1.8, peak: 0.05 }));
    }
  };

  // ---------- Control ----------
  function start() {
    if (!ctx) init();
    ctx.resume();
    if (!started) {
      started = true;
      nextNote = ctx.currentTime + 0.1;
      wind();
    }
    clearInterval(schedTimer);
    schedTimer = setInterval(scheduler, 100);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.8);
  }
  function stop() {
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    clearInterval(schedTimer);
    setTimeout(() => { if (!on) ctx.suspend(); }, 1200);
  }
  function set(v) {
    on = v;
    try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (e) {}
    btns().forEach((b) => {
      b.setAttribute("aria-pressed", v);
      const label = b.querySelector("[data-sound-label]");
      if (label) label.textContent = v ? "Sonido activado" : "Activar sonido";
    });
    v ? start() : stop();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sound-toggle]");
    if (b) set(!on);
  });

  // Si el usuario ya lo activó antes, se reanuda con su primer gesto (los navegadores bloquean el autoplay).
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "on") {
    const resume = (e) => {
      if (e.target.closest && e.target.closest("[data-sound-toggle]")) return;
      if (!on) set(true);
    };
    ["pointerdown", "keydown"].forEach((ev) => addEventListener(ev, resume, { once: true }));
  }

  // Efectos pedidos por el resto de la web.
  let lastTick = 0;
  document.addEventListener("sfx", (e) => {
    if (!on || !ctx) return;
    const now = ctx.currentTime;
    if (e.detail === "tick") { if (now - lastTick < 0.06) return; lastTick = now; }
    if (e.detail === "glow") triumph = true;
    FX[e.detail] && FX[e.detail](now + 0.01);
  });

  // La música se abre con el avance del hero.
  document.addEventListener("hero-progress", (e) => {
    if (!ctx) return;
    const p = e.detail;
    musicFilter.frequency.setTargetAtTime(900 + p * 3800, ctx.currentTime, 0.3);
    if (p < 0.55) triumph = false;
  });
})();
