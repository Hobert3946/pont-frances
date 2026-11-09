// Junta os baralhos de vocabulário. Cada linha: francês | português | inglês | exemplo | tradução | nota
import p1 from './vocab-1.js';
import p2 from './vocab-2.js';
import p3 from './vocab-3.js';
import p4 from './vocab-4.js';
import p5 from './vocab-5.js';

const seen = new Set();

// Ordem do currículo (a progressão automática segue esta sequência).
const ORDER = ['essentiels', 'gens', 'temps', 'verbes', 'liens', 'cuisine', 'maison', 'adjectifs', 'ville',
'travail', 'tech', 'sentiments', 'voyage', 'voyage_pratique', 'sante', 'quebec', 'familier'];

function gender(fr) {
  if (/\(m\.\/f\.\)|\/\s*(la\s|une\b)/.test(fr)) return '';
  if (/\(m\.\)/.test(fr) || /^(le|un) /.test(fr)) return 'm';
  if (/\(f\.\)/.test(fr) || /^(la|une) /.test(fr)) return 'f';
  return '';
}

function parseDeck(d) {
  const words = d.words.trim().split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [fr, pt, en = '', ex = '', exPt = '', note = ''] = line.split('|').map((s) => s.trim());
    let id = `w:${fr}`;
    if (seen.has(id)) id += `#${d.id}`;
    seen.add(id);
    const display = fr.replace(/\s*\((m\.|f\.|m\.\/f\.)\)/, '');
    return { id, fr, display, pt, en, ex, exPt, note, deck: d.id, gender: gender(fr) };
  });
  return { ...d, words };
}

const rank = (d) => { const i = ORDER.indexOf(d.id); return i < 0 ? 99 : i; };
export const DECKS = [...p1, ...p2, ...p3, ...p4, ...p5].sort((a, b) => rank(a) - rank(b)).map(parseDeck);
export const WORDS = DECKS.flatMap((d) => d.words);
export const WORD = Object.fromEntries(WORDS.map((w) => [w.id, w]));
