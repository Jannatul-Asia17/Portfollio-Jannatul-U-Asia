/* ==========================================================================
   Page logic — renders content from data.js and powers the interactions
   ========================================================================== */
(() => {
  const P = PORTFOLIO;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPlaceholder = (s = "") => /\[.*\]/.test(s);

  /* ---------------------------------------------------------------- icons */
  const ICONS = {
    github: '<svg viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0"/></svg>',
    kaggle: '<svg viewBox="0 0 24 24"><path d="M7 3v18M7 13l9-9M10 11l7 10"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
    pipe: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
    brain: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M5 19l2.8-2.8M16.2 7.8 19 5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    award: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/></svg>',
  };

  /* --------------------------------------------------------- simple binds */
  const bind = {
    name: P.profile.name,
    initials: P.profile.initials,
    tagline: P.profile.tagline,
    availability: P.profile.availability,
    location: P.profile.location,
  };
  $$("[data-bind]").forEach((el) => { const v = bind[el.dataset.bind]; if (v) el.textContent = v; });
  $("#year").textContent = new Date().getFullYear();

  if (P.profile.resumeUrl) {
    const r = $("#resumeBtn");
    r.href = P.profile.resumeUrl;
    r.hidden = false;
    $("#contactBtn").hidden = true;
  }

  const socialsHTML = P.socials
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${ICONS[s.icon] || ICONS.link}${esc(s.label)}</a></li>`)
    .join("");
  $("#heroSocials").innerHTML = socialsHTML;
  $("#contactSocials").innerHTML = socialsHTML;

  /* ---------------------------------------------------------- typed role */
  (() => {
    const el = $("#roleText");
    const roles = P.profile.roles;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || roles.length < 2) {
      el.textContent = roles[0];
      return;
    }
    let r = 0, c = roles[0].length, deleting = false;
    const tick = () => {
      const word = roles[r];
      if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1800); }
      if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; }
      c += deleting ? -1 : 1;
      el.textContent = roles[r].slice(0, c);
      setTimeout(tick, deleting ? 40 : 75);
    };
    setTimeout(tick, 1800);
  })();

  /* -------------------------------------------------------------- stats */
  $("#stats").innerHTML = P.stats
    .map((s) => `<li><div class="stats__value"><span data-count="${s.value}">0</span>${esc(s.suffix)}</div><div class="stats__label">${esc(s.label)}</div></li>`)
    .join("");

  function countUp(el) {
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------------- about */
  $("#aboutParas").innerHTML = P.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#aboutFacts").innerHTML = P.about.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
  if (P.profile.photo) {
    const ph = $("#aboutPhoto");
    ph.style.backgroundImage = `url("${P.profile.photo}")`;
    ph.classList.add("has-photo");
  }

  (() => {
    const tools = P.skills.flatMap((g) => g.items.filter((i) => i.level === "Proficient").map((i) => i.name)).slice(0, 6);
    const k = (s) => `<span class="tok-k">${s}</span>`;
    const str = (s) => `<span class="tok-s">'${esc(s)}'</span>`;
    const c = (s) => `<span class="tok-c">-- ${esc(s)}</span>`;
    const f = (s) => `<span class="tok-f">${s}</span>`;
    $("#sqlCard").innerHTML = [
      c("Who is behind this portfolio?"),
      `${k("SELECT")}  name,`,
      `        current_goal,`,
      `        ${f("ARRAY_AGG")}(skill) ${k("AS")} top_skills`,
      `${k("FROM")}    candidates`,
      `${k("WHERE")}   name = ${str(P.profile.name)}`,
      `  ${k("AND")}   loves_data = ${k("TRUE")}`,
      `  ${k("AND")}   role ${k("IN")} (${str("Data Analyst")},`,
      `                ${str("Business Analyst")},`,
      `                ${str("Data Engineer")})`,
      `${k("GROUP BY")} name, current_goal;`,
      "",
      c("Result"),
      `${c("top_skills = { " + tools.join(", ") + " }")}`,
      `${c("current_goal = 'Data Scientist'")}`,
    ].join("\n");
  })();

  /* ------------------------------------------------------------- skills */
  const LEVELS = { Learning: 1, Familiar: 2, Proficient: 3 };
  $("#skillsGrid").innerHTML = P.skills
    .map(
      (g) => `
      <article class="skill-card reveal">
        <div class="skill-card__head"><span class="skill-card__icon">${ICONS[g.icon] || ICONS.chart}</span><h3>${esc(g.group)}</h3></div>
        ${g.items
          .map((s) => {
            const n = LEVELS[s.level] || 1;
            const bars = [1, 2, 3].map((i) => `<b class="${i <= n ? "on" : ""}"></b>`).join("");
            return `<div class="skill-row"><div><span class="skill-row__name">${esc(s.name)}</span><span class="skill-row__note">${esc(s.note)}</span></div><span class="level" title="${esc(s.level)}"><i aria-hidden="true">${bars}</i>${esc(s.level)}</span></div>`;
          })
          .join("")}
      </article>`
    )
    .join("");
  $("#softSkills").innerHTML = P.softSkills.map((s) => `<li class="chip">${esc(s)}</li>`).join("");

  /* ----------------------------------------------------------- projects */
  const CAT = { analytics: "Analytics & SQL", bi: "BI Dashboard", engineering: "Data Engineering", ml: "Machine Learning" };
  const projects = [...P.projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  $("#projectGrid").innerHTML = projects
    .map(
      (p, i) => `
      <article class="project reveal" data-cat="${esc(p.category)}">
        <div class="project__viz" data-viz="${i}">
          <span class="project__cat">${esc(CAT[p.category] || p.category)}</span>
          ${p.featured ? '<span class="project__star">★ Featured</span>' : ""}
        </div>
        <div class="project__body">
          <h3>${esc(p.title)}</h3>
          <p class="project__summary">${esc(p.summary)}</p>
          <details>
            <summary>Case study</summary>
            <dl class="case">
              <div><dt>Problem</dt><dd>${esc(p.problem)}</dd></div>
              <div><dt>Approach</dt><dd>${esc(p.approach)}</dd></div>
              <div><dt>Result</dt><dd>${esc(p.result)}</dd></div>
            </dl>
          </details>
          <ul class="chips">${p.tools.map((t) => `<li class="chip">${esc(t)}</li>`).join("")}</ul>
          ${p.links.code || p.links.demo ? `<div class="project__links">
            ${p.links.code ? `<a href="${esc(p.links.code)}" target="_blank" rel="noopener">${ICONS.github}Code</a>` : ""}
            ${p.links.demo ? `<a href="${esc(p.links.demo)}" target="_blank" rel="noopener">${ICONS.link}Live dashboard</a>` : ""}
          </div>` : ""}
        </div>
      </article>`
    )
    .join("");

  $$(".project__viz").forEach((el) => {
    const host = document.createElement("div");
    host.style.cssText = "width:100%;height:100%";
    el.appendChild(host);
    Charts.mini(host, projects[+el.dataset.viz].viz);
  });

  $$("#projectFilters .filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$("#projectFilters .filter").forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
      const f = btn.dataset.filter;
      $$("#projectGrid .project").forEach((card) => card.classList.toggle("is-hidden", f !== "all" && card.dataset.cat !== f));
    })
  );

  /* ------------------------------------------------------------ journey */
  const TYPE = { work: "Experience", education: "Education", cert: "Certification" };
  $("#timeline").innerHTML = P.journey
    .filter((j) => j.type !== "cert")
    .map(
      (j) => `
      <li class="tl-item reveal">
        <div class="tl-item__card">
          <div class="tl-item__top"><span class="tl-item__type">${TYPE[j.type] || j.type}</span><span class="tl-item__period">${esc(j.period)}</span></div>
          <h3>${esc(j.title)}</h3>
          <div class="tl-item__org">${esc(j.org)}</div>
          ${j.points.length ? `<ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        </div>
      </li>`
    )
    .join("");
  $("#certList").innerHTML = P.journey
    .filter((j) => j.type === "cert")
    .map((c) => {
      const inner = `<span class="cert__icon">${ICONS.award}</span><span><span class="cert__name">${esc(c.title)}</span><br /><span class="cert__meta">${esc(c.org)} · ${esc(c.period)}</span></span>`;
      return `<li>${c.url ? `<a class="cert" href="${esc(c.url)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="cert">${inner}</div>`}</li>`;
    })
    .join("");

  /* ------------------------------------------------------------ contact */
  const email = P.profile.email;
  const emailLink = $("#contactEmail");
  emailLink.textContent = email;
  emailLink.href = isPlaceholder(email) ? "#contact" : `mailto:${email}`;
  $("#copyEmail").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(email); e.target.textContent = "Copied!"; }
    catch { e.target.textContent = "Press Ctrl+C"; }
    setTimeout(() => (e.target.textContent = "Copy"), 1600);
  });
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const note = $("#formNote");
    if (!f.checkValidity()) { note.textContent = "Please fill in all fields with a valid email."; f.reportValidity(); return; }
    if (isPlaceholder(email)) { note.textContent = "Email address not configured yet."; return; }
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.name.value}`);
    const body = encodeURIComponent(`${f.message.value}\n\n— ${f.name.value} (${f.email.value})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app…";
  });

  /* ===================================================================
     SYNTHETIC RETAIL DATASET (seeded so every visitor sees the same data)
     =================================================================== */
  function mulberry32(a) {
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const rand = mulberry32(2025);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const REGIONS = { North: 1.0, South: 0.78, East: 1.18, West: 0.92 };
  const CATS = [
    { name: "Electronics", base: 52000, aov: 310, color: "var(--s1)", growth: 0.022 },
    { name: "Apparel", base: 34000, aov: 74, color: "var(--s2)", growth: 0.012 },
    { name: "Home", base: 26000, aov: 118, color: "var(--s3)", growth: 0.03 },
  ];
  const SEASON = [0.86, 0.8, 0.92, 0.95, 1.0, 0.97, 0.94, 0.99, 1.02, 1.06, 1.3, 1.42];

  // rows: { region, cat, m, revenue, orders }
  const ROWS = [];
  Object.entries(REGIONS).forEach(([region, rf]) => {
    CATS.forEach((c) => {
      MONTHS.forEach((_, m) => {
        const revenue = Math.round(c.base * rf * SEASON[m] * (1 + c.growth * m) * (0.92 + rand() * 0.16));
        const orders = Math.round((revenue / c.aov) * (0.95 + rand() * 0.1));
        ROWS.push({ region, cat: c.name, m, revenue, orders });
      });
    });
  });

  const sum = (arr, k) => arr.reduce((a, r) => a + r[k], 0);
  const fmtMoney = (v, axis) => (v >= 1e6 ? `$${(v / 1e6).toFixed(axis ? (v % 1e6 ? 1 : 0) : 2)}M` : v >= 1e3 ? `$${Math.round(v / 1e3)}k` : `$${Math.round(v)}`);
  const fmtNum = (v, axis) => (v >= 1e3 ? `${(v / 1e3).toFixed(axis || v >= 1e4 ? 0 : 1)}k` : `${Math.round(v)}`);
  const fmtPct = (v) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
  const fmtFull = (v, money) => (money ? "$" : "") + Math.round(v).toLocaleString("en-US");

  function kpiHTML(label, value, delta, deltaNote) {
    const d = delta == null ? "" : `<div class="kpi__delta ${delta >= 0 ? "up" : "down"}"><span aria-hidden="true">${delta >= 0 ? "▲" : "▼"}</span>${fmtPct(Math.abs(delta)).replace("+", "")} <span class="muted">${deltaNote}</span></div>`;
    return `<div class="kpi"><div class="kpi__label">${label}</div><div class="kpi__value">${value}</div>${d}</div>`;
  }

  /* ---------------------------------------------------------- hero card */
  (() => {
    const monthly = MONTHS.map((_, m) => sum(ROWS.filter((r) => r.m === m), "revenue"));
    const rev = monthly.reduce((a, b) => a + b, 0);
    const orders = sum(ROWS, "orders");
    const h1 = monthly.slice(0, 6).reduce((a, b) => a + b, 0);
    const h2 = monthly.slice(6).reduce((a, b) => a + b, 0);
    $("#heroKpis").innerHTML =
      kpiHTML("Revenue", fmtMoney(rev), h2 / h1 - 1, "H2 vs H1") +
      kpiHTML("Orders", fmtNum(orders), null) +
      kpiHTML("Avg. order", `$${(rev / orders).toFixed(0)}`, null);
    Charts.line($("#heroChart"), {
      labels: MONTHS,
      tipLabels: MONTHS_LONG.map((m) => m + " 2025"),
      series: [{ name: "Revenue", color: "var(--s1)", values: monthly }],
      format: fmtMoney,
      area: true,
      endLabels: false,
      ariaLabel: "Monthly revenue 2025, rising from about $0.4M in January to a peak in December",
    });
  })();

  /* --------------------------------------------------------- playground */
  const state = { region: "All", metric: "revenue", table: false };
  const regionSel = $("#pgRegion");
  Object.keys(REGIONS).forEach((r) => regionSel.insertAdjacentHTML("beforeend", `<option value="${r}">${r}</option>`));
  regionSel.addEventListener("change", () => { state.region = regionSel.value; renderBoard(); });
  $$("#pgMetric button").forEach((b) =>
    b.addEventListener("click", () => {
      state.metric = b.dataset.metric;
      $$("#pgMetric button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-checked", x === b); });
      renderBoard();
    })
  );
  $("#pgTableToggle").addEventListener("click", (e) => {
    state.table = !state.table;
    e.currentTarget.setAttribute("aria-pressed", state.table);
    e.currentTarget.lastChild.textContent = state.table ? " View as charts" : " View as table";
    $("#pgTable").hidden = !state.table;
    $("#pgCharts").hidden = state.table;
  });

  function renderBoard() {
    const { region, metric } = state;
    const money = metric === "revenue";
    const fmt = money ? fmtMoney : fmtNum;
    const metricName = money ? "Revenue" : "Orders";
    const rows = region === "All" ? ROWS : ROWS.filter((r) => r.region === region);

    // KPIs
    const rev = sum(rows, "revenue");
    const ord = sum(rows, "orders");
    const half = (h, k) => sum(rows.filter((r) => (h ? r.m >= 6 : r.m < 6)), k);
    const byMonth = MONTHS.map((_, m) => sum(rows.filter((r) => r.m === m), metric));
    const momLast = byMonth[11] / byMonth[10] - 1;
    $("#pgKpis").innerHTML =
      kpiHTML("Total revenue", fmtMoney(rev), half(1, "revenue") / half(0, "revenue") - 1, "H2 vs H1") +
      kpiHTML("Total orders", fmtNum(ord), half(1, "orders") / half(0, "orders") - 1, "H2 vs H1") +
      kpiHTML("Avg. order value", `$${(rev / ord).toFixed(2)}`, null) +
      kpiHTML(`Dec ${metricName.toLowerCase()}`, fmt(byMonth[11]), momLast, "vs Nov");

    // Line: metric by category per month
    const series = CATS.map((c) => ({
      name: c.name,
      color: c.color,
      values: MONTHS.map((_, m) => sum(rows.filter((r) => r.cat === c.name && r.m === m), metric)),
    }));
    $("#pgLineTitle").textContent = `Monthly ${metricName.toLowerCase()} by category${region === "All" ? "" : " · " + region}`;
    $("#pgLegend").innerHTML = series.map((s) => `<li><i style="background:${s.color}"></i>${s.name}</li>`).join("");
    Charts.line($("#pgLine"), {
      labels: MONTHS,
      tipLabels: MONTHS_LONG.map((m) => m + " 2025"),
      series,
      format: fmt,
      ariaLabel: `Monthly ${metricName} by category`,
    });

    // Bars: metric by region (full year), selected region highlighted
    $("#pgBarTitle").textContent = `${metricName} by region, full year`;
    const regionTotals = Object.keys(REGIONS)
      .map((r) => ({ label: r, value: sum(ROWS.filter((x) => x.region === r), metric) }))
      .sort((a, b) => b.value - a.value);
    Charts.hbars($("#pgBars"), {
      items: regionTotals,
      highlight: region,
      format: fmt,
      valueName: metricName,
      ariaLabel: `${metricName} by region`,
    });

    // Auto-generated insight
    const catTotals = series.map((s) => ({ name: s.name, total: s.values.reduce((a, b) => a + b, 0), first: s.values[0], last: s.values[11] }));
    const totalAll = catTotals.reduce((a, b) => a + b.total, 0);
    const topCat = [...catTotals].sort((a, b) => b.total - a.total)[0];
    const fastest = [...catTotals].sort((a, b) => b.last / b.first - a.last / a.first)[0];
    const peak = byMonth.indexOf(Math.max(...byMonth));
    const q4 = byMonth.slice(9).reduce((a, b) => a + b, 0) / byMonth.reduce((a, b) => a + b, 0);
    const where = region === "All" ? "Across all regions" : `In the ${region} region`;
    const regionShare = region === "All" ? "" : ` ${region} contributes <strong>${((regionTotals.find((r) => r.label === region).value / regionTotals.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%</strong> of company ${metricName.toLowerCase()}.`;
    $("#pgInsight").innerHTML =
      `<strong>Insight:</strong> ${where}, <strong>${topCat.name}</strong> drives ${((topCat.total / totalAll) * 100).toFixed(0)}% of ${metricName.toLowerCase()}, ` +
      `while <strong>${fastest.name}</strong> grew fastest (${fmtPct(fastest.last / fastest.first - 1)} Jan→Dec). ` +
      `${metricName} peaks in <strong>${MONTHS_LONG[peak]}</strong> and Q4 alone delivers ${(q4 * 100).toFixed(0)}% of the year, so stock and staffing should be planned around the holiday season.${regionShare}`;

    // Table view
    const total = MONTHS.map((_, m) => series.reduce((a, s) => a + s.values[m], 0));
    $("#pgTable").innerHTML = `<table>
      <caption class="muted" style="caption-side:bottom;padding:8px;font-size:12px;text-align:left">${metricName} by month and category${region === "All" ? "" : " · " + region}</caption>
      <thead><tr><th>Month</th>${series.map((s) => `<th>${s.name}</th>`).join("")}<th>Total</th></tr></thead>
      <tbody>${MONTHS.map((mo, m) => `<tr><td>${mo}</td>${series.map((s) => `<td>${fmtFull(s.values[m], money)}</td>`).join("")}<td>${fmtFull(total[m], money)}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>Total</td>${series.map((s) => `<td>${fmtFull(s.values.reduce((a, b) => a + b, 0), money)}</td>`).join("")}<td>${fmtFull(total.reduce((a, b) => a + b, 0), money)}</td></tr></tfoot>
    </table>`;
  }
  renderBoard();

  /* ------------------------------------------------------- theme toggle */
  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------------------------------------------------------- nav & menu */
  const nav = $("#nav");
  const menuBtn = $("#menuToggle");
  const links = $("#navLinks");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", false); } });
  window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 8), { passive: true });

  // active section highlighting
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) $$("#navLinks a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    const rev = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(countUp);
        rev.unobserve(en.target);
      }),
      { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => rev.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    $$("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
  }
})();
