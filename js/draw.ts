import './shared';
import '../css/draw.css';
import {
  loadParticipants,
  loadExclusions,
  saveDrawResults,
  loadDrawResults,
  clearAll,
} from '../ts/storage';
import { drawNames } from '../ts/exclusions';
import { toast } from './shared';
import { renderHeader } from './header';

const SYMBOLS = ['🎁', '🎀', '⭐', '🍀', '🎊', '💚', '🌟', '🎯'];
let revealed  = false;

function spinDrums(onDone: () => void): void {
  const reels = [0, 1, 2].map(i => document.getElementById(`drum${i}`)!);

  reels.forEach(r => r.classList.add('spinning'));

  reels.forEach((reel, i) => {
    let frame = 0;
    const iv  = setInterval(() => {
      reel.textContent = SYMBOLS[frame++ % SYMBOLS.length];
    }, 80);

    /* Cada reel se bloquea escalonado */
    setTimeout(() => {
      clearInterval(iv);
      reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      reel.classList.remove('spinning');
      reel.classList.add('locked');

      /* Cuando el último se bloquea, ejecuta el sorteo */
      if (i === 2) setTimeout(onDone, 400);
    }, 900 + i * 500);
  });
}

function launchConfetti(): void {
  const canvas  = document.getElementById('confettiCanvas') as HTMLCanvasElement;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx     = canvas.getContext('2d')!;
  const colors  = ['#00704A', '#C9A84C', '#D4E9E2', '#1E3932', '#ffffff'];

  const pieces = Array.from({ length: 140 }, () => ({
    x:   Math.random() * canvas.width,
    y:   Math.random() * -canvas.height,
    r:   3 + Math.random() * 5,
    d:   1.5 + Math.random() * 2.5,
    c:   colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    rs:  (Math.random() - 0.5) * 4,
  }));

  let frame = 0;
  function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
      p.y   += p.d;
      p.rot += p.rs;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function renderResults(results: ReturnType<typeof loadDrawResults>): void {
  const grid = document.getElementById('resultsGrid')!;
  grid.innerHTML = '';

  results.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="result-giver">${r.giverName}</div>
      <div class="result-arrow">🎁</div>
      <div class="result-receiver">${r.receiverName}</div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('slotSection')!.style.display    = 'none';
  document.getElementById('resultsSection')!.style.display = 'block';
  launchConfetti();
}

function runDraw(): void {
  if (revealed) return;

  const btn = document.getElementById('btnReveal')!;
  btn.classList.add('spinning');

  spinDrums(() => {
    btn.classList.remove('spinning');

    const participants = loadParticipants();
    const exclusions   = loadExclusions();

    if (participants.length < 2) {
      toast('No hay suficientes participantes', 'error');
      return;
    }

    const results = drawNames(participants, exclusions);

    if (!results) {
      toast(
        'No se pudo sortear con las exclusiones actuales. Revísalas.',
        'error'
      );
      return;
    }

    saveDrawResults(results);
    revealed = true;
    renderResults(results);
  });
}

function resetDrums(): void {
  [0, 1, 2].forEach(i => {
    const r = document.getElementById(`drum${i}`)!;
    r.classList.remove('locked', 'spinning');
    r.textContent = ['🎁', '🎀', '⭐'][i];
  });
}

function init(): void {
  renderHeader({ step: 6, total: 6, progress: 100 });

  /* Si ya hay resultados guardados, mostrarlos directamente */
  const existing = loadDrawResults();
  if (existing.length > 0) {
    revealed = true;
    renderResults(existing);
  }

  /* Botón sortear */
  document.getElementById('btnReveal')
    ?.addEventListener('click', runDraw);

  /* Resortear */
  document.getElementById('btnNewDraw')
    ?.addEventListener('click', () => {
      saveDrawResults([]);
      revealed = false;
      document.getElementById('slotSection')!.style.display    = 'block';
      document.getElementById('resultsSection')!.style.display = 'none';
      resetDrums();
    });

  /* Volver al resumen */
  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/summary.html';
    });

  /* Nuevo evento */
  document.getElementById('btnRestart')
    ?.addEventListener('click', () => {
      if (confirm('¿Empezar un nuevo evento desde cero?')) {
        clearAll();
        window.location.href = '/index.html';
      }
    });
}

document.addEventListener('DOMContentLoaded', init);