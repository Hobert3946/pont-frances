// Leitor Bilíngue com Áudio e Dicionário Instantâneo.
import { addXP, bump } from '../store.js';
import { checkAchievements } from '../achievements.js';
import { STORIES } from '../data/stories.js';
import { WORDS } from '../data/decks.js';
import { speak, stopSpeaking } from '../speech.js';
import { html, mount, actions, icon, pageHead, toast, confetti, sfx, $ } from '../ui.js';

// Índice rápido de palavras para consulta instantânea ao tocar
const DICT = new Map();
WORDS.forEach((w) => {
  const clean = w.fr.toLowerCase().replace(/^(le|la|l'|un|une|des|les)\s+/, '').replace(/[^a-zàâäéèêëîïôöùûüç]/g, '');
  if (clean && !DICT.has(clean)) DICT.set(clean, w);
});

export default function render(root, params) {
  const storyId = params[0];
  const story = STORIES.find((s) => s.id === storyId);

  if (!story) {
    return listStories(root);
  }

  let showTrans = false;
  let activeWord = null;

  const tokenize = (text) => {
    // Quebra preservando pontuação para permitir toque em cada palavra
    const tokens = text.match(/[\wàâäéèêëîïôöùûüç'-]+|[^\w\sàâäéèêëîïôöùûüç'-]+|\s+/gi) || [];
    return tokens.map((tok) => {
      if (/^\s+$/.test(tok) || /^[^\wàâäéèêëîïôöùûüç]+$/i.test(tok)) {
        return tok;
      }
      return html`<span class="rw-word" data-rw="${tok}">${tok}</span>`;
    });
  };

  const draw = () => {
    mount(root, html`
      ${pageHead(story.title, { back: '#/reader', sub: `${story.level} · ${story.sub}` })}

      <div class="row wrap between" style="margin-bottom:16px;gap:10px">
        <label class="row small" style="gap:8px;cursor:pointer">
          Mostrar tradução <span class="switch"><input type="checkbox" id="transToggle" ${showTrans ? 'checked' : ''}><span></span></span>
        </label>
        <div class="tiny faint">Toque em qualquer palavra para tradução e pronúncia</div>
      </div>

      <div class="stack" style="gap:14px">
        ${story.paragraphs.map((p, idx) => html`
          <section class="card pad-lg stack-sm reader-para">
            <div class="row between">
              <span class="eyebrow">§ ${idx + 1}</span>
              <button class="btn btn-ghost btn-sm" data-act="playPara" data-idx="${idx}">
                ${icon('volume')} Ouvir parágrafo
              </button>
            </div>
            <div class="fr reader-text" style="font-size:1.15rem;line-height:1.75">
              ${tokenize(p.fr)}
            </div>
            ${showTrans ? html`<div class="small muted reader-trans" style="margin-top:8px;border-top:1px dashed var(--border);padding-top:8px">${p.pt}</div>` : ''}
          </section>
        `)}
      </div>

      ${activeWord ? html`
        <div class="card pad-md glow active-word-card" style="margin-top:18px;position:sticky;bottom:80px;z-index:20;background:var(--card-bg, #fff);box-shadow:0 8px 30px rgba(0,0,0,0.15)">
          <div class="row between">
            <div class="grow">
              <div class="fr" style="font-size:1.3rem;font-weight:700">${activeWord.fr}</div>
              <div class="small" style="margin-top:2px">
                <span class="tag pt">PT</span> ${activeWord.pt}
                ${activeWord.en ? html`&nbsp;<span class="tag en">EN</span> ${activeWord.en}` : ''}
              </div>
              ${activeWord.note ? html`<div class="tiny muted" style="margin-top:4px">${activeWord.note}</div>` : ''}
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn-soft btn-sm" data-say="${activeWord.fr}">${icon('volume')} Ouvir</button>
              <button class="btn btn-ghost btn-sm btn-icon" data-act="closeWord">${icon('x')}</button>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="card pad-lg center stack-sm" style="margin-top:24px;border:1px solid var(--accent)">
        <div class="h3">Terminou a leitura?</div>
        <p class="small muted">Parabéns por exercitar sua compreensão imersiva!</p>
        <button class="btn btn-primary btn-lg" data-act="finish">
          ${icon('check')} Concluir leitura (+15 XP)
        </button>
      </div>
    `);
  };

  root.addEventListener('change', (e) => {
    if (e.target.id === 'transToggle') {
      showTrans = e.target.checked;
      draw();
    }
  });

  root.addEventListener('click', (e) => {
    const wEl = e.target.closest('[data-rw]');
    if (wEl) {
      const rawWord = wEl.dataset.rw;
      const clean = rawWord.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüç]/g, '');
      speak(rawWord);

      const found = DICT.get(clean);
      if (found) {
        activeWord = found;
      } else {
        activeWord = { fr: rawWord, pt: 'Palavra em contexto', en: '', note: 'Toque para ouvir a pronúncia nativa' };
      }
      draw();
      return;
    }
  });

  actions(root, {
    playPara: (el) => {
      const idx = +el.dataset.idx;
      const p = story.paragraphs[idx];
      if (p) speak(p.fr);
    },
    closeWord: () => {
      activeWord = null;
      draw();
    },
    finish: () => {
      addXP(15, 'reading');
      bump('storiesRead');
      confetti();
      sfx.ok();
      toast('História concluída! +15 XP 🎉', { type: 'ok' });
      checkAchievements();
      location.hash = '#/reader';
    },
  });

  draw();
  return () => stopSpeaking();
}

function listStories(root) {
  mount(root, html`
    ${pageHead('Leitor Bilíngue', { back: '#/explore', sub: 'Histórias graduadas com áudio e dicionário instantâneo' })}

    <div class="list" style="margin-top:16px">
      ${STORIES.map((s) => html`
        <a class="item" href="#/reader/${s.id}">
          <span class="ico" style="font-size:1.4rem">${s.icon}</span>
          <span class="grow">
            <b>${s.title}</b> <span class="tag fr">${s.level}</span><br>
            <span class="small muted">${s.sub} · ${s.min} min</span>
          </span>
          ${icon('chev', 'chev')}
        </a>
      `)}
    </div>

    <div class="callout tip" style="margin-top:18px">
      <span class="ci">💡</span>
      <div><b>Como aproveitar ao máximo:</b> leia o primeiro parágrafo tentando entender o contexto geral. Toque nas palavras desconhecidas para ouvir a pronúncia e ver o significado.</div>
    </div>
  `);
}

