# The Dukhi Aatma Chronicles
> A romantic, warm, and interactive midnight birthday surprise and confession experience created for **Alsesha Shakya** (lovingly nicknamed **Dukhi Aatma**).

---

## 🌌 Creative Direction & Concept

- **Theme**: Warm romantic midnight magic.
- **Palette**: Deep midnight navy (`#050814`, `#090e24`), twilight nebula violet (`#1d1742`), warm lavender (`#c4b5fd`), and soft rose starlight accents (`#f472b6`, `#fef08a`).
- **Visuals**: 100% original CSS & HTML5 Canvas procedural starry backdrop with dynamic constellation lines and shooting stars. No personal photos, no copyrighted assets, and no generic template clutter.
- **Soundscape**: 100% self-contained procedural Web Audio API synthesizer. Plays gentle ambient celestial drone pads and soft pentatonic wind chimes. Zero external audio dependencies, zero copyright concerns, muted by default with an accessible toggle.
- **Interaction Philosophy**: Thoughtful, playful, and deeply respectful.

---

## 🎯 Target Date & Timezone

- **Target**: **3 November 2026, 00:00:00 Nepal Standard Time**
- **Timezone**: `Asia/Kathmandu` (UTC+05:45)
- **Target Timestamp**: `1793643300000` ms UTC (`2026-11-02T18:15:00.000Z`)
- **Accuracy**: Syncs with public HTTPS time sources with automatic fallback to local system clock converted to Nepal time. Handles mobile tab backgrounding and waking via `visibilitychange`.

---

## 📂 Project Structure

```text
the-dukhi-aatma-chronicles/
├── index.html              # Main semantic HTML5 document with all experience views
├── css/
│   ├── variables.css       # Design tokens (midnight palette, typography, shadows)
│   ├── base.css            # Resets, typography, accessible focus states, reduced-motion
│   ├── stars.css           # Canvas positioning, atmospheric nebulae & crescent moon
│   ├── countdown.css       # Live flip/digit cards, NPT badge, status indicator
│   ├── envelope.css        # 3D CSS wax-sealed envelope and letter opening sequence
│   ├── birthday.css        # Birthday letter, 1-year friendship timeline, field notes
│   ├── confession.css      # Confession parchment, 7-stage NO, YES celebration, Respectful NO
│   └── components.css      # Audio controls, status toast, QA preview drawer
├── js/
│   ├── config.js           # Target timestamp, NPT offset, copy text, local storage keys
│   ├── audio.js            # Procedural Web Audio API soundscape (pads, chimes, cues)
│   ├── stars.js            # Interactive stardust canvas & constellation particle engine
│   ├── clock.js            # Nepal timezone clock engine, drift prevention, test overrides
│   ├── confession.js       # 7-stage playful NO logic, direct respectful exit, YES handler
│   └── app.js              # Application coordinator, view switcher, event listeners
├── tests/
│   └── qa-test-suite.js    # Automated Node.js QA test suite (11 test suites)
└── README.md               # Complete documentation, deployment, and testing guide
```

---

## 🚀 How to Run Locally

Because the project is built with lightweight vanilla Web technologies (HTML5, CSS3, JavaScript, Web Audio API), it can be run on any computer or mobile browser with zero build steps or package installations.

### Option 1: Python Built-in Server (Recommended)
Open a terminal inside the project directory and run:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

### Option 3: Direct File Opening
Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Safari, or Firefox.

---

## 🧪 How to Test Without Waiting Until Midnight

We have built a dedicated **QA & Preview Suite** right into the website so anyone can thoroughly verify the experience before midnight.

### Method A: The Built-in Test Drawer
1. Click the subtle **"QA / Preview Modes"** button at the bottom-right corner of the screen, or press **`Alt + T`** (or **`Ctrl + Shift + T`**).
2. The control suite allows you to instantly test:
   - **5s to Midnight**: Starts a 5-second countdown to watch the live auto-unlock transition at 00:00:00!
   - **10s to Midnight**: Starts a 10-second countdown.
   - **At Midnight**: Immediately opens the envelope view.
   - **Reset Live NPT**: Restores the live clock.
   - **Jump to Views**: Jump directly to Envelope, Birthday Letter, Confession, or YES Screen.
   - **Test Playful NO Stages**: Directly test Stage 1, Stage 4, Stage 7, or the Final NO screen.

### Method B: URL Query Parameters
You can also append test query parameters directly to the URL:
- `http://localhost:8000/?test=5s` (triggers 5s countdown)
- `http://localhost:8000/?test=10s` (triggers 10s countdown)
- `http://localhost:8000/?test=midnight` (loads unlocked experience immediately)

### Method C: Running Automated Tests
```bash
node tests/qa-test-suite.js
```

---

## 🌐 Free Static Hosting & Deployment Options

This project requires no backend, database, or build tools. It can be hosted for free in under two minutes:

### 1. GitHub Pages (100% Free)
1. Initialize a git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial release of The Dukhi Aatma Chronicles"
   git branch -M main
   git remote add origin https://github.com/<your-username>/the-dukhi-aatma-chronicles.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** → **Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/the-dukhi-aatma-chronicles/`.

### 2. Vercel (100% Free)
1. Run `npx vercel` inside the project folder, or connect your GitHub repository on [vercel.com](https://vercel.com).
2. Vercel automatically deploys static HTML projects with global CDN distribution.

### 3. Netlify (100% Free)
1. Drag and drop the project folder into [app.netlify.com/drop](https://app.netlify.com/drop), or deploy via GitHub.
2. Netlify generates a shareable public URL instantly.

---

## 💌 Sharing the Link

Send the link to **Alsesha** with a warm note:
> *"A little something created for your midnight. Open it when the stars align."*
