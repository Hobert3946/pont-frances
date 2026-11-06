// Lições A1 (1/2). Quiz: [pergunta, opções | null (digitar), resposta (índice ou texto "a | b"), explicação]
export default [
  {
    id: 'a1-ponte', level: 'A1', title: 'Sua vantagem secreta', sub: 'Por que português + inglês encurtam o caminho', min: 5,
    body: `
## Você não começa do zero
Falando português e inglês avançado, você já reconhece milhares de palavras francesas. O francês é irmão do português (os dois vêm do latim) e foi a língua da elite inglesa por uns 300 anos depois de 1066 — por isso cerca de um terço do vocabulário inglês veio do francês.
= l'information est importante :: a informação é importante
= la situation est difficile :: a situação é difícil
= c'est une excellente idée :: é uma excelente ideia
PT> **Gramática**: gênero (o/a), conjugações, subjuntivo, perfeito × imperfeito, "a gente" (\`on\`), "ter fome" (\`avoir faim\`). O português é seu mapa da estrutura.
EN> **Vocabulário**: \`garage\`, \`machine\`, \`restaurant\`, \`possible\`, \`table\`, \`question\`, \`important\`. Muitas palavras são idênticas na escrita — só a pronúncia muda.
## Onde nenhuma das duas ajuda
- **Pronúncia**: letras finais mudas, vogais nasais diferentes das nossas, o \`u\` francês e o R da garganta.
- **Ortografia**: \`eau\`, \`au\` e \`ô\` soam todos [o].
- **Falsos amigos**: palavras que parecem, mas não são (veja Explorar → Pontes).
*> Estratégia do Pont: aproveitar ao máximo o que já transfere e investir seu tempo onde está a dificuldade real — **ouvir e pronunciar**.
## Padrões de conversão (prévia)
| Português | Francês | Inglês |
| -dade | -té: \`liberté\` | -ty: liberty |
| -ção | -tion: \`nation\` | -tion: nation |
| -mente | -ment: \`rapidement\` | -ly: rapidly |
| -oso | -eux: \`fameux\` | -ous: famous |
!> Mesmo quando a palavra é igual, a pronúncia quase nunca é. Toque sempre no áudio.
`,
    quiz: [
      ['Qual a melhor tradução de `la liberté`?', ['a liberdade', 'o livro', 'a libertação'], 0, '-dade (PT) ↔ -té (FR) ↔ -ty (EN): liberdade, liberté, liberty.'],
      ['Pelo padrão -oso → -eux, "famoso" em francês é…', ['famoux', 'fameux', 'famose'], 1, 'famoso → fameux, como "famous" em inglês.'],
      ['Em que o português mais ajuda no francês?', ['Pronúncia', 'Gramática: gênero, tempos verbais, subjuntivo', 'Ortografia'], 1, 'A estrutura das duas línguas é muito parecida.'],
      ['"Rapidamente" em francês:', ['rapidemente', 'rapidement', 'rapidly'], 1, '-mente → -ment.'],
      ['Por que o inglês tem tantas palavras francesas?', ['Por causa da Revolução Francesa', 'A conquista normanda de 1066 levou o francês à elite inglesa', 'Porque o inglês é uma língua latina'], 1, 'Por cerca de três séculos após 1066, a corte inglesa falava francês normando.'],
    ],
  },
  {
    id: 'a1-sons', level: 'A1', title: 'Pronúncia: o essencial', sub: 'O francês não se lê como se escreve — mas tem lógica', min: 7,
    body: `
## Regra de ouro: o final da palavra quase sempre é mudo
= Paris :: o "s" final não soa: [paʁi]
= petit :: [pəti] — o "t" final é mudo
= ils parlent :: [il paʁl] — o "-ent" dos verbos é mudo!
*> Exceção útil: as consoantes de **CaReFuL** (c, r, f, l) costumam soar no final: \`avec\`, \`bonjour\`, \`neuf\`, \`avril\`. Mas o -er dos verbos soa [e]: \`parler\`.
## Combinações que valem um som só
| Escrita | Som | Exemplos |
| eau, au, ô | [o] fechado | \`beau\`, \`chaud\`, \`hôtel\` |
| ou | [u] nosso "u" | \`vous\`, \`nous\`, \`rouge\` |
| u | [y] "i" com bico de "u" | \`tu\`, \`rue\`, \`sur\` |
| oi | [wa] | \`moi\`, \`trois\`, \`voiture\` |
| ai, è, ê | [ɛ] "é" aberto | \`lait\`, \`père\`, \`fête\` |
| é, -er, -ez | [e] "ê" fechado | \`café\`, \`parler\`, \`chez\` |
| eu, œu | [ø] / [œ] | \`deux\`, \`peur\`, \`sœur\` |
| ch | [ʃ] nosso "x" | \`chat\`, \`chercher\` |
| gn | [ɲ] nosso "nh" | \`montagne\`, \`Espagne\` |
!> Pegadinha: o \`é\` francês é **fechado**, como o "ê" de "você". O \`è\` é aberto, como o "é" de "pé". Então \`café\` soa "cafê".
PT> O francês tem vogais nasais como o português, mas **sem o "u" ou "i" que o PT acrescenta no fim**: \`bon\` não é "bõu", é [bɔ̃]; \`pain\` não é "pãi".
## O R francês
Feito no fundo da garganta: lembra o R carioca de "carro", só que mais suave e vozeado. Nunca é o "r" de "caro".
= rouge, Paris, merci :: o R nasce lá atrás, perto da úvula
## O "u" que não existe em português
!> \`tu\` [ty] ≠ \`tout\` [tu]. Diga "i" e, sem mexer a língua, faça bico de "u". Esse som muda significados: \`vu\` (visto) × \`vous\` (vocês).
*> Treine esses sons com reconhecimento de voz em **Falar → Laboratório de sons**.
`,
    quiz: [
      ['Como soa o final de `ils parlent`?', ['"parlent", com -ent nasal', '"parl" — o -ent é mudo', '"parlê"'], 1, 'O -ent da 3ª pessoa do plural nunca soa.'],
      ['Qual combinação soa [o]?', ['ou', 'eau', 'eu'], 1, 'eau, au e ô soam [o]. "ou" soa [u].'],
      ['`tu` e `tout` soam iguais?', ['Sim', 'Não: tu [ty] tem o "u" francês; tout [tu] tem o nosso "u"'], 1, 'Essa diferença distingue palavras: vu/vous, rue/roue.'],
      ['O `é` de `café` soa como…', ['o "é" aberto de "pé"', 'o "ê" fechado de "você"', 'um "i"'], 1, 'Em francês, é = [e] fechado.'],
      ['Qual palavra termina com consoante pronunciada?', ['petit', 'avec', 'Paris'], 1, 'CaReFuL: c, r, f, l costumam soar no fim.'],
    ],
  },
  {
    id: 'a1-genero', level: 'A1', title: 'Gênero e artigos', sub: 'le, la, les, un, une, des', min: 6,
    body: `
## Como no português: todo substantivo tem gênero
| | Masculino | Feminino | Plural |
| Definido (o/a/os/as) | \`le\` | \`la\` | \`les\` |
| Indefinido (um/uma/uns) | \`un\` | \`une\` | \`des\` |
= le livre, la table, les livres :: o livro, a mesa, os livros
= un café, une baguette, des croissants :: um café, uma baguete, uns croissants
*> Antes de vogal ou h mudo, \`le\` e \`la\` viram \`l'\`: \`l'ami\`, \`l'école\`, \`l'hôtel\`. Isso esconde o gênero — por isso o Pont marca (m.) ou (f.) nessas palavras.
PT> Na maioria dos cognatos o gênero coincide: \`la maison\` (a casa), \`le livre\` (o livro), \`la question\` (a questão), \`le problème\` (o problema).
## Gênero trocado: as pegadinhas
| Francês | Português |
| \`la mer\` | o mar |
| \`la dent\` | o dente |
| \`la fin\` | o fim |
| \`la valeur\`, \`la chaleur\` | o valor, o calor |
| \`la planète\` | o planeta |
| \`la méthode\` | o método |
| \`le voyage\`, \`le message\` | a viagem, a mensagem |
| \`l'arbre\` (m.) | a árvore |
## Terminações que entregam o gênero
- **-age** → masculino: \`le fromage\`, \`le garage\`, \`le voyage\` (exceções: \`la page\`, \`la plage\`, \`l'image\`).
- **-tion, -té, -ure, -ance, -ence** → feminino: \`la nation\`, \`la liberté\`, \`la voiture\`, \`la chance\`.
- **-ment, -isme, -eau** → masculino: \`le moment\`, \`le tourisme\`, \`le bureau\` (mas \`l'eau\` é feminino!).
EN> O inglês não tem gênero gramatical, então aqui ele não ajuda. Aprenda cada substantivo **com o artigo**: não "voiture", e sim "la voiture".
`,
    quiz: [
      ['Qual o artigo de `mer` (mar)?', ['le', 'la'], 1, 'LA mer — feminino em francês, masculino em português.'],
      ['Palavras em -age (voyage, message) costumam ser…', ['femininas, como em PT', 'masculinas'], 1, '-age é quase sempre masculino: le voyage, le message.'],
      ['"O hotel" em francês:', ['le hôtel', "l'hôtel", 'la hôtel'], 1, 'h mudo conta como vogal: le + hôtel → l\'hôtel.'],
      ['"Umas baguetes":', ['les baguettes', 'des baguettes', 'unes baguettes'], 1, 'O plural de un/une é des.'],
      ['Escreva "a liberdade" em francês', null, 'la liberté', '-dade → -té, e as palavras em -té são femininas.'],
    ],
  },
  {
    id: 'a1-etre-avoir', level: 'A1', title: 'Être e avoir', sub: 'Ser/estar e ter — os dois pilares', min: 6,
    body: `
## Être: ser e estar ao mesmo tempo
| Pessoa | être | Português |
| je | \`je suis\` | eu sou / estou |
| tu | \`tu es\` | você é / está (informal) |
| il, elle, on | \`il est\` | ele é / está |
| nous | \`nous sommes\` | nós somos / estamos |
| vous | \`vous êtes\` | vocês são; o senhor é |
| ils, elles | \`ils sont\` | eles são / estão |
= je suis brésilien et je suis fatigué :: sou brasileiro e estou cansado
EN> Como o "to be", \`être\` cobre **ser** e **estar**. Aqui o inglês é o melhor guia.
## Avoir: ter
| Pessoa | avoir |
| je | \`j'ai\` |
| tu | \`tu as\` |
| il, elle, on | \`il a\` |
| nous | \`nous avons\` |
| vous | \`vous avez\` |
| ils, elles | \`ils ont\` |
PT> O francês usa **avoir** onde o português usa "ter" e o inglês usa "to be": \`j'ai faim\` (tenho fome / I'm hungry), \`j'ai froid\` (tenho frio), \`j'ai 30 ans\` (tenho 30 anos), \`j'ai peur\` (tenho medo), \`j'ai raison\` (tenho razão).
!> \`ils sont\` [ilsɔ̃] (eles são) × \`ils ont\` [ilzɔ̃] (eles têm): a diferença é o som de **z** da ligação. Escute os dois.
## Tu ou vous?
- \`tu\`: amigos, família, crianças, colegas próximos.
- \`vous\`: desconhecidos, chefes, atendimento — e também o plural "vocês".
*> Na dúvida, use \`vous\`. O francês avisa quando dá para passar ao tu: \`On peut se tutoyer ?\`
`,
    quiz: [
      ['"Estou cansado":', ["J'ai fatigué", 'Je suis fatigué', 'Je fatigué'], 1, 'Estado → être.'],
      ['"Tenho fome":', ['Je suis faim', "J'ai faim", "J'ai fame"], 1, 'PT ajuda: ter fome → avoir faim.'],
      ['`ils ont` significa…', ['eles são', 'eles têm'], 1, 'ils ont = eles têm, com som de z: [ilzɔ̃].'],
      ['Para falar com um desconhecido na rua, use…', ['tu', 'vous'], 1, 'vous é o tratamento respeitoso.'],
      ['Escreva "nós somos"', null, 'nous sommes', 'être: je suis, tu es, il est, nous sommes, vous êtes, ils sont.'],
    ],
  },
  {
    id: 'a1-er', level: 'A1', title: 'Verbos em -er', sub: 'O modelo que conjuga 90% dos verbos', min: 6,
    body: `
## Um modelo, milhares de verbos
Quase todos os verbos franceses terminam em **-er** e seguem o mesmo padrão. Aprenda \`parler\` e você conjuga \`aimer\`, \`travailler\`, \`habiter\`, \`chercher\`, \`écouter\`…
| Pessoa | parler | Som |
| je | \`je parle\` | [paʁl] |
| tu | \`tu parles\` | [paʁl] |
| il, elle, on | \`il parle\` | [paʁl] |
| nous | \`nous parlons\` | [paʁlɔ̃] |
| vous | \`vous parlez\` | [paʁle] |
| ils, elles | \`ils parlent\` | [paʁl] |
*> Veja a coluna "Som": **quatro formas soam idênticas**. Na fala, só existem três: "parl", "parlon", "parlê".
PT> A lógica é a do português (falo, falas, fala…), mas o francês **sempre exige o pronome**: como \`parle\` não diz quem fala, \`je\`, \`tu\`, \`il\` são obrigatórios.
## Elisão: je → j'
Antes de vogal ou h mudo, \`je\` vira \`j'\`: \`j'aime\`, \`j'habite\`, \`j'écoute\`.
= j'aime la musique brésilienne :: eu gosto de música brasileira
= nous habitons à Salvador :: nós moramos em Salvador
= vous travaillez où ? :: onde vocês trabalham?
## Presente = "estou fazendo"
O francês não tem um gerúndio para o presente contínuo: \`je parle\` = falo / estou falando.
= Qu'est-ce que tu fais ? — Je travaille. :: O que você está fazendo? — Estou trabalhando.
*> Para enfatizar a ação em andamento existe \`être en train de\`: \`je suis en train de manger\` (estou comendo agora).
`,
    quiz: [
      ['Quantas formas de `parler` no presente soam iguais?', ['2', '4', '6'], 1, 'je parle, tu parles, il parle, ils parlent → [paʁl].'],
      ['"Nós trabalhamos":', ['nous travaillez', 'nous travaillons', 'nous travaillent'], 1, 'nous → -ons.'],
      ['"Eu moro em Salvador":', ['Je habite à Salvador', "J'habite à Salvador", "J'habiter à Salvador"], 1, 'Elisão: je + habite → j\'habite.'],
      ['`je mange` pode significar…', ['só "eu como"', '"eu como" e "estou comendo"'], 1, 'O presente francês cobre os dois sentidos.'],
      ['Conjugue aimer com vous', null, 'vous aimez', 'vous → -ez.'],
    ],
  },
];
