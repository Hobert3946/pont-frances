// Explorar: Ferramentas completas de estudo e imersão cultural.
import { html, mount, icon } from '../ui.js';

const TOOLS = [
  ['01', '#/learn', 'sparkles', 'AULAS INTERATIVAS', 'Trilha Duolingo (A0 → B1)', 'Prática rápida com áudio nativo, treino de pronúncia no microfone e fixação dinâmica.', true],
  ['02', '#/guide', 'compass', 'ROTEIRO COMPLETO', 'Guia Passo a Passo (A0 → B1)', 'Sequência de 19 passos estruturados para quem quer um caminho claro sem se perder.', true],
  ['03', '#/tutor', 'chat', 'CONVERSAÇÃO', 'Tutor com IA (Camille)', 'Diálogos práticos em situações reais: café, hotel, transporte e dia a dia.', true],
  ['04', '#/speed', 'zap', 'DESAFIO RÁPIDO', 'Treino Relâmpago 60s', 'Jogo de reflexo rápido para associar palavras contra o relógio.', true],
  ['05', '#/reader', 'book', 'LEITURA', 'Leitor Graduado', 'Textos e contos em francês com tradução ao toque e áudio narrado.', false],
  ['06', '#/bridges', 'bridge', 'COMPARAÇÃO', 'Pontes PT → FR → EN', 'Padrões de semelhança entre as línguas e lista de falsos amigos para não errar.', false],
  ['07', '#/verbs', 'table', 'GRAMÁTICA', 'Conjugador de Verbos', 'Tabelas completas dos principais verbos franceses em todos os tempos.', false],
  ['08', '#/listen', 'headphones', 'COMPREENSÃO', 'Ditado Auditivo', 'Treine seu ouvido escutando nativos e escrevendo o que ouviu.', false],
  ['09', '#/shadow', 'waves', 'RITMO & ENTONAÇÃO', 'Treino de Shadowing', 'Pratique a melodia e o ritmo natural do francês repetindo junto com nativos.', false],
  ['10', '#/phrases', 'bubble', 'SITUAÇÕES REAIS', 'Guia de Frases', 'Expressões práticas para viagens, restaurantes, aeroporto e trabalho.', false],
  ['11', '#/decks', 'layers', 'VOCABULÁRIO', 'Temas & Baralhos', 'Mais de 500 palavras agrupadas por temas como comida, viagem e tecnologia.', false],
  ['12', '#/lessons', 'book', 'ESTRUTURA', 'Aulas de Gramática', 'Explicações claras e contrastivas com foco em quem fala português.', false],
  ['13', '#/stats', 'trophy', 'DESEMPENHO', 'Conquistas & Métricas', 'Veja seu tempo de estudo, total de palavras dominadas e medalhas.', false],
  ['14', '#/settings', 'gauge', 'CONFIGURAÇÕES', 'Ajustes do Aplicativo', 'Escolha a voz nativa, personalize a velocidade do áudio e ajuste suas metas.', false],
];

const MEDIA = [
  ['PODCAST · A2–B1', 'InnerFrench', 'Francês articulado e claro sobre sociedade, história e cultura francesa.', 'https://innerfrench.com/'],
  ['NOTÍCIAS · DIÁRIO', 'Journal en français facile (RFI)', 'Noticiário do mundo todo em francês acessível com transcrição completa.', 'https://francaisfacile.rfi.fr/'],
  ['VÍDEO · EDUCATIVO', 'TV5Monde — Apprendre', 'Vídeos autênticos com exercícios interativos para todos os níveis.', 'https://apprendre.tv5monde.com/'],
  ['ENTREVISTAS · COTIDIANO', 'Easy French', 'Conversas espontâneas nas ruas de Paris e Montreal com legendas duplas.', 'https://www.youtube.com/@EasyFrench'],
];

export default function render(root) {
  mount(root, html`
    <header style="margin-bottom:28px;padding-top:8px">
      <div class="row" style="gap:8px;margin-bottom:6px;align-items:center">
        <span class="tag ok">BIBLIOTECA COMPLETA</span>
        <span class="small muted">Todos os recursos em um só lugar</span>
      </div>
      <h1 class="h1" style="font-size:clamp(1.7rem, 1.3rem + 1.6vw, 2.3rem);margin:0 0 6px">
        Explorar Ferramentas
      </h1>
      <p class="small muted" style="margin:0;font-size:1.02rem;max-width:65ch">
        Acesse módulos especializados para praticar vocabulário, treinar pronúncia no microfone, conjugar verbos e mergulhar na cultura francófona.
      </p>
    </header>

    <div class="bento-grid-3">
      ${TOOLS.map(([idx, href, ic, tag, title, desc, feat]) => html`
        <a class="card link stack-sm ${feat ? 'featured' : ''}" href="${href}" style="background:var(--surface);padding:22px;justify-content:space-between">
          <div>
            <div class="row between" style="margin-bottom:12px">
              <span class="tag ${feat ? 'ok' : 'fr'}">${tag}</span>
              <span class="small muted">${icon(ic)}</span>
            </div>
            <h3 class="h3" style="color:var(--text-strong);font-size:1.15rem;margin:0 0 6px">${title}</h3>
            <p class="small muted" style="margin:0;line-height:1.5">${desc}</p>
          </div>
          <div class="row between" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);font-size:0.88rem;color:var(--primary);font-weight:600">
            <span>Acessar</span>
            <span>→</span>
          </div>
        </a>
      `)}
    </div>

    <div style="margin-top:40px;margin-bottom:16px">
      <div class="row" style="gap:8px;margin-bottom:4px">
        <span class="tag fr">IMERSÃO CULTURAL</span>
        <span class="small muted">Canais e podcasts recomendados</span>
      </div>
      <h2 class="h2" style="font-size:1.4rem;margin:0">Fontes Externas para Ouvir Natos</h2>
    </div>

    <div class="bento-grid-2">
      ${MEDIA.map(([tag, title, desc, url]) => html`
        <a class="card link stack-sm" href="${url}" target="_blank" rel="noopener" style="background:var(--surface);padding:20px">
          <div class="row between">
            <span class="tag ok">${tag}</span>
            ${icon('globe')}
          </div>
          <div class="h3" style="font-size:1.18rem;color:var(--text-strong);margin:4px 0 2px">${title}</div>
          <p class="small muted" style="margin:0">${desc}</p>
        </a>
      `)}
    </div>

    <div class="callout tip" style="margin-top:24px">
      <span class="ci">💡</span>
      <div><b>Dica de Imersão:</b> altere o idioma do seu smartphone ou aplicativo de streaming para francês (como assistir séries com áudio em francês e legenda em francês ou português). O contato diário acelera a absorção sem esforço.</div>
    </div>
  `);
}
