# Pont — francês para quem já fala português e inglês

PWA (app instalável, funciona offline) para aprender francês usando o português e o inglês como pontes.

## Como abrir no computador

Dê dois cliques em **`iniciar.cmd`** (precisa do Node instalado). Ele sobe um servidor em `http://localhost:5173` e abre o Edge.
Use o **Edge** no Windows: ele tem as vozes neurais francesas mais naturais (Denise, Henri, Vivienne) e reconhecimento de voz.

Ou, no terminal: `node serve.mjs` e abra `http://localhost:5173`.

## Como instalar no celular

Um PWA precisa de HTTPS para instalar no celular. O jeito mais simples é o **GitHub Pages**:

1. Crie um repositório (pode ser privado com GitHub Pro, ou público) e envie esta pasta.
2. Em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
3. Abra o endereço `https://SEU-USUARIO.github.io/NOME-DO-REPO/` no celular:
   - **Android (Chrome):** menu ⋮ → *Instalar app*.
   - **iPhone (Safari):** Compartilhar → *Adicionar à Tela de Início*.

O progresso fica salvo no próprio aparelho. Para levar de um aparelho para outro: *Ajustes → Backup → Exportar/Importar*.

## O que tem dentro

| Área | O que faz |
|---|---|
| Revisão (FSRS-5) | 420 palavras em 14 temas, agendadas pelo mesmo algoritmo do Anki moderno. O cartão evolui: reconhecer → ouvir sem ver → produzir (digitando ou falando). |
| Lições | 21 lições A1→B1 que mostram onde o PT ajuda (subjuntivo, imperfeito, "a gente" = *on*) e onde engana (*si j'avais*, partitivo, gênero trocado). Quiz em cada uma. |
| Laboratório de sons | 15 sons difíceis para brasileiros, com pares mínimos (vozes variadas a cada rodada) e nota de pronúncia pelo microfone. |
| Shadowing e ditado | 60 frases graduadas; nota da fala, correção palavra por palavra na escrita. |
| Conjugação | 77 verbos × 7 tempos gerados por regras + exceções, com áudio e modo treino. |
| Pontes | 16 padrões PT→FR→EN (-dade → -té → -ty…), 33 falsos amigos, jogos de dedução. |
| Tutor com IA | Role-play por voz com o Claude (8 cenas, níveis A1–B2), correções em português. Usa a sua chave da API da Anthropic (fica só no navegador). |

## Tecnologia

HTML/CSS/JS puro, sem build. Web Speech API (síntese e reconhecimento), Web Audio (ondas do microfone e efeitos), MediaRecorder (ouvir a própria voz), Service Worker (offline), Badging API (número de revisões no ícone), Wake Lock (tela acesa na sessão), Storage persistente.

O tutor chama a API da Anthropic direto do navegador com o SDK oficial (`@anthropic-ai/sdk` 1.3.0 via CDN), modelo padrão `claude-opus-5-5`, com *fallback* no servidor caso um filtro de segurança recuse uma mensagem.

## Estrutura

```
index.html  manifest.webmanifest  sw.js  serve.mjs  iniciar.cmd
css/        base.css (tema, layout)  components.css
js/         app.js (rotas)  store.js  fsrs.js  srs.js  speech.js  ui.js  markup.js  practice.js
js/data/    vocabulário, lições, sons, verbos, pontes, frases
js/views/   uma tela por arquivo
```

Ao alterar arquivos, aumente `VERSION` em `sw.js` para os aparelhos receberem a atualização.
