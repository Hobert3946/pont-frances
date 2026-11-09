// Sistema de Conquistas (Badges) do Pont.
import { getState, unlockAchievement, hasAchievement, streak } from './store.js';
import { toast, confetti, sfx } from './ui.js';

export const ACHIEVEMENTS = [
  {
    id: 'first_lesson',
    title: 'Premiers Pas',
    desc: 'Conclua a sua primeira lição de gramática.',
    icon: '🥖',
    xp: 20,
    check: (st) => Object.values(st.lessons || {}).some((l) => l?.best > 0 || l?.at > 0),
    progress: (st) => {
      const done = Object.keys(st.lessons || {}).length;
      return { cur: Math.min(1, done), max: 1 };
    },
  },
  {
    id: 'first_review',
    title: 'Flash Master',
    desc: 'Realize revisões de vocabulário com o algoritmo FSRS.',
    icon: '⚡',
    xp: 20,
    check: (st) => Object.keys(st.cards || {}).length >= 5,
    progress: (st) => ({ cur: Math.min(5, Object.keys(st.cards || {}).length), max: 5 }),
  },
  {
    id: 'speed_demon',
    title: 'Fórmula 1',
    desc: 'Faça 10 ou mais acertos no Treino Relâmpago (60s).',
    icon: '🏎️',
    xp: 30,
    check: (st) => (st.counters?.bestSpeedScore || 0) >= 10,
    progress: (st) => ({ cur: Math.min(10, st.counters?.bestSpeedScore || 0), max: 10 }),
  },
  {
    id: 'streak_3',
    title: 'Foco Inicial',
    desc: 'Mantenha 3 dias seguidos de estudo ativo.',
    icon: '🔥',
    xp: 25,
    check: () => streak() >= 3,
    progress: () => ({ cur: Math.min(3, streak()), max: 3 }),
  },
  {
    id: 'streak_7',
    title: 'Semana em Chamas',
    desc: 'Mantenha uma ofensiva ininterrupta de 7 dias.',
    icon: '🏆',
    xp: 50,
    check: () => streak() >= 7,
    progress: () => ({ cur: Math.min(7, streak()), max: 7 }),
  },
  {
    id: 'shadow_expert',
    title: 'Imitador Nato',
    desc: 'Treine o ritmo e melodia da fala em 10 frases no Shadowing.',
    icon: '🗣️',
    xp: 30,
    check: (st) => (st.counters?.shadowing || 0) >= 10,
    progress: (st) => ({ cur: Math.min(10, st.counters?.shadowing || 0), max: 10 }),
  },
  {
    id: 'dictation_pro',
    title: 'Ouvido de Ouro',
    desc: 'Complete 5 ditados com nota de escuta.',
    icon: '🎧',
    xp: 30,
    check: (st) => (st.counters?.dictations || 0) >= 5,
    progress: (st) => ({ cur: Math.min(5, st.counters?.dictations || 0), max: 5 }),
  },
  {
    id: 'reader_starter',
    title: 'Leitor Voraz',
    desc: 'Leia e explore uma história no Leitor Bilíngue com áudio.',
    icon: '📖',
    xp: 25,
    check: (st) => (st.counters?.storiesRead || 0) >= 1,
    progress: (st) => ({ cur: Math.min(1, st.counters?.storiesRead || 0), max: 1 }),
  },
  {
    id: 'memory_50',
    title: 'Memória de Ferro',
    desc: 'Tenha 30 ou mais cartões memorizados no FSRS.',
    icon: '🧠',
    xp: 40,
    check: (st) => Object.values(st.cards || {}).filter((c) => c && c.s >= 2).length >= 30,
    progress: (st) => ({
      cur: Math.min(30, Object.values(st.cards || {}).filter((c) => c && c.s >= 2).length),
      max: 30,
    }),
  },
  {
    id: 'streak_shield',
    title: 'À Prova de Falhas',
    desc: 'Tenha um Protetor de Ofensiva guardado.',
    icon: '🛡️',
    xp: 20,
    check: (st) => (st.streakFreezes || 0) > 0,
    progress: (st) => ({ cur: Math.min(1, st.streakFreezes || 0), max: 1 }),
  },
  {
    id: 'xp_500',
    title: 'Centenário de Ouro',
    desc: 'Alcance 500 XP acumulados na sua jornada.',
    icon: '💎',
    xp: 50,
    check: (st) => (st.xp || 0) >= 500,
    progress: (st) => ({ cur: Math.min(500, st.xp || 0), max: 500 }),
  },
];

export function checkAchievements() {
  const st = getState();
  for (const ach of ACHIEVEMENTS) {
    if (!hasAchievement(ach.id)) {
      try {
        if (ach.check(st)) {
          if (unlockAchievement(ach.id)) {
            confetti();
            sfx?.fanfare?.();
            toast(`Nova conquista desbloqueada: ${ach.icon} ${ach.title}! 🎉`, { type: 'ok', ms: 5000 });
          }
        }
      } catch (e) {
        console.warn('Erro ao checar conquista:', ach.id, e);
      }
    }
  }
}

