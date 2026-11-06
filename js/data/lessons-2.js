// Lições A1 (2/2).
export default [
  {
    id: 'a1-negation', level: 'A1', title: 'Negação: ne… pas', sub: 'O "sanduíche" que abraça o verbo', min: 6,
    body: `
## O sanduíche da negação
A negação abraça o verbo: **ne** antes, **pas** depois.
= je ne parle pas allemand :: não falo alemão
= il n'aime pas le café :: ele não gosta de café
= ce n'est pas grave :: não tem problema
*> \`ne\` vira \`n'\` antes de vogal: \`je n'ai pas\`, \`il n'est pas\`.
## Outras negações, mesmo formato
| Francês | Português |
| ne … jamais | nunca: \`je ne fume jamais\` |
| ne … plus | não … mais: \`il ne travaille plus ici\` |
| ne … rien | nada: \`je ne vois rien\` |
| ne … personne | ninguém: \`je ne connais personne\` |
| ne … que | só, apenas: \`je n'ai que dix euros\` |
PT> Lembra o "não… nada" e o "não… ninguém" do português — e até o "não sei não" da fala. A estrutura dupla é natural para nós.
## Depois da negação: "pas de"
Depois de uma negação, \`un\`, \`une\`, \`des\`, \`du\`, \`de la\` viram **de** (ou \`d'\`):
= je n'ai pas de voiture :: não tenho carro (afirmativa: j'ai une voiture)
= il n'y a pas de pain :: não tem pão (afirmativa: il y a du pain)
!> Com \`être\` não muda: \`ce n'est pas un problème\`.
## Na fala, o "ne" some
No francês falado do dia a dia, quase ninguém pronuncia o \`ne\`:
= je sais pas :: não sei (sem o ne)
= chais pas :: sei lá (pronúncia relaxada de "je ne sais pas")
= j'ai pas le temps :: não tenho tempo
*> Escreva com \`ne\`, mas treine o ouvido sem ele — é assim que você vai ouvir nas ruas e nas séries.
`,
    quiz: [
      ['"Não falo alemão":', ['Je ne parle allemand', 'Je ne parle pas allemand', 'Je pas parle allemand'], 1, 'ne + verbo + pas.'],
      ["Complete: Je n'ai pas ___ voiture.", ['une', 'de', 'la'], 1, 'Depois da negação: un/une/des → de.'],
      ['`il ne travaille plus ici` significa…', ['Ele trabalha mais aqui', 'Ele não trabalha mais aqui', 'Ele nunca trabalhou aqui'], 1, 'ne … plus = não … mais.'],
      ['Como os franceses costumam dizer "je ne sais pas" na conversa?', ['je ne sais', 'je sais pas / chais pas', 'ne sais pas'], 1, 'O ne cai na fala informal.'],
      ['Escreva: "eu nunca fumo"', null, 'je ne fume jamais', 'ne … jamais = nunca.'],
    ],
  },
  {
    id: 'a1-questions', level: 'A1', title: 'Fazer perguntas', sub: 'Entonação, est-ce que e inversão', min: 6,
    body: `
## Três jeitos de perguntar
| Registro | Exemplo |
| Informal (entonação) | \`Tu parles français ?\` |
| Padrão (est-ce que) | \`Est-ce que tu parles français ?\` |
| Formal (inversão) | \`Parles-tu français ?\` |
PT> O jeito informal é igual ao português: a mesma frase, subindo a entonação no fim. É o mais usado no dia a dia.
EN> \`Est-ce que\` funciona como o "do/does" do inglês: uma partícula que vira a frase em pergunta sem mudar a ordem.
## Palavras interrogativas
| Francês | Português |
| \`qui\` | quem |
| \`que\` / \`quoi\` | o que |
| \`où\` | onde |
| \`quand\` | quando |
| \`comment\` | como |
| \`pourquoi\` | por quê |
| \`combien\` | quanto |
| \`quel\` / \`quelle\` | qual |
= Où est-ce que tu habites ? :: Onde você mora?
= Tu habites où ? :: Você mora onde? (bem informal)
= Qu'est-ce que tu fais ? :: O que você faz / está fazendo?
= Comment tu t'appelles ? :: Como você se chama?
= Quelle heure est-il ? :: Que horas são?
*> \`quel\` concorda como adjetivo: \`quel jour\`, \`quelle heure\`, \`quels livres\`, \`quelles villes\` — e todos soam igual: [kɛl].
!> \`que\` vira \`quoi\` no fim da frase: \`Tu fais quoi ?\` = \`Qu'est-ce que tu fais ?\`
`,
    quiz: [
      ['Qual é a forma mais comum no dia a dia?', ['Inversão: Parles-tu ?', 'Entonação: Tu parles ?', 'Nenhuma das duas'], 1, 'A entonação é a mais usada na conversa.'],
      ['"Onde você mora?" (padrão):', ['Où est-ce que tu habites ?', 'Où tu est-ce que habites ?', 'Est-ce où tu habites ?'], 0, 'Palavra interrogativa + est-ce que + frase normal.'],
      ['"Que horas são?":', ['Quoi heure est-il ?', 'Quelle heure est-il ?', 'Quel heure est-il ?'], 1, 'heure é feminino → quelle.'],
      ['`pourquoi` significa…', ['para quê', 'por quê', 'por onde'], 1, 'pour + quoi = por quê.'],
      ['Escreva "Como você se chama?" (informal)', null, "comment tu t'appelles | tu t'appelles comment | comment t'appelles-tu | comment est-ce que tu t'appelles", 'Qualquer um dos três registros vale.'],
    ],
  },
  {
    id: 'a1-partitif', level: 'A1', title: 'Du, de la, des', sub: 'O artigo que o português não tem', min: 6,
    body: `
## Um artigo para "um pouco de"
Para falar de uma quantidade indefinida (pão, água, sorte…), o francês exige um artigo especial — o **partitivo**:
| | Uso | Exemplo |
| \`du\` | masculino | \`du pain\` (pão) |
| \`de la\` | feminino | \`de la confiture\` (geleia) |
| \`de l'\` | antes de vogal | \`de l'eau\` (água) |
| \`des\` | plural | \`des légumes\` (legumes) |
= je mange du pain :: eu como pão
= tu veux de l'eau ? :: você quer água?
= il y a de la place :: tem lugar
PT> Em português dizemos só "como pão", "quer água?". Em francês, "je mange pain" está **errado**: falta o artigo. É um dos erros mais típicos de brasileiros.
EN> Equivale ao "some" do inglês ("some bread"), só que obrigatório.
## Partitivo × artigo definido
- Gosto em geral → artigo definido: \`j'aime le café\` (gosto de café).
- Consumo de uma parte → partitivo: \`je bois du café\` (bebo café).
## Com quantidade, só "de"
= beaucoup de travail :: muito trabalho
= un peu de sucre :: um pouco de açúcar
= un verre de vin :: uma taça de vinho
!> Na negação também: \`je ne mange pas de viande\` (não como carne).
*> Para lembrar: **du = de + le**, **des = de + les**. O mesmo vale para "à": \`au\` = à + le, \`aux\` = à + les (\`au cinéma\`, \`aux États-Unis\`).
`,
    quiz: [
      ['"Eu como pão":', ['Je mange pain', 'Je mange du pain', 'Je mange le pain'], 1, 'Quantidade indefinida → partitivo.'],
      ['"Você quer água?":', ["Tu veux de l'eau ?", 'Tu veux du eau ?', 'Tu veux eau ?'], 0, 'Antes de vogal: de l\'.'],
      ['"Eu gosto de café" (em geral):', ["J'aime du café", "J'aime le café", "J'aime de café"], 1, 'Gostos e preferências → artigo definido.'],
      ['"Muito trabalho":', ['beaucoup du travail', 'beaucoup de travail', 'beaucoup travail'], 1, 'Depois de quantidade: só de.'],
      ['Escreva: "não como carne"', null, 'je ne mange pas de viande', 'Negação + partitivo → de.'],
    ],
  },
  {
    id: 'a1-on', level: 'A1', title: 'On = a gente', sub: 'O pronome mais útil do francês falado', min: 5,
    body: `
## Você já sabe usar
\`on\` funciona exatamente como o nosso **"a gente"**: quer dizer "nós", mas o verbo vai na 3ª pessoa do singular.
= on va au cinéma ce soir ? :: a gente vai ao cinema hoje à noite?
= on mange ensemble ? :: a gente come junto?
= on y va ! :: vamos!
PT> É a mesma estrutura: "a gente vai" (não "a gente vamos") → \`on va\`, \`on mange\`, \`on est\`.
## Nous × on
- \`nous\` → escrita e situações formais.
- \`on\` → conversa do dia a dia (bem mais comum na fala).
= nous sommes brésiliens :: somos brasileiros
= on est brésiliens :: a gente é brasileiro
## On genérico (o "se" do português)
\`on\` também significa "alguém", "as pessoas":
= ici, on parle français :: aqui se fala francês
= on dit que c'est difficile :: dizem que é difícil
= comment on dit ça en français ? :: como se diz isso em francês?
EN> No sentido genérico, \`on\` lembra o "you/they" genérico do inglês ("they say…").
*> Bônus: \`on\` permite fugir das formas de \`nous\` (-ons), que são as mais longas. Atalho legítimo!
`,
    quiz: [
      ['`on va au cinéma` significa…', ['ele vai ao cinema', 'a gente vai ao cinema', 'eles vão ao cinema'], 1, 'on = a gente.'],
      ['Complete: On ___ brésiliens.', ['sommes', 'est', 'sont'], 1, 'on + 3ª pessoa do singular: on est.'],
      ['"Aqui se fala francês":', ['Ici, se parle français', 'Ici, on parle français', 'Ici, nous parle français'], 1, 'on genérico = "se".'],
      ['Na conversa informal, qual é mais comum?', ['nous', 'on'], 1, 'on domina a fala.'],
      ['Escreva: "vamos!" (com on)', null, 'on y va', 'on y va = vamos (lá)!'],
    ],
  },
  {
    id: 'a1-futur-proche', level: 'A1', title: 'Futuro próximo e "acabar de"', sub: 'aller + infinitivo, venir de + infinitivo', min: 5,
    body: `
## Aller + infinitivo = ir + infinitivo
O jeito mais comum de falar do futuro é idêntico ao português:
= je vais manger :: vou comer
= on va voir :: vamos ver
= il va pleuvoir :: vai chover
= ils vont arriver demain :: eles vão chegar amanhã
| Pessoa | aller | + infinitivo |
| je | \`je vais\` | partir |
| tu | \`tu vas\` | travailler |
| il, elle, on | \`il va\` | venir |
| nous | \`nous allons\` | sortir |
| vous | \`vous allez\` | voir |
| ils, elles | \`ils vont\` | dormir |
PT> Mesma estrutura: "vou comer" = \`je vais manger\`.
EN> Equivale ao "going to": I'm going to eat.
## Venir de + infinitivo = acabar de
= je viens de manger :: acabei de comer
= il vient d'arriver :: ele acabou de chegar
= on vient de finir :: a gente acabou de terminar
!> Não traduza "acabar" ao pé da letra: o francês usa **venir** (vir) — literalmente "venho de comer".
EN> "I've just eaten" = \`je viens de manger\`.
## Negação
O \`ne … pas\` abraça o verbo conjugado (\`aller\`):
= je ne vais pas sortir ce soir :: não vou sair hoje à noite
`,
    quiz: [
      ['"Vou comer":', ['Je vais manger', 'Je manger vais', 'Je vais mange'], 0, 'aller conjugado + infinitivo.'],
      ['"Acabei de chegar":', ["J'ai fini d'arriver", "Je viens d'arriver", "Je vais d'arriver"], 1, 'venir de + infinitivo.'],
      ['"Vai chover":', ['Il va pleuvoir', 'Il vient pleuvoir', 'Il pleut va'], 0, 'Futuro próximo com aller.'],
      ['"Não vou sair":', ['Je vais ne pas sortir', 'Je ne vais pas sortir', 'Je ne vais sortir pas'], 1, 'A negação abraça o verbo conjugado.'],
      ['Escreva: "nós vamos ver" (com nous)', null, 'nous allons voir', 'nous allons + infinitivo.'],
    ],
  },
];
