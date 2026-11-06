// Baralhos de vocabulário: ativar temas e navegar pelas palavras.
import { getState } from '../store.js';
import { DECKS, activeDecks, setDeck, deckStats, wordStatus } from '../srs.js';
import { html, mount, actions, icon, pageHead, sayBtn, toast } from '../ui.js';

const DOT = { new: '', learning: 'l', young: 'r', mature: 'm' };

function list(root) {
  const draw = () => {
    const active = new Set(activeDecks().map((d) => d.id));
    mount(root, html`
      ${pageHead('Baralhos', { back: '#/review', sub: `${DECKS.reduce((n, d) => n + d.words.length, 0)} palavras em ${DECKS.length} temas` })}
      <p class="small muted">As palavras novas saem dos baralhos ativos, na ordem abaixo. Quando um acaba, o próximo é ativado sozinho.</p>
      <div class="row wrap small muted" style="gap:14px;margin:6px 0 14px">
        <span class="row" style="gap:6px"><i class="dot-state"></i> nova</span>
        <span class="row" style="gap:6px"><i class="dot-state l"></i> aprendendo</span>
        <span class="row" style="gap:6px"><i class="dot-state r"></i> jovem</span>
        <span class="row" style="gap:6px"><i class="dot-state m"></i> madura (21+ dias)</span>
      </div>
      <div class="list">${DECKS.map((d) => {
        const s = deckStats(d);
        const on = active.has(d.id);
        return html`<div class="item">
          <a class="ico" href="#/deck/${d.id}" style="font-size:1.4rem">${d.icon}</a>
          <a class="grow" href="#/deck/${d.id}">
            <b>${d.title}</b> <span class="tag">${d.level}</span><br>
            <span class="small muted">${d.desc}</span>
            <div class="bar thin" style="margin-top:8px"><i style="width:${(s.seen / s.total) * 100}%"></i></div>
            <span class="tiny faint">${s.seen}/${s.total} vistas · ${s.mature} maduras</span>
          </a>
          <label class="switch" title="${on ? 'Ativo' : 'Inativo'}"><input type="checkbox" data-deck="${d.id}" ${on ? 'checked' : ''}><span></span></label>
        </div>`;
      })}</div>`);
  };
  draw();
  root.addEventListener('change', (e) => {
    const id = e.target.dataset.deck;
    if (!id) return;
    if (!e.target.checked && activeDecks().length <= 1) { e.target.checked = true; return toast('Deixe pelo menos um baralho ativo.'); }
    setDeck(id, e.target.checked);
    toast(e.target.checked ? 'Baralho ativado' : 'Baralho pausado', { ms: 1600 });
  });
}

function deck(root, id) {
  const d = DECKS.find((x) => x.id === id);
  if (!d) { location.hash = '#/decks'; return; }
  let on = activeDecks().some((x) => x.id === id);
  const toggleLabel = () => (on ? html`${icon('check')} Ativo` : html`${icon('plus')} Ativar baralho`);
  mount(root, html`
    ${pageHead(`${d.icon} ${d.title}`, { back: '#/decks', sub: d.desc })}
    <div class="row wrap" style="margin-bottom:14px">
      <button class="btn ${on ? 'btn-soft' : 'btn-primary'}" data-act="toggle">${toggleLabel()}</button>
      <button class="btn btn-ghost" data-act="playAll">${icon('play')} Ouvir tudo</button>
    </div>
    <section class="card">${d.words.map((w) => html`
      <div class="word-row">
        <i class="dot-state ${DOT[wordStatus(w.id)]}"></i>
        <div class="grow">
          <div class="fr">${w.display} ${w.gender ? html`<span class="tag ${w.gender}">${w.gender}</span>` : ''}</div>
          <div class="pt">${w.pt}</div>
          <div class="en">${w.en}</div>
        </div>
        ${sayBtn(w.fr, 'sm')}
      </div>`)}</section>`);
  let playing = false;
  actions(root, {
    toggle: (el) => {
      if (on && activeDecks().length <= 1) return toast('Deixe pelo menos um baralho ativo.');
      on = !on;
      setDeck(id, on);
      el.className = `btn ${on ? 'btn-soft' : 'btn-primary'}`;
      el.innerHTML = String(toggleLabel());
    },
    playAll: async (el) => {
      if (playing) { playing = false; return; }
      playing = true;
      el.innerHTML = String(html`${icon('stop')} Parar`);
      const { speak } = await import('../speech.js');
      for (const w of d.words) {
        if (!playing || !document.contains(el)) break;
        await speak(w.fr);
        await new Promise((r) => setTimeout(r, 500));
      }
      playing = false;
      if (document.contains(el)) el.innerHTML = String(html`${icon('play')} Ouvir tudo`);
    },
  });
  return () => { playing = false; };
}

export default function render(root, params, name) {
  if (name === 'deck' && params[0]) return deck(root, params[0]);
  return list(root);
}
