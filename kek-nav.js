(function () {
  const MODE_KEY = "kek_reading_mode";
  const HIDDEN_KEY = "kek_subpage_nav_hidden";
  const SIDEBAR_WIDTH = "284px";

  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHomePage = currentFile === "" || currentFile === "index.html";

  // =========================================================================
  // PART A: SUBPAGE LEFT NAVIGATION RAIL (Skipped on index.html)
  // =========================================================================
  if (isHomePage) {
    document.body.classList.remove(
      "kek-left-nav-enabled",
      "kek-left-nav-hidden",
      "kek-right-col-active",
      "kek-is-subpage"
    );
  } else {
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
          padding: 14px 12px 92px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
          transition: transform 0.22s ease;
        }

        @media (min-width: 981px) {
          body.kek-left-nav-enabled.kek-left-nav-hidden .kek-left-sidebar {
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

        .kek-desktop-nav-btn {
          display: none;
        }

        @media (min-width: 981px) {
          .kek-desktop-nav-btn {
            display: inline-flex;
            position: fixed;
            top: 14px;
            left: calc(var(--kek-left-w) + 14px);
            z-index: 2000;
            background: #0c1b33;
            color: var(--kek-gold-bright);
            border: 1.5px solid var(--kek-gold);
            border-radius: 999px;
            padding: 8px 14px;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
            align-items: center;
            gap: 6px;
            transition: left 0.22s ease, background 0.15s ease, color 0.15s ease;
          }

          body.kek-left-nav-enabled.kek-left-nav-hidden .kek-desktop-nav-btn {
            left: 16px;
          }

          .kek-desktop-nav-btn:hover {
            background: var(--kek-gold);
            color: #091324;
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
          bottom: 84px;
          left: 16px;
          z-index: 2000;
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

    function updateToggleLabels() {
      desktopToggleBtn.innerHTML = isHidden
        ? `<span>▶</span><span>Unhide Nav</span>`
        : `<span>◀</span><span>Hide Nav</span>`;
      desktopToggleBtn.setAttribute("aria-expanded", String(!isHidden));
      mobileToggleBtn.textContent = isHidden ? "☰ Unhide Nav" : "✕ Hide Nav";
      mobileToggleBtn.setAttribute("aria-expanded", String(!isHidden));
    }

    function syncNavHiddenState(hidden) {
      isHidden = Boolean(hidden);
      localStorage.setItem(HIDDEN_KEY, isHidden ? "1" : "0");

      if (window.innerWidth > 980) {
        document.body.classList.toggle("kek-left-nav-hidden", isHidden);
        sidebar.classList.remove("is-open");
      } else {
        document.body.classList.remove("kek-left-nav-hidden");
        sidebar.classList.toggle("is-open", !isHidden);
      }
      updateToggleLabels();
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

    const desktopToggleBtn = document.createElement("button");
    desktopToggleBtn.type = "button";
    desktopToggleBtn.className = "kek-desktop-nav-btn";
    desktopToggleBtn.id = "kek-desktop-nav-btn";

    const mobileToggleBtn = document.createElement("button");
    mobileToggleBtn.type = "button";
    mobileToggleBtn.className = "kek-left-mobile-btn";

    sidebar.querySelector("#kek-left-hide-btn")?.addEventListener("click", () => {
      syncNavHiddenState(true);
    });

    desktopToggleBtn.addEventListener("click", () => {
      syncNavHiddenState(!isHidden);
    });

    mobileToggleBtn.addEventListener("click", () => {
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
      updateToggleLabels();
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
    document.body.appendChild(desktopToggleBtn);
    document.body.appendChild(mobileToggleBtn);

    if (window.innerWidth > 980 && isHidden) {
      document.body.classList.add("kek-left-nav-hidden");
    }

    updateToggleLabels();
    applyReadingMode(readingMode);
  }

  // =========================================================================
  // PART B: 100% FREE GOOGLE CLOUD / GOOGLE DRIVE 24/7 WATCH RADIO FOOTER
  // =========================================================================
  if (window.__KEK_RADIO_INITIALIZED__) return;
  window.__KEK_RADIO_INITIALIZED__ = true;

  const GOOGLE_CLOUD_WATCH_STREAMS = {
    1: {
      title: "1st Watch: Midnight Courts & Gates (00:00–03:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-01-midnight-courts.mp3"
    },
    2: {
      title: "2nd Watch: Breaking & Dawn Legislation (03:00–06:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-02-dawn-legislation.mp3"
    },
    3: {
      title: "3rd Watch: Morning Alignment & Scroll (06:00–09:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-03-morning-scroll.mp3"
    },
    4: {
      title: "4th Watch: Marketplace & Goshen Mandate (09:00–12:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-04-goshen-mandate.mp3"
    },
    5: {
      title: "5th Watch: Noon Altar & Melchizedek Order (12:00–15:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-05-melchizedek-order.mp3"
    },
    6: {
      title: "6th Watch: 3:00 PM Hour of Prayer & Decrees (15:00–18:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-06-hour-of-prayer.mp3"
    },
    7: {
      title: "7th Watch: Evening Sacrifice & Family Altar (18:00–21:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-07-evening-sacrifice.mp3"
    },
    8: {
      title: "8th Watch: Night Threshold & Territorial Shield (21:00–00:00 EAT)",
      url: "https://storage.googleapis.com/kek-ministry-altar-audio/watch-08-night-threshold.mp3"
    }
  };

  const RADIO_STORAGE = {
    muted: "kek_radio_muted",
    volume: "kek_radio_volume",
    selectedWatch: "kek_radio_selected_watch"
  };

  function enforceHttps(url) {
    return url ? url.trim().replace(/^http:\/\//i, "https://") : "";
  }

  function getActiveWatchInfo(now = new Date()) {
    const eatHour =
      parseInt(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Nairobi",
          hour: "2-digit",
          hour12: false
        }).format(now),
        10
      ) || 0;

    const jerHour =
      parseInt(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jerusalem",
          hour: "2-digit",
          hour12: false
        }).format(now),
        10
      ) || 0;

    const eatTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);

    const jerTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);

    const watchIndex = Math.floor(eatHour / 3) + 1;
    const jerWatchIndex = Math.floor(jerHour / 3) + 1;
    const isPeakCorporateWatch = eatHour === 15 || eatHour === 0;

    const watchNames = {
      1: "1st Watch (00:00–03:00)",
      2: "2nd Watch (03:00–06:00)",
      3: "3rd Watch (06:00–09:00)",
      4: "4th Watch (09:00–12:00)",
      5: "5th Watch (12:00–15:00)",
      6: "6th Watch (15:00–18:00)",
      7: "7th Watch (18:00–21:00)",
      8: "8th Watch (21:00–00:00)"
    };

    return {
      watchIndex,
      jerWatchIndex,
      watchName: watchNames[watchIndex],
      jerWatchName: watchNames[jerWatchIndex],
      eatTime,
      jerTime,
      isPeakCorporateWatch,
      stream: GOOGLE_CLOUD_WATCH_STREAMS[watchIndex]
    };
  }

  if (!document.getElementById("kek-radio-bar-styles")) {
    const rStyle = document.createElement("style");
    rStyle.id = "kek-radio-bar-styles";
    rStyle.textContent = `
      body { padding-bottom: 72px; }
      .kek-radio-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1550;
        background: rgba(6, 14, 28, 0.98);
        backdrop-filter: blur(10px);
        border-top: 1.5px solid rgba(197, 155, 39, 0.55);
        color: #f8fafc;
        font-family: 'Montserrat', sans-serif;
        padding: 9px 18px;
        box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.35);
      }
      @media (min-width: 981px) {
        body.kek-left-nav-enabled:not(.kek-left-nav-hidden) .kek-radio-footer {
          left: ${SIDEBAR_WIDTH};
        }
      }
      .kek-radio-inner {
        max-width: 1480px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      .kek-radio-controls { display: flex; align-items: center; gap: 8px; }
      .kek-radio-btn {
        background: linear-gradient(135deg, #d4ab38 0%, #b5891b 100%);
        color: #091324;
        border: none;
        border-radius: 999px;
        padding: 7px 14px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.76rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .kek-radio-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        border: 1px solid rgba(197, 155, 39, 0.35);
        border-radius: 999px;
        padding: 6px 11px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .kek-radio-btn-secondary:hover { border-color: #e3bc4b; color: #e3bc4b; }
      .kek-radio-status-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
      .kek-radio-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 9px;
        border-radius: 999px;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        flex-shrink: 0;
        background: rgba(34, 197, 94, 0.16);
        border: 1px solid rgba(34, 197, 94, 0.45);
        color: #86efac;
      }
      .kek-radio-pill.is-offline {
        background: rgba(239, 68, 68, 0.16);
        border-color: rgba(239, 68, 68, 0.45);
        color: #fca5a5;
      }
      .kek-radio-meta {
        font-size: 0.76rem;
        color: #cbd5e1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kek-radio-meta strong { color: #e3bc4b; }
      .kek-radio-right { display: flex; align-items: center; gap: 10px; }
      .kek-radio-vol { width: 78px; accent-color: #c59b27; cursor: pointer; }
      .kek-radio-source-select {
        background: #0c1b33;
        color: #e2e8f0;
        border: 1px solid rgba(197, 155, 39, 0.4);
        border-radius: 6px;
        padding: 5px 8px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.71rem;
        font-weight: 600;
      }
      @media (max-width: 760px) {
        body { padding-bottom: 104px; }
        .kek-radio-vol { display: none; }
      }
    `;
    document.head.appendChild(rStyle);
  }

  const footer = document.createElement("div");
  footer.className = "kek-radio-footer";
  footer.setAttribute("role", "region");
  footer.setAttribute("aria-label", "KEK 24/7 Sanctuary Radio Player");
  footer.innerHTML = `
    <div class="kek-radio-inner">
      <div class="kek-radio-controls">
        <button type="button" class="kek-radio-btn" id="kek-radio-play-btn">▶ Listen 24/7</button>
        <button type="button" class="kek-radio-btn-secondary" id="kek-radio-reconnect-btn" title="Reconnect Audio Stream">↻ Reconnect</button>
        <button type="button" class="kek-radio-btn-secondary" id="kek-radio-mute-btn" title="Mute / Unmute">🔊</button>
      </div>
      <div class="kek-radio-status-wrap">
        <span class="kek-radio-pill" id="kek-radio-status-pill">● GOOGLE CLOUD 24/7</span>
        <div class="kek-radio-meta" id="kek-radio-track-info">
          <strong>KEK Altar Radio:</strong> Synchronizing EAT &amp; Jerusalem Watches...
        </div>
      </div>
      <div class="kek-radio-right">
        <select class="kek-radio-source-select" id="kek-radio-watch-select" aria-label="Select Watch Audio">
          <option value="auto">Auto-Sync Current Watch</option>
          <option value="1">1st Watch (00:00–03:00 EAT)</option>
          <option value="2">2nd Watch (03:00–06:00 EAT)</option>
          <option value="3">3rd Watch (06:00–09:00 EAT)</option>
          <option value="4">4th Watch (09:00–12:00 EAT)</option>
          <option value="5">5th Watch (12:00–15:00 EAT)</option>
          <option value="6">6th Watch (15:00–18:00 EAT)</option>
          <option value="7">7th Watch (18:00–21:00 EAT)</option>
          <option value="8">8th Watch (21:00–00:00 EAT)</option>
        </select>
        <a href="watch-hub.html" class="kek-radio-btn-secondary" title="Open Live Watch Hub">📺 Watch Hub</a>
        <input type="range" class="kek-radio-vol" id="kek-radio-vol" min="0" max="1" step="0.05" value="0.85" aria-label="Radio Volume">
      </div>
    </div>
  `;
  document.body.appendChild(footer);

  const audio = new Audio();
  audio.preload = "none";
  audio.crossOrigin = "anonymous";

  const playBtn = document.getElementById("kek-radio-play-btn");
  const reconnectBtn = document.getElementById("kek-radio-reconnect-btn");
  const muteBtn = document.getElementById("kek-radio-mute-btn");
  const statusPill = document.getElementById("kek-radio-status-pill");
  const trackInfo = document.getElementById("kek-radio-track-info");
  const watchSelect = document.getElementById("kek-radio-watch-select");
  const volSlider = document.getElementById("kek-radio-vol");

  const savedVol = parseFloat(localStorage.getItem(RADIO_STORAGE.volume));
  audio.volume = !Number.isNaN(savedVol) && savedVol >= 0 && savedVol <= 1 ? savedVol : 0.85;
  volSlider.value = String(audio.volume);

  audio.muted = localStorage.getItem(RADIO_STORAGE.muted) === "1";
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  watchSelect.value = localStorage.getItem(RADIO_STORAGE.selectedWatch) || "auto";

  function getSelectedStream(info) {
    const choice = watchSelect.value;
    if (choice !== "auto" && GOOGLE_CLOUD_WATCH_STREAMS[choice]) {
      return { watchNumber: parseInt(choice, 10), ...GOOGLE_CLOUD_WATCH_STREAMS[choice] };
    }
    return { watchNumber: info.watchIndex, ...info.stream };
  }

  function setStatus(isOffline, label) {
    statusPill.classList.toggle("is-offline", isOffline);
    statusPill.textContent = label;
  }

  function updateClockAndWatchDisplay() {
    const info = getActiveWatchInfo();
    const activeStream = getSelectedStream(info);
    const peakTag = info.isPeakCorporateWatch ? " [CORPORATE ALTAR HOUR]" : "";

    trackInfo.innerHTML = `
      <strong>EAT:</strong> ${info.eatTime} &bull; <strong>Jerusalem:</strong> ${info.jerTime} &bull; ${activeStream.title}${peakTag}
    `;

    window.dispatchEvent(
      new CustomEvent("kek:watch-tick", {
        detail: {
          ...info,
          selectedWatchNumber: activeStream.watchNumber,
          selectedStreamTitle: activeStream.title,
          isPlaying: !audio.paused
        }
      })
    );
  }

  function loadAndPlay() {
    const info = getActiveWatchInfo();
    const activeStream = getSelectedStream(info);
    setStatus(false, "● CONNECTING CLOUD...");
    audio.src = enforceHttps(activeStream.url);
    audio.load();

    audio
      .play()
      .then(() => {
        playBtn.textContent = "⏸ Pause Radio";
        setStatus(false, `● ON AIR • WATCH ${activeStream.watchNumber}`);
        updateClockAndWatchDisplay();
      })
      .catch(() => {
        playBtn.textContent = "▶ Listen 24/7";
        setStatus(true, "● STREAM STANDBY — UPLOAD MP3");
      });
  }

  function pauseRadio() {
    audio.pause();
    playBtn.textContent = "▶ Listen 24/7";
    setStatus(false, "● PAUSED");
    updateClockAndWatchDisplay();
  }

  audio.addEventListener("error", () => {
    playBtn.textContent = "▶ Listen 24/7";
    setStatus(true, "● AUDIO FILE PENDING — RECONNECT");
  });

  audio.addEventListener("ended", loadAndPlay);

  playBtn.addEventListener("click", () => (audio.paused ? loadAndPlay() : pauseRadio()));
  reconnectBtn.addEventListener("click", loadAndPlay);

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    localStorage.setItem(RADIO_STORAGE.muted, audio.muted ? "1" : "0");
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  });

  volSlider.addEventListener("input", () => {
    const val = parseFloat(volSlider.value);
    audio.volume = val;
    localStorage.setItem(RADIO_STORAGE.volume, String(val));
    if (val > 0 && audio.muted) {
      audio.muted = false;
      muteBtn.textContent = "🔊";
    }
  });

  watchSelect.addEventListener("change", () => {
    localStorage.setItem(RADIO_STORAGE.selectedWatch, watchSelect.value);
    if (!audio.paused) loadAndPlay();
    else updateClockAndWatchDisplay();
  });

  window.KEKRadio = {
    play: (watchNum) => {
      if (watchNum) {
        watchSelect.value = String(watchNum);
        localStorage.setItem(RADIO_STORAGE.selectedWatch, String(watchNum));
      }
      loadAndPlay();
    },
    pause: pauseRadio,
    reconnect: loadAndPlay,
    getActiveWatchInfo
  };

  updateClockAndWatchDisplay();
  setInterval(updateClockAndWatchDisplay, 1000);
})();
