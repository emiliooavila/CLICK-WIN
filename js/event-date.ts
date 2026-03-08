import './shared';
import '../css/event-date.css';
import { loadEvent, saveEvent } from '../ts/storage';
import { toast } from './shared';
import { renderHeader } from './header';

let selectedDate = '';

function getSuggestedDates(): string[] {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);

  while (dates.length < 3) {
    if ([5, 6, 0].includes(d.getDay())) {
      dates.push(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function formatDate(iso: string): string {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('es-MX', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

function selectDate(date: string, el: HTMLElement): void {
  selectedDate = date;

  document.querySelectorAll('.date-suggestion, #btnOther')
    .forEach(b => b.classList.remove('on'));

  el.classList.add('on');

  document.getElementById('calendarWrap')!.style.display = 'none';
}

function save(): void {
  const calVal    = (document.getElementById('eventDate') as HTMLInputElement).value;
  const finalDate = selectedDate || calVal;

  if (!finalDate) {
    toast('Selecciona una fecha', 'error');
    return;
  }

  const prev = loadEvent()!;
  saveEvent({ ...prev, eventDate: finalDate });
  window.location.href = '/htmls/budget.html';
}

function init(): void {
  renderHeader({ step: 5, total: 6, progress: 83 });

  const ev = loadEvent();
  if (ev?.eventName) {
    document.getElementById('dateScreenTitle')!.textContent =
      `¿Cuándo se celebra ${ev.eventName}?`;
  }

  const container = document.getElementById('suggestedDates')!;
  getSuggestedDates().forEach(iso => {
    const btn       = document.createElement('button');
    btn.className   = 'date-suggestion';
    btn.textContent = formatDate(iso);
    btn.dataset.date = iso;

    if (ev?.eventDate === iso) {
      btn.classList.add('on');
      selectedDate = iso;
    }

    btn.addEventListener('click', () => selectDate(iso, btn));
    container.appendChild(btn);
  });

  if (ev?.eventDate) {
    (document.getElementById('eventDate') as HTMLInputElement).value =
      ev.eventDate;
  }

  document.getElementById('btnOther')
    ?.addEventListener('click', () => {
      selectedDate = '';
      document.querySelectorAll('.date-suggestion, #btnOther')
        .forEach(b => b.classList.remove('on'));
      document.getElementById('btnOther')?.classList.add('on');
      document.getElementById('calendarWrap')!.style.display = 'block';
    });

  document.getElementById('eventDate')
    ?.addEventListener('change', () => { selectedDate = ''; });

  document.getElementById('btnContinue')
    ?.addEventListener('click', save);
  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/event-type.html';
    });
}

document.addEventListener('DOMContentLoaded', init);