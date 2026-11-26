(function () {
  const MODE_KEY = "kek_reading_mode";
  const HIDDEN_KEY = "kek_subpage_nav_hidden";
  const SIDEBAR_WIDTH = "284px";

  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHomePage = currentFile === "" || currentFile === "index.html";

  // index.html uses its own built-in chamber rail without loading kek-nav.js
  if (isHomePage) {
    document.body.classList.remove(
      "kek-left-nav-enabled",
      "kek-left-nav-hidden",
      "kek-right-col-active",
      "kek-is-subpage"
    );
    return;
  }

  const params = new URLSearchParams(window.location.search);
  let readingMode = localStorage.getItem(MODE_KEY) || "focused";
  let isHidden = localStorage.getItem(HIDDEN_KEY) === "1";

  const MAIN_PAGES = [
    { icon: "🏛️", label: "Main Sanctuary", badge: "Home", href: "index.html", pageMatch: "index.html" },
    { icon: "⏱️", label: "24/7 Watch & Hebrew Cal", badge: "Live", href: "watch-hub.html", pageMatch: "watch-hub.html" },
    { icon: "🎓", label: "Member & Classes Portal", badge: "Portal", href: "portal.html", pageMatch: "portal.html" },
    { icon: "📋", label: "Aaron & Hur Coverage Page", badge: "Watch", href: "intake.html", pageMatch: "intake.html" },
    { icon: "🔒", label: "Privacy & Confidentiality", badge: "Policy", href: "privacy.html", pageMatch: "privacy.html" }
  ];

  const NAV_GROUPS = [
    {
      heading: "CORE FOUNDATIONS",
      items: [
        { icon: "🏛️", label: "Who We Are & Koinonia", badge: "01", chamber: "about", href: "index.html?chamber=about" },
        { icon: "⚖️", label: "Governance Mandates", badge: "3", chamber: "mandates", href: "index.html?chamber=mandates" },
        { icon: "🌾", label: "Goshen 8 Pillars", badge: "8", chamber: "goshen-pillars", href: "index.html?chamber=goshen-pillars" },
        { icon: "🛡️", label: "Functional Dockets", badge: "6", chamber: "services", href: "index.html?chamber=services" }
      ]
    },
    {
      heading: "COURTS, LIBRARY & ACTION PAGES",
      items: [
        { icon: "📜", label: "Courts of Heaven 101", badge: "Law", chamber: "courtroom-101", href: "index.html?chamber=courtroom-101" },
        { icon: "📚", label: "Documents & Decrees", badge: "10", chamber: "resources", href: "index.html?chamber=resources" },
        { icon: "🗂️", label: "Work Log & Milestones", badge: "Log", chamber: "logs", href: "index.html?chamber=logs" },
        { icon: "🎥", label: "Teachings & Video", badge: "Live", chamber: "videos", href: "index.html?chamber=videos" },
        { icon: "📝", label: "Engage & Intake Forms", badge: "Join", chamber: "forms", href: "index.html?chamber=forms" },
        { icon: "🖼️", label: "Photo & Media Gallery", badge: "Pics", chamber: "gallery", href: "index.html?chamber=gallery" }
      ]
    }
  ];

  const COMMUNITY_LINKS = [
    { icon: "💬", label: "KEK WhatsApp Community", href: "https://chat.whatsapp.com/KicB3kPctrrHHZpieyfPfA", arrow: "↗", external: true }
  ];

  if (!document.getElementById("kek-left-sidebar-styles")) {
    const style = document.createElement("style");
    style.id = "kek-left-sidebar-styles";
    style.textContent = `
      :root {
        --kek-left-w: ${SIDEBAR_WIDTH};
        --kek-bg: #050d1a;
        --kek-card: #0c172a;
        --kek-gold: #c59b27;
        --kek-gold-bright: #e3bc4b;
      }

      @media (min-width: 981px) {
        body.kek-left-nav-enabled {
          padding-left: var(--kek-left-w);
          padding-right: 0;
          overflow-x: hidden;
          transition: padding-left 0.22s ease;
        }

        body.kek-left-nav-enabled.kek-left-nav-hidden {
          padding-left: 0;
        }

        body.kek-left-nav-enabled.kek-is-subpage header nav,
        body.kek-left-nav-enabled.kek-is-subpage header .nav-links,
        body.kek-left-nav-enabled.kek-is-subpage .kek-shared-return-bar {
          display: none !important;
        }
      }

      .kek-left-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        right: auto;
        bottom: 0;
        width: var(--kek-left-w);
        background: var(--kek-bg);
        border-right: 1px solid rgba(148, 163, 184, 0.16);
        border-left: none;
        color: #e2e8f0;
        font-family: 'Montserrat', sans-serif;
        z-index: 1500;
        padding: 14px 12px 28px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
        transition: transform 0.22s ease;
      }

      @media (min-width: 981px) {
        body.kek-left-nav-hidden .kek-left-sidebar {
          transform: translateX(-100%);
        }
      }

      .kek-left-top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 6px 10px;
        margin-bottom: 4px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
      }

      .kek-left-brand-label {
        font-family: 'Cinzel', serif;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--kek-gold-bright);
        letter-spacing: 0.6px;
      }

      .kek-left-hide-btn {
        background: rgba(197, 155, 39, 0.14);
        color: var(--kek-gold-bright);
        border: 1px solid rgba(197, 155, 39, 0.45);
        border-radius: 7px;
        padding: 5px 10px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .kek-left-hide-btn:hover {
        background: var(--kek-gold);
        color: #091324;
      }

      .kek-left-unhide-btn {
        display: none;
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1600;
        background: #0c1b33;
        color: var(--kek-gold-bright);
        border: 1.5px solid var(--kek-gold);
        border-radius: 999px;
        padding: 9px 14px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
        align-items: center;
        gap: 6px;
        transition: all 0.15s ease;
      }

      .kek-left-unhide-btn:hover {
        background: var(--kek-gold);
        color: #091324;
      }

      @media (min-width: 981px) {
        body.kek-left-nav-hidden .kek-left-unhide-btn {
          display: inline-flex;
        }
      }

      .kek-left-group-label {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #94a3b8;
        padding: 10px 8px 7px;
        line-height: 1.35;
      }

      .kek-left-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
      }

      .kek-left-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        text-decoration: none;
        color: #e2e8f0;
        font-size: 0.81rem;
        font-weight: 600;
        padding: 9px 10px;
        border-radius: 10px;
        border: 1px solid transparent;
        background: transparent;
        cursor: pointer;
        text-align: left;
        transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      }

      .kek-left-link:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }

      .kek-left-link.is-active {
        background: rgba(197, 155, 39, 0.14);
        border: 1.5px solid var(--kek-gold-bright);
        color: var(--kek-gold-bright);
      }

      .kek-left-link-main {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
      }

      .kek-left-icon {
        font-size: 0.95rem;
        flex-shrink: 0;
        line-height: 1;
      }

      .kek-left-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kek-left-badge {
        background: rgba(30, 41, 59, 0.95);
        color: #e2e8f0;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        flex-shrink: 0;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .kek-left-link.is-active .kek-left-badge {
        background: var(--kek-gold);
        color: #091324;
        border-color: var(--kek-gold);
      }

      .kek-left-layout-box {
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 12px;
        padding: 12px;
        margin: 12px 0 14px;
      }

      .kek-left-layout-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--kek-gold-bright);
        margin-bottom: 10px;
      }

      .kek-left-layout-btns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .kek-left-layout-btn {
        background: #0b1526;
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 8px;
        padding: 8px 6px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .kek-left-layout-btn.is-selected {
        background: linear-gradient(135deg, #d4ab38 0%, #b5891b 100%);
        color: #091324;
        border-color: var(--kek-gold-bright);
      }

      .kek-left-quick-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .kek-left-quick-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        text-decoration: none;
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 10px;
        padding: 10px 12px;
        color: #e2e8f0;
        font-size: 0.78rem;
        font-weight: 700;
        transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
      }

      .kek-left-quick-card:hover {
        border-color: var(--kek-gold);
        background: rgba(197, 155, 39, 0.1);
        color: var(--kek-gold-bright);
      }

      .kek-left-quick-arrow {
        color: #94a3b8;
        font-size: 0.85rem;
        flex-shrink: 0;
      }

      .kek-left-mobile-btn {
        display: none;
        position: fixed;
        bottom: 18px;
        left: 18px;
        z-index: 1600;
        background: #0c1b33;
        color: var(--kek-gold-bright);
        border: 1.5px solid var(--kek-gold);
        border-radius: 999px;
        padding: 10px 15px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
      }

      @media (max-width: 980px) {
        .kek-left-mobile-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .kek-left-sidebar {
          transform: translateX(-100%);
        }

        .kek-left-sidebar.is-open {
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.classList.remove("kek-right-col-active");
  document.body.classList.add("kek-left-nav-enabled", "kek-is-subpage");

  function syncNavHiddenState(hidden) {
    isHidden = Boolean(hidden);
    localStorage.setItem(HIDDEN_KEY, isHidden ? "1" : "0");

    if (window.innerWidth > 980) {
      document.body.classList.toggle("kek-left-nav-hidden", isHidden);
      sidebar.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    } else {
      sidebar.classList.toggle("is-open", !isHidden);
      toggleBtn.textContent = isHidden ? "☰ Unhide Nav" : "✕ Hide Nav";
      toggleBtn.setAttribute("aria-expanded", String(!isHidden));
    }
  }

  function applyReadingMode(mode) {
    readingMode = mode === "scroll" ? "scroll" : "focused";
    localStorage.setItem(MODE_KEY, readingMode);

    document.querySelectorAll(".kek-left-layout-btn").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.getAttribute("data-mode") === readingMode);
    });
  }

  function isPageItemActive(item) {
    if (!item.pageMatch) return false;
    return currentFile === item.pageMatch;
  }

  function renderNavRow(item, active) {
    const activeClass = active ? " is-active" : "";
    const badgeHtml = item.badge ? `<span class="kek-left-badge">${item.badge}</span>` : "";
    return `
      <a href="${item.href}" class="kek-left-link${activeClass}" data-chamber="${item.chamber || ""}">
        <span class="kek-left-link-main">
          <span class="kek-left-icon">${item.icon || "•"}</span>
          <span class="kek-left-label">${item.label}</span>
        </span>
        ${badgeHtml}
      </a>
    `;
  }

  const mainPagesHtml = `
    <div class="kek-left-group-label">MAIN PAGES</div>
    <div class="kek-left-list">
      ${MAIN_PAGES.map((item) => renderNavRow(item, isPageItemActive(item))).join("")}
    </div>
  `;

  const groupsHtml = NAV_GROUPS.map((grp) => {
    const itemsHtml = grp.items.map((item) => renderNavRow(item, false)).join("");
    return `
      <div class="kek-left-group-label">${grp.heading}</div>
      <div class="kek-left-list">${itemsHtml}</div>
    `;
  }).join("");

  const communityHtml = COMMUNITY_LINKS.map(
    (q) => `
      <a href="${q.href}" class="kek-left-quick-card"${q.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="kek-left-link-main">
          <span class="kek-left-icon">${q.icon || "•"}</span>
          <span class="kek-left-label">${q.label}</span>
        </span>
        <span class="kek-left-quick-arrow">${q.arrow || "→"}</span>
      </a>
    `
  ).join("");

  const sidebar = document.createElement("aside");
  sidebar.className = "kek-left-sidebar";
  sidebar.setAttribute("aria-label", "KEK Sanctuary Navigation");
  sidebar.innerHTML = `
    <div class="kek-left-top-bar">
      <span class="kek-left-brand-label">KEK Navigation</span>
      <button type="button" class="kek-left-hide-btn" id="kek-left-hide-btn" title="Hide Navigation">✕ Hide</button>
    </div>
    ${mainPagesHtml}
    ${groupsHtml}

    <div class="kek-left-layout-box">
      <div class="kek-left-layout-title">Reading Layout Mode</div>
      <div class="kek-left-layout-btns">
        <button type="button" class="kek-left-layout-btn ${readingMode === "focused" ? "is-selected" : ""}" data-mode="focused">Focused View</button>
        <button type="button" class="kek-left-layout-btn ${readingMode === "scroll" ? "is-selected" : ""}" data-mode="scroll">Full Scroll</button>
      </div>
    </div>

    <div class="kek-left-quick-stack">
      ${communityHtml}
    </div>
  `;

  const unhideBtn = document.createElement("button");
  unhideBtn.type = "button";
  unhideBtn.className = "kek-left-unhide-btn";
  unhideBtn.id = "kek-left-unhide-btn";
  unhideBtn.innerHTML = `<span>▶</span><span>Unhide Nav</span>`;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "kek-left-mobile-btn";
  toggleBtn.textContent = isHidden ? "☰ Unhide Nav" : "☰ Navigation";
  toggleBtn.setAttribute("aria-expanded", String(!isHidden));

  sidebar.querySelector("#kek-left-hide-btn")?.addEventListener("click", () => {
    syncNavHiddenState(true);
  });

  unhideBtn.addEventListener("click", () => {
    syncNavHiddenState(false);
  });

  toggleBtn.addEventListener("click", () => {
    syncNavHiddenState(!isHidden);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      document.body.classList.toggle("kek-left-nav-hidden", isHidden);
      sidebar.classList.remove("is-open");
    } else {
      document.body.classList.remove("kek-left-nav-hidden");
      sidebar.classList.toggle("is-open", !isHidden);
    }
  });

  sidebar.querySelectorAll(".kek-left-layout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyReadingMode(btn.getAttribute("data-mode"));
    });
  });

  sidebar.querySelectorAll(".kek-left-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        syncNavHiddenState(true);
      }
    });
  });

  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.appendChild(unhideBtn);
  document.body.appendChild(toggleBtn);

  if (window.innerWidth > 980 && isHidden) {
    document.body.classList.add("kek-left-nav-hidden");
  }

  applyReadingMode(readingMode);
})();
