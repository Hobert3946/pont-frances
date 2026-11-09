// Guia / Trilha Passo a Passo: O mapa do tesouro do Zero (A0) à Autonomia (B1).
// Cada passo conecta lições, fonética, vocabulário e conversação em uma sequência lógica.

export const PHASES = [
  {
    id: 1,
    title: 'Fase 1 · O Choque Inicial & Primeiros Sons',
    level: 'A0 → A1',
    badge: 'INICIAÇÃO',
    desc: 'Rompa a barreira do som, entenda como o português e o inglês ajudam e domine as primeiras palavras sem travar.',
  },
  {
    id: 2,
    title: 'Fase 2 · As Primeiras Frases & Verbos Mestres',
    level: 'A1',
    badge: 'FUNDAMENTOS',
    desc: 'Aprenda os dois verbos que sustentam 80% do francês (Être e Avoir), decifre vogais nasais e monte seus primeiros diálogos.',
  },
  {
    id: 3,
    title: 'Fase 3 · Artigos, Perguntas e o Cotidiano',
    level: 'A1+',
    badge: 'ESTRUTURA',
    desc: 'Gênero das palavras sem sofrimento, negação da vida real, perguntas naturais e agilidade com o primeiro conto com áudio.',
  },
  {
    id: 4,
    title: 'Fase 4 · O Passado & Conversação Real',
    level: 'A2',
    badge: 'COMUNICAÇÃO',
    desc: 'Conte histórias passadas com o Passé Composé, evite armadilhas de falsos amigos e faça seu primeiro bate-papo com Camille.',
  },
  {
    id: 5,
    title: 'Fase 5 · Independência & Francês da Vida Real',
    level: 'B1',
    badge: 'AUTONOMIA',
    desc: 'O futuro, o subjuntivo desmistificado como espelho do português e o vocabulário familiar usado nas ruas de Paris.',
  },
];

