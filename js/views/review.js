// Sessão de revisão (FSRS). O modo de cada cartão se adapta à força da memória:
// reconhecer (FR→PT) → ouvir sem ver → produzir (PT→FR, digitando ou falando).
import { getState, settings, addXP } from '../store.js';
import { checkAchievements } from '../achievements.js';
import { dueIds, newIds, grade, forecast, WORD } from '../srs.js';
import { preview, formatDelay, State } from '../fsrs.js';
import { speak, checkAnswer, sttSupported, listen, scoreSpeech, sttErrorMessage, stopListening } from '../speech.js';
import { html, mount, actions, icon, sayBtn, tapFr, accentBar, diffView, toast, confetti, sfx, haptic, $, plural } from '../ui.js';

const GRADES = [[1, 'again', 'Errei'], [2, 'hard', 'Difícil'], [3, 'good', 'Bom'], [4, 'easy', 'Fácil']];

function pickMode(card) {
  if (!card || card.state !== State.Review) return 'recog';
  const r = Math.random();
  if (card.s >= 7 && r < .45) return 'type';
  if (card.s >= 2 && r < .75) return 'listen';
  return 'recog';
}

function answerOf(w) {
  const base = w.display.replace(/…/g, '').trim();
  const clean = base.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  const list = [clean];
  if (/\(e\)/.test(base)) list.push(base.replace(/\(e\)/g, 'e'));
  if (clean.includes(' / ')) list.push(...clean.split(' / '));
  return list.join(' | ');
}

const genderTag = (w) => (w.gender ? html`<span class="tag ${w.gender}">${w.gender === 'm' ? 'masc.' : 'fem.'}</span>` : '');

