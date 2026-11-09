// Busca Global Instantânea (Ctrl+K) com indexação de palavras, verbos, lições, sons e pontes.
import { WORDS } from './data/decks.js';
import { VERBS } from './data/verbs.js';
import { LESSONS } from './data/lessons.js';
import { SOUNDS } from './data/sounds.js';
import { PATTERNS, FALSE_FRIENDS } from './data/bridges.js';
import { STORIES } from './data/stories.js';
import { speak } from './speech.js';
import { html, icon, esc } from './ui.js';

let index = null;
let modalEl = null;
let activeIdx = 0;
let currentResults = [];

function buildIndex() {
  if (index) return index;
  const items = [];

  // 1. Vocabulário
  WORDS.forEach((w) => {
    items.push({
      type: 'Palavra',
      title: w.display || w.fr,
      sub: `${w.pt}${w.en ? ` · ${w.en}` : ''}`,
      tag: w.deck,
      badge: 'Vocab',
      href: `#/review`,
      say: w.fr,
      search: `${w.fr} ${w.pt} ${w.en || ''} ${w.ex || ''}`.toLowerCase(),
    });
  });

  // 2. Verbos
  VERBS.forEach((v) => {
    items.push({
      type: 'Verbo',
      title: v.inf,
      sub: `${v.pt} · ${v.en}`,
      badge: 'Conjugação',
      href: `#/verbs`,
      say: v.inf,
      search: `${v.inf} ${v.pt} ${v.en} ${v.pp || ''}`.toLowerCase(),
    });
  });

  // 3. Lições
  LESSONS.forEach((l) => {
    items.push({
      type: 'Lição',
      title: l.title,
      sub: `${l.level} · ${l.sub || ''}`,
      badge: l.level,
      href: `#/lesson/${l.id}`,
      search: `${l.title} ${l.sub || ''} ${l.id}`.toLowerCase(),
    });
  });

  // 4. Sons
  SOUNDS.forEach((s) => {
    items.push({
      type: 'Som',
      title: `${s.sym} ${s.ipa}`,
      sub: `${s.title} · ${s.tag || ''}`,
      badge: 'Fonética',
      href: `#/sound/${s.id}`,
      say: s.sentence,
      search: `${s.sym} ${s.ipa} ${s.title} ${s.tag || ''}`.toLowerCase(),
    });
  });

  // 5. Pontes e Falsos Amigos
  PATTERNS.forEach((p) => {
    items.push({
      type: 'Ponte',
      title: `${p.pt} → ${p.fr}`,
      sub: p.title,
      badge: 'Padrão',
      href: `#/bridges`,
      search: `${p.pt} ${p.fr} ${p.en || ''} ${p.title} ${p.note || ''}`.toLowerCase(),
    });
  });

  if (Array.isArray(FALSE_FRIENDS)) {
    FALSE_FRIENDS.forEach((f) => {
      items.push({
        type: 'Falso Amigo',
        title: f.fr,
        sub: `Não é "${f.parece}"! Significa: ${f.significa}`,
        badge: 'Cuidado',
        href: `#/bridges`,
        say: f.fr,
        search: `${f.fr} ${f.parece} ${f.significa}`.toLowerCase(),
      });
    });
  }

  // 6. Histórias do Leitor
  STORIES.forEach((st) => {
    items.push({
      type: 'História',
      title: st.title,
      sub: `${st.level} · ${st.sub}`,
      badge: 'Leitura',
      href: `#/reader/${st.id}`,
      search: `${st.title} ${st.sub} ${st.level}`.toLowerCase(),
    });
  });

  index = items;
  return index;
}

export function searchItems(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const items = buildIndex();
  const qParts = q.split(/\s+/);

  const matched = [];
  for (const item of items) {
    if (qParts.every((part) => item.search.includes(part))) {
      matched.push(item);
      if (matched.length >= 25) break;
    }
  }
  return matched;
}

function ensureModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement('div');
  modalEl.className = 'search-modal-backdrop';
  modalEl.setAttribute('aria-hidden', 'true');
  modalEl.innerHTML = `
    <div class="search-modal" role="dialog" aria-modal="true" aria-label="Busca rápida">
      <div class="search-input-wrap">
        <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="search" id="globalSearchInput" placeholder="Buscar palavras, verbos, lições, sons... (Esc para fechar)" autocomplete="off">
        <kbd class="tiny faint">Esc</kbd>
      </div>
      <div class="search-results" id="searchResults"></div>
      <div class="search-footer">
        <span><b>↑</b> <b>↓</b> para navegar</span>
        <span><b>Enter</b> para abrir</span>
        <span><b>Ctrl+K</b> para alternar</span>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  const input = modalEl.querySelector('#globalSearchInput');
  const resultsContainer = modalEl.querySelector('#searchResults');

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeSearch();
  });

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length) {
        activeIdx = (activeIdx + 1) % currentResults.length;
        updateActiveResult();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length) {
        activeIdx = (activeIdx - 1 + currentResults.length) % currentResults.length;
        updateActiveResult();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = currentResults[activeIdx];
      if (chosen) {
        selectResult(chosen);
      }
    }
  });

  resultsContainer.addEventListener('click', (e) => {
    const itemEl = e.target.closest('[data-idx]');
    if (!itemEl) return;
    const idx = +itemEl.dataset.idx;
    const chosen = currentResults[idx];
    if (chosen) {
      if (e.target.closest('[data-say]')) {
        speak(chosen.say);
        return;
      }
      selectResult(chosen);
    }
  });

  return modalEl;
}

function updateActiveResult() {
  const container = modalEl.querySelector('#searchResults');
  const items = container.querySelectorAll('.search-result-item');
  items.forEach((it, i) => {
    it.classList.toggle('active', i === activeIdx);
    if (i === activeIdx) it.scrollIntoView({ block: 'nearest' });
  });
}

function selectResult(item) {
  closeSearch();
  if (item.href) {
    location.hash = item.href;
  }
}

function renderResults(query) {
  const container = modalEl.querySelector('#searchResults');
  const q = query.trim();
  if (!q) {
    currentResults = [];
    container.innerHTML = `<div class="search-empty">Digite algo para pesquisar em todo o Pont...</div>`;
    return;
  }

  currentResults = searchItems(q);
  activeIdx = 0;

  if (!currentResults.length) {
    container.innerHTML = `<div class="search-empty">Nenhum resultado encontrado para "<b>${esc(q)}</b>"</div>`;
    return;
  }

  container.innerHTML = currentResults.map((it, idx) => `
    <div class="search-result-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
      <div class="sri-badge">${esc(it.badge)}</div>
      <div class="sri-content">
        <div class="sri-title fr">${esc(it.title)}</div>
        <div class="sri-sub">${esc(it.sub)}</div>
      </div>
      ${it.say ? `<button type="button" class="icon-btn sm" data-say="${esc(it.say)}" title="Ouvir"><svg class="i" viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg></button>` : ''}
    </div>
  `).join('');
}

export function openSearch() {
  const modal = ensureModal();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  const input = modal.querySelector('#globalSearchInput');
  input.value = '';
  renderResults('');
  setTimeout(() => input.focus(), 60);
}

export function closeSearch() {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
}

export function initSearch() {
  ensureModal();

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modalEl?.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  }
}

