import './shared';
import '../css/participants.css';
import { loadParticipants } from '../ts/storage';
import { addParticipant, removeParticipant, reorderParticipants } from '../ts/participants';
import { toast } from './shared';
import { renderHeader } from './header';

let dragSrcId: string | null = null;

function esc(str: string): string {
  return str.replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] ?? c)
  );
}

function renderList(): void {
  const list = loadParticipants();
  const ul   = document.getElementById('participantsList')!;
  ul.innerHTML = '';

  list.forEach((p, idx) => {
    const li       = document.createElement('li');
    li.className   = `participant-item${p.isOrganizer ? ' is-organizer' : ''}`;
    li.draggable   = !p.isOrganizer;
    li.dataset.id  = p.id;
    li.style.animationDelay = `${idx * 0.05}s`;

    li.innerHTML = `
      <span class="drag-handle">${p.isOrganizer ? '📌' : '⠿'}</span>
      ${p.isOrganizer ? '<span class="p-badge">Org</span>' : ''}
      <span class="p-name">${esc(p.name)}</span>
      ${!p.isOrganizer
        ? `<button class="p-del" data-id="${p.id}" aria-label="Eliminar">✕</button>`
        : ''}
    `;

    if (!p.isOrganizer) {
      li.addEventListener('dragstart', onDragStart);
      li.addEventListener('dragover',  onDragOver);
      li.addEventListener('drop',      onDrop);
      li.addEventListener('dragend',   onDragEnd);
    }

    li.querySelector<HTMLButtonElement>('.p-del')
      ?.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        removeParticipant(id);
        renderList();
      });

    ul.appendChild(li);
  });
}

function onDragStart(e: DragEvent): void {
  dragSrcId = (e.currentTarget as HTMLElement).dataset.id!;
  (e.currentTarget as HTMLElement).classList.add('dragging');
  e.dataTransfer!.effectAllowed = 'move';
}

function onDragOver(e: DragEvent): void {
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'move';
  const target = e.currentTarget as HTMLElement;
  if (target.classList.contains('is-organizer')) return;
  document.querySelectorAll('.participant-item')
    .forEach(el => el.classList.remove('drag-over'));
  target.classList.add('drag-over');
}

function onDrop(e: DragEvent): void {
  e.preventDefault();
  const targetId = (e.currentTarget as HTMLElement).dataset.id!;
  if (!dragSrcId || dragSrcId === targetId) return;

  const list   = loadParticipants();
  const ids    = list.map(p => p.id);
  const srcIdx = ids.indexOf(dragSrcId);
  const tgtIdx = ids.indexOf(targetId);

  /* No permitir soltar antes del organizador */
  if (tgtIdx === 0 && list[0].isOrganizer) return;

  ids.splice(srcIdx, 1);
  ids.splice(tgtIdx, 0, dragSrcId);
  reorderParticipants(ids);
  renderList();
}

function onDragEnd(e: DragEvent): void {
  (e.currentTarget as HTMLElement).classList.remove('dragging');
  document.querySelectorAll('.participant-item')
    .forEach(el => el.classList.remove('drag-over'));
  dragSrcId = null;
}

function addNew(): void {
  const input = document.getElementById('newName') as HTMLInputElement;
  const name  = input.value.trim();

  if (!name) {
    toast('Escribe un nombre', 'error');
    return;
  }

  const list = loadParticipants();
  if (list.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    toast('Ese nombre ya existe', 'error');
    return;
  }

  addParticipant(name, false);
  input.value = '';
  input.focus();
  renderList();
}

function init(): void {
  renderHeader({ step: 2, total: 6, progress: 33 });
  renderList();

  document.getElementById('btnAdd')
    ?.addEventListener('click', addNew);

  document.getElementById('newName')
    ?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') addNew();
    });

  document.getElementById('btnContinue')
    ?.addEventListener('click', () => {
      const list = loadParticipants();
      if (list.length < 2) {
        toast('Agrega al menos 2 participantes', 'error');
        return;
      }
      window.location.href = '/htmls/exclusions.html';
    });

  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/organizer.html';
    });
}

document.addEventListener('DOMContentLoaded', init);
