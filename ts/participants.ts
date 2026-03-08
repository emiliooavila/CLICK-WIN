import type { Participant } from './types';
import { loadParticipants, saveParticipants } from './storage';

export function addParticipant(name: string, isOrganizer = false): Participant {
  const list = loadParticipants();
  const p: Participant = {
    id:          `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name:        name.trim(),
    isOrganizer,
    order:       list.length,
  };
  saveParticipants([...list, p]);
  return p;
}

export function removeParticipant(id: string): void {
  const list = loadParticipants()
    .filter(p => p.id !== id)
    .map((p, i) => ({ ...p, order: i }));
  saveParticipants(list);
}

export function reorderParticipants(orderedIds: string[]): void {
  const map      = new Map(loadParticipants().map(p => [p.id, p]));
  const reordered = orderedIds
    .map((id, i) => ({ ...map.get(id)!, order: i }))
    .filter(Boolean);
  saveParticipants(reordered);
}

export function clearParticipants(): void {
  saveParticipants([]);
}