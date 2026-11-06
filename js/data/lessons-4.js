// Lições B1.
export default [
  {
    id: 'b1-futur', level: 'B1', title: 'Futuro simples', sub: 'O mesmo mecanismo do "falarei"', min: 6,
    body: `
## Infinitivo + terminação
O futuro simples é o infinitivo + terminações vindas de \`avoir\` — exatamente como "falar + ei" no português!
| Pessoa | parler | Português |
| je | \`je parlerai\` | falarei |
| tu | \`tu parleras\` | falarás |
| il | \`il parlera\` | falará |
| nous | \`nous parlerons\` | falaremos |
| vous | \`vous parlerez\` | falareis |
| ils | \`ils parleront\` | falarão |
PT> "falar-ei", "falar-ás", "falar-á": português e francês formaram o futuro do mesmo jeito. As terminações até se parecem: -ai/-ei, -as/-ás, -a/-á.
*> Verbos em -re perdem o e final: \`prendre\` → \`je prendrai\`, \`dire\` → \`je dirai\`.
## Radicais irregulares (terminações sempre iguais)
| Verbo | Futuro |
| être | \`je serai\` |
| avoir | \`j'aurai\` |
| aller | \`j'irai\` |
| faire | \`je ferai\` |
| pouvoir | \`je pourrai\` |
| vouloir | \`je voudrai\` |
| savoir | \`je saurai\` |
| voir | \`je verrai\` |
| venir | \`je viendrai\` |
| devoir | \`je devrai\` |
= on verra :: veremos
= je te dirai demain :: te digo amanhã
= quand je serai à Paris, je t'appellerai :: quando eu estiver em Paris, te ligo
!> Depois de \`quand\` com sentido futuro, o francês usa **futuro** ("quand je serai"); o português usa subjuntivo ("quando eu estiver") e o inglês, presente ("when I am").
## Futur proche × futur simple
- \`je vais partir\`: plano, intenção, futuro próximo — o mais comum na fala.
- \`je partirai\`: previsões, promessas, textos — mais formal.
`,
    quiz: [
      ['"Falarei":', ['je parlai', 'je parlerai', 'je parlerais'], 1, 'Infinitivo + -ai.'],
      ['Futuro de être (je):', ['je serai', "j'étrai", 'je sera'], 0, 'être → ser-.'],
      ['"Quando eu estiver em Paris…":', ['Quand je suis à Paris…', 'Quand je serai à Paris…', 'Quand je sois à Paris…'], 1, 'Depois de quand com sentido futuro: futuro simples.'],
      ['"Veremos":', ['on verra', 'on voira', 'on vera'], 0, 'voir → verr-.'],
      ['Escreva: "eu irei" (aller)', null, "j'irai", 'aller → ir-.'],
    ],
  },
  {
    id: 'b1-subjonctif', level: 'B1', title: 'Subjuntivo', sub: 'Um presente que o português te dá', min: 8,
    body: `
## Mesmos contextos do português
O subjuntivo francês aparece onde o nosso aparece: vontade, necessidade, emoção, dúvida.
= il faut que tu viennes :: é preciso que você venha
= je veux que tu sois heureux :: quero que você seja feliz
= je suis content que tu sois là :: fico feliz que você esteja aqui
= bien qu'il soit tard :: embora seja tarde
PT> Se o português pede "que eu faça / que você venha / que ele seja", o francês quase sempre pede subjuntivo também.
EN> O inglês praticamente perdeu o subjuntivo ("I want you to come") — não use como guia.
## Formação
Pegue \`ils\` do presente, tire -ent e acrescente **-e, -es, -e, -ions, -iez, -ent**:
| | parler (ils parlent) | finir (ils finissent) |
| que je | \`parle\` | \`finisse\` |
| que tu | \`parles\` | \`finisses\` |
| qu'il | \`parle\` | \`finisse\` |
| que nous | \`parlions\` | \`finissions\` |
| que vous | \`parliez\` | \`finissiez\` |
| qu'ils | \`parlent\` | \`finissent\` |
## Os irregulares que importam
| Verbo | que je… | que nous… |
| être | \`sois\` | \`soyons\` |
| avoir | \`aie\` | \`ayons\` |
| aller | \`aille\` | \`allions\` |
| faire | \`fasse\` | \`fassions\` |
| pouvoir | \`puisse\` | \`puissions\` |
| savoir | \`sache\` | \`sachions\` |
| vouloir | \`veuille\` | \`voulions\` |
## Gatilhos mais comuns
- \`il faut que\` (é preciso que)
- \`je veux que\`, \`j'aimerais que\` (quero / gostaria que)
- \`avant que\`, \`pour que\`, \`bien que\` (antes que, para que, embora)
- \`je suis content que\`, \`j'ai peur que\` (fico feliz que, tenho medo que)
!> Armadilhas: \`j'espère que\` pede **indicativo** (\`j'espère que tu vas bien\`); depois de \`si\` nunca vem subjuntivo; \`après que\` também pede indicativo.
`,
    quiz: [
      ['"É preciso que você venha":', ['Il faut que tu viens', 'Il faut que tu viennes', 'Il faut que tu venir'], 1, 'il faut que → subjuntivo.'],
      ['"Quero que você seja feliz":', ['Je veux que tu es heureux', 'Je veux que tu sois heureux', 'Je veux tu être heureux'], 1, 'être → que tu sois.'],
      ['"Espero que você esteja bem":', ["J'espère que tu sois bien", "J'espère que tu vas bien"], 1, 'espérer que → indicativo (diferente do PT!).'],
      ['Subjuntivo de faire (que je…):', ['fasse', 'faise', 'fais'], 0, 'faire → que je fasse.'],
      ["Complete: Il faut que j'___ (aller)", null, 'aille', 'aller → que j\'aille.'],
    ],
  },
  {
    id: 'b1-si', level: 'B1', title: 'Hipóteses com "si"', sub: 'O erro nº 1 dos brasileiros', min: 7,
    body: `
## O condicional: o nosso "-ria"
Radical do futuro + terminações do imparfait: \`je parlerais\` (falaria), \`je serais\` (seria), \`j'aurais\` (teria), \`je voudrais\` (queria, gostaria).
= je voudrais un café :: eu queria um café (pedido educado)
= tu pourrais m'aider ? :: você poderia me ajudar?
= ce serait génial :: seria incrível
## Si + imparfait → condicional
= si j'avais le temps, je voyagerais :: se eu tivesse tempo, viajaria
= si tu venais, on serait contents :: se você viesse, a gente ficaria feliz
!> O português usa subjuntivo depois do "se" ("se eu tivesse"). O francês usa **imparfait**: \`si j'avais\`, nunca "si j'aurais" nem "si j'aie".
EN> Aqui o inglês acerta: "if I had time, I would travel" — mesma lógica do francês.
## Os três tipos de "si"
| Tipo | Estrutura | Exemplo |
| Real | si + presente → futuro | \`si tu viens, on ira au cinéma\` |
| Hipótese | si + imparfait → condicional | \`si j'étais riche, j'achèterais une maison\` |
| Passado irreal | si + mais-que-perfeito → condicional passado | \`si j'avais su, je serais venu\` |
= si j'avais su, je serais venu :: se eu soubesse, teria vindo
*> Truque: depois de \`si\`, nunca coloque "-rais". O "-rais" fica do outro lado da vírgula.
`,
    quiz: [
      ['"Se eu tivesse tempo…":', ["Si j'aurais le temps…", "Si j'avais le temps…", "Si j'aie le temps…"], 1, 'si + imparfait.'],
      ['"…eu viajaria":', ['je voyagerai', 'je voyagerais', 'je voyageais'], 1, 'Condicional: -rais.'],
      ['"Você poderia me ajudar?":', ["Tu pourras m'aider ?", "Tu pourrais m'aider ?", "Tu pouvais m'aider ?"], 1, 'Pedido educado → condicional.'],
      ['"Se você vier, a gente vai ao cinema":', ['Si tu viendras, on ira au cinéma', 'Si tu viens, on ira au cinéma', 'Si tu viennes, on ira au cinéma'], 1, 'si + presente → futuro.'],
      ['Escreva: "eu queria um café" (educado)', null, 'je voudrais un café', 'vouloir no condicional: je voudrais.'],
    ],
  },
  {
    id: 'b1-relatifs', level: 'B1', title: 'Qui, que, où, dont', sub: 'Frases mais longas e naturais', min: 6,
    body: `
## Os quatro relativos
| Pronome | Função | Exemplo |
| \`qui\` | sujeito | \`l'homme qui parle\` (o homem que fala) |
| \`que\` | objeto | \`le livre que je lis\` (o livro que leio) |
| \`où\` | lugar e tempo | \`la ville où j'habite\` (a cidade onde moro) |
| \`dont\` | "de que", "cujo" | \`le film dont je parle\` (o filme de que falo) |
PT> O português usa "que" nos dois primeiros casos; o francês separa: se o "que" é **sujeito** do verbo seguinte → \`qui\`; se já há outro sujeito → \`que\`.
= c'est le collègue qui m'a aidé :: é o colega que me ajudou
= c'est le collègue que j'ai aidé :: é o colega que eu ajudei
!> \`qui\` nunca sofre elisão (\`l'ami qui est là\`), mas \`que\` vira \`qu'\` (\`l'ami qu'il a vu\`).
## Où também para tempo
= le jour où je suis arrivé :: o dia em que cheguei
EN> Igual ao "the day when"; o português prefere "em que".
## Dont: o mais elegante
Substitui "de + algo", muito usado com verbos que pedem \`de\` (parler de, avoir besoin de, avoir peur de):
= voilà le livre dont j'ai besoin :: eis o livro de que preciso
= la femme dont le fils est médecin :: a mulher cujo filho é médico
*> Na fala, \`dont\` às vezes some, mas na escrita ele é a marca de um francês bem construído.
`,
    quiz: [
      ['"O homem que fala":', ["l'homme que parle", "l'homme qui parle"], 1, 'O "que" é sujeito → qui.'],
      ['"O livro que eu leio":', ['le livre qui je lis', 'le livre que je lis'], 1, 'Já há sujeito (je) → que.'],
      ['"A cidade onde moro":', ["la ville que j'habite", "la ville où j'habite", "la ville dont j'habite"], 1, 'Lugar → où.'],
      ['"O livro de que preciso":', ["le livre que j'ai besoin", "le livre dont j'ai besoin"], 1, 'avoir besoin DE → dont.'],
      ['Escreva: "o dia em que cheguei"', null, 'le jour où je suis arrivé | le jour où je suis arrivée', 'Tempo → où; arriver usa être.'],
    ],
  },
  {
    id: 'b1-oral', level: 'B1', title: 'O francês falado de verdade', sub: 'Para entender séries, podcasts e as ruas', min: 7,
    body: `
## Livro × rua
Você entende muito mais rápido quando sabe como o francês **realmente soa** na boca dos nativos.
## 1. O "ne" desaparece
= je sais pas, j'ai pas faim, c'est pas grave :: não sei, não tô com fome, não tem problema
## 2. Contrações e vogais engolidas
| Escrito | Falado |
| \`tu es\` | \`t'es\` |
| \`tu as\` | \`t'as\` |
| \`il y a\` | \`y a\` |
| \`je suis\` | \`chuis\` |
| \`je ne sais pas\` | \`chais pas\` |
| \`il faut\` | \`faut\` |
= t'as vu ça ? :: você viu isso?
= y a personne :: não tem ninguém
= chuis crevé :: tô morto de cansaço
## 3. Pergunta com a palavra no fim
= tu vas où ? :: você vai aonde?
= c'est quoi ? :: o que é isso?
= tu fais quoi ? :: tá fazendo o quê?
## 4. "On" no lugar de "nous"
= on se voit demain ? :: a gente se vê amanhã?
## 5. Ligação e encadeamento
As palavras se colam: \`les amis\` soa "lé-zami"; \`il a\` soa "i-la"; \`vous avez\` soa "vu-zavê".
= les enfants, vous avez, un ami :: lé-zanfan, vu-zavê, un-nami
*> Para treinar o ouvido: séries francesas com legenda **em francês** (Lupin, Dix pour cent, Le Bureau des légendes), o podcast InnerFrench e o "Journal en français facile" da RFI.
## 6. Verlan: sílabas invertidas
Gíria que inverte sílabas: \`femme\` → \`meuf\`, \`fou\` → \`ouf\`, \`louche\` → \`chelou\` (suspeito), \`lourd\` → \`relou\` (chato).
= c'est ouf ! :: é loucura! / incrível!
`,
    quiz: [
      ["`t'as vu ?` é a versão falada de…", ['tu as vu ?', 'tu es vu ?', 'tu avais vu ?'], 0, "tu as → t'as."],
      ['`y a personne` significa…', ['há uma pessoa', 'não tem ninguém', 'tem gente'], 1, "il n'y a personne → y a personne."],
      ['`chuis` é a contração de…', ['je suis', 'je sais', "j'ai"], 0, 'je suis → chuis.'],
      ['Em verlan, `meuf` vem de…', ['femme', 'mère', 'meuble'], 0, 'fe-mme → meuf.'],
      ['Escreva a forma completa de "chais pas"', null, 'je ne sais pas', 'Na escrita, mantenha o ne.'],
    ],
  },
];
