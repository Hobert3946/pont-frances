// Frases por situação + frases graduadas para ditado e shadowing. Linha: francês | português
const parse = (s) => s.trim().split('\n').map((l) => { const [fr, pt] = l.split('|').map((x) => x.trim()); return { fr, pt }; });

export const SCENES = [
  { id: 'cafe', icon: '☕', title: 'No café', phrases: parse(`
Bonjour ! Un café, s'il vous plaît. | Bom dia! Um café, por favor.
Je voudrais un croissant aussi. | Eu queria um croissant também.
C'est pour emporter. | É para levar.
C'est pour ici. | É para comer aqui.
Je peux payer par carte ? | Posso pagar com cartão?
L'addition, s'il vous plaît. | A conta, por favor.
Vous avez du lait d'avoine ? | Vocês têm leite de aveia?
Merci, bonne journée ! | Obrigado, tenha um bom dia!`) },
  { id: 'resto', icon: '🍽️', title: 'No restaurante', phrases: parse(`
Bonsoir, une table pour deux, s'il vous plaît. | Boa noite, uma mesa para dois, por favor.
J'ai réservé au nom de Santos. | Fiz uma reserva em nome de Santos.
Qu'est-ce que vous nous conseillez ? | O que o senhor nos recomenda?
Je vais prendre le plat du jour. | Vou querer o prato do dia.
La cuisson ? À point, s'il vous plaît. | O ponto? Ao ponto, por favor.
Une carafe d'eau, s'il vous plaît. | Uma jarra de água, por favor.
C'était délicieux ! | Estava delicioso!
On peut avoir l'addition ? | Pode trazer a conta?`) },
  { id: 'rue', icon: '🗺️', title: 'Pedindo direções', phrases: parse(`
Excusez-moi, je suis perdu. | Com licença, estou perdido.
Où est la station de métro la plus proche ? | Onde fica a estação de metrô mais próxima?
C'est loin d'ici ? | É longe daqui?
On peut y aller à pied ? | Dá para ir a pé?
Continuez tout droit, puis tournez à gauche. | Siga reto e depois vire à esquerda.
C'est juste en face de la banque. | É bem em frente ao banco.
Vous pouvez me le montrer sur le plan ? | Pode me mostrar no mapa?
Merci beaucoup, vous êtes très gentil. | Muito obrigado, o senhor é muito gentil.`) },
  { id: 'hotel', icon: '🏨', title: 'No hotel', phrases: parse(`
J'ai une réservation pour trois nuits. | Tenho uma reserva para três noites.
À quelle heure est le petit-déjeuner ? | A que horas é o café da manhã?
Le wifi est gratuit ? | O wi-fi é grátis?
Quel est le mot de passe du wifi ? | Qual é a senha do wi-fi?
La climatisation ne marche pas. | O ar-condicionado não funciona.
Je peux laisser mes bagages ici ? | Posso deixar minha bagagem aqui?
À quelle heure faut-il libérer la chambre ? | A que horas preciso liberar o quarto?
Vous pouvez m'appeler un taxi ? | Pode chamar um táxi para mim?`) },
  { id: 'travail', icon: '💼', title: 'No trabalho (TI)', phrases: parse(`
Je travaille dans l'informatique. | Trabalho com TI.
Je m'occupe du support technique. | Cuido do suporte técnico.
Le serveur est tombé en panne. | O servidor caiu.
Tu as essayé de redémarrer ? | Você tentou reiniciar?
Je t'envoie le lien par mail. | Te mando o link por e-mail.
On fait un point demain matin ? | Fazemos um alinhamento amanhã de manhã?
Je suis en réunion, je te rappelle. | Estou em reunião, te ligo de volta.
Le projet sera livré vendredi. | O projeto será entregue na sexta.`) },
  { id: 'social', icon: '🥂', title: 'Conhecendo pessoas', phrases: parse(`
Tu viens d'où ? | De onde você é?
Je viens du Brésil, de Salvador. | Sou do Brasil, de Salvador.
Ça fait combien de temps que tu habites ici ? | Há quanto tempo você mora aqui?
J'apprends le français depuis quelques mois. | Estou aprendendo francês há alguns meses.
Tu fais quoi dans la vie ? | O que você faz da vida?
On prend un verre ce soir ? | Vamos tomar alguma coisa hoje à noite?
Tu as Instagram ? | Você tem Instagram?
C'était un plaisir de te rencontrer ! | Foi um prazer te conhecer!`) },
  { id: 'sante', icon: '💊', title: 'Farmácia e médico', phrases: parse(`
Je ne me sens pas bien. | Não estou me sentindo bem.
J'ai mal à la tête depuis hier. | Estou com dor de cabeça desde ontem.
Vous avez quelque chose contre la toux ? | Tem alguma coisa para tosse?
Je suis allergique à la pénicilline. | Sou alérgico à penicilina.
Il me faut une ordonnance ? | Preciso de receita?
Je voudrais prendre rendez-vous. | Queria marcar uma consulta.
C'est urgent. | É urgente.
Appelez une ambulance ! | Chamem uma ambulância!`) },
  { id: 'magasin', icon: '🛍️', title: 'Compras', phrases: parse(`
Je regarde seulement, merci. | Só estou olhando, obrigado.
Vous l'avez en plus grand ? | Tem num tamanho maior?
Je peux l'essayer ? | Posso experimentar?
Où sont les cabines d'essayage ? | Onde ficam os provadores?
Ça coûte combien ? | Quanto custa?
C'est un peu trop cher pour moi. | Está um pouco caro demais para mim.
Je le prends. | Vou levar.
Vous faites la détaxe ? | Vocês fazem a restituição de impostos?`) },
];