export const STEPS = [
  // --- FASE 1: O Choque Inicial & Primeiros Sons (A0 → A1) ---
  {
    id: 'step-01',
    phase: 1,
    num: '01',
    tag: 'ESTRATÉGIA INICIAL',
    title: 'Sua Vantagem Secreta',
    sub: 'Descubra por que você já reconhece mais de 3.000 palavras em francês graças ao português e ao inglês.',
    why: 'Antes de decorar regras, você precisa ver que o francês não é uma língua distante, mas sim uma irmã do português.',
    href: '#/lesson/a1-ponte',
    actionText: 'Começar Lição 01',
    icon: 'book',
    time: '5 min',
    isDone: (st) => !!st.lessons?.['a1-ponte'],
  },
  {
    id: 'step-02',
    phase: 1,
    num: '02',
    tag: 'FONÉTICA ACÚSTICA',
    title: 'O Som [y]: O "u" Francês',
    sub: 'O som mais famoso da língua: posicione a boca para falar "i", faça bico de "u" e teste no microfone.',
    why: 'Diferenciar "tu" [ty] de "tout" [tu] é a primeira vitória acústica para ser entendido por qualquer nativo.',
    href: '#/sound/u',
    actionText: 'Treinar Fonema [y]',
    icon: 'mic',
    time: '4 min',
    isDone: (st) => !!st.sounds?.['u'],
  },
  {
    id: 'step-03',
    phase: 1,
    num: '03',
    tag: 'MEMÓRIA FSRS',
    title: 'Suas Primeiras 10 Palavras de Ouro',
    sub: 'Estude seu primeiro lote de cartões no Baralho Essentiels com repetição espaçada neural.',
    why: 'O algoritmo FSRS programa a revisão exata antes do esquecimento. 10 palavras hoje tornam-se permanentes.',
    href: '#/review',
    actionText: 'Abrir Baralho Essencial',
    icon: 'cards',
    time: '6 min',
    isDone: (st) => Object.keys(st.cards || {}).length >= 8,
  },
  {
    id: 'step-04',
    phase: 1,
    num: '04',
    tag: 'PRONÚNCIA ESSENCIAL',
    title: 'Letras Finais Mudas & Regra CaReFuL',
    sub: 'Descubra por que "Paris" soa "Pari" e aprenda a única regra necessária para saber o que se lê e o que se cala.',
    why: 'O francês não é pronunciado como se escreve, mas tem uma lógica precisa. Dominar essa regra tira 90% da ansiedade de ler.',
    href: '#/lesson/a1-sons',
    actionText: 'Estudar Lição 02',
    icon: 'book',
    time: '7 min',
    isDone: (st) => !!st.lessons?.['a1-sons'],
  },

  // --- FASE 2: Primeiras Frases & Verbos Mestres (A1) ---
  {
    id: 'step-05',
    phase: 2,
    num: '05',
    tag: 'GRAMÁTICA PILAR',
    title: 'Être & Avoir: Os Dois Verbos Mestres',
    sub: 'Aprenda a conjugar "ser/estar" e "ter". Juntos, eles formam a espinha dorsal de toda frase e tempo composto.',
    why: 'Sem Être e Avoir não há conversa em francês. Você os usará em 70% de tudo o que disser.',
    href: '#/lesson/a1-etre-avoir',
    actionText: 'Estudar Lição 03',
    icon: 'book',
    time: '8 min',
    isDone: (st) => !!st.lessons?.['a1-etre-avoir'],
  },
  {
    id: 'step-06',
    phase: 2,
    num: '06',
    tag: 'CALIBRAGEM VOCAL',
    title: 'Vogais Nasais: [ɑ̃] de "France"',
    sub: 'Como produzir o som nasal francês sem fechar a boca nem adicionar o "u" ou "i" do português.',
    why: '"Blanc", "temps", "enfant": as nasais francesas são abertas e dão a identidade acústica à língua.',
    href: '#/sound/an',
    actionText: 'Calibrar Som Nasal',
    icon: 'mic',
    time: '4 min',
    isDone: (st) => !!st.sounds?.['an'] || !!st.sounds?.['on'],
  },
  {
    id: 'step-07',
    phase: 2,
    num: '07',
    tag: 'SITUAÇÕES REAIS',
    title: 'Frases de Sobrevivência: Café & Restaurante',
    sub: 'Peça um café, uma água, a conta e compreenda as respostas dos garçons parisienses.',
    why: 'Praticar frases fechadas e funcionais gera autoconfiança imediata para viagens e interações reais.',
    href: '#/phrases/cafe',
    actionText: 'Praticar Frases Prontas',
    icon: 'bubble',
    time: '6 min',
    isDone: (st) => (st.counters?.phrases || 0) > 0,
  },
  {
    id: 'step-08',
    phase: 2,
    num: '08',
    tag: 'ACUIDADE AUDITIVA',
    title: 'Seu Primeiro Ditado de Escuta',
    sub: 'Ouça frases curtas em velocidade nativa, digite o que ouviu e receba correção palavra por palavra.',
    why: 'Conectar o que o ouvido capta com a ortografia escrita acelera o reflexo de compreensão auditiva.',
    href: '#/listen',
    actionText: 'Fazer 1º Ditado',
    icon: 'headphones',
    time: '8 min',
    isDone: (st) => (st.counters?.dictations || 0) > 0,
  },

  // --- FASE 3: Artigos, Perguntas e o Cotidiano (A1+) ---
  {
    id: 'step-09',
    phase: 3,
    num: '09',
    tag: 'ESTRUTURA',
    title: 'Gênero & Artigos: Le, La, Un, Une',
    sub: 'Onde o gênero coincide com o português e quais são as terminações que revelam se a palavra é masculina ou feminina.',
    why: 'Em vez de memorizar o gênero de cada palavra do zero, use as terminações-chave (-tion, -té, -eau, -ment).',
    href: '#/lesson/a1-genero',
    actionText: 'Estudar Lição 04',
    icon: 'book',
    time: '7 min',
    isDone: (st) => !!st.lessons?.['a1-genero'],
  },
  {
    id: 'step-10',
    phase: 3,
    num: '10',
    tag: 'CONVERSA REAL',
    title: 'A Negação Real: "Ne... Pas"',
    sub: 'Como negar formalmente na escrita e por que na fala cotidiana os franceses quase sempre omitem o "ne".',
    why: 'Saber que os nativos dizem "j\'sais pas" em vez de "je ne sais pas" destrava seu ouvido para filmes e podcasts.',
    href: '#/lesson/a1-negation',
    actionText: 'Estudar Lição 05',
    icon: 'book',
    time: '6 min',
    isDone: (st) => !!st.lessons?.['a1-negation'],
  },
  {
    id: 'step-11',
    phase: 3,
    num: '11',
    tag: 'SISTEMA VERBAL',
    title: 'Verbos Regulares em -ER',
    sub: 'Parler, habiter, aimer, manger: um único padrão que conjuga mais de 80% dos verbos franceses.',
    why: 'Aprendendo um verbo em -ER, você ganha dezenas de verbos de graça.',
    href: '#/lesson/a1-er',
    actionText: 'Estudar Lição 06',
    icon: 'book',
    time: '7 min',
    isDone: (st) => !!st.lessons?.['a1-er'],
  },
  {
    id: 'step-12',
    phase: 3,
    num: '12',
    tag: 'REFLEXO RÁPIDO',
    title: 'Treino Relâmpago 60s',
    sub: 'Desafie seu reflexo lexical contra o relógio: acerte o máximo de traduções e construa sequências com bônus 3x.',
    why: 'Fluência não é pensar muito; é acessar a palavra sem traduzir mentalmente pelo português.',
    href: '#/speed',
    actionText: 'Jogar Sprint 60s',
    icon: 'zap',
    time: '3 min',
    isDone: (st) => (st.counters?.bestSpeedScore || 0) >= 3,
  },
  {
    id: 'step-13',
    phase: 3,
    num: '13',
    tag: 'LEITURA GRADUADA',
    title: 'Seu Primeiro Conto com Áudio Sincronizado',
    sub: 'Leia uma história leve no Leitor Bilíngue com tradução instantânea ao tocar em qualquer palavra.',
    why: 'Ver palavras dentro de uma história com contexto contextualiza a gramática e fixa a ortografia.',
    href: '#/reader',
    actionText: 'Abrir Leitor Bilíngue',
    icon: 'book',
    time: '8 min',
    isDone: (st) => (st.counters?.storiesRead || 0) > 0,
  },

  // --- FASE 4: O Passado & Conversação Real (A2) ---
  {
    id: 'step-14',
    phase: 4,
    num: '14',
    tag: 'TEMPO DO PASSADO',
    title: 'Passé Composé: Contar o que Você Fez',
    sub: 'Como relatar viagens, finais de semana e acontecimentos usando o particípio passado com avoir e être.',
    why: 'O Passé Composé é o tempo verbal mais usado na fala diária para relatar eventos concluídos.',
    href: '#/lesson/a2-passe-compose',
    actionText: 'Estudar Lição 08',
    icon: 'book',
    time: '10 min',
    isDone: (st) => !!st.lessons?.['a2-passe-compose'],
  },
  {
    id: 'step-15',
    phase: 4,
    num: '15',
    tag: 'ARMADILHAS COGNITIVAS',
    title: 'Pontes & Falsos Amigos (Faux Amis)',
    sub: 'Descubra por que "actuellement" não é "atualmente" e "attendre" não é "atender".',
    why: 'Evitar os 33 falsos cognatos clássicos poupa constrangimentos e refina sua elegância na língua.',
    href: '#/bridges',
    actionText: 'Consultar Falsos Amigos',
    icon: 'bridge',
    time: '6 min',
    isDone: (st) => (st.counters?.bridges || 0) > 0,
  },
  {
    id: 'step-16',
    phase: 4,
    num: '16',
    tag: 'PROSÓDIA & RITMO',
    title: 'Shadowing: Imitação de Cadência Nativa',
    sub: 'Ouça falantes nativos e repita simultaneamente, sincronizando entonação, pausas e ligações de som.',
    why: 'Falar francês com boa prosódia é mais sobre ritmo e ligação de palavras do que sobre cada letra isolada.',
    href: '#/shadow',
    actionText: 'Estúdio de Shadowing',
    icon: 'waves',
    time: '7 min',
    isDone: (st) => (st.counters?.shadowing || 0) > 0,
  },
  {
    id: 'step-17',
    phase: 4,
    num: '17',
    tag: 'CONVERSAÇÃO IA',
    title: 'Diálogo por Voz com Camille',
    sub: 'Converse em áudio ou texto com a tutora IA em cenários cotidianos e receba correções gentis em tempo real.',
    why: 'Praticar a fala em ambiente seguro sem julgamento destrava a timidez antes de falar com nativos reais.',
    href: '#/tutor',
    actionText: 'Conversar com Camille',
    icon: 'sparkles',
    time: '10 min',
    isDone: (st) => (st.counters?.chat || 0) > 0,
  },

  // --- FASE 5: Independência & Fluência (B1) ---
  {
    id: 'step-18',
    phase: 5,
    num: '18',
    tag: 'ALTA EXPRESSIVIDADE',
    title: 'Subjuntivo sem Drama',
    sub: 'O modo dos sentimentos, vontades e dúvidas — exatamente nos mesmos lugares em que o português o utiliza.',
    why: 'O subjuntivo francês assusta alunos anglófonos, mas para quem fala português é quase uma tradução 1 para 1.',
    href: '#/lesson/b1-subjonctif',
    actionText: 'Estudar Lição 14',
    icon: 'book',
    time: '9 min',
    isDone: (st) => !!st.lessons?.['b1-subjonctif'],
  },
  {
    id: 'step-19',
    phase: 5,
    num: '19',
    tag: 'FRANCÊS DA RUA',
    title: 'Gírias e Argot: Comme on Dit',
    sub: 'Mec, meuf, boulot, bouffer, kiffer: o francês que você ouve nas séries, músicas e conversas de bistrô.',
    why: 'Para entender franceses reais fora dos livros didáticos, dominar o vocabulário familiar é indispensável.',
    href: '#/deck/familier',
    actionText: 'Cofre de Gírias',
    icon: 'layers',
    time: '8 min',
    isDone: (st) => Object.values(st.cards || {}).some((c) => c.deck === 'familier'),
  },
];

