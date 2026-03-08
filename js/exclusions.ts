import './shared';
import '../css/exclusions.css';
import { loadParticipants, loadExclusions } from '../ts/storage';
import { setExclusion, clearExclusions } from '../ts/exclusions';
import { renderHeader } from './header';

let useExclusions   = false;
let currentGiverId: string | null = null;
let tempSelected:   Set<string>   = new Set();

function setMode(active: boolean): void {
  useExclusions = active;
  document.getElementById('btnNoExcl')?.classList.toggle('on', !active);
  document.getElementById('btnYesExcl')?.classList.toggle('on',  active);

  const list = document.getElementById('exclusionsList')!;
  list.style.display = active ? 'block' : 'none';
  if (active) renderExclusionsList();
}

function renderExclusionsList(): void {
  const participants = loadParticipants();
  const exclusions   = loadExclusions();
  const container    = document.getElementById('exclusionsList')!;
  container.innerHTML = '';

  participants.forEach(p => {
    const excl  = exclusions.find(e => e.giverId === p.id);
    const names = (excl?.excludedIds ?? [])
      .map(id => participants.find(pp => pp.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const div = document.createElement('div');
    div.className = 'excl-person';
    div.innerHTML = `
      <div class="excl-person-name">${p.name}</div>
      <button class="excl-select-btn${names ? ' has-data' : ''}" data-id="${p.id}">
        <span>${names || 'Selecciona los nombres que quieres excluir...'}</span>
        <i class="bi bi-chevron-right"></i>
      </button>
    `;

    div.querySelector('button')
      ?.addEventListener('click', () => openModal(p.id));

    container.appendChild(div);
  });
}

function openModal(giverId: string): void {
  currentGiverId = giverId;
  const participants = loadParticipants();
  const exclusions   = loadExclusions();
  const giver        = participants.find(p => p.id === giverId)!;

  tempSelected = new Set(
    exclusions.find(e => e.giverId === giverId)?.excludedIds ?? []
  );

  document.getElementById('exclModalTitle')!.textContent =
    `${giver.name} no sortea a:`;

  const list = document.getElementById('exclCheckList')!;
  list.innerHTML = '';

  participants
    .filter(p => p.id !== giverId)
    .forEach(p => {
      const picked = tempSelected.has(p.id);
      const li     = document.createElement('li');
      li.className  = `excl-item${picked ? ' picked' : ''}`;
      li.dataset.id = p.id;
      li.innerHTML  = `
        <span class="excl-item-check"></span>
        <span>${p.name}</span>
      `;
      li.addEventListener('click', () => toggleItem(li, p.id));
      list.appendChild(li);
    });

  document.getElementById('exclModal')!.style.display = 'flex';
}

function toggleItem(el: HTMLElement, id: string): void {
  if (tempSelected.has(id)) {
    tempSelected.delete(id);
    el.classList.remove('picked');
  } else {
    tempSelected.add(id);
    el.classList.add('picked');
  }
}

function saveModal(): void {
  if (!currentGiverId) return;
  setExclusion(currentGiverId, [...tempSelected]);
  closeModal();
  renderExclusionsList();
}

function closeModal(e?: MouseEvent): void {
  if (e && (e.target as HTMLElement).id !== 'exclModal') return;
  document.getElementById('exclModal')!.style.display = 'none';
  currentGiverId = null;
}

function init(): void {
  renderHeader({ step: 3, total: 6, progress: 50 });
  setMode(false);

  document.getElementById('btnNoExcl')
    ?.addEventListener('click',  () => setMode(false));
  document.getElementById('btnYesExcl')
    ?.addEventListener('click',  () => setMode(true));

  document.getElementById('exclModal')
    ?.addEventListener('click', closeModal);
  document.getElementById('btnModalCancel')
    ?.addEventListener('click', () => closeModal());
  document.getElementById('btnModalSave')
    ?.addEventListener('click', saveModal);

  document.getElementById('btnContinue')?.addEventListener('click', () => {
    if (!useExclusions) clearExclusions();
    window.location.href = '/htmls/event-type.html';
  });
  document.getElementById('btnBack')?.addEventListener('click', () => {
    window.location.href = '/htmls/participants.html';
  });
}

document.addEventListener('DOMContentLoaded', init);