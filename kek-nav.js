(function () {
  const path = (window.location.pathname || "").toLowerCase();
  const isMainPage = path.endsWith("/") || path.endsWith("/index.html") || path === "index.html";
  if (isMainPage) return;

  const style = document.createElement("style");
  style.textContent = `
    .kek-shared-return-bar {
      position: sticky;
      top: 0;
      z-index: 1400;
      background: rgba(7, 16, 32, 0.97);
      border-bottom: 1.5px solid rgba(197, 155, 39, 0.5);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
      font-family: 'Montserrat', sans-serif;
    }
    .kek-shared-return-links {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .kek-shared-home-btn {
      background: linear-gradient(135deg, #d4ab38 0%, #b5891b 100%);
      color: #0c1b33;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.78rem;
      padding: 6px 12px;
      border-radius: 6px;
    }
    .kek-shared-chamber-link {
      color: #e2e8f0;
      text-decoration: none;
      font-size: 0.76rem;
      font-weight: 600;
      padding: 5px 9px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.14);
    }
    .kek-shared-chamber-link:hover {
      color: #e3bc4b;
      border-color: #c59b27;
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement("nav");
  bar.className = "kek-shared-return-bar";
  bar.setAttribute("aria-label", "Main Page and Chambers Return Bar");
  bar.innerHTML = `
    <a href="index.html" class="kek-shared-home-btn">&larr; Main Hub (index.html)</a>
    <div class="kek-shared-return-links">
      <a href="index.html?chamber=about" class="kek-shared-chamber-link">Who We Are</a>
      <a href="index.html?chamber=goshen-pillars" class="kek-shared-chamber-link">Goshen 8 Pillars</a>
      <a href="index.html?chamber=courtroom-101" class="kek-shared-chamber-link">Courts 101</a>
      <a href="index.html?chamber=resources" class="kek-shared-chamber-link">Documents</a>
      <a href="index.html?chamber=forms" class="kek-shared-chamber-link">Intake Forms</a>
    </div>
  `;

  document.body.insertBefore(bar, document.body.firstChild);
})();
