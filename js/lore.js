// Secciones de lore interactivas: Trifuerza, cronología, mapa, personajes y test.
(() => {
  const L = window.LORE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const anim = (fn) => { if (hasGsap && !reduce) fn(); };
  const sfx = (name) => document.dispatchEvent(new CustomEvent("sfx", { detail: name }));

  // Scroll suave con Lenis, enlazado a ScrollTrigger.
  if (hasGsap && !reduce && typeof Lenis !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) { e.preventDefault(); lenis.scrollTo(target); }
      })
    );
  }

  // Sonido suave al pasar por encima de cualquier elemento interactivo.
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest(".chip, .game, .pin, .tri__piece, .flip, .quiz__opt, .btn, .tl__node, .nav a, .race-tab, .relic");
    if (el && !el.contains(e.relatedTarget)) sfx("tick");
  });

  // Activa un elemento con clic, Enter o Espacio.
  const onActivate = (el, fn) => {
    el.addEventListener("click", fn);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); }
    });
  };

  const TRI_SVG = (on) => `
    <svg viewBox="0 0 300 260" aria-hidden="true">
      <path class="${on === "poder" ? "is-on" : ""}" d="M150 10 220 130H80Z"/>
      <path class="${on === "sabiduria" ? "is-on" : ""}" d="M80 130 150 250H10Z"/>
      <path class="${on === "valor" ? "is-on" : ""}" d="M220 130 290 250H150Z"/>
    </svg>`;

  // ---------- Trifuerza ----------
  const triInfo = $(".tri-info");
  $$(".tri__piece").forEach((piece) =>
    onActivate(piece, () => {
      const k = piece.dataset.piece, d = L.triforce[k];
      sfx("select");
      $$(".tri__piece").forEach((p) => p.classList.toggle("is-active", p === piece));
      triInfo.innerHTML = `<h3>${d.title}</h3><p class="meta">${d.bearer} · ${d.goddess}</p><p>${d.text}</p>`;
      anim(() => gsap.from(triInfo.children, { y: 12, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }));
    })
  );

  // ---------- Cronología ----------
  const chips = $(".chips"), desc = $(".tl__desc"), games = $(".tl__games");
  const branchOrder = ["origen", "adulto", "nino", "caida", "despertar"];

  branchOrder.forEach((k) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.role = "tab";
    b.dataset.branch = k;
    b.textContent = L.timeline[k].label;
    b.addEventListener("click", () => { sfx("select"); selectBranch(k); });
    chips.appendChild(b);
  });
  $$(".tl__node").forEach((n) => {
    n.setAttribute("aria-label", L.timeline[n.dataset.branch].label);
    onActivate(n, () => { sfx("select"); selectBranch(n.dataset.branch); });
  });

  function selectBranch(k) {
    const br = L.timeline[k];
    $$(".chip").forEach((c) => c.setAttribute("aria-selected", c.dataset.branch === k));
    $$(".tl__node").forEach((n) => n.classList.toggle("is-active", n.dataset.branch === k));
    // Resalta el camino desde el origen hasta la rama elegida.
    $$(".tl__line").forEach((l) => l.classList.toggle("is-active", l.dataset.branch === k || (k !== "origen" && l.dataset.branch === "origen")));

    desc.textContent = br.desc;
    games.innerHTML = br.games.map((g, i) => `
      <button class="game" type="button" aria-expanded="false">
        <span class="game__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="game__t">${g.t}</span>
        <span class="game__y">${g.y}</span>
        <span class="game__body">${g.b}</span>
      </button>`).join("");
    $$(".game", games).forEach((card) =>
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        card.setAttribute("aria-expanded", !open);
        sfx(open ? "tick" : "flip");
      })
    );
    anim(() => gsap.from($$(".game", games), { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }));
  }
  selectBranch("origen");

  // ---------- Mapa ----------
  // Usa assets/map/hyrule.jpg si existe (pines en % sobre la imagen). Si no, el mapa SVG dibujado.
  const pins = $(".map__pins"), mapCard = $(".map__card"), mapBox = $(".map");
  const MAP_IMG = "assets/map/hyrule.jpg";

  function selectRegion(r, el) {
    sfx("select");
    $$(".pin").forEach((p) => p.classList.toggle("is-active", p.dataset.id === r.id));
    const credit = r.credit ? `<figcaption><a href="${r.credit}" target="_blank" rel="noopener">${r.creditLabel || "Fuente"}</a></figcaption>` : "";
    mapCard.innerHTML = `
      <figure class="map__photo">
        <img src="${r.photo}" alt="${r.name}" loading="lazy" onerror="this.parentNode.remove()">
        ${credit}
      </figure>
      <p class="meta">Región</p>
      <h3>${r.name}</h3>
      <p>${r.text}</p>
      <ul class="people">${r.people.map((p) => `<li>${p}</li>`).join("")}</ul>`;
    anim(() => gsap.from(mapCard.children, { x: 16, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }));
  }

  // Pines del mapa SVG
  L.regions.forEach((r) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "pin");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", r.name);
    g.dataset.id = r.id;
    g.innerHTML = `
      <circle class="pin__ring" cx="${r.x}" cy="${r.y}" r="9"/>
      <circle class="pin__dot" cx="${r.x}" cy="${r.y}" r="8"/>
      <text x="${r.x}" y="${r.y - 16}">${r.name}</text>`;
    onActivate(g, () => selectRegion(r, g));
    pins.appendChild(g);
  });

  // Mapa real: se activa solo si la imagen carga
  const probe = new Image();
  probe.onload = () => {
    const real = document.createElement("div");
    real.className = "map__real";
    real.innerHTML = `<img src="${MAP_IMG}" alt="Mapa de Hyrule" width="${probe.naturalWidth}" height="${probe.naturalHeight}">`;
    real.style.aspectRatio = `${probe.naturalWidth} / ${probe.naturalHeight}`;
    L.regions.forEach((r) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pin pin--real";
      b.dataset.id = r.id;
      b.style.left = r.mx + "%";
      b.style.top = r.my + "%";
      b.setAttribute("aria-label", r.name);
      b.innerHTML = `<span class="pin__ring"></span><span class="pin__dot"></span><span class="pin__label">${r.name}</span>`;
      b.addEventListener("click", () => { if (!b.dataset.dragged) selectRegion(r, b); delete b.dataset.dragged; });
      real.appendChild(b);
    });
    $(".map__svg").replaceWith(real);
    if (new URLSearchParams(location.search).has("editar")) mapEditor(real);
  };
  probe.src = MAP_IMG;

  // Modo editor (?editar): arrastra los pines y copia las coordenadas a data.js
  function mapEditor(real) {
    const out = document.createElement("textarea");
    out.className = "map__editor";
    out.readOnly = true;
    mapBox.after(out);
    const dump = () => {
      out.value = $$(".pin--real", real).map((b) => `${b.dataset.id}: mx: ${parseFloat(b.style.left).toFixed(1)}, my: ${parseFloat(b.style.top).toFixed(1)}`).join(String.fromCharCode(10));
    };
    $$(".pin--real", real).forEach((b) => {
      b.addEventListener("pointerdown", (e) => {
        b.setPointerCapture(e.pointerId);
        const move = (ev) => {
          const r = real.getBoundingClientRect();
          b.style.left = Math.min(100, Math.max(0, ((ev.clientX - r.left) / r.width) * 100)) + "%";
          b.style.top = Math.min(100, Math.max(0, ((ev.clientY - r.top) / r.height) * 100)) + "%";
          b.dataset.dragged = "1";
          dump();
        };
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerup", () => b.removeEventListener("pointermove", move), { once: true });
      });
    });
    dump();
  }

  // ---------- Personajes ----------
  const ACCENT = { link: "#5fb4e8", zelda: "#e8c25a", ganon: "#e0612f", impa: "#d0453f" };
  $(".cards").innerHTML = L.characters.map((c) => `
    <button class="flip" type="button" aria-pressed="false" aria-label="${c.name}: girar carta" style="--accent:${ACCENT[c.id]}">
      <span class="flip__inner">
        <span class="flip__face flip__front">
          <img class="flip__img" src="assets/characters/${c.id}.jpg" alt="Retrato de ${c.name}" loading="lazy" width="720" height="960">
          <span class="flip__info">
            <span class="flip__tag">${c.tag}</span>
            <span class="flip__name">${c.name}</span>
            <span class="flip__role">${c.role}</span>
          </span>
        </span>
        <span class="flip__face flip__back">
          <h3>${c.name}</h3>
          <ul>${c.facts.map((f) => `<li>${f}</li>`).join("")}</ul>
          <span class="flip__tag">Pulsa para volver</span>
        </span>
      </span>
    </button>`).join("");
  $$(".flip").forEach((f) =>
    f.addEventListener("click", () => { sfx("flip"); f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") !== "true"); })
  );
  // Inclinación 3D de la carta siguiendo al ratón.
  if (!reduce) $$(".flip").forEach((f) => {
    const inner = $(".flip__inner", f);
    f.addEventListener("pointermove", (e) => {
      const r = f.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      f.style.setProperty("--mx", (x * 100 + 50) + "%");
      f.style.setProperty("--my", (y * 100 + 50) + "%");
      const flipped = f.getAttribute("aria-pressed") === "true" ? 180 : 0;
      inner.style.transform = `rotateY(${flipped + x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    f.addEventListener("pointerleave", () => { inner.style.transform = ""; });
    f.addEventListener("click", () => { inner.style.transform = ""; });
  });

  // ---------- Test ----------
  const quiz = $(".quiz");
  const RESULT = {
    poder: "Tu fuerza mueve montañas. Cuidado: el poder sin freno es el camino de Ganondorf.",
    sabiduria: "Ves lo que otros no ven. Como Zelda, prefieres entender antes de actuar.",
    valor: "No eres el más fuerte ni el más listo, pero nunca te rindes. Así empieza cada Link."
  };
  let step = 0, score = {};

  function drawQuiz() {
    if (step < L.quiz.length) {
      const q = L.quiz[step];
      quiz.innerHTML = `
        <div class="quiz__bar"><i style="width:${(step / L.quiz.length) * 100}%"></i></div>
        <p class="quiz__step">Pregunta ${step + 1} de ${L.quiz.length}</p>
        <p class="quiz__q">${q.q}</p>
        <div class="quiz__opts">${q.a.map(([t, k]) => `<button class="quiz__opt" type="button" data-k="${k}">${t}</button>`).join("")}</div>`;
      $$(".quiz__opt", quiz).forEach((b) =>
        b.addEventListener("click", () => {
          score[b.dataset.k] = (score[b.dataset.k] || 0) + 1;
          sfx(step === L.quiz.length - 1 ? "result" : "select");
          step++;
          drawQuiz();
        })
      );
    } else {
      // Empate: gana el último elegido entre los máximos (el valor desempata).
      const best = ["poder", "sabiduria", "valor"].reduce((a, k) => ((score[k] || 0) >= (score[a] || 0) ? k : a), "poder");
      quiz.innerHTML = `
        <div class="quiz__result">
          ${TRI_SVG(best)}
          <p class="quiz__step">Tu fragmento</p>
          <p class="quiz__q">${L.triforce[best].title}</p>
          <p>${RESULT[best]}</p>
          <button class="btn btn--dark" type="button">Repetir</button>
        </div>`;
      $(".btn", quiz).addEventListener("click", () => { step = 0; score = {}; drawQuiz(); });
      anim(() => gsap.from(".quiz__result svg", { scale: 0.6, rotation: -20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }));
    }
    anim(() => gsap.from(quiz.children, { y: 10, opacity: 0, duration: 0.35, stagger: 0.04 }));
  }
  drawQuiz();

  // ---------- Origen (scroll narrativo) ----------
  const steps = $(".origin__steps");
  steps.innerHTML = L.origin.map((o, i) => `
    <li class="origin__step${i === 0 ? " is-active" : ""}" data-i="${i}">
      <p class="origin__era">${o.s}</p>
      <h3>${o.t}</h3>
      <p>${o.b}</p>
    </li>`).join("");
  $(".origin__total").textContent = String(L.origin.length).padStart(2, "0");
  function setOrigin(i) {
    $$(".origin__step").forEach((el) => el.classList.toggle("is-active", +el.dataset.i === i));
    $(".origin__n").textContent = String(i + 1).padStart(2, "0");
    $(".origin__bar i").style.transform = `scaleY(${(i + 1) / L.origin.length})`;
  }
  setOrigin(0);

  // ---------- Pueblos ----------
  const tabs = $(".races__tabs"), panel = $(".races__panel");
  tabs.innerHTML = L.races.map((r, i) =>
    `<button class="race-tab" type="button" role="tab" data-id="${r.id}" aria-selected="${i === 0}">${r.name}</button>`).join("");
  function selectRace(id, sound) {
    const r = L.races.find((x) => x.id === id);
    if (sound) sfx("select");
    $$(".race-tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.id === id));
    const region = L.regions.find((x) => x.id === r.region);
    panel.innerHTML = `
      <div class="race__head">
        ${region ? `<img class="race__img" src="${region.photo}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        <div>
          <p class="meta">Hogar: ${r.home}</p>
          <h3 class="race__name">${r.name}</h3>
        </div>
      </div>
      <ul class="race__traits">${r.traits.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p class="race__label">Figuras conocidas</p>
      <ul class="people people--light">${r.famous.map((f) => `<li>${f}</li>`).join("")}</ul>
      <p class="race__fact"><strong>¿Sabías que…?</strong> ${r.fact}</p>
      ${region ? `<a class="btn btn--outline race__go" href="#mapa" data-region="${region.id}">Ver ${region.name} en el mapa</a>` : ""}`;
    const go = $(".race__go", panel);
    if (go) go.addEventListener("click", () => {
      setTimeout(() => {
        const pin = document.querySelector(`.pin[data-id="${go.dataset.region}"]`);
        if (pin) pin.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }, 900);
    });
    anim(() => gsap.from(panel.children, { y: 12, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }));
  }
  $$(".race-tab").forEach((t) => t.addEventListener("click", () => selectRace(t.dataset.id, true)));
  selectRace(L.races[0].id, false);

  // ---------- Reliquias ----------
  // Iconos genéricos dibujados a mano para cada objeto.
  const ICON = {
    espada: '<path d="M32 4 36 10V40H28V10Z"/><path d="M18 40H46L42 46H22Z"/><rect x="29" y="46" width="6" height="10" rx="2"/><circle cx="32" cy="59" r="3"/>',
    escudo: '<path d="M14 10H50L50 30C50 44 41 53 32 58C23 53 14 44 14 30Z"/><path d="M32 20 39 33H25Z" class="ic-accent"/>',
    ocarina: '<ellipse cx="32" cy="36" rx="22" ry="14"/><path d="M46 28 58 20 60 24 50 32Z"/><circle cx="24" cy="34" r="2.5" class="ic-hole"/><circle cx="32" cy="38" r="2.5" class="ic-hole"/><circle cx="40" cy="34" r="2.5" class="ic-hole"/>',
    trifuerza: '<path d="M32 6 44 27H20Z"/><path d="M20 27 32 48H8Z"/><path d="M44 27 56 48H32Z"/>',
    piedra: '<rect x="12" y="10" width="40" height="44" rx="6"/><circle cx="32" cy="30" r="8" class="ic-hole"/><path d="M32 40V46" class="ic-line"/>',
    arco: '<path d="M16 8C40 16 40 48 16 56" class="ic-line"/><path d="M16 8V56" class="ic-thin"/><path d="M10 32H56" class="ic-thin"/><path d="M56 32 48 27V37Z"/>'
  };
  const relics = $(".relics"), dlg = $(".relic-dialog"), dlgBody = $(".relic-dialog__body");
  relics.innerHTML = L.relics.map((r) => `
    <button class="relic" type="button" data-id="${r.id}">
      <svg viewBox="0 0 64 64" aria-hidden="true">${ICON[r.id]}</svg>
      <span class="relic__name">${r.name}</span>
      <span class="relic__sub">${r.sub}</span>
    </button>`).join("");
  $$(".relic", relics).forEach((b) => b.addEventListener("click", () => {
    const r = L.relics.find((x) => x.id === b.dataset.id);
    sfx("glow");
    dlgBody.innerHTML = `
      <svg class="relic-dialog__icon" viewBox="0 0 64 64" aria-hidden="true">${ICON[r.id]}</svg>
      <p class="meta">${r.sub}</p>
      <h3 id="relic-title">${r.name}</h3>
      <dl>
        <dt>Origen</dt><dd>${r.origin}</dd>
        <dt>Poder</dt><dd>${r.power}</dd>
        <dt>Aparece en</dt><dd>${r.games}</dd>
      </dl>`;
    dlg.showModal();
    anim(() => gsap.from(dlg, { scale: 0.92, opacity: 0, duration: 0.4, ease: "back.out(1.6)" }));
  }));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // ---------- Animaciones de entrada y nav ----------
  if (!hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const nav = $(".nav");
  $$("main .section").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 40px",
      end: "bottom 40px",
      onToggle: (self) => { if (self.isActive) nav.classList.toggle("is-light", !sec.classList.contains("section--night")); }
    });
  });
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom 40px",
    onToggle: (self) => { if (self.isActive) nav.classList.remove("is-light"); }
  });
  ScrollTrigger.create({
    trigger: ".footer", start: "top 40px",
    onEnter: () => nav.classList.remove("is-light"),
    onLeaveBack: () => nav.classList.add("is-light")
  });

  if (reduce) return;

  // Revelado sutil (preset UI UX Pro Max: y pequeño, power2.out)
  $$(".reveal").forEach((el) =>
    gsap.from(el, { y: 16, opacity: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } })
  );

  // Los tres fragmentos se reúnen al entrar
  gsap.from(".tri__piece", {
    opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.12,
    x: (i) => [0, -120, 120][i], y: (i) => [-120, 80, 80][i], rotation: (i) => [-40, 60, -60][i],
    transformOrigin: "50% 50%",
    scrollTrigger: { trigger: ".tri", start: "top 75%" }
  });

  // El árbol de la cronología se dibuja con el scroll
  $$(".tl__line").forEach((p) => {
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut",
        scrollTrigger: { trigger: ".tl__tree", start: "top 80%" },
        onComplete: () => { p.style.strokeDasharray = p.classList.contains("tl__line--dash") ? "4 8" : "none"; } });
  });

  gsap.from(".pin", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08, ease: "back.out(2)",
    scrollTrigger: { trigger: ".map", start: "top 70%" } });

  $$(".origin__step").forEach((el, i) =>
    ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (self) => { if (self.isActive) setOrigin(i); } })
  );
  gsap.from(".relic", { y: 30, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power3.out",
    scrollTrigger: { trigger: ".relics", start: "top 85%" } });
  gsap.from(".race-tab", { x: -20, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out",
    scrollTrigger: { trigger: ".races", start: "top 80%" } });

  gsap.from(".flip", { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
    scrollTrigger: { trigger: ".cards", start: "top 80%" } });
})();
