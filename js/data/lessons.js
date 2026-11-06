// Índice das lições de gramática, por nível.
import l1 from './lessons-1.js';
import l2 from './lessons-2.js';
import l3 from './lessons-3.js';
import l4 from './lessons-4.js';

export const LESSONS = [...l1, ...l2, ...l3, ...l4];
export const LESSON = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export const LEVELS = [
  { id: 'A1', title: 'A1 · Fundamentos', desc: 'Sons, artigos, verbos básicos e as primeiras frases' },
  { id: 'A2', title: 'A2 · Conversa do dia a dia', desc: 'Passados, pronomes e descrições' },
  { id: 'B1', title: 'B1 · Independência', desc: 'Futuro, subjuntivo, hipóteses e o francês real' },
];
