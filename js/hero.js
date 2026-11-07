// Hero cinemático: el héroe en la oscuridad desenvaina con el scroll; la hoja se enciende
// y su luz lo revela. Dos poses en capas + máscaras CSS + GSAP ScrollTrigger.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shot = document.querySelector(".shot");
  const tilt = document.querySelector(".shot__tilt");
  const dust = document.querySelector(".dust");
  const sfx = (name) => document.dispatchEvent(new CustomEvent("sfx", { detail: name }));

  // Estado visual: brillo base, radio y centro de la luz, fundido entre poses, hoja, brillo, zoom.
  const st = { base: 0.04, r: 10, lx: 37, ly: 62, swap: 0, blade: 0, glow: 0.4, core: 0, zoom: 1.15, dust: 0.4 };
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

  function paint() {
    shot.style.setProperty("--base", st.base.toFixed(3));
    shot.style.setProperty("--r", st.r.toFixed(2));
    shot.style.setProperty("--lx", st.lx.toFixed(2));
    shot.style.setProperty("--ly", st.ly.toFixed(2));
    shot.style.setProperty("--swap", st.swap.toFixed(3));
    shot.style.setProperty("--blade", st.blade.toFixed(2));
    shot.style.setProperty("--glow", st.glow.toFixed(3));
    shot.style.setProperty("--core", st.core.toFixed(3));
    shot.style.setProperty("--zoom", st.zoom.toFixed(4));
  }

  // ---------- Polvo de luz (canvas 2D) ----------
  const ctx = dust.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  const motes = [];
  function size() {
    DPR = Math.min(devicePixelRatio, 2);
    W = dust.clientWidth; H = dust.clientHeight;
    dust.width = W * DPR; dust.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function spawn(m, anywhere) {
    // Más partículas cerca de la hoja (centro).
    const spread = Math.random() < 0.6 ? 0.18 : 0.5;
    m.x = W / 2 + (Math.random() - 0.5) * W * spread * 2;
    m.y = anywhere ? Math.random() * H : H + 10 + Math.random() * H * 0.4;
    m.z = Math.random();                      // profundidad: 0 lejos, 1 cerca
    m.r = 0.4 + m.z * 2.2;
    m.v = 0.15 + m.z * 0.6 + Math.random() * 0.2;
    m.ph = Math.random() * Math.PI * 2;
  }
  for (let i = 0; i < 140; i++) { const m = {}; spawn(m, true); motes.push(m); }
  size();
  addEventListener("resize", size);

  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    t += 0.016;
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;
    if (!reduce) {
      tilt.style.transform = `rotateY(${(mouse.sx * 3).toFixed(2)}deg) rotateX(${(-mouse.sy * 2.2).toFixed(2)}deg) translate3d(${(-mouse.sx * 8).toFixed(1)}px, ${(-mouse.sy * 6).toFixed(1)}px, 0)`;
    }
    ctx.clearRect(0, 0, W, H);
    const a = st.dust;
    if (a <= 0.01) return;
    ctx.globalCompositeOperation = "lighter";
    for (const m of motes) {
      m.y -= m.v;
      m.x += Math.sin(t * 0.8 + m.ph) * 0.25 * (0.3 + m.z);
      if (m.y < -10) spawn(m, false);
      const px = m.x + mouse.sx * 30 * m.z, py = m.y + mouse.sy * 20 * m.z;
      const tw = 0.55 + 0.45 * Math.sin(t * 2 + m.ph);
      const g = ctx.createRadialGradient(px, py, 0, px, py, m.r * 3);
      g.addColorStop(0, `rgba(210,240,255,${(0.8 * tw * a).toFixed(3)})`);
      g.addColorStop(1, "rgba(120,190,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, m.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  frame();

  addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  paint();

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // En móvil la barra del navegador cambia la altura de la ventana: no recalcular el pin por eso.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // La imagen aparece desde negro al cargar.
  const img = document.querySelector(".shot__lit");
  const show = () => document.documentElement.classList.add("hero-ready");
  img.complete ? show() : img.addEventListener("load", show);

  if (reduce) {
    Object.assign(st, { base: 0.08, r: 58, lx: 50, ly: 40, swap: 1, blade: 100, glow: 0.6, core: 0, zoom: 1, dust: 0.6 });
    paint();
    gsap.set(".hero__hint", { autoAlpha: 0 });
    return;
  }

  // Respiración de la luz de la guarda mientras no se hace scroll.
  const idle = gsap.to(st, { r: 13, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: paint });

  gsap.from(".hero__intro > *", { y: 24, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power3.out", delay: 0.5 });

  const marks = [[1.0, "draw"], [2.2, "glow"]];
  let last = 0;
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onUpdate() {
      paint();
      const now = this.time();
      marks.forEach(([at, name]) => { if (last < at && now >= at) sfx(name); });
      last = now;
      document.dispatchEvent(new CustomEvent("hero-progress", { detail: this.progress() }));
    },
    scrollTrigger: {
      trigger: ".hero", start: "top top", end: "+=260%", scrub: 1, pin: true, anticipatePin: 1, refreshPriority: 1,
      onEnter: () => idle.pause(),
      onLeaveBack: () => idle.resume()
    }
  });

  // 1. La oscuridad se cierra y la cámara se acerca a la empuñadura
  tl.to(".hero__intro", { y: "-=40", opacity: 0, duration: 0.8 }, 0)
    .to(".hero__hint", { opacity: 0, duration: 0.4 }, 0)
    .to(st, { r: 7, zoom: 1.28, dust: 0.2, duration: 1 }, 0)

  // 2. Desenvaina: cambia de pose y la hoja se enciende desde la vaina hacia la guarda
    .to(st, { swap: 1, duration: 0.7, ease: "power2.inOut" }, 1)
    .fromTo(st, { blade: 0 }, { blade: 100, duration: 1.1, ease: "power2.in", immediateRender: false }, 1.1)
    .to(st, { glow: 1, core: 1, r: 16, dust: 1, duration: 1.1, ease: "power2.in" }, 1.1)

  // 3. Destello: la luz sube a la cara y revela al héroe; el fondo sigue en sombra
    .to(".flash", { opacity: 0.5, duration: 0.18, ease: "power2.in" }, 2.2)
    .to(".flash", { opacity: 0, duration: 0.6, ease: "power2.out" }, 2.38)
    .to(st, { r: 58, lx: 50, ly: 40, base: 0.08, zoom: 1, glow: 0.6, core: 0, duration: 1.5, ease: "power3.out" }, 2.25)

  // 4. Mensaje final
    .fromTo(".hero__final", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 3.6)
    .to({}, { duration: 0.6 });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
