// Laboratório de sons: os pontos de pronúncia que mais pegam brasileiros.
// pairs: [palavra A, palavra B, tradução "A · B"] — usados no treino de ouvido (pares mínimos).
export const SOUNDS = [
  {
    id: 'u', sym: 'u', ipa: '[y]', title: 'O "u" francês', tag: 'Não existe em PT',
    body: `
Diga "i". Agora, **sem mexer a língua**, arredonde os lábios num biquinho de assobio. Esse é o [y], escrito \`u\`.
!> Não existe em português nem em inglês, e muda o sentido: \`vu\` (visto) × \`vous\` (vocês), \`rue\` (rua) × \`roue\` (roda).
*> Teste: se a língua escorregar para trás, virou o "u" brasileiro. Mantenha-a na frente, como no "i".
`,
    words: ['tu', 'rue', 'vu', 'lune', 'sur', 'salut', 'du', 'musique'],
    pairs: [['tu', 'tout', 'você · tudo'], ['rue', 'roue', 'rua · roda'], ['vu', 'vous', 'visto · vocês'], ['dessus', 'dessous', 'em cima · embaixo'], ['su', 'sous', 'sabido · sob'], ['pur', 'pour', 'puro · para']],
    sentence: 'Tu as vu la lune sur la rue ?',
  },
  {
    id: 'ou', sym: 'ou', ipa: '[u]', title: 'O "ou" = nosso "u"', tag: 'Fácil',
    body: `
Boa notícia: \`ou\` soa exatamente como o "u" do português: \`vous\` = "vu", \`nous\` = "nu".
!> O perigo é o contrário: ler \`u\` como "u" brasileiro. Compare sempre \`ou\` [u] com \`u\` [y].
`,
    words: ['vous', 'nous', 'tout', 'rouge', 'jour', 'beaucoup', 'souvent', 'bonjour'],
    pairs: [['tout', 'tu', 'tudo · você'], ['roue', 'rue', 'roda · rua'], ['vous', 'vu', 'vocês · visto'], ['pour', 'pur', 'para · puro'], ['loup', 'lu', 'lobo · lido']],
    sentence: 'Vous voulez boire du rouge ou du blanc ?',
  },
  {
    id: 'eu', sym: 'eu', ipa: '[ø] [œ]', title: 'O "eu" e o "œu"', tag: 'Não existe em PT',
    body: `
Diga "ê" e arredonde os lábios: [ø], como em \`deux\`, \`peu\`, \`bleu\`. Diga "é" aberto com lábios arredondados: [œ], como em \`peur\`, \`sœur\`, \`heure\`.
*> Regra prática: em sílaba terminada por consoante pronunciada, tende a ser aberto (\`peur\`, \`fleur\`); em sílaba final aberta, fechado (\`deux\`, \`feu\`).
!> \`deux\` [dø] ≠ \`des\` [de] ≠ \`doux\` [du]. Três sons, três palavras.
`,
    words: ['deux', 'peu', 'bleu', 'heureux', 'peur', 'sœur', 'cœur', 'heure'],
    pairs: [['deux', 'doux', 'dois · doce'], ['peu', 'pou', 'pouco · piolho'], ['feu', 'fou', 'fogo · louco'], ['jeu', 'joue', 'jogo · bochecha'], ['cœur', 'cour', 'coração · pátio'], ['deux', 'des', 'dois · uns']],
    sentence: 'Il est heureux avec sa sœur et ses deux neveux.',
  },
  {
    id: 'e', sym: 'e', ipa: '[ə]', title: 'O "e" mudo', tag: 'Some na fala',
    body: `
O \`e\` sem acento em sílaba aberta (\`le\`, \`je\`, \`de\`, \`petit\`) é um som neutro e curto, entre "ê" e "ô". Muitas vezes ele **desaparece** na fala rápida: \`samedi\` → "sam'di", \`petit\` → "p'tit", \`je ne sais pas\` → "j'sais pas".
!> \`le\` [lə] (o) × \`les\` [le] (os): a diferença entre singular e plural está só na vogal!
`,
    words: ['le', 'je', 'de', 'petit', 'demain', 'samedi', 'regarder', 'cheval'],
    pairs: [['le', 'les', 'o · os'], ['de', 'des', 'de · uns'], ['ce', 'ces', 'este · estes'], ['je', "j'ai", 'eu · eu tenho']],
    sentence: 'Je te le dis demain.',
  },
  {
    id: 'e-accent', sym: 'é / è', ipa: '[e] [ɛ]', title: 'É fechado × è aberto', tag: 'Pegadinha',
    body: `
Atenção à troca: o \`é\` francês é **fechado**, como o "ê" de "você"; o \`è\`, o \`ê\` e o \`ai\` são **abertos**, como o "é" de "pé".
- [e] fechado: \`café\`, \`été\`, \`parler\`, \`chez\`, \`nez\`
- [ɛ] aberto: \`père\`, \`fête\`, \`lait\`, \`mais\`, \`il parlait\`
PT> O português tem os mesmos dois sons — só muda a letra que os representa.
*> Par importante: \`parlé\` (falado, passé composé) × \`parlait\` (falava, imparfait).
`,
    words: ['café', 'été', 'chez', 'parler', 'père', 'fête', 'lait', 'mais'],
    pairs: [['parlé', 'parlait', 'falado · falava'], ['été', 'était', 'verão · era'], ['les', 'lait', 'os · leite'], ['fée', 'fait', 'fada · feito'], ['épée', 'épais', 'espada · espesso']],
    sentence: 'Mon père a parlé à ma mère cet été.',
  },
  {
    id: 'o', sym: 'o / ô', ipa: '[o] [ɔ]', title: 'O fechado × ó aberto', tag: 'Fácil',
    body: `
Igual ao português: [o] fechado como em "avô" (\`eau\`, \`au\`, \`ô\`, e o final de sílaba: \`mot\`, \`chaud\`) e [ɔ] aberto como em "avó" (\`porte\`, \`homme\`, \`robe\`).
*> \`eau\`, \`au\` e \`ô\` são quase sempre fechados: \`beau\`, \`chaud\`, \`hôtel\`.
`,
    words: ['eau', 'beau', 'chaud', 'mot', 'hôtel', 'porte', 'homme', 'robe'],
    pairs: [['paume', 'pomme', 'palma · maçã'], ['saute', 'sotte', 'pula · tola'], ['côte', 'cote', 'costa · cotação'], ['nôtre', 'notre', 'o nosso · nosso']],
    sentence: "Il faut de l'eau chaude pour l'homme à la porte.",
  },
  {
    id: 'an', sym: 'an / en', ipa: '[ɑ̃]', title: 'Nasal "an"', tag: 'Nasal',
    body: `
Um "ã" aberto e lá no fundo da boca, **sem** o "u" ou "m" que o português acrescenta: \`temps\` não é "tãu", \`dans\` não é "dãm".
*> \`an\`, \`am\`, \`en\`, \`em\` soam igual: \`enfant\` = "ãfã".
`,
    words: ['enfant', 'temps', 'vent', 'chambre', 'France', 'dans', 'souvent', 'maman'],
    pairs: [['vent', 'vont', 'vento · vão'], ['sans', 'son', 'sem · som'], ['temps', 'ton', 'tempo · teu'], ['blanc', 'blond', 'branco · loiro'], ['lent', 'long', 'lento · longo']],
    sentence: 'Mes enfants chantent dans la chambre en même temps.',
  },
  {
    id: 'on', sym: 'on', ipa: '[ɔ̃]', title: 'Nasal "on"', tag: 'Nasal',
    body: `
Lábios bem arredondados, como para dizer "ô", e o ar sai pelo nariz: \`bon\`, \`nom\`, \`pont\`. Não feche com "m" ou "u" no fim.
!> \`bon\` [bɔ̃] (nasal) × \`bonne\` [bɔn] (o "n" soa e a vogal deixa de ser nasal).
`,
    words: ['bon', 'nom', 'maison', 'pont', 'long', 'monde', 'bonjour', 'non'],
    pairs: [['bon', 'banc', 'bom · banco'], ['son', 'sans', 'som · sem'], ['bon', 'beau', 'bom · bonito'], ['bon', 'bonne', 'bom · boa'], ['pont', 'pain', 'ponte · pão']],
    sentence: 'Bonjour, mon oncle, ton nom est long !',
  },
  {
    id: 'in', sym: 'in / ain', ipa: '[ɛ̃]', title: 'Nasal "in"', tag: 'Nasal',
    body: `
Um "é" aberto e nasal, com a boca bem esticada: \`vin\`, \`pain\`, \`main\`. Não vire "ĩ" como em "vim".
*> \`in\`, \`im\`, \`ain\`, \`ein\` e (para a maioria dos franceses hoje) \`un\` soam igual. \`vin\`, \`vingt\`, \`vain\` e \`vint\` são homófonos!
`,
    words: ['vin', 'pain', 'main', 'plein', 'matin', 'important', 'un', 'lundi'],
    pairs: [['vin', 'vent', 'vinho · vento'], ['pain', 'pont', 'pão · ponte'], ['fin', 'fond', 'fim · fundo'], ['main', 'ment', 'mão · mente (verbo)'], ['lin', 'long', 'linho · longo']],
    sentence: 'Lundi matin, mon cousin a faim.',
  },
  {
    id: 'r', sym: 'r', ipa: '[ʁ]', title: 'O R francês', tag: 'Garganta',
    body: `
O R francês nasce no **fundo da garganta**, perto da úvula: lembra o R carioca de "carro", só que mais suave e com a voz vibrando. Nunca use o "r" de "caro".
*> Exercício: faça um gargarejo leve sem água. Depois diga "a-ra-ra" com esse som. Então \`Paris\`, \`merci\`, \`rouge\`.
!> No final de sílaba (\`merci\`, \`partir\`) ele é bem leve — quase um sopro.
`,
    words: ['rouge', 'Paris', 'merci', 'frère', 'très', 'rue', 'travail', 'partir'],
    pairs: [],
    sentence: 'Robert rentre à Paris par le train de trois heures.',
  },
  {
    id: 'oi', sym: 'oi', ipa: '[wa]', title: 'O "oi" = "uá"', tag: 'Fácil',
    body: `
\`oi\` soa "uá": \`moi\` = "muá", \`trois\` = "truá", \`voiture\` = "vuatür".
!> Nunca leia "oi" como em português: \`soir\` é "suár", não "sóir".
`,
    words: ['moi', 'toi', 'trois', 'voiture', 'soir', 'boire', 'froid', 'pourquoi'],
    pairs: [],
    sentence: 'Toi et moi, on boit un verre ce soir ?',
  },
  {
    id: 's-z', sym: 's / ss', ipa: '[z] [s]', title: 'S entre vogais = z', tag: 'Como em PT',
    body: `
Como no português: um \`s\` entre vogais soa [z] (\`maison\`, \`rose\`); \`ss\` soa [s] (\`poisson\`). Só que no francês isso **muda o sentido** com frequência.
!> \`poisson\` (peixe) × \`poison\` (veneno). Cuidado no restaurante!
`,
    words: ['maison', 'rose', 'cousin', 'poisson', 'dessert', 'désert', 'coussin', 'chose'],
    pairs: [['poisson', 'poison', 'peixe · veneno'], ['dessert', 'désert', 'sobremesa · deserto'], ['coussin', 'cousin', 'almofada · primo'], ['ils sont', 'ils ont', 'eles são · eles têm'], ['russe', 'ruse', 'russo · astúcia']],
    sentence: 'Ma cousine a mis un coussin rose dans la maison.',
  },
  {
    id: 'muettes', sym: '-s -t -d', ipa: '∅', title: 'Letras finais mudas', tag: 'Essencial',
    body: `
A maioria das consoantes finais não soa: \`Paris\`, \`petit\`, \`grand\`, \`beaucoup\`, \`nez\`. E o \`-ent\` dos verbos no plural é totalmente mudo: \`ils parlent\` = "il parl".
*> CaReFuL: c, r, f e l finais costumam soar (\`avec\`, \`bonjour\`, \`neuf\`, \`avril\`).
!> No feminino, a consoante volta a soar: \`petit\` [pəti] × \`petite\` [pətit]. Treine o ouvido com os pares.
`,
    words: ['Paris', 'petit', 'grand', 'beaucoup', 'temps', 'vingt', 'ils parlent', 'avec'],
    pairs: [['petit', 'petite', 'pequeno · pequena'], ['grand', 'grande', 'grande (m.) · grande (f.)'], ['vert', 'verte', 'verde (m.) · verde (f.)'], ['chaud', 'chaude', 'quente (m.) · quente (f.)']],
    sentence: 'Ils parlent trop et nous écoutons beaucoup.',
  },
  {
    id: 'liaison', sym: 'liaison', ipa: '‿', title: 'Ligação entre palavras', tag: 'Fluência',
    body: `
Quando uma palavra termina em consoante muda e a seguinte começa com vogal, a consoante "acorda" e se cola na próxima: \`les amis\` = "lé-zami", \`vous avez\` = "vu-zavê", \`un ami\` = "un-nami".
*> O \`s\` e o \`x\` de ligação soam [z]; o \`d\` soa [t] (\`grand homme\` = "grã-tom").
!> O h "aspirado" bloqueia a ligação: \`les héros\` (os heróis) soa "lé-erô", enquanto \`les zéros\` soa "lé-zerô".
`,
    words: ['les amis', 'vous avez', 'un enfant', 'ils ont', 'très important', 'deux heures', 'les héros', "c'est un ami"],
    pairs: [['deux heures', 'deux sœurs', 'duas horas · duas irmãs'], ['les héros', 'les zéros', 'os heróis · os zeros'], ['ils ont', 'ils sont', 'eles têm · eles são']],
    sentence: 'Mes amis ont deux enfants et un appartement à Paris.',
  },
  {
    id: 'gn-ill', sym: 'gn / ill', ipa: '[ɲ] [j]', title: '"gn" = nh e "ill" = lh/i', tag: 'Fácil',
    body: `
\`gn\` soa como o nosso "nh": \`montagne\` = "montanhe", \`Espagne\` = "Espanhe". \`ill\` depois de vogal soa como um "i" deslizado: \`famille\` = "famíi", \`travailler\` = "travaiê".
!> Exceções com "l" normal: \`ville\`, \`mille\`, \`tranquille\`.
`,
    words: ['montagne', 'champagne', 'gagner', 'fille', 'famille', 'travailler', 'soleil', 'ville'],
    pairs: [['fille', 'file', 'menina · fila'], ['paille', 'pâle', 'palha · pálido']],
    sentence: 'Ma famille travaille à la montagne en Espagne.',
  },
];
export const SOUND = Object.fromEntries(SOUNDS.map((s) => [s.id, s]));
