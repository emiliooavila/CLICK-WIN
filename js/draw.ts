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

    setTimeout(() => {
      clearInterval(iv);
      reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      reel.classList.remove('spinning');
      reel.classList.add('locked');

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
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
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

  const slotSection    = document.getElementById('slotSection');
  const resultsSection = document.getElementById('resultsSection');
  if (slotSection)    slotSection.style.display    = 'none';
  if (resultsSection) resultsSection.style.display = 'block';

  launchConfetti();
}

function runDraw(): void {
  if (revealed) return;

  const btn = document.getElementById('btnReveal');
  if (!btn) return;
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
  [0, 1, 2].forEach((i) => {
    const r = document.getElementById(`drum${i}`);
    if (!r) return;
    r.classList.remove('locked', 'spinning');
    r.textContent = ['🎁', '🎀', '⭐'][i];
  });
}

function showConfirm(msg: string, onAccept: () => void): void {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.65);
    z-index:999; display:flex; align-items:center;
    justify-content:center; padding:20px;
  `;
  overlay.innerHTML = `
    <div style="
      background:#1a3d28;
      border:2px solid rgba(201,168,76,.4);
      border-radius:16px; padding:28px;
      max-width:340px; width:100%;
      text-align:center;
      font-family:'Raleway',sans-serif;
      box-shadow: 0 8px 38px rgba(0,0,0,.4);
    ">
      <p style="font-size:.95rem; color:#fff; margin-bottom:20px; line-height:1.5;">
        ${msg}
      </p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="confirmNo" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #C9A84C; background:transparent;
          color:#C9A84C; cursor:pointer; font-size:.9rem;
          font-family:'Raleway',sans-serif;
        ">Cancelar</button>
        <button id="confirmYes" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #C9A84C;
          background:linear-gradient(135deg,#C9A84C,#a07830);
          color:#0d1f15; cursor:pointer; font-size:.9rem;
          font-family:'Raleway',sans-serif;
        ">Sí, borrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#confirmNo')
    ?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#confirmYes')
    ?.addEventListener('click', () => {
      overlay.remove();
      onAccept();
    });
}

function init(): void {
  renderHeader({ step: 6, total: 6, progress: 100 });

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
      const slotSection    = document.getElementById('slotSection');
      const resultsSection = document.getElementById('resultsSection');
      if (slotSection)    slotSection.style.display    = 'block';
      if (resultsSection) resultsSection.style.display = 'none';
      resetDrums();
    });

  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/summary.html';
    });


  document.getElementById('btnRestart')
    ?.addEventListener('click', () => {
      showConfirm('¿Empezar un nuevo evento desde cero?', () => {
        clearAll();
        window.location.href = '/index.html';
      });
    });
}

document.addEventListener('DOMContentLoaded', init);