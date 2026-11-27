(function () {
  if (window.__KEK_RADIO_INITIALIZED__) return;
  window.__KEK_RADIO_INITIALIZED__ = true;

  // =========================================================================
  // 1. 100% FREE GOOGLE CLOUD / GOOGLE DRIVE WATCH AUDIO STREAMS (STRICT HTTPS)
  // =========================================================================
  // Replace URLs below with your public Google Cloud Storage bucket links:
  //   https://storage.googleapis.com/YOUR_BUCKET_NAME/watch-01.mp3
  // Or direct Google Drive links:
  //   https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
  const GOOGLE_CLOUD_WATCH_STREAMS = {
    1: {
      title: "1st Watch: Midnight Courts & Gates (00:00–03:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-01-midnight-courts.mp3"
    },
    2: {
      title: "2nd Watch: Breaking & Dawn Legislation (03:00–06:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-02-dawn-legislation.mp3"
    },
    3: {
      title: "3rd Watch: Morning Alignment & Scroll (06:00–09:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-03-morning-scroll.mp3"
    },
    4: {
      title: "4th Watch: Marketplace & Goshen Mandate (09:00–12:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-04-goshen-mandate.mp3"
    },
    5: {
      title: "5th Watch: Noon Altar & Melchizedek Order (12:00–15:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-05-melchizedek-order.mp3"
    },
    6: {
      title: "6th Watch: 3:00 PM Hour of Prayer & Decrees (15:00–18:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-06-hour-of-prayer.mp3"
    },
    7: {
      title: "7th Watch: Evening Sacrifice & Family Altar (18:00–21:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-07-evening-sacrifice.mp3"
    },
    8: {
      title: "8th Watch: Night Threshold & Territorial Shield (21:00–00:00 EAT)",
      url: "https://storage.googleapis.com/kek-sanctuary-audio/watch-08-night-threshold.mp3"
    }
  };

  // Optional Free YouTube Live Watch Hub Link (for live Zoom/YouTube altar sessions)
  const FREE_LIVE_WATCH_HUB_URL = "watch-hub.html";

  const STORAGE_KEYS = {
    muted: "kek_radio_muted",
    volume: "kek_radio_volume",
    selectedWatch: "kek_radio_selected_watch" // "auto" or "1".."8"
  };

  function enforceHttps(url) {
    if (!url) return "";
    return url.trim().replace(/^http:\/\//i, "https://");
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

    const watchIndex = Math.floor(eatHour / 3) + 1; // 1..8
    const jerWatchIndex = Math.floor(jerHour / 3) + 1;
    const isPeakCorporateWatch = eatHour === 15 || eatHour === 0; // 3:00 PM & Midnight EAT

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

  // =========================================================================
  // 2. INJECT FOOTER RADIO PLAYER STYLES
  // =========================================================================
  if (!document.getElementById("kek-radio-bar-styles")) {
    const style = document.createElement("style");
    style.id = "kek-radio-bar-styles";
    style.textContent = `
      body {
        padding-bottom: 74px;
      }

      .kek-radio-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1450;
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
          left: 284px;
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

      .kek-radio-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

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
        transition: transform 0.15s ease, opacity 0.15s ease;
      }

      .kek-radio-btn:hover {
        transform: translateY(-1px);
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
        transition: all 0.15s ease;
      }

      .kek-radio-btn-secondary:hover {
        border-color: #e3bc4b;
        color: #e3bc4b;
      }

      .kek-radio-status-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1;
      }

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

      .kek-radio-meta strong {
        color: #e3bc4b;
      }

      .kek-radio-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .kek-radio-vol {
        width: 78px;
        accent-color: #c59b27;
        cursor: pointer;
      }

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
        body {
          padding-bottom: 104px;
        }
        .kek-radio-vol {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================================
  // 3. BUILD PERSISTENT FOOTER AUDIO ENGINE
  // =========================================================================
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
        <a href="${FREE_LIVE_WATCH_HUB_URL}" class="kek-radio-btn-secondary" title="Open Live YouTube & Watch Room">📺 Watch Hub</a>
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

  const savedVol = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
  if (!Number.isNaN(savedVol) && savedVol >= 0 && savedVol <= 1) {
    audio.volume = savedVol;
    volSlider.value = String(savedVol);
  } else {
    audio.volume = 0.85;
  }

  audio.muted = localStorage.getItem(STORAGE_KEYS.muted) === "1";
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";

  const savedWatchChoice = localStorage.getItem(STORAGE_KEYS.selectedWatch) || "auto";
  watchSelect.value = savedWatchChoice;

  function getSelectedStream(info) {
    const choice = watchSelect.value;
    if (choice !== "auto" && GOOGLE_CLOUD_WATCH_STREAMS[choice]) {
      return {
        watchNumber: parseInt(choice, 10),
        ...GOOGLE_CLOUD_WATCH_STREAMS[choice]
      };
    }
    return {
      watchNumber: info.watchIndex,
      ...info.stream
    };
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
    const streamUrl = enforceHttps(activeStream.url);

    setStatus(false, "● CONNECTING CLOUD...");
    audio.src = streamUrl;
    audio.load();

    audio
      .play()
      .then(() => {
        playBtn.textContent = "⏸ Pause Radio";
        setStatus(false, `● ON AIR • WATCH ${activeStream.watchNumber}`);
        updateClockAndWatchDisplay();
      })
      .catch((err) => {
        playBtn.textContent = "▶ Listen 24/7";
        setStatus(true, "● STREAM STANDBY — UPLOAD MP3");
        console.warn("KEK Google Cloud Radio notice:", err);
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

  audio.addEventListener("ended", () => {
    // Seamlessly advance to whichever watch is active when the track finishes
    loadAndPlay();
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      loadAndPlay();
    } else {
      pauseRadio();
    }
  });

  reconnectBtn.addEventListener("click", () => {
    loadAndPlay();
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    localStorage.setItem(STORAGE_KEYS.muted, audio.muted ? "1" : "0");
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  });

  volSlider.addEventListener("input", () => {
    const val = parseFloat(volSlider.value);
    audio.volume = val;
    localStorage.setItem(STORAGE_KEYS.volume, String(val));
    if (val > 0 && audio.muted) {
      audio.muted = false;
      muteBtn.textContent = "🔊";
    }
  });

  watchSelect.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEYS.selectedWatch, watchSelect.value);
    if (!audio.paused) {
      loadAndPlay();
    } else {
      updateClockAndWatchDisplay();
    }
  });

  window.KEKRadio = {
    play: (watchNum) => {
      if (watchNum) {
        watchSelect.value = String(watchNum);
        localStorage.setItem(STORAGE_KEYS.selectedWatch, String(watchNum));
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
