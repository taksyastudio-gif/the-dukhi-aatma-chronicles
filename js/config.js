/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - CONFIGURATION & CONSTANTS
   Target: Alsesha Shakya ("Dukhi Aatma")
   Midnight Nepal Target: 3 November 2026, 00:00:00 (Asia/Kathmandu UTC+05:45)
   ========================================================================== */

const CONFIG = {
  // Target Time Settings
  targetYear: 2026,
  targetMonth: 10, // 0-indexed in JS Date.UTC (10 = November)
  targetDay: 3,
  targetHour: 0,
  targetMinute: 0,
  targetSecond: 0,
  nepalOffsetMinutes: 345, // UTC+05:45

  // Exact target timestamp in UTC epoch milliseconds:
  // Date.UTC(2026, 10, 3, 0, 0, 0) - (345 * 60 * 1000) = 1793643300000 ms
  // which corresponds to 2026-11-02T18:15:00.000Z
  targetTimestampUTC: 1793643300000,

  // Recipient Identity
  recipientName: "Alsesha Shakya",
  recipientNickname: "Dukhi Aatma",

  // LocalStorage Keys
  storageKeys: {
    audioEnabled: "dukhi_aatma_audio_pref",
    viewState: "dukhi_aatma_view_state",
    confessionOutcome: "dukhi_aatma_outcome"
  },

  // Seven-Stage Playful NO Sequence
  noStages: [
    {
      stage: 1,
      badge: "Stage 1 of 7 • A gentle pause",
      message: "Wait... are you sure? I rehearsed this question at least once."
    },
    {
      stage: 2,
      badge: "Stage 2 of 7 • The plot thickens",
      message: "Dukhi Aatma, that was unexpectedly devastating for my little plan."
    },
    {
      stage: 3,
      badge: "Stage 3 of 7 • Checking in",
      message: "Okay, okay. I promise I'm being serious. Still a no?"
    },
    {
      stage: 4,
      badge: "Stage 4 of 7 • Vulnerability check",
      message: "Plot twist: I actually gathered courage to ask this."
    },
    {
      stage: 5,
      badge: "Stage 5 of 7 • Deep breath",
      message: "One final dramatic pause. Think about it, but only if you want to."
    },
    {
      stage: 6,
      badge: "Stage 6 of 7 • The home stretch",
      message: "Almost at the end of this little adventure. Your answer is still yours."
    },
    {
      stage: 7,
      badge: "Stage 7 of 7 • The gentle resolution",
      message: "Alright. No more dramatic questioning. I respect your answer."
    }
  ],

  // Free HTTPS Time Source APIs with graceful fallback
  timeAPIs: [
    "https://worldtimeapi.org/api/timezone/Asia/Kathmandu",
    "https://timeapi.io/api/time/current/zone?timeZone=Asia/Kathmandu"
  ]
};

// Freeze configuration
Object.freeze(CONFIG);
