(function () {
  const CORE_FOUNDATIONS = [
    { icon: "🏛️", label: "Who We Are & Koinonia", badge: "01", chamber: "about", href: "index.html?chamber=about" },
    { icon: "⚖️", label: "Governance Mandates", badge: "3", chamber: "governance", href: "index.html?chamber=governance" },
    { icon: "🌾", label: "Goshen 8 Pillars", badge: "8", chamber: "goshen-pillars", href: "index.html?chamber=goshen-pillars" },
    { icon: "🛡️", label: "Functional Dockets", badge: "6", chamber: "dockets", href: "index.html?chamber=dockets" }
  ];

  const ACTION_PAGES = [
    { icon: "📜", label: "Courts of Heaven 101", badge: "Law", chamber: "courtroom-101", href: "index.html?chamber=courtroom-101", matchPage: "courtroom" },
    { icon: "📚", label: "Documents & Decrees", badge: "10", chamber: "resources", href: "index.html?chamber=resources", matchPage: "decrees" },
    { icon: "📁", label: "Work Log & Milestones", badge: "Log", chamber: "milestones", href: "index.html?chamber=milestones", matchPage: "milestones" },
    { icon: "🎥", label: "Teachings & Video", badge: "Live", chamber: "media", href: "index.html?chamber=media", matchPage: "media" },
    { icon: "📝", label: "Engage & Intake Forms", badge: "Join", chamber: "forms", href: "index.html?chamber=forms", matchPage: "forms" },
    { icon: "🖼️", label: "Photo & Media Gallery", badge: "Pics", chamber: "gallery", href: "index.html?chamber=gallery", matchPage: "gallery" }
  ];

  const QUICK_LINKS = [
    { icon: "⏱️", label: "24/7 Watch & Hebrew Cal", href: "watch-hub.html", arrow: "→", external: false },
    { icon: "🎓", label: "Member & Classes Portal", href: "portal.html", arrow: "→", external: false },
    { icon: "📋", label: "Aaron & Hur Coverage Page", href: "aaron-hur.html", arrow: "→", external: false },
    { icon: "💬", label: "KEK WhatsApp Community", href: "https://chat.whatsapp.com/KicB3kPctrrHHZpieyfPfA", arrow: "↗", external: true }
  ];

  const SIDEBAR_WIDTH = "284px";
  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isIndexPage = currentFile === "" || currentFile === "index.html";
  const params = new URLSearchParams(window.location.search);
  let activeChamber = params.get("chamber") || "";

  let readingMode = localStorage.getItem("kek_reading_mode") || "focused";

  if (!document.getElementById("kek-unified-sidebar-style")) {
    const style = document.createElement("style");
    style.id = "kek-unified-sidebar-style";
    style.textContent = `
      :root {
        --kek-sidebar-w: ${SIDEBAR_WIDTH};
        --kek-rail-bg: #050d1a;
        --kek-rail-card: #0c172a;
        --kek-rail-gold: #c59b27;
        --kek-rail-gold-bright: #e3bc4b;
      }

      @media (min-width: 981px) {
        body.kek-sidebar-enabled {
          padding-left: var(--kek-sidebar-w);
        }

        /* On subpages, hide duplicate top row nav bars so sidebar is primary navigation */
        body.kek-sidebar-enabled.kek-subpage header nav,
        body.kek-sidebar-enabled.kek-subpage header .nav-links {
          display: none !important;
        }
      }

      .kek-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--kek-sidebar-w);
        background: var(--kek-rail-bg);
        border-right: 1px solid rgba(148, 163, 184, 0.16);
        color: #e2e8f0;
        font-family: 'Montserrat', sans-serif;
        z-index: 1500;
        padding: 16px 12px 28px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
        transition: transform 0.22s ease;
      }

      .kek-sidebar-group-label {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #94a3b8;
        padding: 10px 8px 7px;
        line-height: 1.35;
      }

      .kek-sidebar-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
      }

      .kek-nav-item {
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

      .kek-nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }

      .kek-nav-item.is-active {
        background: rgba(197, 155, 39, 0.14);
        border: 1.5px solid var(--kek-rail-gold-bright);
        color: var(--kek-rail-gold-bright);
      }

      .kek-nav-left {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
      }

      .kek-nav-icon {
        font-size: 0.95rem;
        flex-shrink: 0;
        line-height: 1;
      }

      .kek-nav-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kek-nav-badge {
        background: rgba(30, 41, 59, 0.95);
        color: #e2e8f0;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        flex-shrink: 0;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .kek-nav-item.is-active .kek-nav-badge {
        background: var(--kek-rail-gold);
        color: #091324;
        border-color: var(--kek-rail-gold);
      }

      .kek-layout-box {
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 12px;
        padding: 12px;
        margin: 12px 0 14px;
      }

      .kek-layout-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--kek-rail-gold-bright);
        margin-bottom: 10px;
      }

      .kek-layout-btns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .kek-layout-btn {
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

      .kek-layout-btn.is-selected {
        background: linear-gradient(135deg, #d4ab38 0%, #b5891b 100%);
        color: #091324;
        border-color: var(--kek-rail-gold-bright);
      }

      .kek-quick-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .kek-quick-card {
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

      .kek-quick-card:hover {
        border-color: var(--kek-rail-gold);
        background: rgba(197, 155, 39, 0.1);
        color: var(--kek-rail-gold-bright);
      }

      .kek-quick-arrow {
        color: #94a3b8;
        font-size: 0.85rem;
        flex-shrink: 0;
      }

      .kek-sidebar-toggle {
        display: none;
        position: fixed;
        bottom: 18px;
        left: 18px;
        z-index: 1600;
        background: #0c1b33;
        color: var(--kek-rail-gold-bright);
        border: 1.5px solid var(--kek-rail-gold);
        border-radius: 999px;
        padding: 10px 15px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
      }

      @media (max-width: 980px) {
        .kek-sidebar-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .kek-sidebar {
          transform: translateX(-100%);
        }

        .kek-sidebar.is-open {
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.classList.add("kek-sidebar-enabled");
  if (!isIndexPage) {
    document.body.classList.add("kek-subpage");
  }

  function applyReadingLayoutMode(mode, targetChamber = "") {
    readingMode = mode === "scroll" ? "scroll" : "focused";
    localStorage.setItem("kek_reading_mode", readingMode);

    document.querySelectorAll(".kek-layout-btn").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.getAttribute("data-mode") === readingMode);
    });

    // Sync with existing hub mode toggles if present on the page (e.g. watch-hub.html)
    const modeTabbedBtn = document.getElementById("mode-tabbed-btn");
    const modeAllBtn = document.getElementById("mode-all-btn");
    if (modeTabbedBtn && modeAllBtn) {
      if (readingMode === "scroll") {
        modeAllBtn.click();
      } else {
        modeTabbedBtn.click();
      }
    }

    // Support chamber / section focus on index.html if present
    if (isIndexPage) {
      const chambers = Array.from(document.querySelectorAll("[data-chamber], .chamber-section, section[id]"));
      if (chambers.length > 0 && readingMode === "focused" && targetChamber) {
        chambers.forEach((el) => {
          const elChamber = el.getAttribute("data-chamber") || el.id;
          if (el.hasAttribute("data-chamber") || el.classList.contains("chamber-section")) {
            el.style.display = (elChamber === targetChamber) ? "" : "none";
          }
        });
        const matched = document.querySelector(`[data-chamber="${targetChamber}"], #${targetChamber}`);
        if (matched) {
          matched.style.display = "";
          matched.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (readingMode === "scroll") {
        chambers.forEach((el) => {
          if (el.hasAttribute("data-chamber") || el.classList.contains("chamber-section")) {
            el.style.display = "";
          }
        });
      }
    }
  }

  function isItemActive(item) {
    if (isIndexPage && activeChamber) {
      return item.chamber === activeChamber;
    }
    if (!isIndexPage && item.matchPage && currentFile.includes(item.matchPage)) {
      return true;
    }
    if (isIndexPage && !activeChamber && item.chamber === "about") {
      return true;
    }
    return false;
  }

  function renderItemHtml(item) {
    const activeClass = isItemActive(item) ? " is-active" : "";
    return `
      <a href="${item.href}" class="kek-nav-item${activeClass}" data-chamber="${item.chamber || ""}">
        <span class="kek-nav-left">
          <span class="kek-nav-icon">${item.icon}</span>
          <span class="kek-nav-text">${item.label}</span>
        </span>
        <span class="kek-nav-badge">${item.badge}</span>
      </a>
    `;
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "kek-sidebar";
  sidebar.setAttribute("aria-label", "KEK Sanctuary Navigation");

  sidebar.innerHTML = `
    <div class="kek-sidebar-group-label">CORE FOUNDATIONS</div>
    <div class="kek-sidebar-list">
      ${CORE_FOUNDATIONS.map(renderItemHtml).join("")}
    </div>

    <div class="kek-sidebar-group-label">COURTS, LIBRARY &amp; ACTION PAGES</div>
    <div class="kek-sidebar-list">
      ${ACTION_PAGES.map(renderItemHtml).join("")}
    </div>

    <div class="kek-layout-box">
      <div class="kek-layout-title">Reading Layout Mode</div>
      <div class="kek-layout-btns">
        <button type="button" class="kek-layout-btn ${readingMode === "focused" ? "is-selected" : ""}" data-mode="focused">Focused View</button>
        <button type="button" class="kek-layout-btn ${readingMode === "scroll" ? "is-selected" : ""}" data-mode="scroll">Full Scroll</button>
      </div>
    </div>

    <div class="kek-quick-stack">
      ${QUICK_LINKS.map((q) => `
        <a href="${q.href}" class="kek-quick-card"${q.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
          <span class="kek-nav-left">
            <span class="kek-nav-icon">${q.icon}</span>
            <span class="kek-nav-text">${q.label}</span>
          </span>
          <span class="kek-quick-arrow">${q.arrow}</span>
        </a>
      `).join("")}
    </div>
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "kek-sidebar-toggle";
  toggleBtn.textContent = "☰ Navigation";
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(open));
  });

  sidebar.querySelectorAll(".kek-layout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyReadingLayoutMode(btn.getAttribute("data-mode"), activeChamber);
    });
  });

  sidebar.querySelectorAll(".kek-nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetChamber = link.getAttribute("data-chamber");
      sidebar.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");

      if (isIndexPage && targetChamber) {
        const targetEl = document.querySelector(`[data-chamber="${targetChamber}"], #${targetChamber}`);
        if (targetEl) {
          e.preventDefault();
          activeChamber = targetChamber;
          const nextUrl = `${window.location.pathname}?chamber=${encodeURIComponent(targetChamber)}`;
          window.history.replaceState({}, "", nextUrl);
          sidebar.querySelectorAll(".kek-nav-item").forEach((itemEl) => {
            itemEl.classList.toggle("is-active", itemEl === link);
          });
          applyReadingLayoutMode(readingMode, targetChamber);
        }
      }
    });
  });

  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.appendChild(toggleBtn);

  applyReadingLayoutMode(readingMode, activeChamber);
})();
