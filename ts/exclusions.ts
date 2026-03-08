import type { Exclusion, Participant, DrawResult } from './types';
import { loadExclusions, saveExclusions } from './storage';


export function setExclusion(giverId: string, excludedIds: string[]): void {
  const list = loadExclusions();
  const idx  = list.findIndex(e => e.giverId === giverId);
  if (idx >= 0) list[idx] = { giverId, excludedIds };
  else          list.push({ giverId, excludedIds });
  saveExclusions(list);
}

export function clearExclusions(): void {
  saveExclusions([]);
}

export function drawNames(
  participants: Participant[],
  exclusions:   Exclusion[],
): DrawResult[] | null {

  const ids     = participants.map(p => p.id);
  const exclMap = new Map(
    exclusions.map(e => [e.giverId, new Set(e.excludedIds)])
  );

  for (let attempt = 0; attempt < 1000; attempt++) {
    const receivers = [...ids].sort(() => Math.random() - 0.5);
    let valid = true;
    const results: DrawResult[] = [];

    for (let i = 0; i < ids.length; i++) {
      const gId = ids[i];
      const rId = receivers[i];

      if (gId === rId)                 { valid = false; break; }
      if (exclMap.get(gId)?.has(rId)) { valid = false; break; }

      const giver    = participants.find(p => p.id === gId)!;
      const receiver = participants.find(p => p.id === rId)!;
      results.push({
        giverId:      gId,
        giverName:    giver.name,
        receiverId:   rId,
        receiverName: receiver.name,
      });
    }

    if (valid) return results;
  }

  return null;
}