import './shared.ts';
import '../css/welcome.css';
import { clearAll } from '../ts/storage';

const SYMBOLS = ['🎁', '🎀', '⭐', '🃏', '💚', '🍀', '🎊', '🎰', '🌟', '🎯'];
const FINAL   = ['🎁', '🎀', '🎁'];

function animateSlots(): void {
  [0, 1, 2].forEach((i) => {
    const reel = document.getElementById(`reel${i}`) as HTMLElement;
    let frame  = 0;

    const interval = setInterval(() => {
      reel.textContent = SYMBOLS[frame % SYMBOLS.length];
      frame++;
    }, 70 + i * 15);

    setTimeout(() => {
      clearInterval(interval);
      reel.textContent = FINAL[i];
      reel.classList.add('locked');
    }, 1400 + i * 500);
  });
}

function spawnParticles(): void {
  const container = document.getElementById('particles')!;
  const emojis    = ['🎁', '🎀', '⭐', '🍀', '🎊'];

  function spawn(): void {
    const el            = document.createElement('div');
    el.className        = 'particle';
    el.textContent      = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left       = `${Math.random() * 100}vw`;
    el.style.bottom     = `-40px`;
    const dur           = 6 + Math.random() * 8;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay   = `${Math.random() * 2}s`;
    el.style.fontSize         = `${0.7 + Math.random() * 0.8}rem`;
    container.appendChild(el);

    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(spawn, i * 600);
  }
  setInterval(spawn, 1200);
}

function init(): void {
  animateSlots();
  spawnParticles();

  document.getElementById('btnStart')?.addEventListener('click', () => {
    clearAll();
    window.location.href = '/htmls/organizer.html';
  });
}

document.addEventListener('DOMContentLoaded', init);