(function () {
  const path = (window.location.pathname || "").toLowerCase();
  const isMainPage = path.endsWith("/") || path.endsWith("/index.html") || path === "index.html";
  if (isMainPage) return;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --kek-right-col-w: 236px;
    }

    @media (min-width: 961px) {
      body.kek-right-col-active {
        padding-right: var(--kek-right-col-w);
      }

      /* Hide the duplicate top row nav/links on subpages so navigation lives in the right column */
      body.kek-right-col-active header nav,
      body.kek-right-col-active header .nav-links {
        display: none !important;
      }
    }

    .kek-shared-return-bar {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: auto;
      width: var(--kek-right-col-w);
      z-index: 1400;
      background: rgba(7, 16, 32, 0.98);
      border-left: 1.5px solid rgba(197, 155, 39, 0.55);
      border-right: none;
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 8px;
      overflow-y: auto;
      font-family: 'Montserrat', sans-serif;
      box-shadow: -6px 0 22px rgba(0, 0, 0, 0.25);
      transition: transform 0.2s ease;
    }

    .kek-shared-col-heading {
      font-family: 'Cinzel', serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #e3bc4b;
      padding: 4px 10px 10px;
      margin-bottom: 4px;
      border-bottom: 1px solid rgba(197, 155, 39, 0.28);
    }

    .kek-shared-return-links {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
    }

    .kek-shared-chamber-link {
      display: block;
      color: #e2e8f0;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 9px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.02);
      transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }

    .kek-shared-chamber-link:hover {
      color: #e3bc4b;
      border-color: #c59b27;
      background: rgba(197, 155, 39, 0.14);
    }

    .kek-right-col-toggle {
      display: none;
      position: fixed;
      bottom: 18px;
      right: 18px;
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
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    }

    @media (max-width: 960px) {
      .kek-right-col-toggle {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .kek-shared-return-bar {
        transform: translateX(100%);
      }

      .kek-shared-return-bar.is-open {
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);

  document.body.classList.add("kek-right-col-active");

  const bar = document.createElement("nav");
  bar.className = "kek-shared-return-bar";
  bar.setAttribute("aria-label", "Chambers Navigation Column");
  bar.innerHTML = `
    <div class="kek-shared-col-heading">Chambers</div>
    <div class="kek-shared-return-links">
      <a href="index.html?chamber=about" class="kek-shared-chamber-link">Who We Are</a>
      <a href="index.html?chamber=goshen-pillars" class="kek-shared-chamber-link">Goshen 8 Pillars</a>
      <a href="index.html?chamber=courtroom-101" class="kek-shared-chamber-link">Courts 101</a>
      <a href="index.html?chamber=resources" class="kek-shared-chamber-link">Documents</a>
      <a href="index.html?chamber=forms" class="kek-shared-chamber-link">Intake Forms</a>
    </div>
  `;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "kek-right-col-toggle";
  toggleBtn.textContent = "☰ Chambers";
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const isOpen = bar.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  bar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      bar.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.body.insertBefore(bar, document.body.firstChild);
  document.body.appendChild(toggleBtn);
})();
