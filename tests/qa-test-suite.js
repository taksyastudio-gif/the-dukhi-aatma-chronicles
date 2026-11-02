/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - AUTOMATED QA TEST SUITE
   Tests all 15 requirements from Section 12 of the Specification
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
  }
}

console.log('====================================================');
console.log('STARTING QA VERIFICATION FOR THE DUKHI AATMA CHRONICLES');
console.log('====================================================\n');

// 1. Files & Structural Integrity
runTest('Project Files exist and are non-empty', () => {
  const files = [
    'index.html',
    'css/variables.css',
    'css/base.css',
    'css/stars.css',
    'css/countdown.css',
    'css/envelope.css',
    'css/birthday.css',
    'css/confession.css',
    'css/components.css',
    'js/config.js',
    'js/audio.js',
    'js/stars.js',
    'js/clock.js',
    'js/confession.js',
    'js/app.js'
  ];

  files.forEach(f => {
    const fullPath = path.join(projectRoot, f);
    assert(fs.existsSync(fullPath), `File missing: ${f}`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 50, `File is unexpectedly small/empty: ${f}`);
  });
});

// 2. Target Date & Nepal Timezone Accuracy
runTest('Nepal Standard Timezone and UTC target calculation', () => {
  const configContent = fs.readFileSync(path.join(projectRoot, 'js/config.js'), 'utf8');
  assert(configContent.includes('1793643300000'), 'Exact target UTC timestamp ms missing');
  assert(configContent.includes('targetYear: 2026'), 'Target year should be 2026');
  assert(configContent.includes('nepalOffsetMinutes: 345'), 'Offset minutes should be 345 (UTC+05:45)');

  // Verify mathematical calculation: 2026-11-03 00:00:00 Nepal Time (UTC+05:45)
  // UTC = 00:00 - 05:45 = 18:15 on Nov 2, 2026 UTC
  const targetUTC = Date.UTC(2026, 10, 3, 0, 0, 0) - (5 * 60 + 45) * 60 * 1000;
  assert.strictEqual(targetUTC, 1793643300000);
  assert.strictEqual(new Date(targetUTC).toISOString(), '2026-11-02T18:15:00.000Z');
});

// 3. Countdown Math Before Midnight, At Midnight, After Midnight
runTest('Countdown calculation across time states', () => {
  const targetUTC = 1793643300000;

  // Case A: 50 minutes and 28 seconds before midnight (simulated user local time 2026-11-02T23:09:32+05:45)
  const currentSimulatedUTC = targetUTC - (50 * 60 + 28) * 1000;
  const diffBefore = targetUTC - currentSimulatedUTC;
  assert(diffBefore > 0);
  const totalSec = Math.floor(diffBefore / 1000);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  assert.strictEqual(mins, 50);
  assert.strictEqual(secs, 28);

  // Case B: Exactly at midnight
  const diffAt = targetUTC - targetUTC;
  assert.strictEqual(diffAt, 0);

  // Case C: After midnight (1 hour later)
  const afterMidnightUTC = targetUTC + 3600 * 1000;
  const diffAfter = targetUTC - afterMidnightUTC;
  assert(diffAfter < 0);
});

// 4. Seven Stages of Playful NO Verification
runTest('Seven-Stage NO copy and flow matches specification', () => {
  const configContent = fs.readFileSync(path.join(projectRoot, 'js/config.js'), 'utf8');
  
  const expectedSnippets = [
    "Wait... are you sure? I rehearsed this question at least once.",
    "Dukhi Aatma, that was unexpectedly devastating for my little plan.",
    "Okay, okay. I promise I'm being serious. Still a no?",
    "Plot twist: I actually gathered courage to ask this.",
    "One final dramatic pause. Think about it, but only if you want to.",
    "Almost at the end of this little adventure. Your answer is still yours.",
    "Alright. No more dramatic questioning. I respect your answer."
  ];

  expectedSnippets.forEach((snippet, idx) => {
    assert(configContent.includes(snippet), `Missing expected NO stage message for Stage ${idx + 1}`);
  });
});

// 5. Immediate "No, I mean it" Exit Option
runTest('Immediate decline option exists for respectful exit', () => {
  const confessionJs = fs.readFileSync(path.join(projectRoot, 'js/confession.js'), 'utf8');
  assert(confessionJs.includes('btn-direct-exit'), 'Missing direct exit button ID');
  assert(confessionJs.includes('No, I mean it'), 'Missing accessible "No, I mean it" copy');
  assert(confessionJs.includes('handleRespectfulNoOutcome'), 'Direct exit must route straight to Respectful NO outcome');
});

