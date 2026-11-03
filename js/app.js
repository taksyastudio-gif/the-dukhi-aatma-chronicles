/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - MAIN APPLICATION ORCHESTRATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const views = {
    countdown: document.getElementById('view-countdown'),
    opening: document.getElementById('view-opening'),
    birthday: document.getElementById('view-birthday'),
    confession: document.getElementById('view-confession'),
    outcomeYes: document.getElementById('view-outcome-yes'),
    outcomeNo: document.getElementById('view-outcome-no')
  };

  // Countdown DOM targets
  const digitDays = document.getElementById('val-days');
  const digitHours = document.getElementById('val-hours');
  const digitMinutes = document.getElementById('val-minutes');
  const digitSeconds = document.getElementById('val-seconds');
  const clockStatusText = document.getElementById('clock-status-label');

  // Audio Controls
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioStatusText = document.getElementById('audio-status-text');

  // Envelope Controls
  const envelopeStage = document.getElementById('envelope-stage');
  const btnOpenSurprise = document.getElementById('btn-open-surprise');

  // Confession and navigation buttons
  const btnProceedConfession = document.getElementById('btn-proceed-confession');
  const btnReturnBirthdayFromYes = document.getElementById('btn-return-birthday-yes');
  const btnReturnBirthdayFromNo = document.getElementById('btn-return-birthday-no');

  // Test Drawer Elements
  const devTestTrigger = document.getElementById('dev-test-trigger');
  const devTestPanel = document.getElementById('dev-test-panel');
  const devCloseBtn = document.getElementById('dev-panel-close');

  let currentActiveView = 'countdown';

  // 1. Switch View Helper
  function switchView(viewName) {
    if (!views[viewName]) return;

    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.remove('active');
      }
    });

    views[viewName].classList.add('active');
    currentActiveView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 2. Audio Control Setup
  function updateAudioButtonUI(isPlaying) {
    if (!btnAudioToggle) return;
    if (isPlaying) {
      btnAudioToggle.classList.add('playing');
      btnAudioToggle.setAttribute('aria-label', 'Sound is currently ON. Click to mute.');
      if (audioStatusText) audioStatusText.textContent = 'Mute';
    } else {
      btnAudioToggle.classList.remove('playing');
      btnAudioToggle.setAttribute('aria-label', 'Sound is currently MUTED. Click to turn sound ON.');
      if (audioStatusText) audioStatusText.textContent = 'Sound';
    }
  }

  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      window.audioController.toggleSound((isPlaying) => {
        updateAudioButtonUI(isPlaying);
      });
    });
  }

  // 3. Initialize Clock & Countdown Engine
  const clockEngine = new window.NepalCountdownEngine({
    onTick: (remaining) => {
      if (digitDays) digitDays.textContent = String(remaining.days).padStart(2, '0');
      if (digitHours) digitHours.textContent = String(remaining.hours).padStart(2, '0');
      if (digitMinutes) digitMinutes.textContent = String(remaining.minutes).padStart(2, '0');
      if (digitSeconds) digitSeconds.textContent = String(remaining.seconds).padStart(2, '0');
    },
    onMidnightReached: () => {
      // Midnight unlocked: Transition from countdown to Opening envelope view!
      if (currentActiveView === 'countdown') {
        setTimeout(() => {
          switchView('opening');
          showToast('✨ Midnight has arrived in Nepal. Happy Birthday, Alsesha!');
          if (window.audioController && !window.audioController.isMuted) {
            window.audioController.playCelestialArpeggio();
          }
        }, 800);
      }
    },
    onStatusChange: (statusInfo) => {
      if (clockStatusText) {
        clockStatusText.textContent = statusInfo.label;
      }
    }
  });

  // Check initial state: if already past midnight on first load, immediately show envelope or birthday
  const initialRemaining = clockEngine.getRemaining();
  if (initialRemaining.isMidnight) {
    switchView('opening');
  } else {
    switchView('countdown');
  }

  // 4. Envelope Reveal Animation
  function openEnvelopeExperience() {
    if (!envelopeStage) return;

    if (window.audioController) {
      window.audioController.playEnvelopeOpen();
    }

    envelopeStage.classList.add('opened');

    setTimeout(() => {
      switchView('birthday');
    }, 1100);
  }

  if (btnOpenSurprise) {
    btnOpenSurprise.addEventListener('click', openEnvelopeExperience);
  }
  if (envelopeStage) {
    envelopeStage.addEventListener('click', openEnvelopeExperience);
  }

  // 5. Birthday to Confession Transition
  if (btnProceedConfession) {
    btnProceedConfession.addEventListener('click', () => {
      switchView('confession');
      if (window.confessionManager) {
        window.confessionManager.renderInitialQuestion();
      }
    });
  }

  // 6. Return to Birthday from Outcomes
  if (btnReturnBirthdayFromYes) {
    btnReturnBirthdayFromYes.addEventListener('click', () => {
      switchView('birthday');
    });
  }
  if (btnReturnBirthdayFromNo) {
    btnReturnBirthdayFromNo.addEventListener('click', () => {
      switchView('birthday');
    });
  }

  // 7. Confession Manager
  window.confessionManager = new window.ConfessionManager({
    onOutcome: (outcome) => {
      if (outcome === 'YES') {
        switchView('outcomeYes');
        launchCelebrationParticles();
      } else if (outcome === 'NO') {
        switchView('outcomeNo');
      }
      updateDevAuditDisplay();
    }
  });

  // Dynamic date labels update from CONFIG
  document.querySelectorAll('.date-display-label').forEach(el => {
    el.textContent = CONFIG.displayDateFormatted || "November 4";
  });

  // =========================================================================
  // AUTO-SCROLL ENGINE & GUIDED READING
  // =========================================================================
  const btnToggleAutoScroll = document.getElementById('btn-toggle-autoscroll');
  const autoscrollBtnLabel = document.getElementById('autoscroll-btn-label');
  const btnScrollTimeline = document.getElementById('btn-scroll-timeline');
  let isAutoScrolling = false;
  let autoScrollRafId = null;

  function stopAutoScroll() {
    if (!isAutoScrolling) return;
    isAutoScrolling = false;
    if (autoScrollRafId) {
      cancelAnimationFrame(autoScrollRafId);
      autoScrollRafId = null;
    }
    if (btnToggleAutoScroll) {
      btnToggleAutoScroll.classList.remove('active');
    }
    if (autoscrollBtnLabel) {
      autoscrollBtnLabel.textContent = 'Auto-Scroll Story';
    }
  }

  function startAutoScroll() {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    if (btnToggleAutoScroll) {
      btnToggleAutoScroll.classList.add('active');
    }
    if (autoscrollBtnLabel) {
      autoscrollBtnLabel.textContent = '⏸️ Pause Auto-Scroll';
    }

    let lastTime = performance.now();
    const scrollSpeed = 40; // pixels per second

    function step(currentTime) {
      if (!isAutoScrolling) return;
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        stopAutoScroll();
        return;
      }

      window.scrollBy(0, scrollSpeed * deltaTime);
      autoScrollRafId = requestAnimationFrame(step);
    }

    autoScrollRafId = requestAnimationFrame(step);
  }

  if (btnToggleAutoScroll) {
    btnToggleAutoScroll.addEventListener('click', () => {
      if (isAutoScrolling) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });
  }

  // User manual scroll or touch pauses auto-scroll naturally
  window.addEventListener('wheel', () => stopAutoScroll(), { passive: true });
  window.addEventListener('touchstart', () => stopAutoScroll(), { passive: true });

  if (btnScrollTimeline) {
    btnScrollTimeline.addEventListener('click', () => {
      const target = document.getElementById('timeline-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // =========================================================================
  // INTERACTIVE BIRTHDAY CANDLE ("MAKE A WISH")
  // =========================================================================
  const candleStage = document.getElementById('candle-stage');
  const wishUnlockedCard = document.getElementById('wish-unlocked-card');

  if (candleStage) {
    candleStage.addEventListener('click', () => {
      if (candleStage.classList.contains('blown')) return;
      candleStage.classList.add('blown');

      if (window.audioController) {
        window.audioController.playCelestialArpeggio();
      }

      // Sparkles around candle
      const rect = candleStage.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'celebration-sparkle';
        const size = Math.random() * 6 + 3;
        p.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: #fbbf24;
          left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px;
          top: ${rect.top + 20 + (Math.random() - 0.5) * 40}px;
          pointer-events: none;
          box-shadow: 0 0 10px #fbbf24;
          animation: floatSparkle 1.6s ease-out forwards;
          z-index: 100;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1600);
      }

      setTimeout(() => {
        if (wishUnlockedCard) {
          wishUnlockedCard.classList.add('show');
        }
      }, 400);
    });
  }
  function setupWhatsAppLinks() {
    const btnYes = document.getElementById('btn-send-whatsapp-yes');
    const btnNo = document.getElementById('btn-send-whatsapp-no');

    const yesText = encodeURIComponent("Hey! I just opened the Dukhi Aatma Chronicles midnight surprise... and it's a YES! ✨💫");
    const noText = encodeURIComponent("Hey, thank you so much for the thoughtful midnight birthday letter and surprise. It means a lot to me 🤍");

    const phone = CONFIG.userWhatsAppNumber ? CONFIG.userWhatsAppNumber.replace(/\D/g, '') : '';
    const baseYesUrl = phone ? `https://wa.me/${phone}?text=${yesText}` : `https://api.whatsapp.com/send?text=${yesText}`;
    const baseNoUrl = phone ? `https://wa.me/${phone}?text=${noText}` : `https://api.whatsapp.com/send?text=${noText}`;

    if (btnYes) btnYes.href = baseYesUrl;
    if (btnNo) btnNo.href = baseNoUrl;
  }
  setupWhatsAppLinks();

  // Update Laptop Dev Audit Display
  function updateDevAuditDisplay() {
    const display = document.getElementById('dev-audit-display');
    if (!display) return;
    try {
      const saved = localStorage.getItem(CONFIG.storageKeys.choiceAuditLog);
      if (saved) {
        const data = JSON.parse(saved);
        display.innerHTML = `
          <strong>First Pick:</strong> ${data.firstPick || 'None'}<br>
          <strong>Final Decision:</strong> ${data.finalPick || 'Pending'}<br>
          <strong>Stages Visited:</strong> ${data.stagesVisited ? data.stagesVisited.length : 0}
        `;
      } else {
        display.textContent = 'No choices made yet.';
      }
    } catch (e) {
      display.textContent = 'Unable to read audit.';
    }
  }

  // 8. Celebration Particle Launcher for YES screen
  function launchCelebrationParticles() {
    const container = document.getElementById('view-outcome-yes');
    if (!container) return;

    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'celebration-sparkle';
      const size = Math.random() * 8 + 4;
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${['#f472b6', '#c4b5fd', '#fef08a', '#ffffff'][Math.floor(Math.random() * 4)]};
        left: ${Math.random() * 90 + 5}%;
        top: ${Math.random() * 80 + 10}%;
        pointer-events: none;
        opacity: 0;
        box-shadow: 0 0 10px currentColor;
        animation: floatSparkle ${Math.random() * 2 + 1.5}s ease-in-out forwards;
      `;
      container.appendChild(p);

      setTimeout(() => p.remove(), 3500);
    }
  }

  // Inject sparkle keyframes dynamically
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes floatSparkle {
      0% { opacity: 0; transform: translateY(20px) scale(0.5); }
      50% { opacity: 1; transform: translateY(-30px) scale(1.2); }
      100% { opacity: 0; transform: translateY(-70px) scale(0.8); }
    }
  `;
  document.head.appendChild(styleEl);

  // 9. Toast Notification Helper
  function showToast(msg) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // 10. QA & Interactive Dev Test Drawer
  // Completely hidden unless explicitly requested with ?dev=true or ?qa=1 or secret shortcut Alt+T
  const urlParams = new URLSearchParams(window.location.search);
  const isDevExplicit = urlParams.has('dev') || urlParams.has('qa') || urlParams.has('test');

  if (isDevExplicit) {
    document.body.classList.add('dev-mode-active');
  }

  // Keyboard shortcut toggle on desktop: Alt + T or Ctrl + Shift + T
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') || (e.altKey && e.key.toLowerCase() === 't')) {
      e.preventDefault();
      document.body.classList.toggle('dev-mode-active');
      if (devTestPanel) {
        devTestPanel.classList.toggle('open');
        updateDevAuditDisplay();
      }
    }
  });

  if (devTestTrigger && devTestPanel) {
    devTestTrigger.addEventListener('click', () => {
      devTestPanel.classList.toggle('open');
      updateDevAuditDisplay();
    });

    if (devCloseBtn) {
      devCloseBtn.addEventListener('click', () => {
        devTestPanel.classList.remove('open');
      });
    }

    // Test Actions
    document.querySelectorAll('[data-test-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-test-action');

        switch (action) {
          case 'countdown-5s':
            clockEngine.enableTestCountdown(5);
            switchView('countdown');
            showToast('Simulating: 5s until midnight Nepal time');
            break;
          case 'countdown-10s':
            clockEngine.enableTestCountdown(10);
            switchView('countdown');
            showToast('Simulating: 10s until midnight Nepal time');
            break;
          case 'trigger-midnight':
            clockEngine.enableTestUnlocked();
            switchView('opening');
            showToast('Triggered midnight unlock!');
            break;
          case 'view-envelope':
            switchView('opening');
            if (envelopeStage) envelopeStage.classList.remove('opened');
            break;
          case 'view-birthday':
            switchView('birthday');
            break;
          case 'view-confession':
            switchView('confession');
            if (window.confessionManager) window.confessionManager.renderInitialQuestion();
            break;
          case 'view-stage-1':
            switchView('confession');
            if (window.confessionManager) window.confessionManager.jumpToStage(1);
            break;
          case 'view-stage-4':
            switchView('confession');
            if (window.confessionManager) window.confessionManager.jumpToStage(4);
            break;
          case 'view-stage-7':
            switchView('confession');
            if (window.confessionManager) window.confessionManager.jumpToStage(7);
            break;
          case 'view-yes':
            switchView('outcomeYes');
            launchCelebrationParticles();
            break;
          case 'view-no':
            switchView('outcomeNo');
            break;
          case 'reset-live':
            clockEngine.resetToLiveTime();
            showToast('Reset to Live Nepal Standard Time');
            break;
        }
      });
    });
  }
});
