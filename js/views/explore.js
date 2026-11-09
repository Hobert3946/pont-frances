// Atelier (Explorar): Instrumentarium completo do Pont em Bento Grid + curadoria cultural.
import { html, mount, icon } from '../ui.js';

const TOOLS = [
  ['00', '#/learn', 'sparkles', 'MÉTODO DUOLINGO', 'Aulas Interativas (Do Zero ao B1)', 'Prática rápida com áudio nativo, treino de pronúncia no microfone e fixação dinâmica.', true],
  ['01', '#/guide', 'compass', 'ROTEIRO GUIADO', 'Trilha Passo a Passo (A0 → B1)', 'Sequência pedagógica estruturada em 19 passos e 5 fases para aprender do zero sem se perder.', true],
  ['02', '#/tutor', 'chat', 'CONVERSATION IA', 'Tutor com IA (Camille)', 'Role-play por voz em cenários parisienses com correção gramatical instantânea.', true],
  ['02', '#/speed', 'zap', 'RÉFLEXE LEXICAL', 'Treino Relâmpago 60s', 'Desafio contra o relógio com multiplicadores de combo até 3x.', true],
  ['03', '#/reader', 'book', 'LECTURE BILINGUE', 'Leitor Graduado', 'Contos A1–B1 com áudio sincronizado e dicionário ao toque.', false],
  ['04', '#/bridges', 'bridge', 'ÉTYMOLOGIE & PONTS', 'Pontes PT → FR → EN', '16 padrões morfológicos de conversão direta e 33 falsos amigos.', false],
  ['05', '#/verbs', 'table', 'SYSTÈME VERBAL', 'Motor de Conjugação', '77 verbos essenciais conjugados em 7 tempos com áudio e treino.', false],
  ['06', '#/listen', 'headphones', 'COMPRÉHENSION', 'Ditado Auditivo', 'Escuta de alta precisão com diagnóstico ortográfico palavra por palavra.', false],
  ['07', '#/shadow', 'waves', 'PROSODIE & RYTHME', 'Shadowing Acústico', 'Imitação de cadência e melodia nativa com espectrograma de voz.', false],
  ['08', '#/phrases', 'bubble', 'SITUATIONS RÉELLES', 'Guia de Frases', 'Expressões indispensáveis para café, hotel, TI, aeroporto e saúde.', false],
  ['09', '#/decks', 'layers', 'COLLECTION FSRS-5', 'Cofre de Vocabulário', '500+ palavras em 17 coleções temáticas (incluindo TI, Viagem e Québec).', false],
  ['10', '#/lessons', 'book', 'ARCHITECTURE A1–B1', 'Lições de Gramática', '21 dossiês contrastivos mostrando onde o português ajuda e onde engana.', false],
  ['11', '#/stats', 'trophy', 'TÉLÉMÉTRIE & BADGES', 'Conquistas & Métricas', 'Curva de retenção FSRS, precisão fonética e galeria de medalhas.', false],
  ['12', '#/settings', 'gauge', 'PRÉFÉRENCES', 'Ajustes & Backup', 'Vozes neurais, sotaques francófonos, retenção-alvo e exportação JSON.', false],
];

const MEDIA = [
  ['PODCAST · A2–B1', 'InnerFrench', 'Francês articulado e reflexivo sobre sociedade, história e cultura.', 'https://innerfrench.com/'],
  ['RADIO · QUOTIDIEN', 'Journal en français facile (RFI)', 'Noticiário internacional diário em francês claro com transcrição integral.', 'https://francaisfacile.rfi.fr/'],
  ['VIDÉO · EXERCICES', 'TV5Monde — Apprendre', 'Reportagens francófonas autênticas acompanhadas de fichas interativas.', 'https://apprendre.tv5monde.com/'],
  ['DOCUMENTAIRE · RUE', 'Easy French', 'Conversas espontâneas nas ruas de Paris e Montreal com dupla legenda.', 'https://www.youtube.com/@EasyFrench'],
];

export default function render(root) {
  mount(root, html`
    <section class="editorial-mast">
      <div class="mast-meta">
        <span class="mast-issue">INSTRUMENTARIUM</span>
        <span class="mast-sep">◆</span>
        <span class="mast-date">13 MODULES D'EXCELLENCE</span>
      </div>
      <div class="mast-headline">
        <h1 class="h1">L'Atelier <span class="grad-text">Pont</span><em>.</em></h1>
        <p class="mast-sub">Todas as ferramentas de engenharia cognitiva, fonética acústica e imersão reunidas em um único espaço.</p>
      </div>
    </section>

    <div class="bento-grid-3">
      ${TOOLS.map(([idx, href, ic, tag, title, desc, feat]) => html`
        <a class="bento-item ${feat ? 'featured' : ''}" href="${href}">
          <div class="bi-head">
            <span class="bi-idx">${idx}</span>
            <span class="bi-ico">${icon(ic)}</span>
          </div>
          <div class="bi-body">
            <div class="bi-tag">${tag}</div>
            <h3 class="bi-title">${title}</h3>
            <p class="bi-desc">${desc}</p>
          </div>
          <div class="bi-foot">
            <span>Abrir instrumento</span>
            <span class="bi-arrow">→</span>
          </div>
        </a>
      `)}
    </div>

    <div class="section-header" style="margin-top:38px">
      <div>
        <span class="eyebrow">CULTURE FRANCOPHONE</span>
        <h2>Imersão Curada</h2>
      </div>
      <span class="small faint">Fontes externas recomendadas</span>
    </div>

    <div class="bento-grid-2">
      ${MEDIA.map(([tag, title, desc, url]) => html`
        <a class="card link stack-sm" href="${url}" target="_blank" rel="noopener">
          <div class="row between">
            <span class="bento-index">${tag}</span>
            ${icon('globe')}
          </div>
          <div class="h3 fr" style="font-size:1.25rem;color:#fff">${title}</div>
          <p class="small muted">${desc}</p>
        </a>
      `)}
    </div>

    <div class="callout tip" style="margin-top:20px">
      <span class="ci">✦</span>
      <div><b>Segredo de Imersão Passiva:</b> altere o idioma do seu smartphone e da sua conta de streaming para francês (séries como <i>Lupin</i>, <i>Dix pour cent</i> e <i>Le Bureau des légendes</i>). Como você já domina a interface, seu cérebro absorve o vocabulário funcional sem esforço.</div>
    </div>
  `);
}