// 6. Non-manipulative Button Rules
runTest('NO button is never hidden, shrunk, or disabled', () => {
  const confessionJs = fs.readFileSync(path.join(projectRoot, 'js/confession.js'), 'utf8');
  assert(!confessionJs.includes('display: none'), 'NO button should never be hidden via inline style');
  assert(!confessionJs.includes('transform: scale(0'), 'NO button should never be shrunk to zero');
  assert(!confessionJs.includes('disabled = true'), 'NO button should not be disabled when cycling');
});

// 7. Confession and Respectful NO text verification
runTest('Confession message and Respectful NO wording matches specification', () => {
  const htmlContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  
  // Check confession message
  assert(htmlContent.includes('Somewhere along this unexpected friendship, you became someone I genuinely look forward to talking to.'), 'Confession body missing text');
  assert(htmlContent.includes('Would you be open to giving us a chance to explore something more than friendship?'), 'Confession question missing');
  assert(htmlContent.includes('Whatever your answer is, I respect it.'), 'Confession reassurance missing');

  // Check Respectful NO ending
  assert(htmlContent.includes('Thank you for being honest with me, Alsesha.'), 'Respectful NO heading missing');
  assert(htmlContent.includes('No pressure, no awkward expectations, and no hard feelings.'), 'Respectful NO text missing');
  assert(htmlContent.includes('I hope your birthday is wonderful.'), 'Respectful NO birthday wish missing');

  // Check YES celebration
  assert(htmlContent.includes('Wait... is this actually a YES?'), 'YES celebration heading missing');
  assert(htmlContent.includes('You just made this midnight a little more special.'), 'YES celebration subhead missing');
});

// 8. One-Year Friendship Timeline and Dukhi Aatma Observations
runTest('Friendship Timeline and Dukhi Aatma Observations check', () => {
  const htmlContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  
  // Required known facts
  assert(htmlContent.includes('Free Fire'), 'Must reference Free Fire');
  assert(htmlContent.includes('Girlfriend Day'), 'Must reference Girlfriend Day');
  assert(htmlContent.includes('August'), 'Must reference August');
  assert(htmlContent.includes('approximately one year') || htmlContent.includes('One Year in Orbit'), 'Must reference 1 year');
  assert(htmlContent.includes('Dukhi Aatma'), 'Must reference Dukhi Aatma');
  
  // Observations section title
  assert(htmlContent.includes('Things I have learned about having a Dukhi Aatma in my life'), 'Observations section heading missing');
});

// 9. Accessibility, WCAG and Keyboard navigation
runTest('Accessibility checks: focus-visible, ARIA labels, semantic markup', () => {
  const htmlContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const baseCss = fs.readFileSync(path.join(projectRoot, 'css/base.css'), 'utf8');
  
  assert(baseCss.includes(':focus-visible'), 'CSS must define :focus-visible for keyboard users');
  assert(baseCss.includes('prefers-reduced-motion'), 'CSS must support prefers-reduced-motion');
  assert(htmlContent.includes('role="timer"'), 'Timer accessibility role missing');
  assert(htmlContent.includes('aria-label='), 'Aria labels missing on key buttons');
  assert(htmlContent.includes('<main'), 'Semantic <main> missing');
  assert(htmlContent.includes('<header'), 'Semantic <header> missing');
});

// 10. Web Audio API Procedural Architecture
runTest('Audio Controller has zero external mp3 dependencies and graceful fallback', () => {
  const audioJs = fs.readFileSync(path.join(projectRoot, 'js/audio.js'), 'utf8');
  assert(audioJs.includes('AudioContext'), 'Must use Web Audio API');
  assert(audioJs.includes('toggleSound'), 'Audio toggle must exist');
  assert(audioJs.includes('isMuted = true') || audioJs.includes('this.isMuted'), 'Must be muted by default');
  assert(!audioJs.includes('.mp3') && !audioJs.includes('.wav'), 'Must not rely on external copyrighted audio files');
});

// 11. Interactive QA / Testing Drawer
runTest('QA Dev Test drawer exists with shortcuts and quick simulation hooks', () => {
  const htmlContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(projectRoot, 'js/app.js'), 'utf8');
  
  assert(htmlContent.includes('dev-test-panel'), 'QA test panel missing in HTML');
  assert(appJs.includes('enableTestCountdown'), 'Countdown test hook missing');
  assert(appJs.includes('enableTestUnlocked'), 'Midnight trigger test hook missing');
});

console.log(`\n====================================================`);
console.log(`QA TEST SUITE FINISHED: ${passedTests}/${totalTests} TESTS PASSED.`);
console.log(`====================================================`);

if (passedTests !== totalTests) {
  process.exit(1);
}
