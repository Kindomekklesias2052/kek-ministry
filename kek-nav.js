(function () {
  const STORAGE_KEY = "kek_homepage_nav_snapshot_v1";
  const MODE_KEY = "kek_reading_mode";
  const SIDEBAR_WIDTH = "284px";

  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHomePage = currentFile === "" || currentFile === "index.html";
  const params = new URLSearchParams(window.location.search);
  let activeChamber = params.get("chamber") || "";
  let readingMode = localStorage.getItem(MODE_KEY) || "focused";

  // Fallback navigation structure matching the homepage sidebar if snapshot is not yet cached
  const FALLBACK_GROUPS = [
    {
      heading: "CORE FOUNDATIONS",
      items: [
        { icon: "🏛️", label: "Who We Are & Koinonia", badge: "01", chamber: "about", href: "index.html?chamber=about" },
        { icon: "⚖️", label: "Governance Mandates", badge: "3", chamber: "governance", href: "index.html?chamber=governance" },
        { icon: "🌾", label: "Goshen 8 Pillars", badge: "8", chamber: "goshen-pillars", href: "index.html?chamber=goshen-pillars" },
        { icon: "🛡️", label: "Functional Dockets", badge: "6", chamber: "dockets", href: "index.html?chamber=dockets" }
      ]
    },
    {
      heading: "COURTS, LIBRARY & ACTION PAGES",
      items: [
        { icon: "📜", label: "Courts of Heaven 101", badge: "Law", chamber: "courtroom-101", href: "index.html?chamber=courtroom-101", matchPage: "courtroom" },
        { icon: "📚", label: "Documents & Decrees", badge: "10", chamber: "resources", href: "index.html?chamber=resources", matchPage: "decrees" },
        { icon: "📁", label: "Work Log & Milestones", badge: "Log", chamber: "milestones", href: "index.html?chamber=milestones", matchPage: "milestones" },
        { icon: "🎥", label: "Teachings & Video", badge: "Live", chamber: "media", href: "index.html?chamber=media", matchPage: "media" },
        { icon: "📝", label: "Engage & Intake Forms", badge: "Join", chamber: "forms", href: "index.html?chamber=forms", matchPage: "forms" },
        { icon: "🖼️", label: "Photo & Media Gallery", badge: "Pics", chamber: "gallery", href: "index.html?chamber=gallery", matchPage: "gallery" }
      ]
    }
  ];

  const FALLBACK_QUICK_LINKS = [
    { icon: "⏱️", label: "24/7 Watch & Hebrew Cal", href: "watch-hub.html", arrow: "→", external: false },
    { icon: "🎓", label: "Member & Classes Portal", href: "portal.html", arrow: "→", external: false },
    { icon: "📋", label: "Aaron & Hur Coverage Page", href: "aaron-hur.html", arrow: "→", external: false },
    { icon: "💬", label: "KEK WhatsApp Community", href: "https://chat.whatsapp.com/KicB3kPctrrHHZpieyfPfA", arrow: "↗", external: true }
  ];

  // If on index.html, harvest any existing homepage sidebar/nav structure so subpages match 1:1
  function harvestHomepageNav() {
    if (!isHomePage) return null;

    const existingSidebar = document.querySelector(
      "aside:not(.kek-left-sidebar), .sidebar:not(.kek-left-sidebar), [data-home-nav]"
    );

    if (!existingSidebar) return null;

    const groups = [];
    const quickLinks = [];
    let currentGroup = null;

    existingSidebar.querySelectorAll("div, section, nav, ul, a").forEach((el) => {
      if (el.closest(".kek-quick-stack, .kek-layout-box")) return;

      if (el.matches("div, section, p, h2, h3, h4, span")) {
        const txt = (el.textContent || "").trim();
        const isUpperHeading =
          txt.length > 2 &&
          txt.length < 70 &&
          txt === txt.toUpperCase() &&
          /[A-Z]/.test(txt) &&
          el.children.length === 0;

        if (isUpperHeading) {
          currentGroup = { heading: txt, items: [] };
          groups.push(currentGroup);
        }
      }

      if (el.tagName === "A") {
        const href = el.getAttribute("href") || "#";
        const fullText = (el.textContent || "").trim();
        if (!fullText) return;

        const isExternal = /^https?:\/\//i.test(href);
        const arrowMatch = fullText.match(/(→|↗)$/);

        if (isExternal || arrowMatch) {
          const cleanLabel = fullText.replace(/(→|↗)$/, "").trim();
          quickLinks.push({
            icon: "•",
            label: cleanLabel,
            href,
            arrow: arrowMatch ? arrowMatch[1] : (isExternal ? "↗" : "→"),
            external: isExternal
          });
        } else {
          if (!currentGroup) {
            currentGroup = { heading: "NAVIGATION", items: [] };
            groups.push(currentGroup);
          }
          const badgeEl = el.querySelector(".badge, .count, span:last-child");
          const badge = badgeEl && badgeEl !== el ? (badgeEl.textContent || "").trim() : "";
          const label = badge
            ? fullText.slice(0, fullText.lastIndexOf(badge)).trim() || fullText
            : fullText;

          const chamberMatch = href.match(/[?&]chamber=([^&]+)/i) || href.match(/#(.+)$/);
          currentGroup.items.push({
            icon: "•",
            label,
            badge,
            chamber: chamberMatch ? decodeURIComponent(chamberMatch[1]) : "",
            href
          });
        }
      }
    });

    if (groups.length > 0) {
      const snapshot = { groups, quickLinks: quickLinks.length > 0 ? quickLinks : FALLBACK_QUICK_LINKS };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch (_) {}
      return snapshot;
    }

    return null;
  }

  function getNavData() {
    const harvested = harvestHomepageNav();
    if (harvested) return harvested;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.groups) && parsed.groups.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}

    return { groups: FALLBACK_GROUPS, quickLinks: FALLBACK_QUICK_LINKS };
  }

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
        }

        /* On subpages, hide duplicate top horizontal nav bars so the left sidebar is the unified nav */
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
        padding: 16px 12px 28px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
        transition: transform 0.22s ease;
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
  document.body.classList.add("kek-left-nav-enabled");
  if (!isHomePage) {
    document.body.classList.add("kek-is-subpage");
  }

  function applyReadingMode(mode, targetChamber = "") {
    readingMode = mode === "scroll" ? "scroll" : "focused";
    localStorage.setItem(MODE_KEY, readingMode);

    document.querySelectorAll(".kek-left-layout-btn").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.getAttribute("data-mode") === readingMode);
    });

    // Sync with existing hub mode toggles when present (such as watch-hub.html)
    const modeTabbedBtn = document.getElementById("mode-tabbed-btn");
    const modeAllBtn = document.getElementById("mode-all-btn");
    if (modeTabbedBtn && modeAllBtn) {
      if (readingMode === "scroll" && !modeAllBtn.classList.contains("active-mode")) {
        modeAllBtn.click();
      } else if (readingMode === "focused" && !modeTabbedBtn.classList.contains("active-mode")) {
        modeTabbedBtn.click();
      }
    }

    if (isHomePage) {
      const chambers = Array.from(document.querySelectorAll("[data-chamber], .chamber-section"));
      if (chambers.length > 0 && readingMode === "focused" && targetChamber) {
        chambers.forEach((el) => {
          const elChamber = el.getAttribute("data-chamber") || el.id;
          el.style.display = elChamber === targetChamber ? "" : "none";
        });
        const matched = document.querySelector(`[data-chamber="${targetChamber}"], #${targetChamber}`);
        if (matched) {
          matched.style.display = "";
          matched.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (readingMode === "scroll") {
        chambers.forEach((el) => {
          el.style.display = "";
        });
      }
    }
  }

  function isItemActive(item) {
    if (isHomePage && activeChamber) {
      return item.chamber === activeChamber;
    }
    if (!isHomePage && item.matchPage && currentFile.includes(item.matchPage)) {
      return true;
    }
    if (isHomePage && !activeChamber && item.chamber === "about") {
      return true;
    }
    return false;
  }

  const navData = getNavData();

  const groupsHtml = navData.groups
    .map((grp) => {
      const itemsHtml = grp.items
        .map((item) => {
          const activeClass = isItemActive(item) ? " is-active" : "";
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
        })
        .join("");

      return `
        <div class="kek-left-group-label">${grp.heading}</div>
        <div class="kek-left-list">${itemsHtml}</div>
      `;
    })
    .join("");

  const quickLinksHtml = navData.quickLinks
    .map(
      (q) => `
        <a href="${q.href}" class="kek-left-quick-card"${q.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
          <span class="kek-left-link-main">
            <span class="kek-left-icon">${q.icon || "•"}</span>
            <span class="kek-left-label">${q.label}</span>
          </span>
          <span class="kek-left-quick-arrow">${q.arrow || "→"}</span>
        </a>
      `
    )
    .join("");

  const sidebar = document.createElement("aside");
  sidebar.className = "kek-left-sidebar";
  sidebar.setAttribute("aria-label", "KEK Sanctuary Navigation");
  sidebar.innerHTML = `
    ${groupsHtml}

    <div class="kek-left-layout-box">
      <div class="kek-left-layout-title">Reading Layout Mode</div>
      <div class="kek-left-layout-btns">
        <button type="button" class="kek-left-layout-btn ${readingMode === "focused" ? "is-selected" : ""}" data-mode="focused">Focused View</button>
        <button type="button" class="kek-left-layout-btn ${readingMode === "scroll" ? "is-selected" : ""}" data-mode="scroll">Full Scroll</button>
      </div>
    </div>

    <div class="kek-left-quick-stack">
      ${quickLinksHtml}
    </div>
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "kek-left-mobile-btn";
  toggleBtn.textContent = "☰ Navigation";
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  sidebar.querySelectorAll(".kek-left-layout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyReadingMode(btn.getAttribute("data-mode"), activeChamber);
    });
  });

  sidebar.querySelectorAll(".kek-left-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetChamber = link.getAttribute("data-chamber");
      sidebar.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");

      if (isHomePage && targetChamber) {
        const targetEl = document.querySelector(`[data-chamber="${targetChamber}"], #${targetChamber}`);
        if (targetEl) {
          e.preventDefault();
          activeChamber = targetChamber;
          window.history.replaceState({}, "", `${window.location.pathname}?chamber=${encodeURIComponent(targetChamber)}`);
          sidebar.querySelectorAll(".kek-left-link").forEach((itemEl) => {
            itemEl.classList.toggle("is-active", itemEl === link);
          });
          applyReadingMode(readingMode, targetChamber);
        }
      }
    });
  });

  document.body.insertBefore(sidebar, document.body.firstChild);
  document.body.appendChild(toggleBtn);

  applyReadingMode(readingMode, activeChamber);
})();
