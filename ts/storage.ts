import type { Participant, Exclusion, EventData, DrawResult } from './types';

const K = {
  EVENT:        'cw_event',
  PARTICIPANTS: 'cw_participants',
  EXCLUSIONS:   'cw_exclusions',
  DRAW:         'cw_draw',
} as const;

export const saveEvent = (d: EventData): void =>
  localStorage.setItem(K.EVENT, JSON.stringify(d));

export const loadEvent = (): EventData | null => {
  const r = localStorage.getItem(K.EVENT);
  return r ? JSON.parse(r) : null;
};

export const saveParticipants = (list: Participant[]): void =>
  localStorage.setItem(K.PARTICIPANTS, JSON.stringify(list));

export const loadParticipants = (): Participant[] => {
  const r = localStorage.getItem(K.PARTICIPANTS);
  return r ? JSON.parse(r) : [];
};

export const saveExclusions = (list: Exclusion[]): void =>
  localStorage.setItem(K.EXCLUSIONS, JSON.stringify(list));

export const loadExclusions = (): Exclusion[] => {
  const r = localStorage.getItem(K.EXCLUSIONS);
  return r ? JSON.parse(r) : [];
};

export const saveDrawResults = (list: DrawResult[]): void =>
  localStorage.setItem(K.DRAW, JSON.stringify(list));

export const loadDrawResults = (): DrawResult[] => {
  const r = localStorage.getItem(K.DRAW);
  return r ? JSON.parse(r) : [];
};

export const clearAll = (): void =>
  Object.values(K).forEach(k => localStorage.removeItem(k));