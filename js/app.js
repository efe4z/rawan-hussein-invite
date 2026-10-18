/* ═══════════════════════════════════════════════════════════
   دعوة روان و حسين · التسلسل الكامل
   الظهور من العتمة ← كسرة الختم ← الضو على الزخارف ← فتح الغطا
   ← طلوع الكرت ← الكرت بيصير صفحة الدعوة
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const C = window.INVITE || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  const ar = (n) => String(n);   // الأرقام بالشكل 123 (متل التاريخ)
  const pad = (n) => (n < 10 ? "0" : "") + n;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const guest = (params.get("to") || "").trim().slice(0, 40);
  let inFrame = false;
  try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const el = {
    scene: $("#scene"), envWrap: $("#envWrap"), env: $("#env"), envBack: $("#envBack"), envShadow: $("#envShadow"),
    card: $("#card"), pocketWrap: $("#pocketWrap"), flap: $("#flap"), seal: $("#seal"), sealGlow: $("#sealGlow"),
    flash: $("#flash"), envLight: $("#envLight"), tap: $("#tap"), dark: $("#dark"), hint: $("#hint"),
    candle: $("#candle"), dust: $("#dust"), page: $("#page"), pageScroll: $("#pageScroll"),
    shimmer: $("#pageShimmer"), sound: $("#soundBtn"), flapShade: $("#flapShade"),
  };

  /* ═════════ ١. النصوص من ملف الإعدادات ═════════ */
  $$("[data-k]").forEach((n) => {
    const v = get(n.getAttribute("data-k"));
    if (v == null || v === "") { n.hidden = true; return; }
    n.textContent = v;
  });
  const N = C.names || {};
  const sign = $("#sign");
  sign.innerHTML = "";
  sign.append(N.first || "", Object.assign(document.createElement("span"), { className: "j", textContent: N.joiner || "و" }), N.second || "");
  $("#envTo").textContent = guest ? "إلى " + guest : (C.envelopeTo || "");
  const envNames = $("#envNames");
  envNames.append(N.first || "", Object.assign(document.createElement("span"), { className: "j", textContent: N.joiner || "و" }), N.second || "");
  $$(".mono").forEach((m) => { m.textContent = C.sealLetters || ""; });
  if (guest) $("#guestLink").value = guest;
  document.title = "دعوة " + (N.first || "") + " " + (N.joiner || "و") + " " + (N.second || "");

  /* ═════════ ٢. الزخارف ═════════ */
  const O = window.Ornaments.envelope();
  const defs = $("#ornDefs defs");
  defs.insertAdjacentHTML("beforeend", O.defs);
  const foilUses =
    '<use href="#ornFoil" class="u-shadow" transform="translate(1.8 2.6)"/>' +
    '<use href="#ornFoil" class="u-hi" transform="translate(-1.1 -1.1)"/>' +
    '<use href="#ornFoil" class="u-main"/>' +
    '<use href="#ornFoil" class="u-sheen"/>';
  ["#pocketFoil", "#flapFoil"].forEach((s) => { $(s).innerHTML = foilUses; });

  // طبقات الضو: نسخ حقيقية (مش <use>) لأن مسارات الضو بتتحرك، وهيك أخف على الآيفون
  const gSrc = $("#ornGlow"), sSrc = $("#ornStars");
  const counters = {};
  $$("path", gSrc).forEach((p) => {
    const c = (p.getAttribute("class") || "").split(" ").pop();
    counters[c] = (counters[c] || 0);
    p.setAttribute("data-i", counters[c]++);
    p.setAttribute("pathLength", "1"); p.setAttribute("stroke-dasharray", "1 1"); p.setAttribute("stroke-dashoffset", "1");
  });
  $$("path", sSrc).forEach((p, i) => { p.setAttribute("data-i", i); p.setAttribute("opacity", "0"); });
  const glowHTML = gSrc.innerHTML, starsHTML = sSrc.innerHTML;
  const glowLayer = (cls) => '<g class="' + cls + '" fill="none" stroke-linejoin="round" stroke-linecap="round">' + glowHTML + "</g>";
  const starLayer = (cls) => '<g class="' + cls + '" fill="none" stroke-linejoin="round">' + starsHTML + "</g>";
  ["#pocketGlow", "#flapGlow"].forEach((s) => {
    $(s).innerHTML = glowLayer("u-g1") + glowLayer("u-g2") + glowLayer("u-g3") + starLayer("u-s1") + starLayer("u-s2");
  });
  // مسارات الإطار الأصلية بنحتاجها بس للقياس
  const measure = {
    r: $('path.gl-frame[data-side="r"]', gSrc), l: $('path.gl-frame[data-side="l"]', gSrc),
    stars: $$("path", sSrc), edges: $$("path.gl-edge", gSrc),
  };

  const st = document.createElement("style");
  st.textContent =
    "#ornFoil path{stroke-width:var(--sw,3)}#ornFoil path.thin{stroke-width:var(--swt,2)}#ornFoil path.hair{stroke-width:var(--swh,1.1)}" +
    ".u-shadow{stroke:#02060f;opacity:.7;--sw:3.4;--swt:2.4;--swh:1.4}" +
    ".u-hi{stroke:#fff1c8;opacity:.32;--sw:2;--swt:1.4;--swh:.8}" +
    ".u-main{stroke:url(#foil);--sw:3;--swt:2;--swh:1.1}" +
    ".u-sheen{stroke:url(#sheen);mix-blend-mode:screen;--sw:3.4;--swt:2.4;--swh:1.4}" +
    ".u-g1{stroke:#d99a3e;opacity:.28;stroke-width:24}.u-g2{stroke:#ffd98e;opacity:.6;stroke-width:8}.u-g3{stroke:#fffaf0;opacity:.95;stroke-width:2.4}" +
    ".u-g1 .gl-edge,.u-g1 .gl-petal,.u-g1 .gl-vine,.u-g1 .gl-side,.u-g1 .gl-under{stroke-width:13}" +
    ".u-g2 .gl-edge,.u-g2 .gl-petal,.u-g2 .gl-vine,.u-g2 .gl-side,.u-g2 .gl-under{stroke-width:4.4}" +
    ".u-g3 .gl-edge,.u-g3 .gl-petal,.u-g3 .gl-vine,.u-g3 .gl-side,.u-g3 .gl-under{stroke-width:1.4}" +
    ".u-s1{stroke:#ffcf7a;opacity:.35;stroke-width:9}.u-s2{stroke:#fffaf0;opacity:.95;stroke-width:2}";
  document.head.appendChild(st);
  // الأصل بيضل بالـ defs (ما بينرسم) لنقيس عليه
  const sheenGrad = $("#sheen");

  // زخارف صفحة الدعوة
  $("#miniMed").setAttribute("d", window.Ornaments.miniMedallion(60, 60, 50));
  $$(".div-path").forEach((p) => p.setAttribute("d", window.Ornaments.divider(150, 20, 140)));
  $("#pfStar").setAttribute("d", window.Ornaments.octagram(0, 0, 12) + window.Ornaments.circle(0, 0, 4));

  /* ═════════ ٣. القياسات ═════════ */
  let L = {};
  let stage = "load"; // load → intro → ready → opening → page
  function layout() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const ew = Math.round(Math.min(vw * 0.8, (vh * (vw < 700 ? 0.58 : 0.64)) / 1.4, 460));
    const eh = Math.round(ew * 1.4);
    const mobile = vw < 700;
    const pw = mobile ? vw : Math.min(620, vw - 80);
    const ph = mobile ? vh : vh - 48;
    L = { vw, vh, ew, eh, pw, ph, pl: (vw - pw) / 2, pt: (vh - ph) / 2 };
    el.env.style.width = ew + "px";
    el.env.style.height = eh + "px";
    const sd = ew * 0.19;
    el.seal.style.width = el.seal.style.height = sd + "px";
    $$(".mono").forEach((m) => { m.style.fontSize = sd * 0.3 + "px"; });
    $("#envTo").style.fontSize = ew * 0.058 + "px";
    envNames.style.fontSize = ew * 0.1 + "px";
    if (stage !== "page") {
      el.page.style.width = pw + "px";
      el.page.style.height = ph + "px";
      if (el.page.parentNode === el.card) {
        gsap.set(el.page, { scale: el.card.offsetWidth / pw, transformOrigin: "0 0", x: 0, y: 0 });
      }
    } else {
      Object.assign(el.page.style, { left: L.pl + "px", top: L.pt + "px", width: pw + "px", height: ph + "px" });
    }
    Dust.resize();
    FX.resize();
  }

  /* ═════════ ٤. الصوت ═════════ */
  const M = C.music || {};
  const Sound = {
    ctx: null, master: null, noise: null, el: null, gain: null, viaWA: false, muted: false, looping: false,
    init() {
      try {
        if (navigator.audioSession) navigator.audioSession.type = "playback";
      } catch (e) {}
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.ctx = new AC();
          this.master = this.ctx.createGain();
          this.master.connect(this.ctx.destination);
          const b = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate), d = b.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          this.noise = b;
        }
        if (this.ctx.state === "suspended") this.ctx.resume();
      } catch (e) {}
    },
    burst(t, type, f, q, peak, dur) {
      const c = this.ctx, n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
      n.buffer = this.noise; fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.connect(fl); fl.connect(g); g.connect(this.master);
      n.start(t, Math.random() * 0.5); n.stop(t + dur + 0.02);
    },
    crack() {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + 0.01;
      this.burst(t, "bandpass", 2600, 1.2, 0.55, 0.035);
      this.burst(t + 0.045, "bandpass", 1700, 1.4, 0.4, 0.05);
      this.burst(t + 0.1, "highpass", 3200, 0.8, 0.18, 0.04);
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.16);
    },
    rustle(dur) {
      if (!this.ctx) return;
      const c = this.ctx, t = c.currentTime + 0.02;
      const n = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
      n.buffer = this.noise; n.loop = true; fl.type = "bandpass"; fl.frequency.value = 2400; fl.Q.value = 0.6;
      g.gain.setValueAtTime(0.0001, t);
      for (let i = 0; i < 9; i++) {
        const tt = t + (i / 9) * dur;
        g.gain.linearRampToValueAtTime(0.03 + Math.random() * 0.06, tt + 0.03);
        g.gain.linearRampToValueAtTime(0.008, tt + 0.09);
      }
      g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.1);
      n.connect(fl); fl.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + dur + 0.2);
    },
    prep() {                          // تحميل الأغنية من بدري مشان تبلّش فوراً مع الكبسة
      if (!M.file || this.el) return;
      const a = new Audio();
      a.preload = "auto"; a.playsInline = true; a.src = M.file;
      try { a.load(); } catch (e) {}
      this.el = a;
    },
    startMusic() {
      if (!M.file || this.started) return null;
      this.started = true;
      this.prep();
      const a = this.el;
      if (!this.wired) {                  // التوصيل بيصير مرة وحدة بس
        this.wired = true;
        try {
          if (!this.ctx || location.protocol === "file:") throw 0;
          const src = this.ctx.createMediaElementSource(a);
          this.gain = this.ctx.createGain(); this.gain.gain.value = 0;
          src.connect(this.gain); this.gain.connect(this.master);
          this.viaWA = true;
        } catch (e) { this.viaWA = false; try { a.volume = 0; } catch (e2) {} }
        a.addEventListener("timeupdate", () => {
          const left = a.duration - a.currentTime;
          if (!this.looping && isFinite(left) && left <= (M.fadeOut || 3)) { this.looping = true; this.fade(0, Math.max(0.2, left)); }
        });
        a.addEventListener("ended", () => {
          a.currentTime = 0; this.looping = false;
          const p2 = a.play(); if (p2 && p2.catch) p2.catch(() => {});
          this.fade(M.volume == null ? 0.75 : M.volume, M.fadeIn || 2);
        });
      }
      const p = a.play();
      this.fade(M.volume == null ? 0.75 : M.volume, M.fadeIn || 2);
      return p;
    },
    fade(v, d) {
      if (!this.el) return;
      if (this.viaWA) {
        const g = this.gain.gain, t = this.ctx.currentTime;
        g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(v, t + d);
      } else {
        gsap.to(this.el, { volume: v, duration: d, ease: "none" });
      }
    },
    setMuted(m) {
      this.muted = m;
      if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.06);
      if (this.el) this.el.muted = m;
    },
  };
  document.addEventListener("visibilitychange", () => {
    if (!Sound.ctx) return;
    if (document.hidden) { Sound.ctx.suspend(); if (Sound.el) Sound.el.pause(); }
    else { Sound.ctx.resume(); if (Sound.el && Sound.el.currentTime > 0) { const p = Sound.el.play(); if (p && p.catch) p.catch(() => {}); } }
  });
  el.sound.addEventListener("click", () => {
    if (!Sound.started) { startAudioNow(); return; }
    if (performance.now() - (Sound.justStarted || 0) < 500) return;   // نفس الكبسة اللي شغّلت الصوت
    Sound.init();
    const m = !Sound.muted;
    Sound.setMuted(m);
    el.sound.classList.toggle("muted", m);
    el.sound.setAttribute("aria-label", m ? "تشغيل الصوت" : "كتم الصوت");
  });

  /* ═════════ ٥. غبار ذهبي ═════════ */
  const Dust = {
    cv: el.dust, ctx: null, parts: [], W: 0, H: 0, dpr: 1, level: { v: 0.5 }, sprite: null,
    init() {
      if (reduce) return;
      this.ctx = this.cv.getContext("2d");
      const s = document.createElement("canvas"); s.width = s.height = 64;
      const g = s.getContext("2d"), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, "rgba(255,240,205,1)"); rg.addColorStop(0.25, "rgba(255,212,140,.75)"); rg.addColorStop(1, "rgba(255,180,90,0)");
      g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
      this.sprite = s;
      const n = window.innerWidth < 700 ? 46 : 70;
      for (let i = 0; i < n; i++) this.parts.push(this.spawn(true));
      gsap.ticker.add(() => this.draw());
    },
    spawn(any) {
      const W = this.W || window.innerWidth, H = this.H || window.innerHeight;
      return {
        x: W * (0.15 + Math.random() * 0.7) + (Math.random() - 0.5) * W * 0.3,
        y: any ? Math.random() * H : H + 10,
        r: 0.6 + Math.random() * Math.random() * 2.6,
        vy: -(5 + Math.random() * 14), sway: 6 + Math.random() * 14, ph: Math.random() * 6.28,
        a: 0.25 + Math.random() * 0.6, tw: 0.6 + Math.random() * 1.8,
      };
    },
    resize() {
      if (!this.ctx) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = window.innerWidth; this.H = window.innerHeight;
      this.cv.width = this.W * this.dpr; this.cv.height = this.H * this.dpr;
    },
    draw() {
      const c = this.ctx; if (!c) return;
      const dt = Math.min(gsap.ticker.deltaRatio() / 60, 0.05), t = gsap.ticker.time;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.W, this.H);
      c.globalCompositeOperation = "lighter";
      const L = this.level.v;
      for (const p of this.parts) {
        p.y += p.vy * dt * (0.6 + L * 0.5);
        p.x += Math.sin(t * 0.6 + p.ph) * p.sway * dt;
        if (p.y < -12) Object.assign(p, this.spawn(false));
        const a = p.a * L * (0.55 + 0.45 * Math.sin(t * p.tw + p.ph));
        if (a <= 0.01) continue;
        const s = p.r * 7;
        c.globalAlpha = Math.min(1, a);
        c.drawImage(this.sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      c.globalAlpha = 1;
    },
  };

  /* ═════════ ٥ب. رقائق ذهب ولمعات (فوق كل شي) ═════════ */
  const FX = {
    cv: $("#fx"), ctx: null, W: 0, H: 0, dpr: 1, leaves: [], sparks: [], rings: [], on: false, last: 0,
    init() {
      this.ctx = this.cv.getContext("2d");
      this.resize();
      this.tick = this.tick.bind(this);
    },
    resize() {
      if (!this.ctx) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = window.innerWidth; this.H = window.innerHeight;
      this.cv.width = this.W * this.dpr; this.cv.height = this.H * this.dpr;
    },
    run() { if (!this.on && this.ctx) { this.on = true; gsap.ticker.add(this.tick); } },
    // رقاقة ذهب: شكل غير منتظم بيلف بالهوا وبينزل ببطء
    leafBurst(x, y, n, spread) {
      if (!this.ctx || reduce) return;
      for (let i = 0; i < n; i++) {
        const k = 3 + Math.floor(Math.random() * 3), pts = [];
        for (let j = 0; j < k; j++) {
          const a = (j / k) * Math.PI * 2 + Math.random() * 0.8, r = 0.55 + Math.random() * 0.45;
          pts.push([Math.cos(a) * r, Math.sin(a) * r * (0.6 + Math.random() * 0.4)]);
        }
        const big = Math.random() < 0.22;
        this.leaves.push({
          x: x + (Math.random() - 0.5) * spread, y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 260, vy: -(240 + Math.random() * 420),
          s: big ? 9 + Math.random() * 7 : 4 + Math.random() * 5,
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 5,
          fl: Math.random() * 6.28, vf: 2.5 + Math.random() * 5,
          sway: 0.8 + Math.random() * 1.6, ph: Math.random() * 6.28,
          t: 0, life: 6 + Math.random() * 3.5, pts,
          tone: Math.random(),
        });
      }
      this.run();
    },
    sparkle(x, y, n, power) {
      if (!this.ctx) return;
      n = n || 10; power = power || 1;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = (50 + Math.random() * 130) * power;
        this.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, t: 0, life: 0.55 + Math.random() * 0.5, s: (2 + Math.random() * 3.5) * Math.min(power, 1.4) });
      }
      if (power >= 1) this.rings.push({ x, y, t: 0, life: 0.55 });
      this.run();
    },
    trail(x, y) {
      if (!this.ctx || reduce) return;
      for (let i = 0; i < 2; i++) {
        this.sparks.push({ x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 40, vy: 10 + Math.random() * 40, t: 0, life: 0.5 + Math.random() * 0.4, s: 1.5 + Math.random() * 2.2 });
      }
      this.run();
    },
    tick() {
      const c = this.ctx, dt = Math.min(gsap.ticker.deltaRatio() / 60, 0.05);
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.W, this.H);
      // الرقائق
      for (let i = this.leaves.length - 1; i >= 0; i--) {
        const p = this.leaves[i];
        p.t += dt;
        const drag = 2.6;
        p.vy += 330 * dt; p.vx -= p.vx * drag * dt; p.vy -= p.vy * drag * dt * (p.vy > 0 ? 1 : 0.35);
        p.x += (p.vx + Math.sin(p.t * p.sway + p.ph) * 26) * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt; p.fl += p.vf * dt;
        if (p.t > p.life || p.y > this.H + 30) { this.leaves.splice(i, 1); continue; }
        const fade = Math.min(1, p.t * 4) * Math.min(1, (p.life - p.t) / 1.2);
        const fx = Math.cos(p.fl), face = Math.abs(fx);
        c.save();
        c.translate(p.x, p.y); c.rotate(p.rot); c.scale(Math.max(0.12, face) * p.s, p.s);
        c.beginPath();
        p.pts.forEach((q, j) => (j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])));
        c.closePath();
        const g = c.createLinearGradient(-1, -1, 1, 1);
        const lo = p.tone < 0.5 ? "#8a6224" : "#9b7230";
        g.addColorStop(0, "#fbe9b4"); g.addColorStop(0.45, p.tone < 0.5 ? "#d6aa55" : "#e2bb68"); g.addColorStop(1, lo);
        c.globalAlpha = fade * (0.55 + 0.45 * face);
        c.fillStyle = g; c.fill();
        const spec = Math.pow(face, 10);
        if (spec > 0.05) { c.globalAlpha = fade * spec * 0.85; c.fillStyle = "#fffaf0"; c.fill(); }
        c.restore();
      }
      // اللمعات: على العتمة بتضوي، وعلى ورق الكرت بتطلع ذهبية
      const dark = stage !== "page";
      c.globalCompositeOperation = dark ? "lighter" : "source-over";
      const SC = dark ? "#ffe6a6" : "#c08b2e", RC = dark ? "#f3d68f" : "#c49a45";
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const p = this.sparks[i];
        p.t += dt;
        if (p.t > p.life) { this.sparks.splice(i, 1); continue; }
        p.vx *= 1 - 2.2 * dt; p.vy = p.vy * (1 - 2.2 * dt) + 60 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        const k = 1 - p.t / p.life, r = p.s * (0.6 + 0.4 * k);
        c.globalAlpha = k;
        c.fillStyle = SC;
        c.beginPath();
        c.moveTo(p.x, p.y - r * 2.2); c.quadraticCurveTo(p.x, p.y, p.x + r * 2.2, p.y); c.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 2.2);
        c.quadraticCurveTo(p.x, p.y, p.x - r * 2.2, p.y); c.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 2.2);
        c.fill();
        c.globalAlpha = k * (dark ? 0.35 : 0.16); c.beginPath(); c.arc(p.x, p.y, r * 2.6, 0, 6.283); c.fill();
      }
      for (let i = this.rings.length - 1; i >= 0; i--) {
        const p = this.rings[i];
        p.t += dt;
        if (p.t > p.life) { this.rings.splice(i, 1); continue; }
        const k = p.t / p.life;
        c.globalAlpha = (1 - k) * 0.6; c.strokeStyle = RC; c.lineWidth = 1.4;
        c.beginPath(); c.arc(p.x, p.y, 6 + k * 26, 0, 6.283); c.stroke();
      }
      c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
      if (!this.leaves.length && !this.sparks.length && !this.rings.length) {
        c.clearRect(0, 0, this.W, this.H);
        gsap.ticker.remove(this.tick); this.on = false;
      }
    },
  };

  // لمعة ذهب مكان اللمس
  window.addEventListener("pointerdown", (e) => {
    if (stage === "load" || reduce) return;
    const now = performance.now();
    if (now - FX.last < 90) return;
    FX.last = now;
    FX.sparkle(e.clientX, e.clientY, 9, 1);
  }, { passive: true });

  // أشعة الضو (بتنرسم مرة وحدة، والحركة على الصندوق كله)
  (function buildRays() {
    const box = $("#rays");
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const P = (a, r, ox) => [(500 + ox + Math.sin(a) * r).toFixed(1), (1000 - Math.cos(a) * r).toFixed(1)].join(",");
    let rays = "";
    const N = 21;
    for (let i = 0; i < N; i++) {
      const a = ((-70 + (140 * (i + 0.2 + rnd() * 0.6)) / N) * Math.PI) / 180;
      const w = ((1 + rnd() * 3.6) * Math.PI) / 180, L = 640 + rnd() * 360, ox = (rnd() - 0.5) * 70;
      rays += '<polygon opacity="' + (0.35 + rnd() * 0.6).toFixed(2) + '" points="' + (500 + ox) + ',1000 ' + P(a - w / 2, L, ox) + " " + P(a + w / 2, L, ox) + '"/>';
    }
    box.innerHTML =
      '<svg viewBox="0 0 1000 1000" preserveAspectRatio="none">' +
      '<defs><radialGradient id="rayG" gradientUnits="userSpaceOnUse" cx="500" cy="1000" r="1000">' +
      '<stop offset="0" stop-color="#fff6dc" stop-opacity="1"/><stop offset=".3" stop-color="#ffdc96" stop-opacity=".55"/><stop offset="1" stop-color="#ffc56b" stop-opacity="0"/></radialGradient>' +
      '<filter id="rayB" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      '<g fill="url(#rayG)" filter="url(#rayB)">' + rays + '<ellipse cx="500" cy="1000" rx="300" ry="150" opacity=".9"/></g></svg>';
  })();

  /* ═════════ ٦. حركة خفيفة مع الماوس أو ميلان الجوال ═════════ */
  let tiltOn = false;
  const tiltX = gsap.quickTo(el.env, "rotationY", { duration: 0.9, ease: "power3" });
  const tiltY = gsap.quickTo(el.env, "rotationX", { duration: 0.9, ease: "power3" });
  const candleX = gsap.quickTo(el.candle, "x", { duration: 1.2, ease: "power3" });
  function tilt(nx, ny) {
    if (!tiltOn || reduce) return;
    tiltX(nx * 9); tiltY(-ny * 7); candleX(nx * -24);
  }
  window.addEventListener("pointermove", (e) => tilt(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5), { passive: true });
  if (!isIOS && "DeviceOrientationEvent" in window) {
    let base = null;
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      if (base == null) base = e.beta;
      tilt(Math.max(-1, Math.min(1, e.gamma / 25)) * 0.5, Math.max(-1, Math.min(1, (e.beta - base) / 25)) * 0.5);
    });
  }

  /* ═════════ ٧. البداية ═════════ */
  gsap.set(el.env, { xPercent: -50, yPercent: -50, rotation: -3, transformPerspective: 0 });
  gsap.set(el.flap, { transformOrigin: "50% 0%" });
  el.card.appendChild(el.page);
  Dust.init();
  FX.init();
  layout();
  window.addEventListener("resize", layout);

  function loadImg(src) { return new Promise((r) => { const i = new Image(); i.onload = i.onerror = () => r(); i.src = src; if (i.decode) i.decode().then(r, r); }); }
  const fontsReady = document.fonts && document.fonts.load
    ? Promise.all([
        document.fonts.load('400 40px "Gulzar"', (N.first || "") + (N.second || "")),
        document.fonts.load('600 20px "Markazi Text"', "الجمعة"),
        document.fonts.load('400 20px "Amiri"', "بسم"),
        document.fonts.load('700 20px "Amiri"', "صالة"),
      ]).catch(() => {})
    : Promise.resolve();
  const ready = Promise.race([
    Promise.all([fontsReady, loadImg("assets/velvet.jpg"), loadImg("assets/paper-navy.jpg"), loadImg("assets/seal.webp"), loadImg("assets/paper-ivory.jpg")]),
    new Promise((r) => setTimeout(r, 6000)),
  ]);

  // نقطة تحميل صغيرة إذا تأخر
  const loader = document.createElement("div");
  loader.style.cssText = "position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px;border-radius:50%;background:#e6c983;box-shadow:0 0 14px #e6c983;opacity:0";
  el.dark.appendChild(loader);
  const loaderTween = gsap.to(loader, { opacity: 0.8, duration: 0.8, repeat: -1, yoyo: true, delay: 0.9 });

  ready.then(() => {
    loaderTween.kill(); loader.remove();
    layout();
    if (location.hash === "#invite") return showPageDirect();
    intro();
  });

  function intro() {
    stage = "intro";
    Sound.prep();
    const tl = gsap.timeline({ onComplete: () => {
      stage = "ready"; el.tap.disabled = false; tiltOn = true;
      // إذا الضيف ما كبس، الظرف بينفتح لحاله
      const autoS = C.autoOpenSeconds == null ? 6 : +C.autoOpenSeconds;
      if (autoS > 0) setTimeout(() => { if (stage === "ready") openInvite(true); }, autoS * 1000);
    } });
    tl.fromTo(el.dark, { opacity: 1 }, { opacity: 0, duration: reduce ? 0.6 : 2.3, ease: "power1.inOut" }, 0)
      .fromTo(el.candle, { opacity: 0 }, { opacity: 1, duration: reduce ? 0.6 : 2.4, ease: "power1.inOut" }, 0)
      .fromTo(el.env, { scale: 0.975, y: 10 }, { scale: 1, y: 0, duration: 2.6, ease: "power2.out" }, 0)
      .fromTo(Dust.level, { v: 0 }, { v: 0.55, duration: 2.5 }, 0.2)
      .fromTo(sheenGrad, { attr: { x1: -500, y1: -100, x2: -100, y2: 200 } }, { attr: { x1: 1300, y1: 1300, x2: 1700, y2: 1600 }, duration: 1.3, ease: "power1.inOut" }, 2.0)
      .to(el.hint, { opacity: 0.92, duration: 0.8 }, 2.5);
    // نَفَس الختم
    gsap.fromTo(el.sealGlow, { opacity: 0.05, scale: 0.9 }, { opacity: 0.55, scale: 1.05, duration: 1.25, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.4 });
    gsap.to(el.hint, { opacity: 0.55, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 3.4 });
    // وميض الشمعة
    gsap.ticker.add(candleFlicker);
  }
  function candleFlicker() {
    if (stage === "page") return;
    const t = gsap.ticker.time;
    const f = 0.9 + 0.06 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 13.1 + 1) + 0.03 * Math.sin(t * 2.1);
    el.candle.style.filter = "brightness(" + f.toFixed(3) + ")";
  }

  /* ═════════ ٨. فتح الرسالة ═════════ */
  el.tap.addEventListener("click", () => { if (stage === "ready") openInvite(); });

  function shards() {
    const box = el.seal;
    for (let i = 0; i < 9; i++) {
      const s = document.createElement("i");
      const sz = 3 + Math.random() * 5;
      s.style.cssText = "position:absolute;left:50%;top:50%;width:" + sz + "px;height:" + sz * 0.7 + "px;border-radius:40% 60% 50% 45%;" +
        "background:linear-gradient(135deg,#f3dc9b,#a9802f 60%,#6d4f17);z-index:3;pointer-events:none";
      box.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 20 + Math.random() * 40;
      gsap.timeline({ onComplete: () => s.remove() })
        .to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.6 - 10, rotation: Math.random() * 360, duration: 0.35, ease: "power2.out" })
        .to(s, { y: "+=" + (40 + Math.random() * 30), opacity: 0, duration: 0.6, ease: "power2.in" });
    }
  }

  function framePos(starX, starY, path) {
    // موقع النجمة على مسار الإطار (٠ فوق بالنص → ١ تحت بالنص)
    const len = path.getTotalLength();
    let best = 0, bd = 1e9;
    for (let i = 0; i <= 160; i++) {
      const p = path.getPointAtLength((i / 160) * len), d = (p.x - starX) ** 2 + (p.y - starY) ** 2;
      if (d < bd) { bd = d; best = i / 160; }
    }
    return best;
  }

  // الصوت بالفتح التلقائي: الجوالات بتمنعه قبل أول لمسة، فبيبلّش مع أول لمسة للشاشة
  const AUDIO_EVENTS = ["click", "touchend", "keydown"];
  function armAudio() { AUDIO_EVENTS.forEach((t) => window.addEventListener(t, startAudioNow, true)); }
  function startAudioNow() {
    if (Sound.started) return;
    AUDIO_EVENTS.forEach((t) => window.removeEventListener(t, startAudioNow, true));
    Sound.init();
    Sound.justStarted = performance.now();
    const p = Sound.startMusic();
    el.sound.classList.remove("muted");
    el.sound.setAttribute("aria-label", "كتم الصوت");
    // إذا المتصفح رفض التشغيل (مثلاً اللمسة كانت سحب)، منرجع منستنى اللمسة الجاية
    if (p && p.catch) p.catch(() => {
      Sound.started = false;
      el.sound.classList.add("muted");
      el.sound.setAttribute("aria-label", "تشغيل الصوت");
      armAudio();
    });
  }

  function openInvite(auto) {
    stage = "opening";
    el.tap.disabled = true;
    tiltOn = false;
    el.sound.hidden = false;
    if (auto && M.file) {
      el.sound.classList.add("muted");
      el.sound.setAttribute("aria-label", "تشغيل الصوت");
      armAudio();
    } else {
      startAudioNow();
    }
    gsap.killTweensOf([el.sealGlow, el.hint]);
    gsap.to(el.hint, { opacity: 0, duration: 0.4 });
    gsap.to(el.env, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" });
    gsap.to(el.candle, { x: 0, duration: 0.6 });

    const k = reduce ? 0.45 : 1;          // تسريع لتقليل الحركة
    const T = (s) => s * k;
    const tl = gsap.timeline();
    window.__invite.tl = tl;
    const halves = $$(".seal-half", el.seal);
    const g = (cls, i) => $$(".orn-glow ." + cls + (i == null ? "" : '[data-i="' + i + '"]'));
    const draw = (targets, at, dur, ease, stagger) =>
      tl.to(targets, {
        attr: { "stroke-dashoffset": 0 }, duration: T(dur), ease: ease || "power1.inOut",
        delay: 0, stagger: stagger ? (i, t) => (+t.getAttribute("data-i") || 0) * stagger : 0,
      }, T(at));

    // ٠.٠٠ – ٠.٤٠ كسرة الختم
    tl.to(el.seal, { scale: 0.96, duration: 0.07, ease: "power1.out" }, 0)
      .call(() => { el.seal.classList.remove("seal-whole"); Sound.crack(); if (!reduce) shards(); }, null, 0.06)
      .to(el.seal, { scale: 1, duration: 0.18, ease: "back.out(3)" }, 0.07)
      .to(halves[0], { x: -1.6, y: 0.6, rotation: -1.8, duration: 0.3, ease: "power2.out" }, 0.1)
      .to(halves[1], { x: 1.6, y: 0.4, rotation: 1.8, duration: 0.3, ease: "power2.out" }, 0.1)
      .to(el.sealGlow, { opacity: 1, scale: 1.25, duration: 0.4, ease: "power2.out" }, 0.1)
      .to(el.sealGlow, { opacity: 0.35, scale: 1.1, duration: 1.6 }, 0.5);

    // ٠.٤٠ – ٢.٤٠ الميدالية والأغصان
    draw(g("gl-med", 0), 0.4, 1.0);
    draw(g("gl-med", 1), 0.5, 0.8);
    draw(g("gl-petal"), 1.0, 0.45, "power1.out", T(0.03));
    draw(g("gl-med2"), 1.2, 0.5);
    draw(g("gl-stem"), 1.4, 0.7, "power1.in");
    draw(g("gl-vine"), 1.65, 0.75);
    draw(g("gl-side"), 1.5, 0.9);
    tl.to(Dust.level, { v: 1.35, duration: T(1.2) }, T(1.6));

    // ٢.٤٠ – ٤.٠٠ الإطار بينقسم يمين ويسار
    draw(g("gl-frame"), 2.4, 1.6, "power1.inOut");
    const inout = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    measure.stars.forEach((s, i) => {
      const x = +s.dataset.x, y = +s.dataset.y;
      const u = framePos(x, y, x >= 500 ? measure.r : measure.l);
      const at = 2.4 + 1.6 * inout(u);
      const copies = $$('.orn-glow .gl-star[data-i="' + i + '"]');
      tl.to(copies, { attr: { opacity: 1 }, duration: T(0.25) }, T(at)).to(copies, { attr: { opacity: 0.55 }, duration: T(0.8) }, T(at + 0.3));
    });
    measure.edges.forEach((v, i) => {
      const x = +v.dataset.x, y = +v.dataset.y;
      const u = framePos(x, y, x >= 500 ? measure.r : measure.l);
      draw(g("gl-edge", i), 2.4 + 1.6 * inout(u), 0.4, "power1.out");
    });
    draw(g("gl-under"), 3.55, 0.6);

    // ٤.٠٠ وميض تحت + ذروة ثم جمر
    tl.fromTo(el.flash, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: T(0.25), ease: "power2.out" }, T(3.95))
      .to(el.flash, { opacity: 0, duration: T(0.8) }, T(4.25))
      .to(".orn-glow", { opacity: 1, duration: T(0.3) }, T(4.0))
      .to(".orn-glow", { opacity: 0.5, duration: T(0.9), ease: "power1.out" }, T(4.3))
      .fromTo(sheenGrad, { attr: { x1: -500, y1: -100, x2: -100, y2: 200 } }, { attr: { x1: 1300, y1: 1300, x2: 1700, y2: 1600 }, duration: T(1.0), ease: "power1.inOut" }, T(3.9))
      .to(Dust.level, { v: 0.8, duration: T(1.5) }, T(4.3));

    // ٤.٤٥ – ٥.٨٠ الختم بيوقع والغطا بينفتح
    tl.to(halves[0], { y: 26, x: -16, rotation: -22, opacity: 0, duration: T(0.6), ease: "power2.in" }, T(4.45))
      .to(halves[1], { y: 30, x: 16, rotation: 20, opacity: 0, duration: T(0.6), ease: "power2.in" }, T(4.45))
      .to(el.sealGlow, { opacity: 0, duration: T(0.5) }, T(4.45))
      .call(() => Sound.rustle(1.0), null, T(4.6))
      .to(el.flapShade, { opacity: 0, duration: T(0.5) }, T(4.6))
      .to(el.flap, { rotationX: 180, duration: T(1.2), ease: "power2.inOut" }, T(4.6))
      .set(el.flap, { zIndex: 1, z: -2 }, T(5.2));

    // ٥.٨٠ – ٧.٢٠ الكرت بيطلع
    tl.to("#cardShade", { opacity: 0, duration: T(1.3), ease: "power1.inOut" }, T(5.85))
      .to(el.card, { y: -0.4 * L.eh, duration: T(1.4), ease: "power2.inOut" }, T(5.8))
      .to(el.env, { y: 0.22 * L.eh, duration: T(1.4), ease: "power2.inOut" }, T(5.8))
      .fromTo(el.shimmer, { opacity: 1, backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: T(1.0), ease: "power1.inOut", immediateRender: false }, T(6.6))
      .to(el.shimmer, { opacity: 0, duration: T(0.25) }, T(7.6));

    // ٥.٣٠ – ٧.٢٠ أشعة ضو من فم الظرف ورقائق ذهب
    const rays = $("#rays");
    tl.fromTo(rays, { opacity: 0, scaleY: 0.45, scaleX: 0.8 }, { opacity: 0.9, scaleY: 1, scaleX: 1, duration: T(1.1), ease: "power2.out", immediateRender: false }, T(5.3))
      .to(rays, { rotation: 2.2, duration: T(0.9), ease: "sine.inOut", yoyo: true, repeat: 1 }, T(5.6))
      .to(rays, { opacity: 0.55, duration: T(0.6) }, T(6.5))
      .to(rays, { opacity: 0, duration: T(0.5) }, T(7.2))
      .call(() => leafFromEnvelope(L.vw < 700 ? 24 : 36), null, T(6.0))
      .call(() => leafFromEnvelope(L.vw < 700 ? 14 : 22), null, T(6.75));

    // ٧.٢٠ – ٩.٠٠ الظرف بينزل والكرت بيصير الصفحة
    const parts = [el.envBack, el.pocketWrap, el.flap, el.envShadow, el.envLight, el.seal];
    tl.to(parts, { y: "+=" + 0.32 * L.eh, opacity: 0, duration: T(0.6), ease: "power2.in" }, T(7.2))
      .to(el.dark, { opacity: L.vw < 700 ? 0.3 : 0.5, duration: T(1.6) }, T(7.2))
      .to(Dust.level, { v: 0.35, duration: T(1.5) }, T(7.5))
      .call(() => flipPage(T(1.45)), null, T(7.6));
  }

  function leafFromEnvelope(n) {
    const r = el.env.getBoundingClientRect();
    FX.leafBurst(r.left + r.width / 2, r.top + r.height * 0.12, n, r.width * 0.55);
  }

  function flipPage(dur) {
    const r = el.card.getBoundingClientRect();
    const cw = el.card.offsetWidth, ch = el.card.offsetHeight;
    const th = (gsap.getProperty(el.env, "rotation") * Math.PI) / 180;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const Tx = cx + (ch / 2) * Math.sin(th), Ty = cy - (ch / 2) * Math.cos(th);
    const s = cw / L.pw;
    document.body.appendChild(el.page);
    el.page.classList.add("is-fixed");
    Object.assign(el.page.style, { left: L.pl + "px", top: L.pt + "px", width: L.pw + "px", height: L.ph + "px" });
    gsap.set(el.page, {
      x: Tx - (L.pl + L.pw / 2), y: Ty - L.pt, rotation: (th * 180) / Math.PI, scale: s, transformOrigin: "50% 0%",
      clipPath: "inset(0px 0px " + Math.max(0, L.ph - ch / s).toFixed(1) + "px 0px)",
    });
    el.card.style.visibility = "hidden";
    stage = "page";
    gsap.to(el.page, {
      x: 0, y: 0, rotation: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px)", duration: dur, ease: "power3.inOut",
      onComplete: () => {
        el.page.classList.remove("locked");
        gsap.set(el.page, { clearProps: "clipPath" });
        el.envWrap.style.display = "none";
        el.hint.style.display = "none";
        startCountdown();
        writeNames(0.1);
        setupReveal();
      },
    });
  }

  function showPageDirect() {
    stage = "page";
    document.body.appendChild(el.page);
    el.page.classList.add("is-fixed");
    el.page.classList.remove("locked");
    Object.assign(el.page.style, { left: L.pl + "px", top: L.pt + "px", width: L.pw + "px", height: L.ph + "px" });
    gsap.set(el.page, { x: 0, y: 0, scale: 1, rotation: 0 });
    el.envWrap.style.display = "none";
    el.hint.style.display = "none";
    gsap.to(el.dark, { opacity: L.vw < 700 ? 0.3 : 0.5, duration: 0.8 });
    gsap.to(el.candle, { opacity: 1, duration: 0.8 });
    Dust.level.v = 0.35;
    startCountdown();
    writeNames(0.7);
    setupReveal();
  }

  /* ═════════ ٨ب. الأسماء بتنكتب بالضو ═════════ */
  const nmEls = $$(".names .nm"), joinerEl = $(".names .joiner"), pen = $(".names .pen");
  if (reduce) gsap.set([...nmEls, joinerEl], { opacity: 0 });
  else { gsap.set(nmEls, { clipPath: "inset(0% 0% 0% 100%)" }); gsap.set(joinerEl, { opacity: 0 }); }

  function writeNames(delay) {
    if (reduce) {
      gsap.to([nmEls[0], joinerEl, nmEls[1]], { opacity: 1, duration: 0.8, stagger: 0.25, delay });
      return;
    }
    const NAVY = "#13284a", GOLD = "#b8903f";
    const tl = gsap.timeline({ delay, onComplete: () => gsap.set(nmEls, { clearProps: "clipPath,color,textShadow" }) });
    const DUR = 1.3;
    nmEls.forEach((n, i) => {
      const at = i === 0 ? 0 : 1.9;
      const pad = parseFloat(getComputedStyle(n).paddingLeft) || 0;
      const xr = n.offsetLeft + n.offsetWidth - pad * 0.9, xl = n.offsetLeft + pad * 0.9;
      const ym = n.offsetTop + n.offsetHeight * 0.52;
      const amp = n.offsetHeight * 0.12;
      tl.set(n, { color: GOLD, textShadow: "0 0 16px rgba(226,182,96,.9)" }, at)
        .fromTo(n, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DUR, ease: "power1.inOut" }, at)
        .to(n, { color: NAVY, textShadow: "0 0 0px rgba(226,182,96,0)", duration: 1.2, ease: "power1.out" }, at + DUR * 0.75)
        .set(pen, { x: xr, y: ym, opacity: 0 }, at)
        .to(pen, { opacity: 1, duration: 0.15 }, at)
        .to(pen, { x: xl, duration: DUR, ease: "power1.inOut",
          onUpdate: () => {
            const b = pen.getBoundingClientRect();
            if (Math.random() < 0.6) FX.trail(b.left + b.width / 2, b.top + b.height / 2);
          } }, at)
        .to(pen, { keyframes: { y: [ym - amp, ym + amp * 1.2, ym - amp * 0.6, ym + amp * 0.5, ym] }, duration: DUR, ease: "none" }, at)
        .to(pen, { opacity: 0, duration: 0.3 }, at + DUR - 0.12);
    });
    tl.fromTo(joinerEl, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2.2)" }, 1.35)
      .call(() => { const b = joinerEl.getBoundingClientRect(); FX.sparkle(b.left + b.width / 2, b.top + b.height / 2, 14, 1.2); }, null, 1.45);
  }

  /* ═════════ ٨ج. الأقسام بتطلع مع النزول ═════════ */
  function setupReveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    const sc = el.pageScroll;
    const limit = sc.scrollTop + sc.clientHeight * 0.9;
    const items = $$(".page-content > *").filter((n) => !n.hidden && n.offsetTop > limit && !n.matches(".names, .basmala, .inv, .mini-med"));
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 30 });
    items.forEach((n) => {
      if (n.matches(".divider")) {
        const p = n.querySelector("path");
        p.setAttribute("pathLength", "1"); p.setAttribute("stroke-dasharray", "1 1"); p.setAttribute("stroke-dashoffset", "1");
      }
    });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const n = e.target;
        gsap.to(n, { opacity: 1, y: 0, duration: 0.95, ease: "power2.out" });
        if (n.matches(".divider")) gsap.to(n.querySelector("path"), { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power1.inOut" });
        const cells = n.querySelectorAll(".cd-cell, .choice label, .field, .btn, .stepper");
        if (cells.length) gsap.from(cells, { opacity: 0, y: 14, duration: 0.6, stagger: 0.08, delay: 0.15, ease: "power2.out", clearProps: "opacity,transform" });
      });
    }, { root: sc, rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    items.forEach((n) => io.observe(n));
  }

  /* ═════════ ٩. صفحة الدعوة ═════════ */
  const E = C.event || {};
  const target = new Date(Date.UTC(E.year, E.month - 1, E.day, E.hour - (E.utcOffset || 0), E.minute || 0));
  let cdTimer = null;
  function startCountdown() {
    if (cdTimer) return;
    const cells = {};
    ["d", "h", "m", "s"].forEach((k) => { cells[k] = $('[data-cd="' + k + '"]'); });
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        $("#cd").hidden = true;
        const done = $("#cdDone"); done.textContent = (C.countdown || {}).done || ""; done.hidden = false;
        clearInterval(cdTimer); return;
      }
      cells.d.textContent = ar(Math.floor(diff / 864e5));
      cells.h.textContent = ar(Math.floor(diff / 36e5) % 24);
      cells.m.textContent = ar(Math.floor(diff / 6e4) % 60);
      cells.s.textContent = ar(Math.floor(diff / 1e3) % 60);
    };
    tick(); cdTimer = setInterval(tick, 1000);
  }
  startCountdown();

  // التقويم
  const end = new Date(target.getTime() + (E.durationHours || 4) * 36e5);
  const z = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
  const P = C.place || {};
  const where = (P.name || "") + "، " + (P.address || "");
  const pageUrl = /^https?:/.test(location.protocol) && !inFrame ? location.href.split("#")[0].split("?")[0] : "";
  const details = (C.closing || "") + (pageUrl ? "\n" + pageUrl : "");
  $("#gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(C.calendarTitle || "") +
    "&dates=" + z(target) + "/" + z(end) + "&details=" + encodeURIComponent(details) + "&location=" + encodeURIComponent(where);
  const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rawan-Hussein//Invite//AR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:rawan-hussein-" + z(target) + "@invite", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(target), "DTEND:" + z(end),
    "SUMMARY:" + esc(C.calendarTitle || ""), "LOCATION:" + esc(where), "DESCRIPTION:" + esc(details),
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + esc(C.calendarTitle || ""), "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const ical = $("#ical");
  if (inFrame) ical.hidden = true;
  else { ical.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); ical.setAttribute("download", "khutbeh-rawan-hussein.ics"); }
  $("#calBtn").addEventListener("click", () => { const o = $("#calOpts"); o.hidden = !o.hidden; });

  // الخريطة
  $("#mapBtn").href = P.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(where);

  // واتساب
  const R = C.rsvp || {};
  const wa = String(R.whatsapp || "").replace(/\D/g, "").replace(/^00/, "");
  const waLink = (text) => "https://wa.me/" + wa + "?text=" + encodeURIComponent(text);
  if (wa) {
    const w = $("#waBtn");
    w.href = waLink(R.whatsappMessage || "");
    w.hidden = false;
  }

  // الفورم: بيحفظ الرد بجدول Google، وإذا ما زبط بيعطي زر واتساب والرسالة جاهزة
  const form = $("#rsvpForm"), gRow = $("#guestsRow"), gIn = $("#gIn"), gOut = $("#gOut");
  let guests = 1;
  const setGuests = (n) => { guests = Math.max(1, Math.min(20, n)); gIn.value = guests; gOut.textContent = ar(guests); };
  $("#gPlus").addEventListener("click", () => setGuests(guests + 1));
  $("#gMinus").addEventListener("click", () => setGuests(guests - 1));
  $$('input[name="attendance"]').forEach((r) => r.addEventListener("change", () => { gRow.hidden = !$("#fYes").checked; }));

  function rsvpText(d) {
    const lines = ["تأكيد حضور خطوبة " + (N.first || "") + " و" + (N.second || ""), "الاسم: " + d.name, "الحضور: " + d.attendance];
    if (d.attendance === "حاضر") lines.push("عدد الأشخاص: " + d.guests);
    if (d.message) lines.push("رسالة: " + d.message);
    return lines.join("\n");
  }
  function sendToSheet(body) {
    const ctrl = "AbortController" in window ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), 12000);
    // no-cors: الطلب بيوصل للجدول، وإذا الموقع محجوب بيرجع خطأ ومنروح عالواتساب
    return fetch(R.sheetUrl, { method: "POST", mode: "no-cors", body, signal: ctrl ? ctrl.signal : undefined })
      .finally(() => clearTimeout(timer));
  }
  function done(note) {
    form.hidden = true;
    $("#waFallback").hidden = true;
    const th = $("#thanks"); th.textContent = R.thanks || ""; th.hidden = false;
    if (note) th.insertAdjacentHTML("beforeend", '<br><small style="font-family:var(--f-body);font-size:.85rem;color:#8a7a5a">' + note + "</small>");
  }
  function fallback(d) {
    const box = $("#waFallback"), msg = $("#formMsg");
    if (!wa) { $("#fSend").disabled = false; msg.textContent = "ما انبعت التأكيد، جرّب كمان مرة بعد شوي"; msg.hidden = false; return; }
    $("#waSend").href = waLink(rsvpText(d));
    form.hidden = true;
    $("#waBtn").hidden = true;
    box.hidden = false;
    $("#waSend").addEventListener("click", () => setTimeout(() => done(), 600), { once: true });
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const msg = $("#formMsg");
    msg.hidden = true;
    if ($("#fTrap").value) return;                       // روبوت
    const name = $("#fName").value.trim();
    const att = (form.querySelector('input[name="attendance"]:checked') || {}).value;
    if (!name || !att) { msg.textContent = "اكتب اسمك واختار حاضر أو معتذر"; msg.hidden = false; return; }
    const d = { name, attendance: att, guests: att === "حاضر" ? guests : 0, message: $("#fMsg").value.trim().slice(0, 500), guest_link: guest };
    const btn = $("#fSend"); btn.disabled = true;
    const local = inFrame || location.protocol === "file:" || /^(localhost|127\.|192\.168\.)/.test(location.hostname);
    if (local) { done("(تجربة: الإرسال الحقيقي بيشتغل على الرابط المنشور)"); return; }
    if (!R.sheetUrl) { fallback(d); return; }
    try {
      await sendToSheet(new URLSearchParams(d));
      done();
    } catch (e) {
      fallback(d);
    }
  });

  window.__invite = { open: () => { if (stage === "ready") openInvite(); }, get stage() { return stage; } };
})();