export default function render(root, params) {
  let queue = [...dueIds(), ...newIds()];
  let done = 0, wrong = 0, xp = 0;
  let cur = null; // { id, w, card, mode, revealed, suggested, typed }
  let lock = null;
  navigator.wakeLock?.request('screen').then((l) => { lock = l; }).catch(() => { });

  const total = () => done + queue.length + (cur ? 1 : 0);

  function next() {
    stopListening();
    if (!queue.length) return finish();
    const id = queue.shift();
    const card = getState().cards[id];
    cur = { id, w: WORD[id], card, mode: pickMode(card), revealed: false, suggested: 0 };
    draw();
    if (settings().autoplay && cur.mode !== 'type') speak(cur.w.fr);
    if (cur.mode === 'type') setTimeout(() => $('#ans', root)?.focus(), 80);
  }

  function front() {
    const { w, mode } = cur;
    if (mode === 'listen') return html`
      <span class="tag fr mode">${icon('ear')} Ouvir</span>
      <button class="say lg" data-say="${w.fr}" aria-label="Ouvir de novo">${icon('volume')}</button>
      <div class="hint">O que você ouviu? Pense no significado e vire.</div>
      <button class="btn btn-ghost btn-sm" data-say="${w.fr}" data-rate=".7">${icon('gauge')} Mais devagar</button>`;
    if (mode === 'type') return html`
      <span class="tag fr mode">${icon('pen')} Produzir</span>
      <div class="meaning">${w.pt}</div>
      <div class="small faint"><span class="tag en">EN</span> ${w.en}</div>
      <div style="width:100%;max-width:420px">
        <input id="ans" class="field fr center" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="em francês…">
        ${accentBar()}
      </div>
      <div class="row">
        <button class="btn btn-primary" data-act="check">${icon('check')} Verificar</button>
        ${sttSupported ? html`<button class="btn btn-soft" data-act="speakAns">${icon('mic')} Falar</button>` : ''}
      </div>
      <div class="live-text" id="live"></div>`;
    return html`
      <span class="tag fr mode">${icon('eye')} Reconhecer</span>
      <div class="row" style="gap:8px">${genderTag(w)}</div>
      <div class="word">${w.display}</div>
      ${sayBtn(w.fr)}
      <div class="hint">Lembra o significado? <span class="kbd">espaço</span></div>`;
  }

  function back() {
    const { w } = cur;
    return html`
      <div class="row" style="gap:8px">${genderTag(w)}${sayBtn(w.fr, 'sm')}</div>
      <div class="word">${w.display}</div>
      <div class="meaning">${w.pt}</div>
      <div class="small faint"><span class="tag en">EN</span> ${w.en}</div>
      ${w.ex ? html`<div class="example"><div class="fr" style="font-size:1.1rem">${tapFr(w.ex)}</div><div class="small muted">${w.exPt}</div></div>` : ''}
      ${w.note ? html`<div class="small" style="max-width:440px">💡 ${w.note}</div>` : ''}`;
  }

  function grades() {
    const pv = preview(cur.card || { due: 0, s: 0, d: 0, reps: 0, lapses: 0, state: 0, last: 0 }, Date.now(), settings().retention);
    return html`<div class="grades">${GRADES.map(([g, cls, label]) => html`
      <button class="grade ${cls}" data-act="grade" data-g="${g}" style="${cur.suggested === g ? 'outline:2px solid currentColor;outline-offset:2px' : ''}">
        ${label}<small>${formatDelay(pv[g])} · ${g}</small></button>`)}</div>`;
  }

  function draw() {
    const pct = total() ? (done / total()) * 100 : 0;
    mount(root, html`
      <div class="session-top no-anim">
        <a class="back" href="#/" aria-label="Sair">${icon('x')}</a>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="small bold num">${done}/${total()}</span>
      </div>
      <div class="flash ${cur.revealed ? 'flipped' : ''}">
        <div class="flash-inner">
          <div class="flash-face">${front()}</div>
          <div class="flash-face flash-back">${cur.revealed ? back() : ''}</div>
        </div>
      </div>
      <div id="result" style="margin-top:14px">${cur.result || ''}</div>
      <div style="margin-top:14px">
        ${cur.revealed ? grades() : cur.mode !== 'type' ? html`<button class="btn btn-primary btn-lg btn-block" data-act="reveal">Mostrar resposta</button>` : ''}
      </div>
      <div class="center tiny faint" style="margin-top:12px">Atalhos: <span class="kbd">espaço</span> virar · <span class="kbd">1</span>–<span class="kbd">4</span> avaliar · <span class="kbd">R</span> ouvir · <span class="kbd">S</span> devagar</div>
    `);
  }

  function reveal() {
    if (!cur || cur.revealed) return;
    cur.revealed = true;
    draw();
    if (cur.mode !== 'recog' && settings().autoplay) speak(cur.w.fr);
  }

  function judge(res) {
    cur.suggested = res.perfect ? 3 : res.accentOnly || res.score >= .5 ? 2 : 1;
    const ok = cur.suggested >= 2;
    cur.result = html`<div class="feedback ${ok ? 'ok' : 'bad'}">
      <b class="t">${res.perfect ? 'Perfeito!' : res.accentOnly ? 'Quase — atenção aos acentos' : ok ? 'Quase!' : 'Ainda não'}</b>
      ${res.words ? diffView(res.words) : ''}<div class="small">Resposta: <b class="fr">${cur.w.display}</b></div></div>`;
    ok ? sfx.ok() : sfx.bad();
    haptic(ok ? 12 : [30, 40, 30]);
    reveal();
  }

  function rate(g) {
    if (!cur?.revealed) return;
    const sched = grade(cur.id, g);
    done++;
    if (g === 1) wrong++;
    const gain = cur.mode === 'type' && g >= 3 ? 3 : 2;
    xp += gain;
    addXP(gain, 'reviewsXp');
    if (sched.due - Date.now() < 20 * 60e3) queue.splice(Math.min(queue.length, 3 + (Math.random() * 3 | 0)), 0, cur.id);
    if (g >= 3) haptic(8);
    next();
  }

  function finish() {
    lock?.release?.();
    if (!done) return empty();
    sfx.done();
    confetti();
    checkAchievements();
    const acc = Math.round(((done - wrong) / done) * 100);
    mount(root, html`
      <section class="card hero glow pad-lg center stack">
        <div class="empty" style="padding:0"><div class="big">🎉</div></div>
        <h1 class="h1">Bravo !</h1>
        <p class="muted">Sessão concluída. A memória se consolida enquanto você descansa.</p>
        <div class="kpis">
          <div class="kpi"><b>${done}</b><span>revisões</span></div>
          <div class="kpi"><b>${acc}%</b><span>acertos</span></div>
          <div class="kpi"><b>+${xp}</b><span>XP</span></div>
        </div>
        <div class="row wrap" style="justify-content:center">
          <a class="btn btn-primary" href="#/">${icon('sun')} Voltar ao início</a>
          <button class="btn btn-soft" data-act="more">${icon('plus')} Mais 5 palavras</button>
        </div>
      </section>`);
  }

  function empty() {
    const fc = forecast(7);
    const max = Math.max(1, ...fc);
    const dias = ['hoje', 'amanhã', ...Array.from({ length: 5 }, (_, i) => new Date(Date.now() + (i + 2) * 864e5).toLocaleDateString('pt-BR', { weekday: 'short' }))];
    mount(root, html`
      <section class="card hero glow pad-lg center stack">
        <div class="empty" style="padding:0"><div class="big">✨</div></div>
        <h1 class="h2">Tudo em dia!</h1>
        <p class="muted">Nenhuma revisão pendente e a cota de palavras novas de hoje já foi. Quer adiantar?</p>
        <div class="row wrap" style="justify-content:center">
          <button class="btn btn-primary" data-act="more">${icon('plus')} Aprender mais 5</button>
          <a class="btn btn-soft" href="#/decks">${icon('layers')} Escolher baralhos</a>
        </div>
      </section>
      <section class="card" style="margin-top:14px">
        <div class="h3" style="margin-bottom:12px">Próximos 7 dias</div>
        <div class="row" style="align-items:flex-end;gap:8px;height:120px">
          ${fc.map((n, i) => html`<div class="grow center" style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:4px">
            <span class="tiny bold num">${n || ''}</span>
            <div style="height:${Math.max(4, (n / max) * 80)}px;border-radius:8px;background:${n ? 'var(--grad)' : 'var(--surface-3)'}"></div>
            <span class="tiny faint">${dias[i]}</span></div>`)}
        </div>
      </section>
      <div class="list" style="margin-top:14px">
        <a class="item" href="#/decks"><span class="ico">${icon('layers')}</span><span class="grow"><b>Baralhos de vocabulário</b><br><span class="small muted">Veja todas as palavras e ative temas</span></span>${icon('chev', 'chev')}</a>
      </div>`);
  }

  actions(root, {
    reveal,
    grade: (el) => rate(+el.dataset.g),
    check: () => {
      const v = $('#ans', root).value.trim();
      if (!v) return;
      cur.typed = v;
      judge(checkAnswer(answerOf(cur.w), v, { strictAccents: settings().accentStrict }));
    },
    speakAns: async (el) => {
      el.classList.add('btn-primary');
      const live = $('#live', root);
      try {
        const r = await listen({ onInterim: (t) => { live.textContent = t; } });
        const best = answerOf(cur.w).split('|').map((a) => scoreSpeech(a.trim(), r.alternatives)).sort((a, b) => b.score - a.score)[0];
        judge({ perfect: best.score >= .85, accentOnly: false, score: best.score, words: best.words });
      } catch (e) { toast(sttErrorMessage(e), { type: 'err' }); }
      el.classList.remove('btn-primary');
    },
    more: () => {
      queue = newIds(5); // ignora a cota diária
      done = 0; wrong = 0; xp = 0;
      queue.length ? next() : toast('Você já viu todas as palavras dos baralhos! 🏆', { type: 'ok' });
    },
  });

  const onKey = (e) => {
    if (!cur || e.target.matches('input, textarea')) {
      if (e.key === 'Enter' && e.target.id === 'ans' && !cur.revealed) root.querySelector('[data-act="check"]')?.click();
      return;
    }
    if ((e.key === ' ' || e.key === 'Enter') && !cur.revealed && cur.mode !== 'type') { e.preventDefault(); reveal(); }
    else if (cur.revealed && ['1', '2', '3', '4'].includes(e.key)) rate(+e.key);
    else if (e.key.toLowerCase() === 'r' && cur?.w?.fr) { speak(cur.w.fr); }
    else if (e.key.toLowerCase() === 's' && cur?.w?.fr) { speak(cur.w.fr, { rate: 0.7 }); }
  };
  document.addEventListener('keydown', onKey);
  next();
  return () => { document.removeEventListener('keydown', onKey); lock?.release?.(); stopListening(); };
}
