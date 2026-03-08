import './shared';
import '../css/summary.css';
import {
  loadEvent,
  loadParticipants,
  loadExclusions,
  clearAll,
} from '../ts/storage';
import { renderHeader } from './header';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric',
    month:   'long', day:  'numeric',
  });
}

function setText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function appendLi(listId: string, text: string): void {
  const list = document.getElementById(listId);
  if (!list) return;
  const li       = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
}

function init(): void {
  renderHeader({ step: 6, total: 6, progress: 100 });

  const event        = loadEvent();
  const participants = loadParticipants();
  const exclusions   = loadExclusions();

  if (!event) {
    window.location.href = '/index.html';
    return;
  }

  setText('sumOrganizer', event.organizerName);
  setText('sumEvent',     event.eventName || event.eventType || '—');
  setText('sumDate',      event.eventDate ? formatDate(event.eventDate) : '—');
  setText('sumBudget',    event.budget    ? `$${event.budget} MXN`      : '—');

  if (participants.length === 0) {
    appendLi('sumParticipants', 'Sin participantes registrados');
  } else {
    participants.forEach(p => {
      appendLi(
        'sumParticipants',
        p.isOrganizer ? `${p.name} (organizador)` : p.name
      );
    });
  }

  const active = exclusions.filter(e => e.excludedIds.length > 0);
  if (active.length === 0) {
    setText('sumExclTitle', 'Sin exclusiones');
    appendLi('sumExclusions', 'Todas las combinaciones son válidas');
  } else {
    active.forEach(e => {
      const giver    = participants.find(p => p.id === e.giverId)?.name ?? '?';
      const excluded = e.excludedIds
        .map(id => participants.find(p => p.id === id)?.name ?? '?')
        .join(', ');
      appendLi('sumExclusions', `${giver} → no sortea a: ${excluded}`);
    });
  }

  document.getElementById('btnDraw')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/draw.html';
    });
  document.getElementById('btnRestart')
    ?.addEventListener('click', () => {
      showConfirm('¿Borrar todos los datos y empezar de nuevo?', () => {
        clearAll();
        window.location.href = '/index.html';
      });
    });
}

function showConfirm(msg: string, onAccept: () => void): void {
  const overlay    = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    z-index:999; display:flex; align-items:center;
    justify-content:center; padding:20px;
  `;
  overlay.innerHTML = `
    <div style="
      background:#fff; border-radius:16px; padding:28px;
      max-width:340px; width:100%; text-align:center;
      font-family:'Raleway',sans-serif;
    ">
      <p style="font-size:.95rem; color:#1a1a1a; margin-bottom:20px;">
        ${msg}
      </p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="confirmNo" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #00704A; background:#fff;
          color:#00704A; cursor:pointer; font-size:.9rem;
        ">Cancelar</button>
        <button id="confirmYes" style="
          padding:10px 24px; border-radius:8px; font-weight:700;
          border:2px solid #00704A; background:#00704A;
          color:#fff; cursor:pointer; font-size:.9rem;
        ">Sí, borrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirmNo')
    ?.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#confirmYes')
    ?.addEventListener('click', () => { overlay.remove(); onAccept(); });
}

document.addEventListener('DOMContentLoaded', init);