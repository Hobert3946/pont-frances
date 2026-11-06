// Mini-linguagem das lições → HTML.
//   ## Título              → subtítulo
//   - item                 → lista
//   PT> texto / EN> texto  → ponte com o português / inglês
//   !> texto / *> texto    → atenção / dica
//   = francês :: tradução  → exemplo com botão de áudio
//   | a | b | c |          → tabela (1ª linha = cabeçalho)
//   Inline: `francês` (toque para ouvir), **negrito**, *itálico*
import { esc, icon } from './ui.js';

const VOL = String(icon('volume'));

export function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, (_, t) => `<span class="fr tap" data-say="${t}">${t}</span>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function markup(src) {
  let out = '', para = [], list = null, table = null;
  const flushPara = () => { if (para.length) out += `<p>${inline(para.join(' '))}</p>`; para = []; };
  const flushList = () => { if (list) out += `<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`; list = null; };
  const flushTable = () => {
    if (!table) return;
    const [head, ...rows] = table;
    out += `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`
      + rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
    table = null;
  };
  const flush = () => { flushPara(); flushList(); flushTable(); };

  for (const rawLine of String(src).trim().split('\n')) {
    const line = rawLine.trim();
    let m;
    if (!line) { flush(); continue; }
    if (line.startsWith('## ')) { flush(); out += `<h3>${inline(line.slice(3))}</h3>`; }
    else if (line.startsWith('- ')) { flushPara(); flushTable(); (list ||= []).push(line.slice(2)); }
    else if (line.startsWith('|')) { flushPara(); flushList(); (table ||= []).push(line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())); }
    else if ((m = line.match(/^(PT|EN)>\s*(.*)$/))) {
      flush();
      const k = m[1].toLowerCase();
      out += `<div class="bridge ${k}"><span class="tag ${k}">${m[1]}</span><div>${inline(m[2])}</div></div>`;
    } else if ((m = line.match(/^([!*])>\s*(.*)$/))) {
      flush();
      const warn = m[1] === '!';
      out += `<div class="callout ${warn ? 'warn' : 'tip'}"><span class="ci">${warn ? '⚠️' : '💡'}</span><div>${inline(m[2])}</div></div>`;
    } else if ((m = line.match(/^=\s*(.+?)\s*::\s*(.*)$/))) {
      flush();
      const fr = esc(m[1]);
      out += `<div class="ex"><button type="button" class="say" data-say="${fr}" aria-label="Ouvir">${VOL}</button>`
        + `<div><span class="fr">${fr}</span><span class="pt">${inline(m[2])}</span></div></div>`;
    } else { flushList(); flushTable(); para.push(line); }
  }
  flush();
  return out;
}

/** Extrai as frases de exemplo (para ditado e shadowing). */
export function examplesOf(src) {
  return [...String(src).matchAll(/^\s*=\s*(.+?)\s*::\s*(.*)$/gm)].map((m) => ({ fr: m[1], pt: m[2] }));
}
