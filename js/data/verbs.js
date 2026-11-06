// Motor de conjugação: regras para regulares + exceções para os irregulares mais usados.
// Linha: infinitivo | português | inglês | chave:valor…
//   p: presente (6 formas)  pp: particípio  fut: radical do futuro  imp: radical do imparfait
//   subj: 2 radicais (je/tu/il/ils · nous/vous) ou 6 formas  impv: tu nous vous | none  aux:être
const RAW = `
être | ser, estar | to be | p:suis es est sommes êtes sont | pp:été | fut:ser | imp:ét | subj:sois sois soit soyons soyez soient | impv:sois soyons soyez
avoir | ter | to have | p:ai as a avons avez ont | pp:eu | fut:aur | subj:aie aies ait ayons ayez aient | impv:aie ayons ayez
aller | ir | to go | p:vais vas va allons allez vont | pp:allé | fut:ir | subj:aill all | impv:va allons allez | aux:être
faire | fazer | to do, make | p:fais fais fait faisons faites font | pp:fait | fut:fer | subj:fass fass
dire | dizer | to say | p:dis dis dit disons dites disent | pp:dit | fut:dir | subj:dis dis
pouvoir | poder | can | p:peux peux peut pouvons pouvez peuvent | pp:pu | fut:pourr | subj:puiss puiss | impv:none
vouloir | querer | to want | p:veux veux veut voulons voulez veulent | pp:voulu | fut:voudr | subj:veuill voul | impv:veuille veuillons veuillez
savoir | saber | to know | p:sais sais sait savons savez savent | pp:su | fut:saur | subj:sach sach | impv:sache sachons sachez
voir | ver | to see | p:vois vois voit voyons voyez voient | pp:vu | fut:verr | subj:voi voy
venir | vir | to come | p:viens viens vient venons venez viennent | pp:venu | fut:viendr | subj:vienn ven | aux:être
devoir | dever | must | p:dois dois doit devons devez doivent | pp:dû | fut:devr | subj:doiv dev | impv:none
prendre | pegar, tomar | to take | p:prends prends prend prenons prenez prennent | pp:pris | fut:prendr | subj:prenn pren
mettre | pôr, colocar | to put | p:mets mets met mettons mettez mettent | pp:mis | fut:mettr | subj:mett mett
connaître | conhecer | to know (someone) | p:connais connais connaît connaissons connaissez connaissent | pp:connu | fut:connaîtr | subj:connaiss connaiss
croire | crer, acreditar | to believe | p:crois crois croit croyons croyez croient | pp:cru | fut:croir | subj:croi croy
partir | partir, ir embora | to leave | p:pars pars part partons partez partent | pp:parti | fut:partir | subj:part part | aux:être
sortir | sair | to go out | p:sors sors sort sortons sortez sortent | pp:sorti | fut:sortir | subj:sort sort | aux:être
dormir | dormir | to sleep | p:dors dors dort dormons dormez dorment | pp:dormi | fut:dormir | subj:dorm dorm
vivre | viver | to live | p:vis vis vit vivons vivez vivent | pp:vécu | fut:vivr | subj:viv viv
écrire | escrever | to write | p:écris écris écrit écrivons écrivez écrivent | pp:écrit | fut:écrir | subj:écriv écriv
lire | ler | to read | p:lis lis lit lisons lisez lisent | pp:lu | fut:lir | subj:lis lis
boire | beber | to drink | p:bois bois boit buvons buvez boivent | pp:bu | fut:boir | subj:boiv buv
ouvrir | abrir | to open | p:ouvre ouvres ouvre ouvrons ouvrez ouvrent | pp:ouvert | fut:ouvrir | subj:ouvr ouvr
tenir | segurar | to hold | p:tiens tiens tient tenons tenez tiennent | pp:tenu | fut:tiendr | subj:tienn ten
recevoir | receber | to receive | p:reçois reçois reçoit recevons recevez reçoivent | pp:reçu | fut:recevr | subj:reçoiv recev
comprendre | entender | to understand | p:comprends comprends comprend comprenons comprenez comprennent | pp:compris | fut:comprendr | subj:comprenn compren
apprendre | aprender | to learn | p:apprends apprends apprend apprenons apprenez apprennent | pp:appris | fut:apprendr | subj:apprenn appren
devenir | tornar-se | to become | p:deviens deviens devient devenons devenez deviennent | pp:devenu | fut:deviendr | subj:devienn deven | aux:être
revenir | voltar | to come back | p:reviens reviens revient revenons revenez reviennent | pp:revenu | fut:reviendr | subj:revienn reven | aux:être
suivre | seguir | to follow | p:suis suis suit suivons suivez suivent | pp:suivi | fut:suivr | subj:suiv suiv
courir | correr | to run | p:cours cours court courons courez courent | pp:couru | fut:courr | subj:cour cour
mourir | morrer | to die | p:meurs meurs meurt mourons mourez meurent | pp:mort | fut:mourr | subj:meur mour | aux:être
envoyer | enviar | to send | p:envoie envoies envoie envoyons envoyez envoient | pp:envoyé | fut:enverr | subj:envoi envoy
payer | pagar | to pay | p:paie paies paie payons payez paient | pp:payé | fut:paier | subj:pai pay
acheter | comprar | to buy | p:achète achètes achète achetons achetez achètent | pp:acheté | fut:achèter | subj:achèt achet
appeler | chamar, ligar | to call | p:appelle appelles appelle appelons appelez appellent | pp:appelé | fut:appeller | subj:appell appel
préférer | preferir | to prefer | p:préfère préfères préfère préférons préférez préfèrent | pp:préféré | fut:préférer | subj:préfèr préfér
parler | falar | to speak
aimer | gostar, amar | to like, love
travailler | trabalhar | to work
habiter | morar | to live (reside)
manger | comer | to eat
commencer | começar | to start
chercher | procurar | to look for
trouver | encontrar | to find
donner | dar | to give
penser | pensar | to think
regarder | olhar, assistir | to watch
écouter | escutar | to listen
demander | pedir, perguntar | to ask
arriver | chegar | to arrive | aux:être
rester | ficar | to stay | aux:être
entrer | entrar | to enter | aux:être
rentrer | voltar (para casa) | to go home | aux:être
tomber | cair | to fall | aux:être
passer | passar | to pass, spend
jouer | jogar, brincar | to play
oublier | esquecer | to forget
étudier | estudar | to study
utiliser | usar | to use
aider | ajudar | to help
voyager | viajar | to travel
gagner | ganhar | to win, earn
laisser | deixar | to leave, let
montrer | mostrar | to show
finir | terminar | to finish
choisir | escolher | to choose
réussir | conseguir, ter sucesso | to succeed
réfléchir | refletir, pensar | to think over
grandir | crescer | to grow up
attendre | esperar | to wait
entendre | ouvir | to hear
répondre | responder | to answer
vendre | vender | to sell
perdre | perder | to lose
descendre | descer | to go down | aux:être
rendre | devolver | to give back
`;

