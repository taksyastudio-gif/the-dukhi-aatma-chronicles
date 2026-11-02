/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - CONFESSION ENGINE & SEVEN-STAGE NO LOGIC
   Non-manipulative, playful, deeply respectful, fully accessible.
   ========================================================================== */

class ConfessionManager {
  constructor(options = {}) {
    this.stages = CONFIG.noStages;
    this.currentStageIndex = 0;
    this.onOutcome = options.onOutcome || null;
    this.container = document.getElementById('confession-interactive-container');

    this.init();
  }

  init() {
    this.renderInitialQuestion();
  }

  // Initial State: First Confession Screen
  renderInitialQuestion() {
    this.currentStageIndex = 0;
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="confession-actions" role="group" aria-label="Confession options">
        <button id="btn-confession-first-yes" class="btn-confession-yes" type="button">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          YES
        </button>
        <button id="btn-confession-first-no" class="btn-confession-no" type="button">
          NO
        </button>
      </div>
    `;

    document.getElementById('btn-confession-first-yes').addEventListener('click', () => {
      this.handleYesOutcome();
    });

    document.getElementById('btn-confession-first-no').addEventListener('click', () => {
      this.handleNoClick();
    });
  }

  // Handle NO button clicks: cycle through 7 stages
  handleNoClick() {
    if (window.audioController) {
      window.audioController.playNoGentle();
    }

    if (this.currentStageIndex >= this.stages.length) {
      // Reached past stage 7 -> Final Respectful NO
      this.handleRespectfulNoOutcome();
      return;
    }

    const currentStageData = this.stages[this.currentStageIndex];
    this.renderStage(currentStageData);
    this.currentStageIndex++;
  }

  // Render a specific playful stage
  renderStage(stageData) {
    if (!this.container) return;

    const isFinalStage = stageData.stage === 7;

    this.container.innerHTML = `
      <div class="no-stage-modal-wrap" role="region" aria-live="polite">
        <span class="stage-counter-pill">${stageData.badge}</span>
        <p class="stage-prompt-text">"${stageData.message}"</p>
        
        <div class="stage-actions">
          <button id="btn-stage-yes" class="btn-confession-yes" type="button">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            ${stageData.stage === 1 ? 'Actually, YES' : 'Change my mind to YES'}
          </button>
          
          <button id="btn-stage-no" class="btn-confession-no" type="button">
            ${isFinalStage ? 'I still respect my NO' : 'Still NO'}
          </button>
        </div>

        <div class="direct-decline-wrap">
          <button id="btn-direct-exit" class="btn-direct-decline" type="button" aria-label="End conversation and confirm no">
            No, I mean it — end proposal respectfully
          </button>
        </div>
      </div>
    `;

    // Hook listeners
    document.getElementById('btn-stage-yes').addEventListener('click', () => {
      this.handleYesOutcome();
    });

    document.getElementById('btn-stage-no').addEventListener('click', () => {
      if (isFinalStage) {
        this.handleRespectfulNoOutcome();
      } else {
        this.handleNoClick();
      }
    });

    document.getElementById('btn-direct-exit').addEventListener('click', () => {
      this.handleRespectfulNoOutcome();
    });

    // Focus on the stage container for keyboard/screen reader accessibility
    const stageWrap = this.container.querySelector('.no-stage-modal-wrap');
    if (stageWrap) {
      stageWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // YES Outcome Celebration
  handleYesOutcome() {
    if (window.audioController) {
      window.audioController.playYesCelebration();
    }

    if (this.onOutcome) {
      this.onOutcome('YES');
    }
  }

  // Respectful NO Outcome
  handleRespectfulNoOutcome() {
    if (this.onOutcome) {
      this.onOutcome('NO');
    }
  }

  // Jump directly to a stage for testing
  jumpToStage(stageNumber) {
    if (stageNumber < 1 || stageNumber > 7) {
      this.renderInitialQuestion();
      return;
    }
    this.currentStageIndex = stageNumber - 1;
    this.renderStage(this.stages[this.currentStageIndex]);
    this.currentStageIndex++;
  }
}

window.ConfessionManager = ConfessionManager;
