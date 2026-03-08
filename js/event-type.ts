import './shared';
import '../css/event-type.css';
import { loadEvent, saveEvent } from '../ts/storage';
import { toast } from './shared';
import { renderHeader } from './header';

let selectedType = '';
let showingMore  = false;

function selectChip(btn: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.btn-chip')
    .forEach(b => b.classList.remove('on'));

  btn.classList.add('on');
  selectedType = btn.dataset.type ?? '';

  const nameWrap = document.getElementById('eventNameWrap')!;
  nameWrap.style.display = 'block';

  const input = document.getElementById('eventName') as HTMLInputElement;
  if (!input.value) input.value = selectedType;
}

function toggleMore(): void {
  showingMore = !showingMore;
  document.getElementById('moreTypes')!.style.display =
    showingMore ? 'block' : 'none';
  document.getElementById('btnShowMore')!.textContent =
    showingMore ? 'Mostrar menos' : 'Mostrar más';
}

function save(): void {
  if (!selectedType) {
    toast('Selecciona un tipo de evento', 'error');
    return;
  }

  const eventName =
    (document.getElementById('eventName') as HTMLInputElement).value.trim()
    || selectedType;

  const prev = loadEvent()!;
  saveEvent({ ...prev, eventType: selectedType, eventName });
  window.location.href = '/htmls/event-date.html';
}

function init(): void {
  renderHeader({ step: 4, total: 6, progress: 66 });

  const ev = loadEvent();
  if (ev?.eventType) {
    selectedType = ev.eventType;
    const btn = document.querySelector<HTMLElement>(
      `[data-type="${ev.eventType}"]`
    );
    btn?.classList.add('on');
    (document.getElementById('eventName') as HTMLInputElement).value =
      ev.eventName || ev.eventType;
    document.getElementById('eventNameWrap')!.style.display = 'block';
  }

  document.querySelectorAll<HTMLElement>('.btn-chip')
    .forEach(btn => btn.addEventListener('click', () => selectChip(btn)));

  document.getElementById('btnClearEvent')
    ?.addEventListener('click', () => {
      (document.getElementById('eventName') as HTMLInputElement).value = '';
    });

  document.getElementById('btnShowMore')
    ?.addEventListener('click', toggleMore);

  document.getElementById('btnContinue')
    ?.addEventListener('click', save);
  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/exclusions.html';
    });
}

document.addEventListener('DOMContentLoaded', init);