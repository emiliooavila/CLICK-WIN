import './shared';
import '../css/summary.css';
import {
    loadEvent,
    loadParticipants,
    loadExclusions,
    clearAll,
} from '../ts/storage';
import { renderHeader} from './header';

//formatea fecha iso a texto
function formatDate(iso: string): string{
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

//todo se lee de localStorage
function init(): void {
    renderHeader({step: 6, total: 6, progress: 100});
    const event =loadEvent();
    const participants = loadParticipants();
    const exclusions =loadExclusions();

    //Si no hay datos redirige al inicio
    if (!event) {
        window.location.href = '/index.html';
        return;
    }
    //Organizador
    document.getElementById('sumOrganizer')!.textContent = event.organizerName;

    //Celebracion
    document.getElementById('sumEvent')!.textContent = event.eventName || event.eventType || '-';

    //Fecha
    document.getElementById('sumDate')!.textContent = event.eventDate ? formatDate(event.eventDate) : '-';

    //Presupuesto
    document.getElementById('sumBudget')!.textContent = event.budget ? `$${event.budget} MXN` : '-';
    
    //Participantes
    const pList = document.getElementById('sumPartcipants')!;
    participants.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.isOrganizer ? `${p.name} (organizador)` : p.name;
        pList.appendChild(li);
    });

    //Exclusiones
    const eList = document.getElementById('sumExclusions')!;
    const eTitle = document.getElementById('sumExclTitle')!;
    const active = exclusions.filter(e => e.excludedIds.length > 0);

    if (active.length === 0) {
        eTitle.textContent = 'Sin exclusiones';
        const li = document.createElement('li');
        li.textContent = 'Todas las combinaciones son validas';
        eList.appendChild(li);
    } else {
        active.forEach(e => {
            const giver = participants.find(p=> p.id === e.giverId)?.name ?? '?';
            const excluded = e.excludedIds.map(id => participants.find(p => p.id === id)?.name ?? '?').join(', ');
            const li = document.createElement('li');
            li.textContent = `${giver} no sortea a ${excluded}`;
            eList.appendChild(li);
        });
    }

    //Ir al sorteo
    document.getElementById('btnDraw')?.addEventListener('click', () => {
        window.location.href = '/htmls/draw.html';
    });

    //Nuevo sorteo
    document.getElementById('btnRestart')?.addEventListener('click', () => {
        if (confirm('¿Borrar todos los datos y empezar de nuevo?')){
        clearAll();
        window.location.href = '/index.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', init);