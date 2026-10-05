/* ==========================================================================
   Tiny dependency-free SVG chart library (line, horizontal bars, mini charts)
   Colours are CSS variables, so charts follow light/dark mode automatically.
   ========================================================================== */
const Charts = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const tip = () => document.getElementById("tooltip");

  function svgEl(tag, attrs = {}, parent) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // "Nice" axis ticks (1, 2, 2.5, 5 × 10^n)
  function niceTicks(max, count = 4) {
    if (max <= 0) return [0, 1];
    const raw = max / count;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw);
    const ticks = [];
    for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v);
    if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
    return ticks;
  }

  function showTip(html, x, y) {
    const t = tip();
    t.innerHTML = html;
    t.hidden = false;
    const r = t.getBoundingClientRect();
    let left = x + 14;
    let top = y - r.height - 12;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top < 8) top = y + 16;
    t.style.left = Math.max(8, left) + "px";
    t.style.top = top + "px";
  }
  function hideTip() { tip().hidden = true; }

  function tipRows(rows) {
    return rows
      .map((r) => `<div class="tooltip__row"><span><i style="background:${r.color}"></i>${r.name}</span><b>${r.value}</b></div>`)
      .join("");
  }

  // Re-render a chart whenever its container is resized
  const observed = new WeakMap();
  const ro = "ResizeObserver" in window
    ? new ResizeObserver((entries) => entries.forEach((e) => { const fn = observed.get(e.target); if (fn) fn(); }))
    : null;
  function mount(el, draw) {
    observed.set(el, draw);
    draw();
    if (ro) ro.observe(el);
  }

  /* ---------------------------------------------------------------- LINE */
  function line(el, cfg) {
    mount(el, () => drawLine(el, cfg));
  }

  function drawLine(el, cfg) {
    const { labels, series, format = (v) => v, area = false, endLabels = true } = cfg;
    const W = el.clientWidth || 300;
    const H = el.clientHeight || 220;
    const narrow = W < 420;
    const pad = { t: 10, r: endLabels && !narrow ? 86 : 12, b: 26, l: 44 };
    const iw = W - pad.l - pad.r;
    const ih = H - pad.t - pad.b;
    const max = Math.max(...series.flatMap((s) => s.values));
    const ticks = niceTicks(max, 4);
    const yMax = ticks[ticks.length - 1];
    const x = (i) => pad.l + (labels.length === 1 ? iw / 2 : (i * iw) / (labels.length - 1));
    const y = (v) => pad.t + ih - (v / yMax) * ih;

    el.innerHTML = "";
    const svg = svgEl("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.ariaLabel || "Line chart" }, el);

    // grid + y labels
    ticks.forEach((t) => {
      svgEl("line", { x1: pad.l, x2: pad.l + iw, y1: y(t), y2: y(t), class: t === 0 ? "baseline" : "gridline" }, svg);
      const lbl = svgEl("text", { x: pad.l - 8, y: y(t) + 4, "text-anchor": "end" }, svg);
      lbl.textContent = format(t, true);
    });
    // x labels
    const every = narrow ? 3 : labels.length > 8 && W < 640 ? 2 : 1;
    labels.forEach((l, i) => {
      if (i % every) return;
      const t = svgEl("text", { x: x(i), y: H - 6, "text-anchor": "middle" }, svg);
      t.textContent = l;
    });

    // area (single-series only)
    if (area && series.length === 1) {
      const s = series[0];
      const gid = "g" + Math.random().toString(36).slice(2, 8);
      const defs = svgEl("defs", {}, svg);
      const grad = svgEl("linearGradient", { id: gid, x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
      svgEl("stop", { offset: "0%", style: `stop-color:${s.color};stop-opacity:.22` }, grad);
      svgEl("stop", { offset: "100%", style: `stop-color:${s.color};stop-opacity:0` }, grad);
      const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("") + `L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;
      svgEl("path", { d, style: `fill:url(#${gid});stroke:none` }, svg);
    }

    // lines
    series.forEach((s) => {
      const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
      const p = svgEl("path", { d, style: `stroke:${s.color};stroke-width:2;fill:none` }, svg);
      // draw-in animation
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && p.getTotalLength) {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.getBoundingClientRect();
        p.style.transition = "stroke-dashoffset 900ms ease";
        requestAnimationFrame(() => (p.style.strokeDashoffset = 0));
      }
    });

    // direct end labels (avoid overlap by nudging)
    if (endLabels && !narrow) {
      const last = labels.length - 1;
      const pts = series.map((s) => ({ s, y: y(s.values[last]) })).sort((a, b) => a.y - b.y);
      for (let i = 1; i < pts.length; i++) if (pts[i].y - pts[i - 1].y < 14) pts[i].y = pts[i - 1].y + 14;
      pts.forEach(({ s, y: ly }) => {
        svgEl("circle", { cx: x(last), cy: y(s.values[last]), r: 4, style: `fill:${s.color};stroke:var(--surface);stroke-width:2` }, svg);
        const t = svgEl("text", { x: x(last) + 10, y: ly + 4, class: "end-label" }, svg);
        t.textContent = s.name;
      });
    }

    // hover layer: crosshair + dots + tooltip
    const cross = svgEl("line", { y1: pad.t, y2: pad.t + ih, class: "crosshair", visibility: "hidden" }, svg);
    const dots = series.map((s) => svgEl("circle", { r: 4.5, visibility: "hidden", style: `fill:${s.color};stroke:var(--surface);stroke-width:2` }, svg));
    const hit = svgEl("rect", { x: pad.l, y: 0, width: iw, height: H, class: "hit" }, svg);
    const onMove = (ev) => {
      const pt = ev.touches ? ev.touches[0] : ev;
      const rect = svg.getBoundingClientRect();
      const px = pt.clientX - rect.left;
      const i = Math.max(0, Math.min(labels.length - 1, Math.round(((px - pad.l) / iw) * (labels.length - 1))));
      cross.setAttribute("x1", x(i));
      cross.setAttribute("x2", x(i));
      cross.setAttribute("visibility", "visible");
      dots.forEach((d, k) => { d.setAttribute("cx", x(i)); d.setAttribute("cy", y(series[k].values[i])); d.setAttribute("visibility", "visible"); });
      const rows = series
        .map((s) => ({ name: s.name, color: s.color, value: format(s.values[i]), raw: s.values[i] }))
        .sort((a, b) => b.raw - a.raw);
      showTip(`<div class="tooltip__title">${cfg.tipLabels ? cfg.tipLabels[i] : labels[i]}</div>${tipRows(rows)}`, pt.clientX, rect.top + y(Math.max(...series.map((s) => s.values[i]))));
    };
    const onLeave = () => { cross.setAttribute("visibility", "hidden"); dots.forEach((d) => d.setAttribute("visibility", "hidden")); hideTip(); };
    hit.addEventListener("mousemove", onMove);
    hit.addEventListener("touchstart", onMove, { passive: true });
    hit.addEventListener("touchmove", onMove, { passive: true });
    hit.addEventListener("mouseleave", onLeave);
    hit.addEventListener("touchend", onLeave);
  }

  /* -------------------------------------------------------- HORIZONTAL BARS */
  function hbars(el, cfg) {
    mount(el, () => drawHBars(el, cfg));
  }

  function drawHBars(el, cfg) {
    const { items, format = (v) => v, highlight, color = "var(--s1)" } = cfg;
    const W = el.clientWidth || 300;
    const H = el.clientHeight || 220;
    const labelW = 56;
    const valueW = 60;
    const gap = 10;
    const bh = Math.min(30, (H - gap * (items.length - 1)) / items.length);
    const top = (H - (bh * items.length + gap * (items.length - 1))) / 2;
    const max = Math.max(...items.map((d) => d.value));
    const iw = W - labelW - valueW;

    el.innerHTML = "";
    const svg = svgEl("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.ariaLabel || "Bar chart" }, el);
    svgEl("line", { x1: labelW, x2: labelW, y1: top - 4, y2: top + items.length * (bh + gap) - gap + 4, class: "baseline" }, svg);

    items.forEach((d, i) => {
      const by = top + i * (bh + gap);
      const w = Math.max(2, (d.value / max) * iw);
      const dim = highlight && highlight !== "All" && d.label !== highlight;
      const lbl = svgEl("text", { x: labelW - 8, y: by + bh / 2 + 4, "text-anchor": "end", class: "bar-label" }, svg);
      lbl.textContent = d.label;
      // bar anchored square at the baseline, 4px rounded at the data end
      const r = Math.min(4, bh / 2, w / 2);
      const path = `M${labelW},${by}H${labelW + w - r}Q${labelW + w},${by} ${labelW + w},${by + r}V${by + bh - r}Q${labelW + w},${by + bh} ${labelW + w - r},${by + bh}H${labelW}Z`;
      svgEl("path", { d: path, style: `fill:${color};stroke:none;opacity:${dim ? 0.28 : 1};transition:opacity .2s` }, svg);
      const val = svgEl("text", { x: labelW + w + 8, y: by + bh / 2 + 4, class: "bar-value" }, svg);
      val.textContent = format(d.value);
      const hit = svgEl("rect", { x: 0, y: by - gap / 2, width: W, height: bh + gap, class: "hit" }, svg);
      const total = items.reduce((a, b) => a + b.value, 0);
      const show = (ev) => {
        const pt = ev.touches ? ev.touches[0] : ev;
        showTip(`<div class="tooltip__title">${d.label}</div>${tipRows([
          { name: cfg.valueName || "Value", color, value: format(d.value) },
          { name: "Share", color: "transparent", value: ((d.value / total) * 100).toFixed(1) + "%" },
        ])}`, pt.clientX, pt.clientY);
      };
      hit.addEventListener("mousemove", show);
      hit.addEventListener("touchstart", show, { passive: true });
      hit.addEventListener("mouseleave", hideTip);
      hit.addEventListener("touchend", hideTip);
    });
  }

  /* ---------------------------------------------------------- MINI CHARTS */
  function mini(el, viz) {
    mount(el, () => drawMini(el, viz));
  }

  function drawMini(el, viz) {
    const W = el.clientWidth || 240;
    const H = el.clientHeight || 90;
    const vals = viz.data;
    const max = Math.max(...vals);
    const min = viz.type === "line" ? Math.min(...vals) : 0;
    el.innerHTML = "";
    const svg = svgEl("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" }, el);
    const padT = 26;
    const padB = viz.labels ? 16 : 4;
    const ih = H - padT - padB;
    const y = (v) => padT + ih - ((v - min) / (max - min || 1)) * ih;

    if (viz.type === "line") {
      const x = (i) => 4 + (i * (W - 8)) / (vals.length - 1);
      const d = vals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
      const gid = "m" + Math.random().toString(36).slice(2, 8);
      const grad = svgEl("linearGradient", { id: gid, x1: 0, x2: 0, y1: 0, y2: 1 }, svgEl("defs", {}, svg));
      svgEl("stop", { offset: "0%", style: "stop-color:var(--s1);stop-opacity:.25" }, grad);
      svgEl("stop", { offset: "100%", style: "stop-color:var(--s1);stop-opacity:0" }, grad);
      svgEl("path", { d: d + `L${x(vals.length - 1)},${H}L${x(0)},${H}Z`, style: `fill:url(#${gid});stroke:none` }, svg);
      svgEl("path", { d, style: "stroke:var(--s1);stroke-width:2;fill:none" }, svg);
      svgEl("circle", { cx: x(vals.length - 1), cy: y(vals[vals.length - 1]), r: 4, style: "fill:var(--s1);stroke:var(--surface-2);stroke-width:2" }, svg);
    } else {
      const n = vals.length;
      const slot = (W - 8) / n;
      const bw = Math.min(42, slot * 0.62);
      vals.forEach((v, i) => {
        const cx = 4 + slot * i + slot / 2;
        const top = y(v);
        const h = padT + ih - top;
        const r = Math.min(4, bw / 2, h);
        const x0 = cx - bw / 2;
        const base = padT + ih;
        svgEl("path", {
          d: `M${x0},${base}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + bw - r}Q${x0 + bw},${top} ${x0 + bw},${top + r}V${base}Z`,
          style: `fill:var(--s1);stroke:none;opacity:${i === vals.indexOf(max) ? 1 : 0.55}`,
        }, svg);
        if (viz.labels) {
          const t = svgEl("text", { x: cx, y: H - 2, "text-anchor": "middle", style: "font-size:10px;fill:var(--muted);stroke:none;font-family:var(--font)" }, svg);
          t.textContent = viz.labels[i];
        }
      });
    }
  }

  return { line, hbars, mini, niceTicks };
})();
