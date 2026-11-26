(function () {
  const path = (window.location.pathname || "").toLowerCase();
  const isMainPage = path.endsWith("/") || path.endsWith("/index.html") || path === "index.html";
  if (isMainPage) return;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --kek-left-nav-w: 236px;
    }

    @media (min-width: 961px) {
      body.kek-has-left-nav {
        padding-left: var(--kek-left-nav-w);
      }
    }

    .kek-left-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--kek-left-nav-w);
      background: rgba(7, 16, 32, 0.98);
      border-right: 1.5px solid rgba(197, 155, 39, 0.5);
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 8px;
      overflow-y: auto;
      z-index: 1400;
      font-family: 'Montserrat', sans-serif;
      box-shadow: 6px 0 24px rgba(0, 0, 0, 0.25);
      transition: transform 0.22s ease;
    }

    .kek-left-sidebar-title {
      font-family: 'Cinzel', serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      color: #e3bc4b;
      padding: 4px 10px 10px;
      margin-bottom: 2px;
      border-bottom: 1px solid rgba(197, 155, 39, 0.28);
    }

    .kek-left-nav-links {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 7px;
    }

    .kek-left-chamber-link {
      display: block;
      color: #e2e8f0;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 9px 12px;
      border-radius: 7px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.02);
      transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }

    .kek-left-chamber-link:hover {
      color: #e3bc4b;
      border-color: #c59b27;
      background: rgba(197, 155, 39, 0.12);
    }

    .kek-mobile-sidebar-btn {
      display: none;
      position: fixed;
      bottom: 18px;
      left: 18px;
      z-index: 1500;
      background: #0c1b33;
      color: #e3bc4b;
      border: 1.5px solid #c59b27;
      border-radius: 999px;
      padding: 9px 14px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
    }

    @media (max-width: 960px) {
      .kek-mobile-sidebar-btn {
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

  document.body.classList.add("kek-has-left-nav");

  const sidebar = document.createElement("nav");
  sidebar.className = "kek-left-sidebar";
  sidebar.setAttribute("aria-label", "Chambers Navigation");
  sidebar.innerHTML = `
    <div class="kek-left-sidebar-title">Sanctuary Chambers</div>
    <div class="kek-left-nav-links">
      <a href="index.html?chamber=about" class="kek-left-chamber-link">Who We Are</a>
      <a href="index.html?chamber=goshen-pillars" class="kek-left-chamber-link">Goshen 8 Pillars</a>
      <a href="index.html?chamber=courtroom-101" class="kek-left-chamber-link">Courts 101</a>
      <a href="index.html?chamber=resources" class="kek-left-chamber-link">Documents</a>
      <a href="index.html?chamber=forms" class="kek-left-chamber-link">Intake Forms</a>
    </div>
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "kek-mobile-sidebar-btn";
  toggleBtn.textContent = "☰ Chambers";
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.body.insertBefore(toggleBtn, document.body.firstChild);
  document.body.insertBefore(sidebar, document.body.firstChild);
})();
