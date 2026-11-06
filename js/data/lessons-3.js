// Lições A2.
export default [
  {
    id: 'a2-passe-compose', level: 'A2', title: 'Passé composé', sub: 'O pretérito perfeito: comi, fui, trabalhei', min: 7,
    body: `
## Ações concluídas no passado
Para "comi", "fui", "trabalhei", o francês usa o **passé composé**: auxiliar no presente + particípio.
= j'ai mangé :: comi
= tu as fini ? :: você terminou?
= nous avons vu le film :: vimos o filme
EN> A forma lembra o "present perfect" (I have eaten), mas o uso é o do passado simples: \`hier, j'ai mangé\` = yesterday I ate.
PT> O sentido é o do nosso pretérito perfeito: "ontem eu comi".
## Particípios
| Infinitivo | Particípio | Padrão |
| parler | \`parlé\` | -er → -é |
| finir | \`fini\` | -ir → -i |
| attendre | \`attendu\` | -re → -u |
| avoir | \`eu\` | irregular |
| être | \`été\` | irregular |
| faire | \`fait\` | irregular |
| prendre | \`pris\` | irregular |
| voir | \`vu\` | irregular |
| dire | \`dit\` | irregular |
## Verbos com être: a "casa"
Alguns verbos de movimento ou mudança de estado usam **être** — e o particípio concorda com o sujeito, como adjetivo:
= je suis allé au Brésil :: fui ao Brasil
= elle est arrivée hier :: ela chegou ontem
= nous sommes partis tôt :: saímos cedo
*> Imagine uma casa: você **chega** (arriver), **entra** (entrer), **sobe** (monter), **desce** (descendre), **fica** (rester), **sai** (sortir), **cai** (tomber), **parte** (partir), **volta** (retourner, revenir), **vai** (aller), **vem** (venir), **nasce** (naître) e **morre** (mourir). Todos usam être.
!> Verbos pronominais também usam être: \`je me suis levé\` (eu me levantei).
## Negação
= je n'ai pas compris :: não entendi
= il n'est pas venu :: ele não veio
`,
    quiz: [
      ['"Comi" (ontem):', ['Je mange', "J'ai mangé", 'Je suis mangé'], 1, 'avoir + particípio.'],
      ['"Ela chegou":', ['Elle a arrivé', 'Elle est arrivée', 'Elle est arrivé'], 1, 'arriver usa être e concorda: arrivée.'],
      ['Particípio de `prendre`:', ['prendu', 'pris', 'prené'], 1, 'prendre → pris (e comprendre → compris).'],
      ['"Não entendi":', ["Je n'ai compris pas", "Je n'ai pas compris", 'Je pas ai compris'], 1, 'ne … pas abraça o auxiliar.'],
      ['Escreva: "nós fomos" (aller, com nous)', null, 'nous sommes allés | nous sommes allées', 'aller usa être; com nous, plural: allés.'],
    ],
  },
  {
    id: 'a2-imparfait', level: 'A2', title: 'Imparfait × passé composé', sub: 'Aqui o português te dá a resposta pronta', min: 7,
    body: `
## Os mesmos dois passados do português
| Português | Francês | Uso |
| perfeito: "comi" | passé composé: \`j'ai mangé\` | ação pontual, concluída |
| imperfeito: "comia" | imparfait: \`je mangeais\` | hábito, descrição, cenário |
PT> Se em português você usaria "-ava / -ia" (falava, comia, era, tinha), em francês é **imparfait**. Se usaria "falei, comi, fui", é **passé composé**.
EN> O inglês não separa tão bem ("I ate" serve para os dois; às vezes "used to" ou "was eating"). Aqui, confie no português.
## Formação do imparfait
Pegue a forma de \`nous\` no presente, tire -ons e acrescente **-ais, -ais, -ait, -ions, -iez, -aient**.
| | parler (nous parlons) | Som |
| je | \`je parlais\` | [paʁlɛ] |
| tu | \`tu parlais\` | [paʁlɛ] |
| il | \`il parlait\` | [paʁlɛ] |
| nous | \`nous parlions\` | [paʁljɔ̃] |
| vous | \`vous parliez\` | [paʁlje] |
| ils | \`ils parlaient\` | [paʁlɛ] |
*> Única exceção: \`être\` → \`j'étais\`, \`tu étais\`, \`il était\`…
## Os dois juntos: cenário + evento
= quand j'étais petit, j'habitais à Salvador :: quando eu era pequeno, morava em Salvador
= il pleuvait quand je suis sorti :: chovia quando eu saí
= je dormais quand tu as appelé :: eu estava dormindo quando você ligou
!> "Estava fazendo" (ação em andamento no passado) também é imparfait: \`je travaillais\` = eu estava trabalhando.
`,
    quiz: [
      ['"Quando eu era criança…":', ["Quand j'ai été enfant…", "Quand j'étais enfant…", 'Quand je suis enfant…'], 1, 'Descrição/estado no passado → imparfait.'],
      ['"Ontem eu fui ao cinema":', ["Hier, j'allais au cinéma", 'Hier, je suis allé au cinéma'], 1, 'Ação pontual e concluída → passé composé.'],
      ['"Eu estava dormindo quando você ligou":', ["J'ai dormi quand tu appelais", 'Je dormais quand tu as appelé'], 1, 'Cenário (imparfait) + evento (passé composé).'],
      ['Imparfait de finir (nous finissons) → je…', ['je finais', 'je finissais', 'je finirais'], 1, 'Base finiss- + -ais.'],
      ['Escreva: "eu falava" (parler)', null, 'je parlais', 'parl- + -ais.'],
    ],
  },
  {
    id: 'a2-pronoms', level: 'A2', title: 'Pronomes: le, la, lui, leur', sub: 'Antes do verbo, como no português formal', min: 7,
    body: `
## A posição: antes do verbo conjugado
| Função | Pronomes | Exemplo |
| Objeto direto (o, a, os) | \`me, te, le, la, nous, vous, les\` | \`je la vois\` — eu a vejo |
| Objeto indireto (lhe, lhes) | \`me, te, lui, nous, vous, leur\` | \`je lui parle\` — eu lhe falo |
= tu connais Marie ? Oui, je la connais. :: Conhece a Marie? Sim, conheço.
= je lui ai donné le livre :: dei o livro a ele / a ela
= je leur téléphone ce soir :: ligo para eles hoje à noite
PT> No português falado dizemos "eu vi ela", "falei com ele". Em francês isso não existe: o pronome **vai antes** do verbo — pense no português formal ("eu a vi", "eu lhe falei").
EN> O inglês põe o pronome depois ("I see her"). Não use como guia aqui.
!> \`lui\` serve para os dois gêneros no objeto indireto: \`je lui parle\` = falo com ele / com ela.
## Com tempos compostos e infinitivos
= je l'ai vu :: eu o vi (vi ele)
= je vais le faire :: vou fazer (isso)
= tu peux m'aider ? :: você pode me ajudar?
*> Com dois verbos, o pronome fica antes do infinitivo: \`je vais le faire\`, não "je le vais faire".
## No imperativo afirmativo, depois (com hífen)
= donne-moi ça ! :: me dá isso!
= regarde-le ! :: olha pra ele!
`,
    quiz: [
      ['"Eu a conheço" (Marie):', ['Je connais la', 'Je la connais', 'Je lui connais'], 1, 'Objeto direto antes do verbo.'],
      ['"Falo com ele" (parler à):', ['Je le parle', 'Je lui parle', 'Je parle lui'], 1, 'parler à → objeto indireto: lui.'],
      ['"Vou fazer isso":', ['Je le vais faire', 'Je vais le faire', 'Je vais faire le'], 1, 'O pronome fica antes do infinitivo.'],
      ['`je leur téléphone` significa…', ['eu telefono para eles', 'eu telefono para ele'], 0, 'leur = a eles / a elas.'],
      ['Escreva: "me dá isso!" (informal, com ça)', null, 'donne-moi ça', 'Imperativo afirmativo: pronome depois, com hífen.'],
    ],
  },
  {
    id: 'a2-y-en', level: 'A2', title: 'Y e en', sub: 'Os pronomes que o português não tem', min: 7,
    body: `
## Pequenos e onipresentes
\`y\` e \`en\` substituem complementos com **à** e **de**. São curtinhos e aparecem em toda conversa.
## Y = lá / nisso (substitui "à + lugar ou coisa")
= tu vas à Paris ? Oui, j'y vais. :: Vai a Paris? Sim, vou.
= je pense à mon travail → j'y pense :: penso no meu trabalho → penso nisso
= on y va ! :: vamos!
## En = disso / dele / alguns (substitui "de + coisa" e quantidades)
= tu veux du café ? Oui, j'en veux. :: Quer café? Sim, quero.
= tu as des enfants ? Oui, j'en ai deux. :: Tem filhos? Sim, tenho dois.
= je viens de Lyon → j'en viens :: venho de Lyon → venho de lá
PT> O português simplesmente omite: "Quer café? — Quero." Em francês a frase fica **incompleta** sem o \`en\`: diga \`j'en veux\`, nunca só "je veux".
!> Com números, o \`en\` é obrigatório: \`j'en ai deux\` (tenho dois).
## Expressões fixas que você vai ouvir sempre
| Francês | Português |
| \`on y va\` | vamos |
| \`ça y est\` | pronto, consegui |
| \`vas-y !\` | vai! manda ver! |
| \`je m'en vais\` | estou indo embora |
| \`j'en ai marre\` | estou de saco cheio |
| \`il n'y en a plus\` | acabou, não tem mais |
`,
    quiz: [
      ['"Quer café? — Quero.":', ['Oui, je veux.', "Oui, j'en veux.", "Oui, j'y veux."], 1, 'en substitui "de + café".'],
      ['"Vai a Paris? — Sim, vou.":', ["Oui, j'en vais.", "Oui, j'y vais.", 'Oui, je vais.'], 1, 'y substitui "à Paris".'],
      ['"Tenho dois" (filhos):', ["J'ai deux.", "J'en ai deux.", "J'y ai deux."], 1, 'Com números, en é obrigatório.'],
      ["`J'en ai marre !` significa…", ['Estou com saudade', 'Estou de saco cheio', 'Vou ao mar'], 1, 'Expressão fixa e muito comum.'],
      ['Escreva: "vamos!" (com y)', null, 'on y va | allons-y', 'on y va (falado) ou allons-y.'],
    ],
  },
  {
    id: 'a2-possessifs', level: 'A2', title: 'Possessivos: mon, ma, mes', sub: 'Concordam com a coisa, não com o dono', min: 5,
    body: `
## A tabela
| | masc. | fem. | plural |
| eu | \`mon\` | \`ma\` | \`mes\` |
| tu | \`ton\` | \`ta\` | \`tes\` |
| ele / ela | \`son\` | \`sa\` | \`ses\` |
| nós | \`notre\` | \`notre\` | \`nos\` |
| vocês / o senhor | \`votre\` | \`votre\` | \`vos\` |
| eles / elas | \`leur\` | \`leur\` | \`leurs\` |
PT> Funciona como "seu/sua" do português: concorda com o objeto. \`son livre\` = o livro dele **ou** dela; \`sa maison\` = a casa dele **ou** dela.
EN> Cuidado: o inglês escolhe pelo dono (his/her). Em francês, \`sa voiture\` pode ser "his car" ou "her car".
= c'est mon frère et ma sœur :: é meu irmão e minha irmã
= Paul aime sa femme :: Paul ama a esposa (dele)
= Marie adore son travail :: Marie adora o trabalho (dela)
## Mon antes de vogal, mesmo no feminino
!> Antes de vogal ou h mudo, use \`mon\`, \`ton\`, \`son\` também no feminino, para evitar o choque de vogais: \`mon amie\`, \`ton école\`, \`son histoire\`.
= mon amie Julie habite à Lyon :: minha amiga Julie mora em Lyon
## Para dar ênfase
= c'est son livre à elle :: é o livro DELA
= c'est à moi ! :: é meu!
`,
    quiz: [
      ['"A casa dele":', ['son maison', 'sa maison', 'leur maison'], 1, 'maison é feminino → sa, seja o dono quem for.'],
      ['"Minha amiga" (amie):', ['ma amie', 'mon amie', 'mes amie'], 1, 'Antes de vogal: mon.'],
      ['`son vélo` pode significar…', ['só a bicicleta dele', 'a bicicleta dele ou dela'], 1, 'O possessivo não indica o gênero do dono.'],
      ['"Nossos filhos":', ['notre enfants', 'nos enfants', 'nous enfants'], 1, 'Plural: nos.'],
      ['Escreva: "meu pai e minha mãe"', null, 'mon père et ma mère', 'père (m.) → mon; mère (f.) → ma.'],
    ],
  },
  {
    id: 'a2-adjectifs', level: 'A2', title: 'Adjetivos: concordância e posição', sub: 'O português guia, com algumas exceções', min: 6,
    body: `
## Concordância: como no português
O adjetivo concorda em gênero e número. Regra geral: **+e** no feminino, **+s** no plural.
= un homme grand, une femme grande :: um homem alto, uma mulher alta
= des amis brésiliens, des amies brésiliennes :: amigos brasileiros, amigas brasileiras
*> O feminino muitas vezes faz soar a consoante final que era muda: \`petit\` [pəti] → \`petite\` [pətit]; \`grand\` [gʁɑ̃] → \`grande\` [gʁɑ̃d]. É assim que o ouvido percebe o gênero!
## Femininos irregulares
| Masculino | Feminino |
| \`heureux\` | \`heureuse\` (-eux → -euse) |
| \`actif\` | \`active\` (-f → -ve) |
| \`bon\` | \`bonne\` (dobra o n) |
| \`gentil\` | \`gentille\` |
| \`beau\` | \`belle\` |
| \`nouveau\` | \`nouvelle\` |
| \`vieux\` | \`vieille\` |
## Posição: quase sempre depois
PT> Como no português, o adjetivo costuma vir depois do nome: \`une voiture rouge\`, \`un film intéressant\`.
EN> Esqueça a ordem do inglês ("a red car") — aqui o português é o guia.
## As exceções "BAGS" vêm antes
Adjetivos de **B**eleza, **A**ge (idade), **G**ood/bad (bom/mau) e **S**ize (tamanho) vêm antes:
= un beau jardin :: um jardim bonito
= une jeune femme :: uma mulher jovem
= un bon restaurant :: um bom restaurante
= un petit appartement :: um apartamento pequeno
!> Antes de vogal, beau/nouveau/vieux viram \`bel\`, \`nouvel\`, \`vieil\`: \`un bel homme\`, \`un nouvel ami\`, \`un vieil ami\`.
`,
    quiz: [
      ['"Uma mulher feliz":', ['une femme heureux', 'une femme heureuse', 'une heureuse femme'], 1, '-eux → -euse.'],
      ['"Um carro vermelho":', ['une rouge voiture', 'une voiture rouge'], 1, 'Cor vem depois, como em PT.'],
      ['"Um bom restaurante":', ['un restaurant bon', 'un bon restaurant'], 1, 'BAGS: bon vem antes.'],
      ['"Um novo amigo":', ['un nouveau ami', 'un nouvel ami', 'un nouvelle ami'], 1, 'Antes de vogal: nouvel.'],
      ['Escreva: "uma casa pequena"', null, 'une petite maison', 'petit é BAGS (tamanho) → antes do nome.'],
    ],
  },
];