export const SENTENCES = {
  A1: parse(`
Je m'appelle Paul et j'habite à Lyon. | Eu me chamo Paul e moro em Lyon.
Il fait beau aujourd'hui. | Está fazendo tempo bom hoje.
Nous avons deux enfants. | Nós temos dois filhos.
Le café est très chaud. | O café está muito quente.
Elle travaille dans un hôpital. | Ela trabalha num hospital.
Je ne parle pas bien français. | Não falo bem francês.
Où sont les toilettes ? | Onde fica o banheiro?
J'ai faim, on mange ? | Estou com fome, vamos comer?
Mon frère a vingt ans. | Meu irmão tem vinte anos.
Tu veux un verre d'eau ? | Você quer um copo de água?
La boulangerie ferme à sept heures. | A padaria fecha às sete.
On se voit demain matin. | A gente se vê amanhã de manhã.
Il y a un problème avec mon ordinateur. | Tem um problema com meu computador.
Je vais au travail en bus. | Vou ao trabalho de ônibus.
C'est combien, le croissant ? | Quanto é o croissant?
Ma sœur habite à Paris. | Minha irmã mora em Paris.
Le train part à midi. | O trem sai ao meio-dia.
Nous sommes brésiliens. | Somos brasileiros.
J'aime beaucoup la musique. | Gosto muito de música.
Vous pouvez répéter, s'il vous plaît ? | Pode repetir, por favor?`),
  A2: parse(`
Hier soir, nous sommes allés au cinéma. | Ontem à noite fomos ao cinema.
Quand j'étais petit, j'habitais à la campagne. | Quando eu era pequeno, morava no campo.
Je viens de finir mon travail. | Acabei de terminar meu trabalho.
Il faut acheter du pain et du fromage. | É preciso comprar pão e queijo.
Elle n'a jamais visité le Brésil. | Ela nunca visitou o Brasil.
On va partir en vacances au mois d'août. | A gente vai sair de férias em agosto.
Je lui ai envoyé un message ce matin. | Mandei uma mensagem para ele hoje de manhã.
Tu en veux encore un peu ? | Você quer mais um pouco?
Il pleuvait quand je suis sorti du bureau. | Chovia quando saí do escritório.
Mes collègues sont très sympas. | Meus colegas são muito legais.
Je cherche un appartement près du centre. | Procuro um apartamento perto do centro.
Nous avons besoin d'aide pour le projet. | Precisamos de ajuda com o projeto.
J'habite ici depuis trois ans. | Moro aqui há três anos.
Ce restaurant est meilleur que l'autre. | Este restaurante é melhor que o outro.
Elle s'est levée tôt pour prendre le train. | Ela se levantou cedo para pegar o trem.
Je n'ai rien compris à la réunion. | Não entendi nada da reunião.
Tu peux m'aider à porter ces valises ? | Você pode me ajudar a carregar essas malas?
Il y avait beaucoup de monde à la fête. | Tinha muita gente na festa.
J'y vais tous les samedis. | Vou lá todo sábado.
Le film dont je t'ai parlé sort demain. | O filme de que te falei estreia amanhã.`),
  B1: parse(`
Si j'avais plus de temps, j'apprendrais à jouer du piano. | Se eu tivesse mais tempo, aprenderia a tocar piano.
Il faut que tu viennes avec nous ce week-end. | É preciso que você venha com a gente neste fim de semana.
Bien qu'il soit fatigué, il continue à travailler. | Embora esteja cansado, ele continua trabalhando.
Je pense que la réunion sera reportée. | Acho que a reunião será adiada.
Quand je serai à Paris, je t'enverrai une carte postale. | Quando eu estiver em Paris, te mando um cartão-postal.
C'est la ville où je suis né. | É a cidade onde nasci.
Je voudrais que tu me dises la vérité. | Eu queria que você me dissesse a verdade.
Si j'avais su, je serais venu plus tôt. | Se eu soubesse, teria vindo mais cedo.
Franchement, je ne m'attendais pas à ça. | Sinceramente, eu não esperava por isso.
Du coup, on a décidé de rester à la maison. | Então a gente decidiu ficar em casa.
Il est en train de réparer le serveur. | Ele está consertando o servidor agora.
Ça fait longtemps qu'on ne s'est pas vus ! | Faz tempo que a gente não se vê!
Je me suis rendu compte que j'avais oublié mes clés. | Percebi que tinha esquecido minhas chaves.
Il vaut mieux partir avant les embouteillages. | É melhor sair antes dos engarrafamentos.
Elle a beau essayer, elle n'y arrive pas. | Por mais que tente, ela não consegue.
T'inquiète, je m'en occupe. | Relaxa, eu cuido disso.
On aurait dû réserver plus tôt. | A gente devia ter reservado antes.
Plus je pratique, plus je comprends. | Quanto mais pratico, mais entendo.
C'est le genre de truc qui m'énerve. | É o tipo de coisa que me irrita.
J'ai du mal à comprendre quand ils parlent vite. | Tenho dificuldade de entender quando eles falam rápido.`),
};
