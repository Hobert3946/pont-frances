// Baralhos de vocabulário: ativar temas e navegar pelas palavras.
import { getState } from '../store.js';
import { DECKS, activeDecks, setDeck, deckStats, wordStatus } from '../srs.js';
import { html, mount, actions, icon, pageHead, sayBtn, toast } from '../ui.js';

const DOT = { new: '', learning: 'l', young: 'r', mature: 'm' };

function list(root) {
  const draw = () => {
    const active = new Set(activeDecks().map((d) => d.id));
    const totalWords = DECKS.reduce((n, d) => n + d.words.length, 0);
    mount(root, html`
      ${pageHead('Cofre de Vocabulário', { back: '#/review', sub: `${totalWords} vocábulos distribuídos em ${DECKS.length} coleções temáticas` })}
      <p class="small muted">As palavras novas emergem das coleções ativas, na sequência abaixo. Quando uma coleção é dominada, a seguinte ativa-se automaticamente.</p>
      <div class="row wrap small muted" style="gap:16px;margin:10px 0 18px">
        <span class="row" style="gap:6px"><i class="dot-state"></i> Inédita</span>
        <span class="row" style="gap:6px"><i class="dot-state l"></i> Em aprendizado</span>
        <span class="row" style="gap:6px"><i class="dot-state r"></i> Recente</span>
        <span class="row" style="gap:6px"><i class="dot-state m"></i> Consolidada (21+ dias)</span>
      </div>
      <div class="bento-grid-2">${DECKS.map((d, idx) => {
        const s = deckStats(d);
        const on = active.has(d.id);
        const pct = Math.round((s.seen / s.total) * 100);
        return html`< div class="card stack-sm" style = "display:flex;flex-direction:column;justify-content:space-between" >
          <div class="row between">
            <a class="row" href="#/deck/${d.id}" style="gap:12px">
              <span class="bi-ico" style="font-size:1.35rem">${d.icon}</span>
              <div>
                <span class="bento-index">COLLECTION ${String(idx + 1).padStart(2, '0')} · ${d.level}</span>
                <div class="h3" style="font-size:1.12rem;color:#fff">${d.title}</div>
              </div>
            </a>
            <label class="switch" title="${on ? 'Ativo' : 'Inativo'}"><input type="checkbox" data-deck="${d.id}" ${on ? 'checked' : ''}><span></span></label>
          </div>
          <a href="#/deck/${d.id}" class="stack-sm" style="margin-top:8px">
            <p class="small muted" style="margin:0">${d.desc}</p>
            <div class="bar thin" style="margin-top:10px"><i style="width:${pct}%"></i></div>
            <div class="row between tiny faint" style="margin-top:4px">
              <span>${s.seen}/${s.total} estudadas (${pct}%)</span>
              <span>${s.mature} consolidadas →</span>
            </div>
          </a>
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
