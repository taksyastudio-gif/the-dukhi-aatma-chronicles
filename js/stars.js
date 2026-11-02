/* ==========================================================================
   THE DUKHI AATMA CHRONICLES - CELESTIAL CANVAS & CONSTELLATION PARTICLES
   ========================================================================== */

class CelestialCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
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

    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
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
    const count = Math.min(180, Math.floor((this.width * this.height) / 7500));
    const colors = [
      '#ffffff',
      '#fef08a', // pale gold
      '#c4b5fd', // soft lavender
      '#f472b6', // soft pink
      '#bae6fd'  // ice blue
    ];

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      });
    }
  }

  spawnShootingStar() {
    if (this.isReducedMotion) return;
    if (Math.random() < 0.008 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.width * 0.8,
        y: Math.random() * this.height * 0.3,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        fadeSpeed: 0.025
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw and update stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      if (!this.isReducedMotion) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = this.width;
        if (star.x > this.width) star.x = 0;
        if (star.y < 0) star.y = this.height;
        if (star.y > this.height) star.y = 0;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.shadowBlur = star.radius > 1.2 ? 8 : 0;
      this.ctx.shadowColor = star.color;
      this.ctx.fill();
    }

    // 2. Interactive Constellation Lines between nearby stars & cursor
    if (!this.isReducedMotion) {
      this.ctx.lineWidth = 0.5;
      for (let i = 0; i < this.stars.length; i++) {
        const starA = this.stars[i];

        // Connect nearby stars
        for (let j = i + 1; j < this.stars.length; j++) {
          const starB = this.stars[j];
          const dx = starA.x - starB.x;
          const dy = starA.y - starB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            this.ctx.beginPath();
            this.ctx.moveTo(starA.x, starA.y);
            this.ctx.lineTo(starB.x, starB.y);
            this.ctx.strokeStyle = '#c4b5fd';
            this.ctx.globalAlpha = (1 - dist / 75) * 0.15;
            this.ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (this.mouseX > 0) {
          const dx = starA.x - this.mouseX;
          const dy = starA.y - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            this.ctx.beginPath();
            this.ctx.moveTo(starA.x, starA.y);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.strokeStyle = '#f472b6';
            this.ctx.globalAlpha = (1 - dist / 110) * 0.35;
            this.ctx.stroke();
          }
        }
      }
    }

    // 3. Shooting stars
    this.spawnShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(0.5, `rgba(196, 181, 253, ${s.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(196, 181, 253, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.5;
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
    this.ctx.shadowBlur = 0;

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.celestialCanvas = new CelestialCanvas('celestial-canvas');
});
