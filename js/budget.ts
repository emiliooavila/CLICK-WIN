import './shared';
import '../css/budget.css';
import { loadEvent, saveEvent } from '../ts/storage';
import { toast } from './shared';
import { renderHeader } from './header';

let selectedAmount = '';
let isCustom       = false;

function selectPreset(btn: HTMLElement): void {
  document.querySelectorAll<HTMLElement>('.btn-chip')
    .forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selectedAmount = btn.dataset.amount ?? '';
  isCustom       = false;
  document.getElementById('customBudgetWrap')!.style.display = 'none';
}

function selectOther(): void {
  document.querySelectorAll<HTMLElement>('.btn-chip')
    .forEach(b => b.classList.remove('on'));
  document.getElementById('btnOtroBudget')?.classList.add('on');
  selectedAmount = '';
  isCustom       = true;
  document.getElementById('customBudgetWrap')!.style.display = 'block';
  (document.getElementById('customBudget') as HTMLInputElement).focus();
}

function save(): void {
  let budget = selectedAmount;

  if (isCustom) {
    budget = (document.getElementById('customBudget') as HTMLInputElement)
      .value.trim();
  }

  if (!budget || Number(budget) < 1) {
    toast('Ingresa un presupuesto válido', 'error');
    return;
  }

  const prev = loadEvent()!;
  saveEvent({ ...prev, budget });
  window.location.href = '/htmls/summary.html';
}

function init(): void {
  renderHeader({ step: 6, total: 6, progress: 100 });

  const ev = loadEvent();
  if (ev?.budget) {
    const preset = document.querySelector<HTMLElement>(
      `[data-amount="${ev.budget}"]`
    );
    if (preset) {
      preset.classList.add('on');
      selectedAmount = ev.budget;
    } else {
      selectOther();
      (document.getElementById('customBudget') as HTMLInputElement).value =
        ev.budget;
    }
  }

  document.querySelectorAll<HTMLElement>('.btn-chip:not(#btnOtroBudget)')
    .forEach(btn => btn.addEventListener('click', () => selectPreset(btn)));

  document.getElementById('btnOtroBudget')
    ?.addEventListener('click', selectOther);

  document.getElementById('btnContinue')
    ?.addEventListener('click', save);
  document.getElementById('btnBack')
    ?.addEventListener('click', () => {
      window.location.href = '/htmls/event-date.html';
    });
}

document.addEventListener('DOMContentLoaded', init);