export const PERSONS = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
export const TENSES = [
  { id: 'present', label: 'Présent', pt: 'falo / estou falando' },
  { id: 'pc', label: 'Passé composé', pt: 'falei' },
  { id: 'imparfait', label: 'Imparfait', pt: 'falava' },
  { id: 'futur', label: 'Futur', pt: 'falarei' },
  { id: 'conditionnel', label: 'Conditionnel', pt: 'falaria' },
  { id: 'subjonctif', label: 'Subjonctif', pt: 'que eu fale' },
  { id: 'imperatif', label: 'Impératif', pt: 'fala! falemos! falem!' },
];

const END = {
  er: ['e', 'es', 'e', 'ons', 'ez', 'ent'],
  ir: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
  re: ['s', 's', '', 'ons', 'ez', 'ent'],
  imp: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
  fut: ['ai', 'as', 'a', 'ons', 'ez', 'ont'],
  subj: ['e', 'es', 'e', 'ions', 'iez', 'ent'],
};

/** manger → mangeons, commencer → commençons (antes de a/o). */
function ortho(stem, end) {
  if (/^[ao]/.test(end)) {
    if (stem.endsWith('g')) return `${stem}e${end}`;
    if (stem.endsWith('c')) return `${stem.slice(0, -1)}ç${end}`;
  }
  return stem + end;
}