export function getGuideProgress(st) {
  let completedCount = 0;
  const stepsWithStatus = STEPS.map((s, idx) => {
    const done = s.isDone(st);
    if (done) completedCount++;
    return { ...s, done, index: idx + 1 };
  });

  // Primeiro passo não feito é o atual
  let currentIdx = stepsWithStatus.findIndex((s) => !s.done);
  if (currentIdx === -1) currentIdx = stepsWithStatus.length - 1;

  const currentStep = stepsWithStatus[currentIdx];
  const currentPhase = PHASES.find((p) => p.id === currentStep.phase) || PHASES[0];

  const total = STEPS.length;
  const pct = Math.round((completedCount / total) * 100);

  // Agrupado por fase
  const phaseGroups = PHASES.map((p) => {
    const phaseSteps = stepsWithStatus.filter((s) => s.phase === p.id);
    const phaseDone = phaseSteps.filter((s) => s.done).length;
    return {
      ...p,
      steps: phaseSteps,
      doneCount: phaseDone,
      totalCount: phaseSteps.length,
      isComplete: phaseDone === phaseSteps.length,
      isCurrent: p.id === currentPhase.id,
    };
  });

  return {
    total,
    completedCount,
    percent: pct,
    currentStep,
    currentPhase,
    phases: phaseGroups,
    steps: stepsWithStatus,
  };
}

