/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - CELESTIAL CANVAS & BIRTHDAY PARTICLES
   Stars, gentle floating birthday balloons, drifting festive confetti & nebulae.
   ========================================================================== */

class CelestialCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.balloons = [];
    this.confetti = [];
    this.shootingStars = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.animId = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.createBalloons();
    this.createConfetti();

    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
      this.createBalloons();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
    });

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createStars() {
    this.stars = [];
    const count = Math.min(120, Math.floor((this.width * this.height) / 8500));
    const colors = ['#ffffff', '#fef08a', '#c4b5fd', '#f472b6', '#bae6fd'];

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1
      });
    }
  }

  // Gentle Floating Birthday Balloons in Background
  createBalloons() {
    this.balloons = [];
    const count = this.width < 600 ? 5 : 8;
    const colors = [
      'rgba(244, 114, 182, 0.45)', // soft rose
      'rgba(196, 181, 253, 0.45)', // soft lavender
      'rgba(254, 240, 138, 0.35)', // pale gold
      'rgba(56, 189, 248, 0.35)'   // pastel blue
    ];

    for (let i = 0; i < count; i++) {
      this.balloons.push({
        x: Math.random() * this.width,
        y: this.height + Math.random() * this.height,
        radiusX: Math.random() * 10 + 16,
        radiusY: Math.random() * 12 + 20,
        speed: Math.random() * 0.4 + 0.3,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Soft Drifting Confetti Sparkles
  createConfetti() {
    this.confetti = [];
    const count = this.width < 600 ? 25 : 45;
    const colors = ['#f472b6', '#c4b5fd', '#fde047', '#38bdf8', '#ffffff'];

    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 4 + 2,
        speedY: Math.random() * 0.5 + 0.25,
        speedX: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  spawnShootingStar() {
    if (this.isReducedMotion) return;
    if (Math.random() < 0.007 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.width * 0.8,
        y: Math.random() * this.height * 0.3,
        length: Math.random() * 70 + 40,
        speed: Math.random() * 7 + 5,
        angle: Math.PI / 4,
        opacity: 1,
        fadeSpeed: 0.025
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Floating Birthday Balloons
    if (!this.isReducedMotion) {
      for (let i = 0; i < this.balloons.length; i++) {
        const b = this.balloons[i];
        b.y -= b.speed;
        b.swayOffset += b.swaySpeed;
        const currentX = b.x + Math.sin(b.swayOffset) * 15;

        if (b.y < -50) {
          b.y = this.height + 40;
          b.x = Math.random() * this.width;
        }

        // Draw balloon
        this.ctx.beginPath();
        this.ctx.ellipse(currentX, b.y, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = b.color;
        this.ctx.fill();

        // Balloon string
        this.ctx.beginPath();
        this.ctx.moveTo(currentX, b.y + b.radiusY);
        this.ctx.quadraticCurveTo(currentX + Math.sin(b.swayOffset) * 6, b.y + b.radiusY + 14, currentX, b.y + b.radiusY + 28);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }

    // 2. Draw Drifting Birthday Confetti
    if (!this.isReducedMotion) {
      for (let i = 0; i < this.confetti.length; i++) {
        const c = this.confetti[i];
        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotSpeed;

        if (c.y > this.height) {
          c.y = -10;
          c.x = Math.random() * this.width;
        }

        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.fillStyle = c.color;
        this.ctx.globalAlpha = c.alpha;
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.8);
        this.ctx.restore();
      }
    }

    // 3. Draw Stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      if (!this.isReducedMotion) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.9 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fill();
    }

    // 4. Shooting Stars
    this.spawnShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(1, 'rgba(196, 181, 253, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.2;
      this.ctx.globalAlpha = s.opacity;
      this.ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.fadeSpeed;

      if (s.opacity <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
      }
    }

    this.ctx.globalAlpha = 1;
    this.animId = requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.celestialCanvas = new CelestialCanvas('celestial-canvas');
});
