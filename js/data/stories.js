// Histórias graduadas para o Leitor Bilíngue (A1, A2, B1).
// Cada história tem parágrafos com texto em francês, tradução e vocabulário chave com pontes.

export const STORIES = [
  {
    id: 'cafe-matin',
    title: 'Un café le matin',
    sub: 'Uma manhã típica em Paris',
    level: 'A1',
    icon: '☕',
    min: 3,
    desc: 'Rotina matinal, pedidos no balcão e saudações.',
    paragraphs: [
      {
        fr: "Il est huit heures du matin à Paris. Le soleil se lève doucement sur les toits d'ardoise.",
        pt: "São oito horas da manhã em Paris. O sol nasce suavemente sobre os telhados de ardósia.",
        en: "It is eight o'clock in the morning in Paris. The sun rises gently over the slate roofs.",
      },
      {
        fr: "Lucas sort de son appartement et descend dans la rue. L'air est frais, mais le ciel est bleu.",
        pt: "Lucas sai de seu apartamento e desce para a rua. O ar está fresco, mas o céu está azul.",
        en: "Lucas leaves his apartment and goes down to the street. The air is fresh, but the sky is blue.",
      },
      {
        fr: "Il entre dans son café préféré, au coin du boulevard. Le serveur sourit et dit : « Bonjour Lucas ! Comme d'habitude ? »",
        pt: "Ele entra no seu café preferido, na esquina do boulevard. O garçom sorri e diz: « Bom dia, Lucas! O de costume? »",
        en: "He enters his favorite café, at the corner of the boulevard. The waiter smiles and says: 'Good morning Lucas! The usual?'",
      },
      {
        fr: "« Oui, s'il vous plaît : un expresso serré et un croissant chaud », répond Lucas avec le sourire.",
        pt: "« Sim, por favor: um expresso curto e um croissant quente », responde Lucas com um sorriso.",
        en: "'Yes, please: a strong espresso and a warm croissant', replies Lucas with a smile.",
      },
      {
        fr: "Lucas s'installe en terrasse. Il ouvre son carnet et note ses idées pour la journée. C'est le début d'une belle matinée.",
        pt: "Lucas se instala na calçada. Ele abre seu caderno e anota suas ideias para o dia. É o início de uma bela manhã.",
        en: "Lucas sits on the terrace. He opens his notebook and notes his ideas for the day. It is the beginning of a beautiful morning.",
      },
    ],
  },
  {
    id: 'montreal-weekend',
    title: 'Le week-end à Montréal',
    sub: 'Poutine, sotaque quebequense e caminhada no Mont-Royal',
    level: 'A2',
    icon: '🍁',
    min: 4,
    desc: 'Descobrindo o Québec, expressões locais e estações do ano.',
    paragraphs: [
      {
        fr: "C'est la fin de semaine à Montréal. Malgré le temps un peu frais, les rues du Plateau sont vivantes et colorées.",
        pt: "É final de semana em Montreal. Apesar do tempo um pouco fresco, as ruas do Plateau estão vivas e coloridas.",
        en: "It's the weekend in Montreal. Despite the somewhat cool weather, the streets of Le Plateau are lively and colorful.",
      },
      {
        fr: "Marc retrouve son amie Sophie au dépanneur du coin. « Allô Marc ! Prêt pour grimper le mont Royal ? », demande-t-elle.",
        pt: "Marc encontra sua amiga Sophie na loja de conveniência da esquina. « Olá, Marc! Pronto para subir o Mont Royal? », pergunta ela.",
        en: "Marc meets his friend Sophie at the corner convenience store. 'Hello Marc! Ready to climb Mount Royal?', she asks.",
      },
      {
        fr: "Ils marchent à travers les arbres aux feuilles dorées. Arrivés au belvédère, la vue sur toute la ville est magnifique.",
        pt: "Eles caminham por entre as árvores com folhas douradas. Ao chegarem ao mirante, a vista de toda a cidade é magnífica.",
        en: "They walk through trees with golden leaves. Arriving at the lookout, the view of the entire city is magnificent.",
      },
      {
        fr: "Après cette marche sportive, ils ont très faim. Sophie propose : « On va manger une bonne poutine chez La Banquise ? C'est tellement le fun ! »",
        pt: "Depois dessa caminhada esportiva, eles estão com muita fome. Sophie propõe: « Vamos comer uma boa poutine no La Banquise? É tão divertido! »",
        en: "After this energetic walk, they are very hungry. Sophie suggests: 'Shall we eat a good poutine at La Banquise? It is so much fun!'",
      },
      {
        fr: "Marc adore l'ambiance chaleureuse du Québec. Même quand il fait frette dehors, les gens gardent le sourire.",
        pt: "Marc adora a atmosfera acolhedora do Québec. Mesmo quando está congelando lá fora, as pessoas continuam sorrindo.",
        en: "Marc loves the warm atmosphere of Quebec. Even when it is freezing outside, people keep smiling.",
      },
    ],
  },
  {
    id: 'entretien-tech',
    title: "L'entretien d'embauche",
    sub: 'Um desenvolvedor brasileiro em Lyon',
    level: 'B1',
    icon: '💼',
    min: 5,
    desc: 'Trabalho em equipe, termos de programação e negociação profissional.',
    paragraphs: [
      {
        fr: "Gabriel a rendez-vous à quatorze heures dans un espace de cotravail au centre de Lyon. Il postule comme développeur web full-stack.",
        pt: "Gabriel tem uma entrevista às quatorze horas em um espaço de coworking no centro de Lyon. Ele está se candidatando como desenvolvedor web full-stack.",
        en: "Gabriel has an appointment at two in the afternoon in a coworking space in downtown Lyon. He is applying as a full-stack web developer.",
      },
      {
        fr: "La responsable technique, Élodie, l'accueille avec bienveillance : « Bonjour Gabriel, bienvenue. Installez-vous. Avez-vous trouvé l'adresse facilement ? »",
        pt: "A responsável técnica, Élodie, o recebe com simpatia: « Bom dia, Gabriel, seja bem-vindo. Fique à vontade. Encontrou o endereço com facilidade? »",
        en: "The lead tech, Élodie, welcomes him warmly: 'Hello Gabriel, welcome. Have a seat. Did you find the address easily?'",
      },
      {
        fr: "« Oui, sans aucun souci, la station de métro est juste à côté », répond-il avec assurance.",
        pt: "« Sim, sem nenhuma dificuldade, a estação de metrô fica logo ao lado », responde ele com segurança.",
        en: "'Yes, without any trouble, the metro station is right next door', he answers with confidence.",
      },
      {
        fr: "Pendant quarante minutes, ils discutent d'architecture logicielle, de déploiement continu et de méthodologie agile. Gabriel explique comment il a résolu des bugs complexes.",
        pt: "Durante quarenta minutos, eles conversam sobre arquitetura de software, implantação contínua e metodologia ágil. Gabriel explica como resolveu bugs complexos.",
        en: "For forty minutes, they discuss software architecture, continuous deployment, and agile methodology. Gabriel explains how he resolved complex bugs.",
      },
      {
        fr: "« Vos compétences techniques sont excellentes et votre français est déjà très fluide », conclut Élodie avec un clin d'œil. « Nous vous recontacterons d'ici la fin de semaine ! »",
        pt: "« Suas habilidades técnicas são excelentes e seu francês já é muito fluente », conclui Élodie com uma piscadela. « Entraremos em contato até o final da semana! »",
        en: "'Your technical skills are excellent and your French is already very fluent', concludes Élodie with a wink. 'We will contact you by the end of the week!'",
      },
    ],
  },
];

