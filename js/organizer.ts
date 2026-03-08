import './shared';
import '../css/organizer.css';
import { loadEvent, saveEvent } from '../ts/storage';
import { clearParticipants, addParticipant } from '../ts/participants';
import { toast, clearInput } from './shared';
import { renderHeader } from './header';

function init(): void {

  renderHeader({ step: 1, total: 6, progress: 16 });

  const ev = loadEvent();
  if (ev) {
    (document.getElementById('organizerName')    as HTMLInputElement).value   = ev.organizerName;
    (document.getElementById('includeOrganizer') as HTMLInputElement).checked = ev.includeOrganizer;
  }

  document.getElementById('btnClear')?.addEventListener('click', () => {
    clearInput('organizerName');
  });

  document.getElementById('btnContinue')?.addEventListener('click', () => {
    const name    = (document.getElementById('organizerName')    as HTMLInputElement).value.trim();
    const include = (document.getElementById('includeOrganizer') as HTMLInputElement).checked;

    if (!name) {
      toast('Ingresa tu nombre para continuar', 'error');
      return;
    }

    const prev = loadEvent();
    saveEvent({
      organizerName:    name,
      includeOrganizer: include,
      eventType:        prev?.eventType  ?? '',
      eventName:        prev?.eventName  ?? '',
      eventDate:        prev?.eventDate  ?? '',
      budget:           prev?.budget     ?? '',
    });

    clearParticipants();
    if (include) addParticipant(name, true);

    window.location.href = '/htmls/participants.html';
  });
}

document.addEventListener('DOMContentLoaded', init);