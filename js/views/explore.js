// Explorar: todas as ferramentas do Pont + recursos de imersão.
import { html, mount, icon } from '../ui.js';

const TOOLS = [
  ['#/tutor', 'sparkles', '#8a4fff', 'Tutor com IA', 'Converse por voz em situações reais e receba correções.'],
  ['#/bridges', 'bridge', '#4f5bff', 'Pontes', 'Padrões PT → FR → EN e falsos amigos.'],
  ['#/verbs', 'table', '#0e9f6e', 'Conjugação', '77 verbos, 7 tempos, com áudio e treino.'],
  ['#/phrases', 'bubble', '#f08c00', 'Frases prontas', 'Café, hotel, trabalho, médico, compras…'],
  ['#/listen', 'headphones', '#ff4f74', 'Ditado', 'Ouça e escreva. Acelera a compreensão.'],
  ['#/shadow', 'waves', '#a855f7', 'Shadowing', 'Repita frases imitando o ritmo nativo.'],
  ['#/decks', 'layers', '#2563eb', 'Vocabulário', '420 palavras em 14 temas.'],
  ['#/lessons', 'book', '#db2777', 'Lições', '21 lições de gramática-ponte.'],
];

const MEDIA = [
  ['InnerFrench (podcast)', 'Francês claro e lento sobre temas interessantes. Ideal do A2 ao B1.', 'https://innerfrench.com/'],
  ['Journal en français facile — RFI', 'Notícias diárias em francês simplificado, com transcrição.', 'https://francaisfacile.rfi.fr/'],
  ['TV5Monde — Apprendre le français', 'Vídeos curtos com exercícios, por nível.', 'https://apprendre.tv5monde.com/'],
  ['Easy French (YouTube)', 'Entrevistas nas ruas, com legendas em francês e inglês.', 'https://www.youtube.com/@EasyFrench'],
  ['Séries com áudio e legenda em francês', 'Lupin, Dix pour cent, Le Bureau des légendes, Les Revenants.', ''],
];

export default function render(root) {
  mount(root, html`
    <section class="stack-sm">
      <div class="eyebrow">Ferramentas</div>
      <h1 class="h1">Explorar</h1>
    </section>
    <div class="grid grid-2" style="margin-top:16px">${TOOLS.map(([href, ic, c, t, d]) => html`
      <a class="tile" href="${href}" style="--c:${c}"><span class="blob">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></a>`)}</div>

    <div class="section-title"><h2>Imersão</h2><span class="small faint">fora do app</span></div>
    <div class="list">${MEDIA.map(([t, d, url]) => html`
      <${url ? 'a' : 'div'} class="item" ${url ? html`href="${url}" target="_blank" rel="noopener"` : ''}>
        <span class="ico">${icon(url ? 'globe' : 'music')}</span>
        <span class="grow"><b>${t}</b><br><span class="small muted">${d}</span></span>${url ? icon('chev', 'chev') : ''}
      </${url ? 'a' : 'div'}>`)}</div>
    <div class="callout tip" style="margin-top:14px"><span class="ci">💡</span><div>Truque de imersão grátis: mude o idioma do celular e da Netflix para francês. Você já sabe onde ficam os botões — vai aprender o vocabulário sem esforço.</div></div>

    <div class="list" style="margin-top:20px">
      <a class="item" href="#/settings"><span class="ico">${icon('gauge')}</span><span class="grow"><b>Ajustes</b><br><span class="small muted">Voz, ritmo, tema, backup e instalação</span></span>${icon('chev', 'chev')}</a>
    </div>`);
}
