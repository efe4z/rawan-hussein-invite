/* ═══════════════════════════════════════════════════════════
   الزخارف الدمشقية (SVG مولّد بالكود)
   إحداثيات الظرف: 1000 × 1400 · مركز الختم: (500, 640)
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  var W = 1000, H = 1400, CX = 500, CY = 640;
  var M1 = 44, M2 = 60, MC = 52;           // خطوط الإطار (برّا، جوّا، النص)
  var RC = 34;                              // تدوير زوايا الإطار

  function f(n) { return Math.round(n * 10) / 10; }
  function P(x, y) { return f(x) + " " + f(y); }
  function polar(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }

  // نجمة بعدد رؤوس n (2n رأس داخلي وخارجي)
  function starOutline(cx, cy, R, ri, n, rot) {
    var d = "";
    for (var i = 0; i < 2 * n; i++) {
      var r = i % 2 ? ri : R, p = polar(cx, cy, r, rot + i * Math.PI / n);
      d += (i ? "L" : "M") + P(p[0], p[1]);
    }
    return d + "Z";
  }
  // نجمة ثمانية (مربعين متداخلين)
  function octagram(cx, cy, R) { return starOutline(cx, cy, R, R * 0.7654, 8, -Math.PI / 2); }
  // نجمة {n/k} بخط واحد
  function starPolygon(cx, cy, R, n, k, rot) {
    var d = "", i = 0;
    for (var s = 0; s <= n; s++) {
      var p = polar(cx, cy, R, rot + i * TAU / n);
      d += (s ? "L" : "M") + P(p[0], p[1]);
      i = (i + k) % n;
    }
    return d + "Z";
  }
  function circle(cx, cy, r, startA) {
    var a = startA || -Math.PI / 2;
    var p1 = polar(cx, cy, r, a), p2 = polar(cx, cy, r, a + Math.PI);
    return "M" + P(p1[0], p1[1]) + "A" + f(r) + " " + f(r) + " 0 1 1 " + P(p2[0], p2[1]) + "A" + f(r) + " " + f(r) + " 0 1 1 " + P(p1[0], p1[1]);
  }
  // ورقة (من القاعدة للرأس)
  function leaf(bx, by, tx, ty, w) {
    var dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w;
    var a1x = bx + dx * 0.3 + nx, a1y = by + dy * 0.3 + ny, a2x = bx + dx * 0.75 + nx * 0.6, a2y = by + dy * 0.75 + ny * 0.6;
    var b1x = bx + dx * 0.75 - nx * 0.6, b1y = by + dy * 0.75 - ny * 0.6, b2x = bx + dx * 0.3 - nx, b2y = by + dy * 0.3 - ny;
    return "M" + P(bx, by) + "C" + P(a1x, a1y) + " " + P(a2x, a2y) + " " + P(tx, ty) + "C" + P(b1x, b1y) + " " + P(b2x, b2y) + " " + P(bx, by) + "Z";
  }
  // منحنى ناعم يمر بنقاط (Catmull-Rom → Bézier)
  function smooth(pts) {
    var d = "M" + P(pts[0][0], pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += "C" + P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6) + " " +
        P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6) + " " + P(p2[0], p2[1]);
    }
    return d;
  }
  // غصن بيلتف بالآخر (حلزون)
  function scroll(x0, y0, x1, y1, curlR, dir, lift) {
    var pts = [], i, n = 8;
    for (i = 0; i <= n; i++) {
      var t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * lift;
      pts.push([x, y]);
    }
    var ex = pts[n][0], ey = pts[n][1], ang = Math.atan2(y1 - y0, x1 - x0);
    var cx = ex + Math.cos(ang + dir * Math.PI / 2) * curlR, cy = ey + Math.sin(ang + dir * Math.PI / 2) * curlR;
    var a0 = Math.atan2(ey - cy, ex - cx);
    for (i = 1; i <= 14; i++) {
      var a = a0 + dir * i / 14 * TAU * 0.85, r = curlR * (1 - i / 14 * 0.55);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return { d: smooth(pts), end: [cx, cy], mid: pts[Math.round(n / 2)], ang: ang };
  }

  /* ───── نصف الإطار (من فوق بالنص لتحت بالنص) ───── */
  function halfFrame(m, r, side) {
    var x0 = side > 0 ? W - m : m, sw = side > 0 ? 1 : 0;
    return "M" + P(CX, m) + "H" + f(x0 - side * r) +
      "A" + r + " " + r + " 0 0 " + sw + " " + P(x0, m + r) +
      "V" + f(H - m - r) +
      "A" + r + " " + r + " 0 0 " + sw + " " + P(x0 - side * r, H - m) +
      "H" + f(CX);
  }

  /* ───── تجميع زخارف الظرف ───── */
  function envelope() {
    var foil = [], glow = [], stars = [], masks = [];
    var i, k;

    // الإطار: خطين + خط شعري برّا
    foil.push('<path d="' + halfFrame(M1, RC, 1) + halfFrame(M1, RC, -1) + '" mask="url(#bandMask)"/>');
    foil.push('<path d="' + halfFrame(M2, RC - 16, 1) + halfFrame(M2, RC - 16, -1) + '" mask="url(#bandMask)"/>');
    foil.push('<path class="hair" d="' + halfFrame(30, RC + 12, 1) + halfFrame(30, RC + 12, -1) + '"/>');
    glow.push('<path class="gl gl-frame" data-side="r" d="' + halfFrame(MC, RC - 8, 1) + '"/>');
    glow.push('<path class="gl gl-frame" data-side="l" d="' + halfFrame(MC, RC - 8, -1) + '"/>');

    // النجوم على الإطار
    var starPos = [[CX, MC, 22], [MC, MC, 28], [W - MC, MC, 28], [MC, H - MC, 28], [W - MC, H - MC, 28], [CX, H - MC, 22]];
    [-1, 1].forEach(function (s) {
      starPos.push([CX + s * 230, MC, 16]);
      starPos.push([CX + s * 230, H - MC, 16]);
    });
    for (k = 1; k <= 7; k++) {
      var y = MC + k * (H - 2 * MC) / 8;
      starPos.push([MC, y, k === 4 ? 22 : 16]);
      starPos.push([W - MC, y, k === 4 ? 22 : 16]);
    }
    starPos.forEach(function (s) {
      var d = octagram(s[0], s[1], s[2]);
      masks.push('<path d="' + octagram(s[0], s[1], s[2] + 6) + '"/>');
      foil.push('<path d="' + d + '"/><path d="' + circle(s[0], s[1], s[2] * 0.36) + '"/>');
      stars.push('<path class="gl-star" data-x="' + s[0] + '" data-y="' + s[1] + '" d="' + d + circle(s[0], s[1], s[2] * 0.36) + '"/>');
    });

    // أغصان صغيرة جوّا الإطار بين النجوم (على الجوانب)
    var edgeVines = [];
    for (k = 0; k < 8; k++) {
      var ya = MC + k * (H - 2 * MC) / 8 + 32, yb = MC + (k + 1) * (H - 2 * MC) / 8 - 32;
      [-1, 1].forEach(function (s) {
        var x = s > 0 ? W - MC - 30 : MC + 30, pts = [];
        for (var t = 0; t <= 10; t++) pts.push([x - s * Math.sin(t / 10 * TAU) * 7, ya + (yb - ya) * t / 10]);
        var vd = smooth(pts);
        var lf = leaf(x - s * 6, (ya + yb) / 2, x - s * 26, (ya + yb) / 2 - 12, 6);
        edgeVines.push({ d: vd + lf, x: x, y: (ya + yb) / 2 });
      });
    }
    edgeVines.forEach(function (v) {
      foil.push('<path class="thin" d="' + v.d + '"/>');
      glow.push('<path class="gl gl-edge" data-x="' + f(v.x) + '" data-y="' + f(v.y) + '" d="' + v.d + '"/>');
    });

    // الميدالية حول الختم
    var med = [];
    med.push(circle(CX, CY, 104), circle(CX, CY, 113));
    med.push(starPolygon(CX, CY, 212, 12, 5, -Math.PI / 2));
    med.push(starPolygon(CX, CY, 198, 12, 5, -Math.PI / 2));
    med.push(circle(CX, CY, 228));
    var petals = [];
    for (k = 0; k < 12; k++) {
      var a = -Math.PI / 2 + (k + 0.5) * TAU / 12;
      var b = polar(CX, CY, 122, a), t2 = polar(CX, CY, 178, a);
      petals.push(leaf(b[0], b[1], t2[0], t2[1], 13));
    }
    var dots = "";
    for (k = 0; k < 24; k++) { var p = polar(CX, CY, 240, k * TAU / 24); dots += circle(p[0], p[1], 3.2); }
    med.forEach(function (d) { foil.push('<path d="' + d + '"/>'); });
    foil.push('<path class="thin" d="' + petals.join("") + '"/>');
    foil.push('<path class="thin" d="' + dots + '"/>');
    glow.push('<path class="gl gl-med" d="' + med[2] + '"/>');
    glow.push('<path class="gl gl-med" d="' + med[0] + med[1] + '"/>');
    glow.push('<path class="gl gl-med2" d="' + med[4] + '"/>');
    petals.forEach(function (d) { glow.push('<path class="gl gl-petal" d="' + d + '"/>'); });

    // الغصن الطالع من الميدالية للإطار فوق
    var top = [];
    top.push("M" + P(CX, CY - 240) + "V" + f(MC + 30));
    [[360, 112, 20], [252, 92, 17], [150, 70, 14]].forEach(function (b) {
      [-1, 1].forEach(function (s) {
        var sc = scroll(CX, b[0], CX + s * b[1], b[0] - 18, b[2], s > 0 ? 1 : -1, 22);
        top.push(sc.d);
        top.push(leaf(sc.mid[0], sc.mid[1] - 4, sc.mid[0] + s * 16, sc.mid[1] - 40, 7));
      });
      top.push(starOutline(CX, b[0], 11, 5, 4, -Math.PI / 2));
    });
    // أغصان جانبية من الميدالية للإطار
    var side = [];
    [-1, 1].forEach(function (s) {
      var x0 = CX + s * 242, x1 = s > 0 ? W - MC - 52 : MC + 52;
      var mid = (x0 + x1) / 2;
      var a1 = scroll(x0, CY, mid, CY - 8, 16, s > 0 ? -1 : 1, 26);
      var a2 = scroll(mid, CY, x1, CY + 8, 16, s > 0 ? 1 : -1, -26);
      side.push({ s: s, d: "M" + P(x0, CY) + "H" + f(x1) + a1.d + a2.d +
        leaf(mid, CY, mid + s * 10, CY - 40, 8) + leaf(mid, CY, mid + s * 10, CY + 40, 8) });
    });
    top.forEach(function (d) { foil.push('<path class="thin" d="' + d + '"/>'); });
    side.forEach(function (v) { foil.push('<path class="thin" d="' + v.d + '"/>'); });
    glow.push('<path class="gl gl-stem" d="' + top[0] + '"/>');
    glow.push('<path class="gl gl-vine" d="' + top.slice(1).join("") + '"/>');
    side.forEach(function (v) { glow.push('<path class="gl gl-side" d="' + v.d + '"/>'); });

    // زخرفة صغيرة تحت كتابة "إلى ضيوفنا"
    var under = divider(CX, 1236, 120);
    foil.push('<path class="thin" d="' + under + '"/>');
    glow.push('<path class="gl gl-under" d="' + under + '"/>');

    return {
      defs:
        '<linearGradient id="foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="1400">' +
        '<stop offset="0" stop-color="#8d6a2a"/><stop offset=".22" stop-color="#e6c983"/><stop offset=".4" stop-color="#a98035"/>' +
        '<stop offset=".58" stop-color="#f4dfa4"/><stop offset=".78" stop-color="#9c7531"/><stop offset="1" stop-color="#d9b866"/></linearGradient>' +
        '<linearGradient id="sheen" gradientUnits="userSpaceOnUse" x1="-400" y1="0" x2="0" y2="300">' +
        '<stop offset="0" stop-color="#fff6d8" stop-opacity="0"/><stop offset=".5" stop-color="#fff6d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></linearGradient>' +
        '<mask id="bandMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1400"><rect width="1000" height="1400" fill="#fff"/><g fill="#000">' + masks.join("") + "</g></mask>" +
        '<g id="ornFoil" fill="none" stroke-linejoin="round" stroke-linecap="round">' + foil.join("") + "</g>" +
        '<g id="ornGlow" fill="none" stroke-linejoin="round" stroke-linecap="round">' + glow.join("") + "</g>" +
        '<g id="ornStars" fill="none" stroke-linejoin="round">' + stars.join("") + "</g>",
    };
  }

  /* ───── فاصل: نجمة بالنص وغصنين ───── */
  function divider(cx, cy, half) {
    var d = octagram(cx, cy, 13) + circle(cx, cy, 4.5);
    [-1, 1].forEach(function (s) {
      var x0 = cx + s * 20, x1 = cx + s * half;
      var pts = [];
      for (var t = 0; t <= 12; t++) pts.push([x0 + (x1 - x0) * t / 12, cy + Math.sin(t / 12 * TAU * 1.5) * 6 * (1 - t / 14)]);
      d += smooth(pts);
      d += leaf(x0 + (x1 - x0) * 0.33, cy - 4, x0 + (x1 - x0) * 0.33 + s * 12, cy - 22, 5);
      d += leaf(x0 + (x1 - x0) * 0.66, cy + 3, x0 + (x1 - x0) * 0.66 + s * 12, cy + 19, 5);
      var e = polar(x1, cy, 0, 0);
      d += circle(e[0] + s * 4, cy, 2.6);
    });
    return d;
  }

  /* ───── ميدالية صغيرة (لراس صفحة الدعوة) ───── */
  function miniMedallion(cx, cy, R) {
    return starPolygon(cx, cy, R, 12, 5, -Math.PI / 2) + circle(cx, cy, R * 0.5) + circle(cx, cy, R * 1.08) +
      (function () { var d = ""; for (var k = 0; k < 12; k++) { var a = -Math.PI / 2 + (k + 0.5) * TAU / 12, b = polar(cx, cy, R * 0.58, a), t = polar(cx, cy, R * 0.84, a); d += leaf(b[0], b[1], t[0], t[1], R * 0.07); } return d; })();
  }

  window.Ornaments = {
    envelope: envelope,
    divider: divider,
    miniMedallion: miniMedallion,
    octagram: octagram,
    circle: circle,
  };
})();
