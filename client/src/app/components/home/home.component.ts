import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  opacity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  heroTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId = 0;
  private readonly COUNT = 55;
  private readonly MAX_DIST = 130;
  private mouse = { x: -9999, y: -9999 };

  constructor(public authService: AuthService) { }

  get isLoggedIn(): boolean {
    return !!this.authService.userValue;
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize(canvas);
    window.addEventListener('resize', () => this.resize(canvas));
    this.initParticles(canvas);
    this.animate(canvas);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
  }

  private resize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private initParticles(canvas: HTMLCanvasElement) {
    this.particles = Array.from({ length: this.COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.8 + 0.8,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  private animate(canvas: HTMLCanvasElement) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of this.particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Mouse repel
      const mdx = p.x - this.mouse.x;
      const mdy = p.y - this.mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 90) {
        p.x += (mdx / md) * 1.2;
        p.y += (mdy / md) * 1.2;
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(165,180,252,${p.opacity})`;
      ctx.fill();
    }

    // Draw connecting lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < this.MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / this.MAX_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(() => this.animate(canvas));
  }

  // Track mouse for repel + parallax
  onHeroMouseMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;
    const rotX = (-dy * 6).toFixed(2);
    const rotY = (dx * 8).toFixed(2);
    this.heroTransform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
  }

  onHeroMouseLeave() {
    this.mouse = { x: -9999, y: -9999 };
    this.heroTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }
}
