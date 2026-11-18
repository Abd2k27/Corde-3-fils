// Parcours : Couples de la Bible — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "couples",
  emoji: "👫",
  title: "Couples de la Bible",
  short: "Couples bibliques",
  desc: "Huit couples, leurs réussites et leurs erreurs : des histoires vraies pour apprendre à aimer.",
  weeks: [
    {
      emoji: "⭐",
      title: "Abraham et Sara : croire ensemble l'impossible",
      intro: "Sara rit quand Dieu promet un enfant à un couple âgé. Et pourtant, Dieu tient parole. Leur histoire parle d'attente, de doute… et de fidélité de Dieu.",
      passages: [
        { ref: "Genèse 18:10-14", book: 1, chapter: 18, text: {
          10: "L'un d'entre eux dit : Je reviendrai vers toi à cette même époque ; et voici, Sara, ta femme, aura un fils. Sara écoutait à l'entrée de la tente, qui était derrière lui.",
          11: "Abraham et Sara étaient vieux, avancés en âge : et Sara ne pouvait plus espérer avoir des enfants.",
          12: "Elle rit en elle-même, en disant : Maintenant que je suis vieille, aurais-je encore des désirs ? Mon seigneur aussi est vieux.",
          13: "L'Éternel dit à Abraham : Pourquoi donc Sara a-t-elle ri, en disant : Est-ce que vraiment j'aurais un enfant, moi qui suis vieille ?",
          14: "Y a-t-il rien qui soit étonnant de la part de l'Éternel ? Au temps fixé je reviendrai vers toi, à cette même époque ; et Sara aura un fils."
        }},
        { ref: "Genèse 21:1-2, 6", book: 1, chapter: 21, text: {
          1: "L'Éternel se souvint de ce qu'il avait dit à Sara, et l'Éternel accomplit pour Sara ce qu'il avait promis.",
          2: "Sara devint enceinte, et elle enfanta un fils à Abraham dans sa vieillesse, au temps fixé dont Dieu lui avait parlé.",
          6: "Et Sara dit : Dieu m'a fait un sujet de rire ; quiconque l'apprendra rira de moi."
        }}
      ],
      keyword: { answers: ["rit", "ri", "rire"], hint: "Genèse 18:12 : comment Sara réagit-elle en elle-même ?" },
      memo: { ref: "Genèse 18:14", text: "Y a-t-il rien qui soit [étonnant] de la part de l'[Éternel] ? Au [temps] fixé je reviendrai vers toi.", distractors: ["impossible", "jour"] },
      questions: [
        { id: "q1", type: "echelle", text: "Quand Dieu tarde à répondre, je garde la foi.", low: "Difficilement", high: "Facilement" },
        { id: "q2", type: "tupref", text: "Face à une promesse qui semble impossible, je suis plutôt…", options: ["Sara : je doute (et j'en ris)", "Abraham : j'espère contre toute espérance"] },
        { id: "q3", type: "choix", text: "La chose « impossible » que j'aimerais voir Dieu faire pour nous :", options: ["Dans notre avenir professionnel", "Dans nos familles", "Dans notre foi", "Dans un rêve qu'on porte"] },
        { id: "q4", type: "echelle", text: "Je crois que Dieu a de grandes choses en réserve pour notre couple.", low: "Pas vraiment", high: "Absolument" },
        { id: "q5", type: "ouverte", text: "« Dieu m'a fait un sujet de rire. » Quelle promesse de Dieu aimerais-tu qu'on garde ensemble, même si elle met du temps ?" }
      ],
      defi: "Écrivez ensemble un « rêve impossible » pour votre couple, glissez-le dans le journal de prière et priez pour lui chaque jour de la semaine.",
      priere: "Seigneur, rien n'est étonnant de ta part. Fortifie notre foi quand l'attente est longue."
    },
    {
      emoji: "🙏",
      title: "Isaac et Rébecca : prier l'un pour l'autre",
      intro: "Isaac prie pour sa femme et Dieu l'exauce. Mais plus tard, chacun préfère un enfant différent, et la famille se divise. Une belle histoire avec un avertissement.",
      passages: [
        { ref: "Genèse 25:20-21, 27-28", book: 1, chapter: 25, text: {
          20: "Isaac était âgé de quarante ans, quand il prit pour femme Rebecca, fille de Bethuel, l'Araméen, de Paddan-Aram, et sœur de Laban, l'Araméen.",
          21: "Isaac implora l'Éternel pour sa femme, car elle était stérile, et l'Éternel l'exauça : Rebecca, sa femme, devint enceinte.",
          27: "Ces enfants grandirent. Ésaü devint un habile chasseur, un homme des champs ; mais Jacob fut un homme tranquille, qui restait sous les tentes.",
          28: "Isaac aimait Ésaü, parce qu'il mangeait du gibier ; et Rebecca aimait Jacob."
        }}
      ],
      keyword: { answers: ["implora"], hint: "Verset 21 : qu'a fait Isaac auprès de l'Éternel pour sa femme ?" },
      memo: { ref: "Jacques 5:16", text: "Priez les uns pour les autres. La [prière] agissante du [juste] a une grande [efficace].", distractors: ["foi", "force"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je prie régulièrement pour toi.", low: "Rarement", high: "Chaque jour" },
        { id: "q2", type: "choix", text: "Ce pour quoi j'aimerais que tu pries pour moi en ce moment :", options: ["Mon travail / mes études", "Ma santé / ma fatigue", "Ma foi", "Ma famille"] },
        { id: "q3", type: "tupref", text: "Je préfère que tu pries pour moi…", options: ["Devant moi, à voix haute", "En secret, et que tu me le dises"] },
        { id: "q4", type: "echelle", text: "Nos familles ont eu des « favoris » ou des divisions qui nous ont marqués.", low: "Pas du tout", high: "Beaucoup" },
        { id: "q5", type: "ouverte", text: "Quelle habitude de nos familles voulons-nous garder, et laquelle voulons-nous éviter ?" }
      ],
      defi: "Chaque jour, envoyez à l'autre un message court : « J'ai prié pour toi aujourd'hui pour… »",
      priere: "Seigneur, apprends-nous à prier l'un pour l'autre et garde notre futur foyer de toute division."
    },
    {
      emoji: "⏱️",
      title: "Jacob et Rachel : l'amour qui patiente",
      intro: "Jacob travaille sept ans pour épouser Rachel, et ces années lui semblent « quelques jours ». Quand on aime, le temps et les efforts n'ont plus le même poids.",
      passages: [
        { ref: "Genèse 29:18-20", book: 1, chapter: 29, text: {
          18: "Jacob aimait Rachel, et il dit : Je te servirai sept ans pour Rachel, ta fille cadette.",
          19: "Et Laban dit : J'aime mieux te la donner que de la donner à un autre homme. Reste chez moi !",
          20: "Ainsi Jacob servit sept années pour Rachel : et elles furent à ses yeux comme quelques jours, parce qu'il l'aimait."
        }}
      ],
      keyword: { answers: ["jours"], hint: "Verset 20 : les sept années furent à ses yeux comme quelques …" },
      memo: { ref: "Genèse 29:20", text: "Jacob servit [sept] années pour Rachel : et elles furent à ses yeux comme quelques [jours], parce qu'il l'[aimait].", distractors: ["dix", "mois"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je suis prêt(e) à faire de vrais efforts sur la durée pour notre relation.", low: "Un peu", high: "Totalement" },
        { id: "q2", type: "choix", text: "Ce qui me paraît « long » en ce moment dans notre relation :", options: ["La distance / le peu de temps ensemble", "L'attente pour avancer", "Les études / le travail", "Rien, tout me paraît court !"] },
        { id: "q3", type: "tupref", text: "Pour te montrer mon amour, je préfère…", options: ["Un grand geste rare", "Plein de petits gestes réguliers"] },
        { id: "q4", type: "echelle", text: "Le temps passé avec toi me semble passer trop vite.", low: "Pas toujours", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce que tu serais prêt(e) à « servir » (sacrifier, donner) pour notre relation ?" }
      ],
      defi: "Chacun fait cette semaine un effort qui lui coûte un peu pour l'autre (se lever plus tôt pour appeler, un trajet, un service…).",
      priere: "Seigneur, donne-nous un amour patient, qui ne compte pas ses efforts."
    },
    {
      emoji: "🫂",
      title: "Anne et Elkana : se soutenir dans la douleur",
      intro: "Anne souffre de ne pas avoir d'enfant. Elkana l'aime, maladroitement mais sincèrement. Et Anne porte sa peine devant Dieu. Un couple qui traverse l'épreuve.",
      passages: [
        { ref: "1 Samuel 1:5, 8, 10, 27", book: 9, chapter: 1, text: {
          5: "mais il donnait à Anne une portion double ; car il aimait Anne, que l'Éternel avait rendue stérile.",
          8: "Elkana, son mari, lui disait : Anne, pourquoi pleures-tu, et ne manges-tu pas ? pourquoi ton cœur est-il attristé ? Est-ce que je ne vaux pas pour toi mieux que dix fils ?",
          10: "Et, l'amertume dans l'âme, elle pria l'Éternel et versa des pleurs.",
          27: "C'était pour cet enfant que je priais, et l'Éternel a exaucé la prière que je lui adressais."
        }}
      ],
      keyword: { answers: ["dix"], hint: "Verset 8 : Elkana dit qu'il vaut mieux que combien de fils ?" },
      memo: { ref: "1 Pierre 5:7", text: "Et [déchargez]-vous sur lui de tous vos [soucis], car lui-même prend [soin] de vous.", distractors: ["Remettez", "peines"] },
      questions: [
        { id: "q1", type: "tupref", text: "Quand je suis triste, j'ai surtout besoin que tu…", options: ["M'écoutes sans chercher de solution", "M'aides à trouver une solution"] },
        { id: "q2", type: "echelle", text: "Je me sens compris(e) par toi quand je traverse un moment difficile.", low: "Rarement", high: "Toujours" },
        { id: "q3", type: "choix", text: "Elkana dit « Je ne vaux pas mieux que dix fils ? ». Ce genre de phrase, c'est…", options: ["Touchant", "Maladroit", "Les deux", "Égoïste"] },
        { id: "q4", type: "echelle", text: "Je vais vers Dieu en premier quand j'ai de la peine.", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Y a-t-il une peine (même petite) que tu portes en ce moment et dont tu aimerais me parler ?" }
      ],
      defi: "Choisissez un moment cette semaine pour vous poser la question « Comment vas-tu vraiment ? », et écoutez sans interrompre.",
      priere: "Seigneur, nous déchargeons sur toi nos soucis. Apprends-nous à nous consoler l'un l'autre."
    },
    {
      emoji: "📜",
      title: "Zacharie et Élisabeth : fidèles ensemble",
      intro: "« Tous deux étaient justes devant Dieu. » Pas un des deux, tous les deux. Fidèles pendant des années de silence, jusqu'au jour où Dieu répond.",
      passages: [
        { ref: "Luc 1:5-7, 13", book: 42, chapter: 1, text: {
          5: "Du temps d'Hérode, roi de Judée, il y avait un sacrificateur, nommé Zacharie, de la classe d'Abia ; sa femme était d'entre les filles d'Aaron, et s'appelait Élisabeth.",
          6: "Tous deux étaient justes devant Dieu, observant d'une manière irréprochable tous les commandements et toutes les ordonnances du Seigneur.",
          7: "Ils n'avaient point d'enfants, parce qu'Élisabeth était stérile ; et ils étaient l'un et l'autre avancés en âge.",
          13: "Mais l'ange lui dit : Ne crains point, Zacharie ; car ta prière a été exaucée. Ta femme Élisabeth t'enfantera un fils, et tu lui donneras le nom de Jean."
        }}
      ],
      keyword: { answers: ["justes"], hint: "Verset 6 : tous deux étaient … devant Dieu." },
      memo: { ref: "Luc 1:37", text: "Car [rien] n'est [impossible] à [Dieu].", distractors: ["tout", "difficile"] },
      questions: [
        { id: "q1", type: "echelle", text: "On grandit spirituellement au même rythme tous les deux.", low: "Pas vraiment", high: "Tout à fait" },
        { id: "q2", type: "choix", text: "Ce qui nous aiderait à être fidèles « tous les deux » :", options: ["Un temps de prière commun fixe", "Lire la Bible ensemble", "Aller à l'église ensemble", "S'encourager plus souvent"] },
        { id: "q3", type: "tupref", text: "Spirituellement, dans notre couple, c'est plutôt…", options: ["L'un entraîne l'autre", "On avance côte à côte"] },
        { id: "q4", type: "echelle", text: "Je reste fidèle à Dieu même quand je ne vois pas de réponse.", low: "Difficilement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce que j'admire dans ta relation avec Dieu ?" }
      ],
      defi: "Fixez un rendez-vous de prière commun (même 5 minutes, même par appel) et tenez-le 3 fois cette semaine.",
      priere: "Seigneur, que l'on puisse dire de nous : « tous deux étaient justes devant Dieu »."
    },
    {
      emoji: "⭐",
      title: "Joseph et Marie : obéir ensemble",
      intro: "Leurs fiançailles ne se passent pas comme prévu ! Marie dit « qu'il me soit fait selon ta parole », Joseph se réveille et obéit. Un couple qui fait confiance à Dieu quand tout bascule.",
      passages: [
        { ref: "Matthieu 1:18-21, 24", book: 40, chapter: 1, text: {
          18: "Voici de quelle manière arriva la naissance de Jésus-Christ. Marie, sa mère, ayant été fiancée à Joseph, se trouva enceinte, par la vertu du Saint-Esprit, avant qu'ils eussent habité ensemble.",
          19: "Joseph, son époux, qui était un homme de bien et qui ne voulait pas la diffamer, se proposa de rompre secrètement avec elle.",
          20: "Comme il y pensait, voici, un ange du Seigneur lui apparut en songe, et dit : Joseph, fils de David, ne crains pas de prendre avec toi Marie, ta femme, car l'enfant qu'elle a conçu vient du Saint-Esprit ;",
          21: "elle enfantera un fils, et tu lui donneras le nom de Jésus ; c'est lui qui sauvera son peuple de ses péchés.",
          24: "Joseph s'étant réveillé fit ce que l'ange du Seigneur lui avait ordonné, et il prit sa femme avec lui."
        }}
      ],
      keyword: { answers: ["songe"], hint: "Verset 20 : comment l'ange apparaît-il à Joseph ?" },
      memo: { ref: "Luc 1:38", text: "Marie dit : Je suis la [servante] du [Seigneur] ; qu'il me soit fait selon ta [parole].", distractors: ["fille", "volonté"] },
      questions: [
        { id: "q1", type: "echelle", text: "Quand nos plans sont bousculés, je fais confiance à Dieu.", low: "Difficilement", high: "Facilement" },
        { id: "q2", type: "tupref", text: "Joseph voulait protéger Marie en rompant « secrètement ». Face à un problème, je cherche d'abord à…", options: ["Protéger l'autre", "Dire la vérité, même si ça fait mal"] },
        { id: "q3", type: "choix", text: "Ce que j'admire le plus chez Joseph :", options: ["Sa bonté envers Marie", "Son obéissance rapide", "Son humilité", "Son courage face au regard des autres"] },
        { id: "q4", type: "echelle", text: "Je suis prêt(e) à suivre Dieu même si les autres ne comprennent pas nos choix.", low: "Pas encore", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Y a-t-il une chose que tu sens que Dieu nous demande en ce moment, et qu'on hésite à faire ?" }
      ],
      defi: "Repérez ensemble une chose concrète que Dieu vous demande (une réconciliation, un service, une décision) et faites-la cette semaine.",
      priere: "Seigneur, nous sommes tes serviteurs : qu'il nous soit fait selon ta parole."
    },
    {
      emoji: "🔁",
      title: "Osée : l'amour qui ne lâche pas",
      intro: "Dieu demande au prophète Osée d'aimer encore une femme qui l'a trahi, pour montrer comment Dieu, lui, aime son peuple infidèle. Un amour fou, qui reflète la grâce.",
      passages: [
        { ref: "Osée 3:1-3", book: 28, chapter: 3, text: {
          1: "L'Éternel me dit : Va encore, et aime une femme aimée d'un amant, et adultère ; aime-la comme l'Éternel aime les enfants d'Israël, qui se tournent vers d'autres dieux et qui aiment les gâteaux de raisin.",
          2: "Je l'achetai pour quinze sicles d'argent, un homer d'orge et un léthec d'orge.",
          3: "Et je lui dis : Reste longtemps pour moi, ne te livre pas à la prostitution, ne te donne à aucun homme, et je serai de même envers toi."
        }}
      ],
      keyword: { answers: ["encore"], hint: "Verset 1 : « Va …, et aime une femme »." },
      memo: { ref: "Romains 5:8", text: "Mais Dieu [prouve] son amour envers nous, en ce que, lorsque nous étions encore des [pécheurs], Christ est [mort] pour nous.", distractors: ["montre", "perdus"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je réalise à quel point Dieu m'aime malgré mes infidélités.", low: "Peu", high: "Profondément" },
        { id: "q2", type: "choix", text: "Pour moi, la fidélité dans un couple, c'est d'abord…", options: ["Le corps", "Le cœur et les pensées", "Les paroles (ne pas critiquer l'autre)", "Les priorités (le temps, l'attention)"] },
        { id: "q3", type: "tupref", text: "« Je serai de même envers toi » (v. 3) : la fidélité, c'est surtout…", options: ["Une promesse qu'on fait", "Un choix qu'on renouvelle chaque jour"] },
        { id: "q4", type: "echelle", text: "Je me sens totalement en confiance sur ta fidélité.", low: "Pas encore", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce que cette histoire t'apprend sur l'amour de Dieu pour toi ?" }
      ],
      defi: "Écrivez chacun une phrase d'engagement de fidélité adaptée à votre étape (« Je choisis de… ») et partagez-la.",
      priere: "Seigneur, merci de nous aimer encore et encore. Rends-nous fidèles comme tu es fidèle."
    },
    {
      emoji: "⚠️",
      title: "Ananias et Saphira : le danger de mentir ensemble",
      intro: "Un contre-exemple : ce couple se met d'accord pour faire semblant. Être unis, c'est beau… sauf quand on est unis dans le mensonge. L'unité du couple doit servir la vérité.",
      passages: [
        { ref: "Actes 5:1-4, 9", book: 44, chapter: 5, text: {
          1: "Mais un homme nommé Ananias, avec Saphira sa femme, vendit une propriété,",
          2: "et retint une partie du prix, sa femme le sachant ; puis il apporta le reste, et le déposa aux pieds des apôtres.",
          3: "Pierre lui dit : Ananias, pourquoi Satan a-t-il rempli ton cœur, au point que tu mentes au Saint-Esprit, et que tu aies retenu une partie du prix du champ ?",
          4: "S'il n'eût pas été vendu, ne te restait-il pas ? Et, après qu'il a été vendu, le prix n'était-il pas à ta disposition ? Comment as-tu pu mettre en ton cœur un pareil dessein ? Ce n'est pas à des hommes que tu as menti, mais à Dieu.",
          9: "Alors Pierre lui dit : Comment vous êtes-vous accordés pour tenter l'Esprit du Seigneur ? Voici, ceux qui ont enseveli ton mari sont à la porte, et ils t'emporteront."
        }}
      ],
      keyword: { answers: ["propriete"], hint: "Verset 1 : qu'est-ce qu'Ananias et Saphira ont vendu ?" },
      memo: { ref: "Éphésiens 4:25", text: "Renoncez au [mensonge], et que chacun de vous parle selon la [vérité] à son prochain ; car nous sommes [membres] les uns des autres.", distractors: ["péché", "frères"] },
      questions: [
        { id: "q1", type: "echelle", text: "Il m'arrive de « faire semblant » pour paraître meilleur(e) aux yeux des autres.", low: "Jamais", high: "Souvent" },
        { id: "q2", type: "tupref", text: "Si l'autre me propose un « petit arrangement » avec la vérité, je…", options: ["Le dis tout de suite", "Laisse passer pour éviter le conflit"] },
        { id: "q3", type: "choix", text: "Le domaine où il est le plus tentant de cacher des choses :", options: ["L'argent", "Ce que je fais sur mon téléphone", "Mes sentiments", "Mes erreurs"] },
        { id: "q4", type: "echelle", text: "Je peux tout te dire, même ce qui n'est pas glorieux.", low: "Pas encore", high: "Oui, tout" },
        { id: "q5", type: "ouverte", text: "Comment voulons-nous nous aider l'un l'autre à rester vrais, devant Dieu et devant les autres ?" }
      ],
      defi: "Mettez en place une règle simple de transparence entre vous (ex. « pas de secret sur l'argent », « on peut toujours tout se demander »).",
      priere: "Seigneur, garde notre couple dans la vérité. Que notre unité serve toujours ce qui est juste."
    }
  ]
});
