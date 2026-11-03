/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - CONFIGURATION & CONSTANTS
   Target: Alsesha Shakya ("Dukhi Aatma")
   Timezone: Asia/Kathmandu (UTC+05:45)
   ========================================================================== */

const CONFIG = {
  // Target Time Settings (Nepal Standard Time)
  targetYear: 2026,
  targetMonth: 10, // 0-indexed: 0=Jan, 10=Nov
  targetDay: 4,    // Set to your desired date (e.g. 4 for Nov 4, 5 for Nov 5, etc.)
  targetHour: 0,   // Midnight: 00:00:00
  targetMinute: 0,
  targetSecond: 0,
  nepalOffsetMinutes: 345, // UTC+05:45

  // Display date text in titles & timeline
  displayDateText: "Coming Soon", // Automatically updated or formatted

  // Notification & Feedback Settings
  userWhatsAppNumber: "", // e.g. "9779800000000"
  webhookUrl: "", // Optional webhook (Discord, Formspree, etc.)

  // Recipient Identity
  recipientName: "Alsesha Shakya",
  recipientNickname: "Dukhi Aatma",

  // LocalStorage Keys
  storageKeys: {
    audioEnabled: "dukhi_aatma_audio_pref",
    viewState: "dukhi_aatma_view_state",
    confessionOutcome: "dukhi_aatma_outcome",
    choiceAuditLog: "dukhi_aatma_choice_audit"
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

// Calculate exact target UTC milliseconds dynamically:
// Date.UTC(targetYear, targetMonth, targetDay, targetHour, targetMinute, targetSecond) - (345 * 60 * 1000)
CONFIG.targetTimestampUTC = Date.UTC(
  CONFIG.targetYear,
  CONFIG.targetMonth,
  CONFIG.targetDay,
  CONFIG.targetHour,
  CONFIG.targetMinute,
  CONFIG.targetSecond
) - (CONFIG.nepalOffsetMinutes * 60 * 1000);

// Format human readable date display
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
CONFIG.displayDateFormatted = `${monthNames[CONFIG.targetMonth]} ${CONFIG.targetDay}`;

// Freeze configuration
Object.freeze(CONFIG);
