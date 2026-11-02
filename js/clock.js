/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - NEPAL STANDARD TIME CLOCK & COUNTDOWN ENGINE
   Target: 3 November 2026, 00:00:00 Nepal Standard Time (UTC+05:45)
   Target UTC Epoch ms: 1793643300000
   ========================================================================== */

class NepalCountdownEngine {
  constructor(options = {}) {
    this.targetTimestamp = CONFIG.targetTimestampUTC;
    this.onTick = options.onTick || null;
    this.onMidnightReached = options.onMidnightReached || null;
    this.onStatusChange = options.onStatusChange || null;

    // Clock synchronization state
    this.serverOffsetMs = 0; // Difference between server time and local Date.now()
    this.isSyncedWithServer = false;
    this.timerId = null;
    this.hasUnlocked = false;

    // Test mode overrides
    this.testModeActive = false;
    this.testSimulatedRemainingMs = null;
    this.testStartTime = null;

    this.init();
  }

  async init() {
    this.checkUrlParams();
    await this.syncWithTimeSource();
    this.startCountdownLoop();
    this.setupVisibilityHandler();
  }

  // Check URL parameters for easy testing: ?test=5s or ?test=midnight or ?test=post
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('test')) {
      const mode = params.get('test');
      if (mode === '5s') {
        this.enableTestCountdown(5);
      } else if (mode === '10s') {
        this.enableTestCountdown(10);
      } else if (mode === 'midnight' || mode === 'post') {
        this.enableTestUnlocked();
      }
    }
  }

  // Attempt to synchronize with public HTTPS time sources with graceful fallback
  async syncWithTimeSource() {
    if (this.onStatusChange) {
      this.onStatusChange({ status: 'syncing', label: 'Syncing with Nepal Standard Time...' });
    }

    try {
      // Fast lightweight fetch to a free time API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second safety timeout

      const response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kathmandu", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        // data.utc_datetime or data.unixtime (seconds)
        const serverUtcMs = data.unixtime ? data.unixtime * 1000 : new Date(data.utc_datetime).getTime();
        const localNowMs = Date.now();
        this.serverOffsetMs = serverUtcMs - localNowMs;
        this.isSyncedWithServer = true;

        if (this.onStatusChange) {
          this.onStatusChange({
            status: 'synced',
            label: 'Synchronized with Nepal Standard Time (UTC+05:45)'
          });
        }
        return;
      }
    } catch (e) {
      // Network blocked, offline, or timed out - fall back gracefully
    }

    // Graceful Fallback: Local clock converted directly to UTC ms
    this.serverOffsetMs = 0;
    this.isSyncedWithServer = false;
    if (this.onStatusChange) {
      this.onStatusChange({
        status: 'fallback',
        label: 'Nepal Standard Time (Local Device Clock UTC+05:45)'
      });
    }
  }

  // Calculate current exact Nepal time in UTC milliseconds
  getCurrentUtcMs() {
    if (this.testModeActive) {
      if (this.testSimulatedRemainingMs !== null) {
        const elapsed = Date.now() - this.testStartTime;
        return this.targetTimestamp - Math.max(0, this.testSimulatedRemainingMs - elapsed);
      }
      return this.targetTimestamp + 1000; // Post-midnight
    }
    return Date.now() + this.serverOffsetMs;
  }

  // Calculate remaining time components
  getRemaining() {
    const currentMs = this.getCurrentUtcMs();
    const diffMs = this.targetTimestamp - currentMs;

    if (diffMs <= 0) {
      return {
        isMidnight: true,
        diffMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      isMidnight: false,
      diffMs,
      days,
      hours,
      minutes,
      seconds
    };
  }

  startCountdownLoop() {
    const tick = () => {
      const remaining = this.getRemaining();

      if (this.onTick) {
        this.onTick(remaining);
      }

      if (remaining.isMidnight && !this.hasUnlocked) {
        this.hasUnlocked = true;
        if (this.onMidnightReached) {
          this.onMidnightReached();
        }
      }
    };

    // Run first tick immediately
    tick();

    // Use setInterval with 250ms interval to prevent second-skips or clock drift
    this.timerId = setInterval(tick, 250);
  }

  // Handle mobile app sleep / tab backgrounding
  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Tab came back to foreground: immediately recalculate time
        const remaining = this.getRemaining();
        if (this.onTick) {
          this.onTick(remaining);
        }
        if (remaining.isMidnight && !this.hasUnlocked) {
          this.hasUnlocked = true;
          if (this.onMidnightReached) {
            this.onMidnightReached();
          }
        }
      }
    });
  }

  // Testing Hook: Set remaining countdown seconds (e.g. 10s before midnight)
  enableTestCountdown(secondsRemaining = 10) {
    this.testModeActive = true;
    this.hasUnlocked = false;
    this.testSimulatedRemainingMs = secondsRemaining * 1000;
    this.testStartTime = Date.now();
    if (this.onStatusChange) {
      this.onStatusChange({
        status: 'test',
        label: `Test Mode: ${secondsRemaining}s before Midnight`
      });
    }
  }

  // Testing Hook: Simulate post-midnight / unlocked state
  enableTestUnlocked() {
    this.testModeActive = true;
    this.testSimulatedRemainingMs = 0;
    this.testStartTime = Date.now();
    if (this.onStatusChange) {
      this.onStatusChange({
        status: 'test',
        label: 'Test Mode: Unlocked Experience (Post-Midnight)'
      });
    }
    if (!this.hasUnlocked) {
      this.hasUnlocked = true;
      if (this.onMidnightReached) {
        this.onMidnightReached();
      }
    }
  }

  // Reset back to live time
  resetToLiveTime() {
    this.testModeActive = false;
    this.testSimulatedRemainingMs = null;
    this.testStartTime = null;
    this.hasUnlocked = false;
    this.syncWithTimeSource();
  }
}

window.NepalCountdownEngine = NepalCountdownEngine;
