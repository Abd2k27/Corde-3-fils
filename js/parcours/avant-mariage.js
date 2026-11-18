// Parcours : Avant le mariage — se fréquenter selon Dieu — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "avant",
  emoji: "💌",
  title: "Avant le mariage",
  short: "Avant le mariage",
  desc: "Se fréquenter selon Dieu : discerner, garder son cœur, attendre le bon moment et bien se préparer.",
  weeks: [
    {
      id: "avant-1",
      emoji: "🐪",
      title: "Chercher la volonté de Dieu",
      intro: "Le serviteur d'Abraham part chercher une épouse pour Isaac. Avant de chercher, il prie. L'histoire d'Isaac et Rébecca commence par une prière… et finit par « il l'aima ».",
      passages: [
        { ref: "Genèse 24:12-14, 63-67", book: 1, chapter: 24, text: {
          12: "Et il dit : Éternel, Dieu de mon seigneur Abraham, fais-moi, je te prie, rencontrer aujourd'hui ce que je désire, et use de bonté envers mon seigneur Abraham !",
          13: "Voici, je me tiens près de la source d'eau, et les filles des gens de la ville vont sortir pour puiser de l'eau.",
          14: "Que la jeune fille à laquelle je dirai : Penche ta cruche, je te prie, pour que je boive, et qui répondra : Bois, et je donnerai aussi à boire à tes chameaux, soit celle que tu as destinée à ton serviteur Isaac ! Et par là je connaîtrai que tu uses de bonté envers mon seigneur.",
          63: "Un soir qu'Isaac était sorti pour méditer dans les champs, il leva les yeux, et regarda ; et voici, des chameaux arrivaient.",
          64: "Rebecca leva aussi les yeux, vit Isaac, et descendit de son chameau.",
          65: "Elle dit au serviteur : Qui est cet homme, qui vient dans les champs à notre rencontre ? Et le serviteur répondit : C'est mon seigneur. Alors elle prit son voile, et se couvrit.",
          66: "Le serviteur raconta à Isaac toutes les choses qu'il avait faites.",
          67: "Isaac conduisit Rebecca dans la tente de Sara, sa mère ; il prit Rebecca, qui devint sa femme, et il l'aima. Ainsi fut consolé Isaac, après avoir perdu sa mère."
        }}
      ],
      keyword: { answers: ["chameaux"], hint: "Verset 14 : à qui la jeune fille proposera-t-elle aussi de donner à boire ?" },
      memo: { ref: "Proverbes 16:9", text: "Le [cœur] de l'homme médite sa [voie], mais c'est l'Éternel qui dirige ses [pas].", distractors: ["esprit", "vie"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je sens que Dieu a été présent dans notre rencontre.", low: "Pas vraiment", high: "Complètement" },
        { id: "q2", type: "choix", text: "Ce qui m'a fait comprendre que tu étais quelqu'un de spécial :", options: ["Ta foi", "Ta gentillesse", "Notre complicité", "Ta façon de me traiter"] },
        { id: "q3", type: "tupref", text: "Pour discerner la volonté de Dieu, je compte plutôt sur…", options: ["La prière et la paix intérieure", "Les conseils de personnes de confiance"] },
        { id: "q4", type: "echelle", text: "Nous prions pour notre relation et notre avenir.", low: "Jamais", high: "Très souvent" },
        { id: "q5", type: "ouverte", text: "La Rébecca de l'histoire se distingue par sa générosité spontanée. Quelle qualité de l'autre t'a le plus touché(e) au début ?" }
      ],
      defi: "Racontez-vous chacun, en détail, votre version de votre rencontre. Puis remerciez Dieu ensemble pour ce qu'il a fait.",
      priere: "Seigneur, merci pour notre histoire. Dirige nos pas et montre-nous ta volonté pour notre avenir."
    },
    {
      id: "avant-2",
      emoji: "🛡️",
      title: "Garder son cœur",
      intro: "« Garde ton cœur plus que toute autre chose. » Ce n'est pas fermer son cœur, c'est en prendre soin : ce qu'on regarde, ce qu'on dit, où l'on va.",
      passages: [
        { ref: "Proverbes 4:23-27", book: 20, chapter: 4, text: {
          23: "Garde ton cœur plus que toute autre chose, car de lui viennent les sources de la vie.",
          24: "Écarte de ta bouche la fausseté, éloigne de tes lèvres les détours.",
          25: "Que tes yeux regardent en face, et que tes paupières se dirigent devant toi.",
          26: "Considère le chemin par où tu passes, et que toutes tes voies soient bien réglées ;",
          27: "N'incline ni à droite ni à gauche, et détourne ton pied du mal."
        }}
      ],
      keyword: { answers: ["sources", "source"], hint: "Verset 23 : du cœur viennent les … de la vie." },
      memo: { ref: "Proverbes 4:23", text: "Garde ton [cœur] plus que toute autre [chose], car de lui viennent les sources de la [vie].", distractors: ["âme", "joie"] },
      questions: [
        { id: "q1", type: "choix", text: "Ce qui influence le plus mon cœur en ce moment :", options: ["Ce que je regarde (séries, réseaux…)", "Ce que j'écoute (musique, podcasts…)", "Les gens que je fréquente", "Mes pensées quand je suis seul(e)"] },
        { id: "q2", type: "echelle", text: "Je me sens en sécurité émotionnellement avec toi.", low: "Pas encore", high: "Totalement" },
        { id: "q3", type: "tupref", text: "Quand je suis blessé(e), j'ai tendance à…", options: ["Me fermer un moment", "Tout dire tout de suite"] },
        { id: "q4", type: "echelle", text: "Je suis transparent(e) avec toi (pas de « détours », v. 24).", low: "Peu", high: "Complètement" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce qui pourrait abîmer notre cœur ou notre relation, et dont on devrait se protéger ?" }
      ],
      defi: "Faites chacun un « tri » : une chose à enlever de votre quotidien (appli, contenu, habitude) qui n'aide pas votre cœur. Partagez-la.",
      priere: "Seigneur, garde nos cœurs. Que nos yeux, nos paroles et nos pas te plaisent."
    },
    {
      id: "avant-3",
      emoji: "⏳",
      title: "Le bon moment",
      intro: "Trois fois, le Cantique répète : « ne réveillez pas l'amour avant qu'il le veuille. » Il y a un temps pour tout. L'attente n'est pas du temps perdu, c'est du temps qui prépare.",
      passages: [
        { ref: "Cantique des cantiques 2:7", book: 22, chapter: 2, text: {
          7: "Je vous en conjure, filles de Jérusalem, par les gazelles et les biches des champs, ne réveillez pas, ne réveillez pas l'amour, avant qu'elle le veuille."
        }},
        { ref: "Ecclésiaste 3:1, 5, 11", book: 21, chapter: 3, text: {
          1: "Il y a un temps pour tout, un temps pour toute chose sous les cieux :",
          5: "un temps pour lancer des pierres, et un temps pour ramasser des pierres ; un temps pour embrasser, et un temps pour s'éloigner des embrassements ;",
          11: "Il fait toute chose bonne en son temps ; même il a mis dans leur cœur la pensée de l'éternité, bien que l'homme ne puisse pas saisir l'œuvre que Dieu fait, du commencement jusqu'à la fin."
        }}
      ],
      keyword: { answers: ["gazelles", "gazelle"], hint: "Cantique 2:7 : par quels animaux (avec les biches) la jeune femme conjure-t-elle ?" },
      memo: { ref: "Ecclésiaste 3:1", text: "Il y a un [temps] pour tout, un temps pour toute [chose] sous les [cieux].", distractors: ["moment", "terre"] },
      questions: [
        { id: "q1", type: "tupref", text: "Dans la vie, je suis plutôt…", options: ["Impatient(e) : je veux avancer vite", "Prudent(e) : je préfère prendre mon temps"] },
        { id: "q2", type: "echelle", text: "Je me sens en paix avec le rythme de notre relation.", low: "Pas du tout", high: "Complètement" },
        { id: "q3", type: "choix", text: "Pour moi, la prochaine étape importante de notre relation, c'est…", options: ["Mieux connaître nos familles", "Parler sérieusement d'avenir", "Grandir spirituellement ensemble", "Les fiançailles"] },
        { id: "q4", type: "echelle", text: "Je fais confiance à Dieu pour le timing de notre histoire.", low: "Difficile", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "« Il fait toute chose bonne en son temps. » Qu'est-ce que cette période d'avant le mariage peut nous apprendre ?" }
      ],
      defi: "Écrivez ensemble une « frise » de votre relation : où vous en êtes, et les 3 prochaines étapes que vous imaginez, sans date imposée.",
      priere: "Seigneur, tu fais toute chose bonne en son temps. Donne-nous la patience et la paix dans l'attente."
    },
    {
      id: "avant-4",
      emoji: "🤍",
      title: "Honorer Dieu avec notre corps",
      intro: "La Bible parle sans détour de pureté. Pas pour interdire par principe, mais parce que notre corps est précieux : il est le temple du Saint-Esprit. Un sujet à aborder avec respect et franchise.",
      passages: [
        { ref: "1 Thessaloniciens 4:3-5, 7", book: 52, chapter: 4, text: {
          3: "Ce que Dieu veut, c'est votre sanctification ; c'est que vous vous absteniez de l'impudicité ;",
          4: "c'est que chacun de vous sache posséder son corps dans la sainteté et l'honnêteté,",
          5: "sans vous livrer à une convoitise passionnée, comme font les païens qui ne connaissent pas Dieu ;",
          7: "Car Dieu ne nous a pas appelés à l'impureté, mais à la sanctification."
        }},
        { ref: "1 Corinthiens 6:18-20", book: 46, chapter: 6, text: {
          18: "Fuyez l'impudicité. Quelque autre péché qu'un homme commette, ce péché est hors du corps ; mais celui qui se livre à l'impudicité pèche contre son propre corps.",
          19: "Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous, que vous avez reçu de Dieu, et que vous ne vous appartenez point à vous-mêmes ?",
          20: "Car vous avez été rachetés à un grand prix. Glorifiez donc Dieu dans votre corps et dans votre esprit, qui appartiennent à Dieu."
        }}
      ],
      keyword: { answers: ["temple"], hint: "1 Corinthiens 6:19 : notre corps est le … du Saint-Esprit." },
      memo: { ref: "1 Corinthiens 6:19", text: "Votre [corps] est le [temple] du Saint-[Esprit] qui est en vous.", distractors: ["cœur", "maison"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je me sens à l'aise pour parler de nos limites avec toi.", low: "Pas du tout", high: "Très à l'aise" },
        { id: "q2", type: "choix", text: "Ce qui nous aide le plus à honorer Dieu dans ce domaine :", options: ["Poser des limites claires", "Éviter certaines situations", "Prier ensemble", "Avoir des personnes de confiance à qui en parler"] },
        { id: "q3", type: "tupref", text: "Pour parler de ce sujet, je préfère…", options: ["En face, simplement", "Par écrit d'abord, puis en parler"] },
        { id: "q4", type: "echelle", text: "Je me sens respecté(e) par toi dans ce domaine.", low: "Pas assez", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Quelles limites voulons-nous nous fixer ensemble, et pourquoi sont-elles importantes pour nous ?" }
      ],
      defi: "Mettez-vous d'accord sur 2 ou 3 repères concrets qui vous aident à vous respecter, et confiez-les à Dieu dans la prière.",
      priere: "Seigneur, nous t'appartenons. Aide-nous à t'honorer dans notre corps et à nous respecter l'un l'autre."
    },
    {
      id: "avant-5",
      emoji: "🐂",
      title: "Marcher dans la même direction",
      intro: "Le joug unit deux bœufs pour qu'ils tirent ensemble. S'ils ne vont pas dans le même sens, tout se bloque. Partager la même foi, les mêmes valeurs et la même direction, c'est essentiel.",
      passages: [
        { ref: "2 Corinthiens 6:14", book: 47, chapter: 6, text: {
          14: "Ne vous mettez pas avec les infidèles sous un joug étranger. Car quel rapport y a-t-il entre la justice et l'iniquité ? ou qu'y a-t-il de commun entre la lumière et les ténèbres ?"
        }},
        { ref: "Amos 3:3", book: 30, chapter: 3, text: {
          3: "Deux hommes marchent-ils ensemble, sans en être convenus ?"
        }},
        { ref: "Philippiens 2:2", book: 50, chapter: 2, text: {
          2: "rendez ma joie parfaite, ayant un même sentiment, un même amour, une même âme, une même pensée."
        }}
      ],
      keyword: { answers: ["joug"], hint: "2 Corinthiens 6:14 : ne vous mettez pas sous un … étranger." },
      memo: { ref: "Amos 3:3", text: "[Deux] hommes [marchent]-ils ensemble, sans en être [convenus] ?", distractors: ["Trois", "parlent"] },
      questions: [
        { id: "q1", type: "echelle", text: "Nous avons les mêmes valeurs sur l'essentiel.", low: "Pas vraiment", high: "Complètement" },
        { id: "q2", type: "choix", text: "Le domaine où nous sommes le plus alignés :", options: ["La foi", "La famille", "L'argent", "Les projets de vie"] },
        { id: "q3", type: "choix", text: "Le domaine dont on devrait le plus parler pour « en convenir » :", options: ["La foi et l'église", "La famille et les enfants", "L'argent", "Où et comment vivre"] },
        { id: "q4", type: "tupref", text: "Notre couple, je le vois plutôt comme…", options: ["Deux personnes qui avancent côte à côte", "Une équipe qui construit un projet commun"] },
        { id: "q5", type: "ouverte", text: "Sur quel sujet aimerais-tu qu'on « se mette d'accord » prochainement ?" }
      ],
      defi: "Écrivez chacun vos 5 valeurs les plus importantes, puis comparez vos listes. Lesquelles sont communes ?",
      priere: "Seigneur, unis nos cœurs et nos pensées. Fais-nous marcher ensemble, dans ta direction."
    },
    {
      id: "avant-6",
      emoji: "🏗️",
      title: "Bien se préparer",
      intro: "Jésus parle de celui qui veut bâtir une tour : il s'assied d'abord pour calculer. Le mariage aussi se prépare : la sagesse bâtit la maison.",
      passages: [
        { ref: "Luc 14:28-30", book: 42, chapter: 14, text: {
          28: "Car, lequel de vous, s'il veut bâtir une tour, ne s'assied d'abord pour calculer la dépense et voir s'il a de quoi la terminer,",
          29: "de peur qu'après avoir posé les fondements, il ne puisse l'achever, et que tous ceux qui le verront ne se mettent à le railler,",
          30: "en disant : Cet homme a commencé à bâtir, et il n'a pu achever ?"
        }},
        { ref: "Proverbes 24:3-4", book: 20, chapter: 24, text: {
          3: "C'est par la sagesse qu'une maison s'élève, et par l'intelligence qu'elle s'affermit ;",
          4: "C'est par la science que les chambres se remplissent de tous les biens précieux et agréables."
        }}
      ],
      keyword: { answers: ["tour"], hint: "Luc 14:28 : que veut bâtir l'homme de la parabole ?" },
      memo: { ref: "Proverbes 24:3", text: "C'est par la [sagesse] qu'une [maison] s'élève, et par l'[intelligence] qu'elle s'affermit.", distractors: ["force", "tour"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je me sens prêt(e) à construire un avenir à deux.", low: "Pas encore", high: "Prêt(e)" },
        { id: "q2", type: "choix", text: "Ce qu'il faudrait le plus préparer avant un mariage :", options: ["Notre vie spirituelle", "Nos finances", "Notre communication", "Nos projets (logement, travail…)"] },
        { id: "q3", type: "tupref", text: "Pour préparer l'avenir, je suis plutôt…", options: ["Tableur et plan détaillé", "Grandes lignes et confiance"] },
        { id: "q4", type: "echelle", text: "On parle concrètement d'argent tous les deux.", low: "Jamais", high: "Facilement" },
        { id: "q5", type: "ouverte", text: "Si on « calculait la dépense » de notre futur mariage (pas seulement en argent), qu'est-ce qu'il nous coûterait et qu'est-ce qu'il nous apporterait ?" }
      ],
      defi: "Faites ensemble la liste de 3 choses à préparer dans l'année (ex. une formation, un budget, un livre à lire à deux).",
      priere: "Seigneur, donne-nous ta sagesse pour bâtir. Que notre maison soit fondée sur toi."
    },
    {
      id: "avant-7",
      emoji: "👥",
      title: "Bien entourés",
      intro: "Un couple ne grandit pas seul. La Bible encourage à chercher des conseils et à rester dans une communauté qui nous pousse vers le bien.",
      passages: [
        { ref: "Proverbes 15:22", book: 20, chapter: 15, text: {
          22: "Les projets échouent, faute d'une assemblée qui délibère ; mais ils réussissent quand il y a de nombreux conseillers."
        }},
        { ref: "Hébreux 10:24-25", book: 58, chapter: 10, text: {
          24: "Veillons les uns sur les autres, pour nous exciter à la charité et aux bonnes œuvres.",
          25: "N'abandonnons pas notre assemblée, comme c'est la coutume de quelques-uns ; mais exhortons-nous réciproquement, et cela d'autant plus que vous voyez s'approcher le jour."
        }}
      ],
      keyword: { answers: ["conseillers", "conseiller"], hint: "Proverbes 15:22 : les projets réussissent quand il y a de nombreux …" },
      memo: { ref: "Hébreux 10:24", text: "[Veillons] les uns sur les autres, pour nous exciter à la [charité] et aux bonnes [œuvres].", distractors: ["Prions", "paroles"] },
      questions: [
        { id: "q1", type: "echelle", text: "Nous avons autour de nous des personnes de confiance pour nous conseiller.", low: "Personne", high: "Plusieurs" },
        { id: "q2", type: "choix", text: "À qui aimerais-je demander conseil pour notre couple ?", options: ["Un couple marié qu'on admire", "Un pasteur / responsable d'église", "Nos parents", "Des amis proches"] },
        { id: "q3", type: "tupref", text: "Les conseils sur notre couple, je préfère…", options: ["Les demander souvent", "Les demander seulement en cas de besoin"] },
        { id: "q4", type: "echelle", text: "Je me sens bien intégré(e) dans une communauté chrétienne.", low: "Pas du tout", high: "Complètement" },
        { id: "q5", type: "ouverte", text: "Quel couple autour de nous t'inspire, et pourquoi ?" }
      ],
      defi: "Invitez (ou appelez) un couple chrétien que vous admirez et posez-lui une question : « Qu'est-ce que vous auriez aimé savoir avant de vous marier ? »",
      priere: "Seigneur, entoure-nous de personnes sages. Rends-nous humbles pour écouter et recevoir des conseils."
    }
  ]
});