function parse(line) {
  const [inf, pt, en, ...rest] = line.split('|').map((s) => s.trim());
  const v = { inf, pt, en, aux: 'avoir' };
  for (const kv of rest) {
    const i = kv.indexOf(':');
    v[kv.slice(0, i)] = kv.slice(i + 1).trim();
  }
  for (const k of ['p', 'subj', 'impv']) if (v[k]) v[k] = v[k].split(' ');
  v.kind = v.p ? 'irr' : inf.endsWith('er') ? 'er' : inf.endsWith('ir') ? 'ir' : 're';
  v.stem = inf.slice(0, -2);
  if (!v.pp) v.pp = v.stem + { er: 'é', ir: 'i', re: 'u' }[v.kind];
  return v;
}

export const VERBS = RAW.trim().split('\n').map(parse);
export const VERB = Object.fromEntries(VERBS.map((v) => [v.inf, v]));

const cache = new Map();

/** Formas (sem pronome) de um verbo num tempo. Imperativo: só tu, nous, vous. */
export function conjugate(v, t) {
  const key = `${v.inf}:${t}`;
  if (cache.has(key)) return cache.get(key);
  let out;
  const present = () => (v.p ? v.p : END[v.kind].map((e) => ortho(v.stem, e)));
  const impStem = () => v.imp ?? (v.p ? v.p[3].replace(/ons$/, '') : v.kind === 'ir' ? `${v.stem}iss` : v.stem);
  const futStem = () => v.fut ?? (v.kind === 're' ? v.inf.slice(0, -1) : v.inf);

  if (t === 'present') out = present();
  else if (t === 'imparfait') out = END.imp.map((e) => ortho(impStem(), e));
  else if (t === 'futur') out = END.fut.map((e) => futStem() + e);
  else if (t === 'conditionnel') out = END.imp.map((e) => futStem() + e);
  else if (t === 'subjonctif') {
    if (v.subj?.length === 6) out = v.subj;
    else {
      const [a, b] = v.subj ?? (v.kind === 'ir' ? [`${v.stem}iss`, `${v.stem}iss`] : [v.stem, v.stem]);
      out = END.subj.map((e, i) => (i === 3 || i === 4 ? b : a) + e);
    }
  } else if (t === 'pc') {
    const aux = conjugate(VERB[v.aux], 'present');
    const etre = v.aux === 'être';
    out = aux.map((a, i) => `${a} ${v.pp}${etre ? (i < 3 ? '(e)' : '(e)s') : ''}`);
  } else if (t === 'imperatif') {
    if (v.impv?.[0] === 'none') out = [null, null, null, null, null, null];
    else {
      const p = present();
      const [tu, nous, vous] = v.impv ?? [p[1].endsWith('es') ? p[1].slice(0, -1) : p[1], p[3], p[4]];
      out = [null, tu, null, nous, vous, null];
    }
  }
  cache.set(key, out);
  return out;
}

const vowel = (s) => /^[aeiouyhâàéèêîïôûœ]/i.test(s);
const PRON = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

/** Forma completa com pronome: "j'ai parlé", "que nous parlions", "parle !". */
export function full(v, t, i) {
  const f = conjugate(v, t)[i];
  if (!f) return null;
  if (t === 'imperatif') return f;
  let s = i === 0 && vowel(f) ? `j'${f}` : `${PRON[i]} ${f}`;
  if (t === 'subjonctif') s = (i === 2 || i === 5 ? "qu'" : 'que ') + s;
  return s;
}

/** Respostas aceitas (tira o "(e)" de concordância e aceita as variantes). */
export function accepted(v, t, i) {
  const f = full(v, t, i);
  if (!f) return '';
  if (!f.includes('(e)')) return f;
  const base = f.replace(/\(e\)s?$/, '');
  return i < 3 ? `${base} | ${base}e` : `${base}s | ${base}es`;
}

/** Texto para falar (sem marcas de concordância). */
export const spoken = (s) => String(s).replace(/\(e\)s?/g, (m) => (m.endsWith('s') ? 's' : ''));
