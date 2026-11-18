// Parcours : Notre relation avec Dieu — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "dieu",
  emoji: "✝️",
  title: "Notre relation avec Dieu",
  short: "Avec Dieu",
  desc: "La fondation : connaître Dieu, l'aimer, lui faire confiance, chacun et ensemble.",
  weeks: [
    {
      id: "dieu-1",
      emoji: "🍇",
      title: "Demeurer en lui",
      intro: "Jésus se compare à un cep de vigne et nous à ses sarments. Un sarment ne force pas pour porter du fruit : il reste attaché. La vie spirituelle commence là.",
      passages: [
        { ref: "Jean 15:4-5, 9-11", book: 43, chapter: 15, text: {
          4: "Demeurez en moi, et je demeurerai en vous. Comme le sarment ne peut de lui-même porter du fruit, s'il ne demeure attaché au cep, ainsi vous ne le pouvez non plus, si vous ne demeurez en moi.",
          5: "Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.",
          9: "Comme le Père m'a aimé, je vous ai aussi aimés. Demeurez dans mon amour.",
          10: "Si vous gardez mes commandements, vous demeurerez dans mon amour, de même que j'ai gardé les commandements de mon Père, et que je demeure dans son amour.",
          11: "Je vous ai dit ces choses, afin que ma joie soit en vous, et que votre joie soit parfaite."
        }}
      ],
      keyword: { answers: ["cep"], hint: "Verset 5 : Jésus dit « Je suis le … »." },
      memo: { ref: "Jean 15:5", text: "Je suis le [cep], vous êtes les [sarments]. Celui qui demeure en moi porte beaucoup de fruit, car sans moi vous ne pouvez [rien] faire.", distractors: ["arbre", "tout"] },
      questions: [
        { id: "q1", type: "echelle", text: "En ce moment, je me sens « attaché(e) au cep » (proche de Dieu).", low: "Très loin", high: "Très proche" },
        { id: "q2", type: "choix", text: "Ce qui m'aide le plus à rester proche de Dieu :", options: ["La prière", "La lecture de la Bible", "La louange / la musique", "L'église et les autres chrétiens"] },
        { id: "q3", type: "tupref", text: "Mon moment idéal avec Dieu, c'est plutôt…", options: ["Le matin, pour bien commencer", "Le soir, pour tout lui remettre"] },
        { id: "q4", type: "choix", text: "Ce qui m'éloigne le plus de Dieu au quotidien :", options: ["Le téléphone / les écrans", "La fatigue et le stress", "Les doutes", "Le manque de temps"] },
        { id: "q5", type: "ouverte", text: "Le verset 11 parle d'une joie « parfaite ». Quand as-tu ressenti cette joie de Dieu pour la dernière fois ?" }
      ],
      defi: "Chacun prend 10 minutes par jour, 5 jours cette semaine, seul avec Dieu (prière ou lecture). Le soir, partagez une phrase de ce moment.",
      priere: "Seigneur, garde-nous attachés à toi. Sans toi nous ne pouvons rien faire."
    },
    {
      id: "dieu-2",
      emoji: "❤️‍🔥",
      title: "Le plus grand commandement",
      intro: "Toute la Bible tient en deux phrases : aimer Dieu de tout son être, et aimer son prochain comme soi-même. Et ton prochain le plus proche, c'est peut-être la personne à côté de toi.",
      passages: [
        { ref: "Matthieu 22:36-40", book: 40, chapter: 22, text: {
          36: "Maître, quel est le plus grand commandement de la loi ?",
          37: "Jésus lui répondit : Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, et de toute ta pensée.",
          38: "C'est le premier et le plus grand commandement.",
          39: "Et voici le second, qui lui est semblable : Tu aimeras ton prochain comme toi-même.",
          40: "De ces deux commandements dépendent toute la loi et les prophètes."
        }}
      ],
      keyword: { answers: ["prochain"], hint: "Verset 39 : qui devons-nous aimer comme nous-mêmes ?" },
      memo: { ref: "Matthieu 22:37", text: "Tu aimeras le Seigneur, ton Dieu, de tout ton [cœur], de toute ton [âme], et de toute ta [pensée].", distractors: ["force", "vie"] },
      questions: [
        { id: "q1", type: "choix", text: "J'aime Dieu surtout avec…", options: ["Mon cœur (mes émotions)", "Mon âme (ma vie intérieure)", "Ma pensée (ma réflexion)", "Mes actes"] },
        { id: "q2", type: "echelle", text: "Je m'aime moi-même d'une façon saine.", low: "Pas du tout", high: "Tout à fait" },
        { id: "q3", type: "tupref", text: "Aimer mon prochain, c'est d'abord…", options: ["Donner de mon temps", "Pardonner et être patient(e)"] },
        { id: "q4", type: "echelle", text: "Notre amour l'un pour l'autre m'aide à aimer Dieu davantage.", low: "Pas vraiment", high: "Énormément" },
        { id: "q5", type: "ouverte", text: "Quelle personne autour de nous aurait besoin qu'on l'aime concrètement en ce moment ?" }
      ],
      defi: "Ensemble, faites un geste concret pour une personne de votre entourage cette semaine (un message, un repas, un service).",
      priere: "Seigneur, apprends-nous à t'aimer de tout notre être, et à aimer les autres comme toi tu les aimes."
    },
    {
      id: "dieu-3",
      emoji: "🕊️",
      title: "Chercher d'abord son royaume",
      intro: "Jésus ne dit pas que nos besoins ne comptent pas. Il dit : mets Dieu en premier, et fais-lui confiance pour le reste. Un vrai défi pour un couple qui fait des projets.",
      passages: [
        { ref: "Matthieu 6:25-26, 31-34", book: 40, chapter: 6, text: {
          25: "C'est pourquoi je vous dis : Ne vous inquiétez pas pour votre vie de ce que vous mangerez, ni pour votre corps, de quoi vous serez vêtus. La vie n'est-elle pas plus que la nourriture, et le corps plus que le vêtement ?",
          26: "Regardez les oiseaux du ciel : ils ne sèment ni ne moissonnent, et ils n'amassent rien dans des greniers ; et votre Père céleste les nourrit. Ne valez-vous pas beaucoup plus qu'eux ?",
          31: "Ne vous inquiétez donc point, et ne dites pas : Que mangerons-nous ? que boirons-nous ? de quoi serons-nous vêtus ?",
          32: "Car toutes ces choses, ce sont les païens qui les recherchent. Votre Père céleste sait que vous en avez besoin.",
          33: "Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus.",
          34: "Ne vous inquiétez donc pas du lendemain ; car le lendemain aura soin de lui-même. A chaque jour suffit sa peine."
        }}
      ],
      keyword: { answers: ["oiseaux"], hint: "Verset 26 : que Jésus nous invite-t-il à regarder dans le ciel ?" },
      memo: { ref: "Matthieu 6:33", text: "Cherchez [premièrement] le [royaume] et la justice de Dieu ; et toutes ces choses vous seront [données] par-dessus.", distractors: ["toujours", "rendues"] },
      questions: [
        { id: "q1", type: "echelle", text: "En ce moment, je m'inquiète pour l'avenir.", low: "Pas du tout", high: "Énormément" },
        { id: "q2", type: "choix", text: "Mon inquiétude principale du moment :", options: ["Le travail / les études", "L'argent", "Notre avenir à deux", "La famille / la santé"] },
        { id: "q3", type: "tupref", text: "Face à une décision importante, j'ai tendance à…", options: ["Tout planifier moi-même", "Attendre un signe de Dieu"] },
        { id: "q4", type: "echelle", text: "Dieu passe vraiment en premier dans mes choix.", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Concrètement, « chercher d'abord le royaume » dans notre couple, ça ressemblerait à quoi ?" }
      ],
      defi: "Écrivez chacun votre plus grosse inquiétude sur un papier, échangez-les, et priez chaque jour pour celle de l'autre.",
      priere: "Père, tu sais ce dont nous avons besoin. Apprends-nous à te chercher d'abord et à te confier le reste."
    },
    {
      id: "dieu-4",
      emoji: "🧭",
      title: "Faire confiance",
      intro: "« Ne t'appuie pas sur ta sagesse. » Facile à lire, difficile à vivre, surtout quand on aime tout contrôler. La promesse : Dieu aplanit le chemin.",
      passages: [
        { ref: "Proverbes 3:5-8", book: 20, chapter: 3, text: {
          5: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ;",
          6: "Reconnais-le dans toutes tes voies, et il aplanira tes sentiers.",
          7: "Ne sois point sage à tes propres yeux, crains l'Éternel, et détourne-toi du mal :",
          8: "Ce sera la santé pour tes muscles, et un rafraîchissement pour tes os."
        }}
      ],
      keyword: { answers: ["sentiers"], hint: "Verset 6 : qu'est-ce que Dieu aplanira ?" },
      memo: { ref: "Proverbes 3:5-6", text: "[Confie]-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta [sagesse] ; reconnais-le dans toutes tes voies, et il [aplanira] tes sentiers.", distractors: ["Remets", "force"] },
      questions: [
        { id: "q1", type: "echelle", text: "Il m'est facile de lâcher prise et de faire confiance à Dieu.", low: "Très difficile", high: "Très facile" },
        { id: "q2", type: "tupref", text: "Quand quelque chose m'inquiète, je préfère…", options: ["En parler tout de suite", "Le garder pour moi et prier d'abord"] },
        { id: "q3", type: "choix", text: "Le domaine où j'ai le plus de mal à faire confiance à Dieu :", options: ["Mon avenir professionnel", "Notre relation", "Ma famille", "Mes finances"] },
        { id: "q4", type: "echelle", text: "Je te fais confiance (dans tes choix, tes paroles, ta fidélité).", low: "Peu", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Raconte une fois où Dieu a « aplani ton sentier » alors que tu ne voyais pas d'issue." }
      ],
      defi: "Choisissez une décision en suspens (petite ou grande) et priez ensemble chaque jour à son sujet avant d'agir.",
      priere: "Seigneur, nous te confions nos chemins. Aplanis nos sentiers et garde-nous de compter sur nos seules forces."
    },
    {
      id: "dieu-5",
      emoji: "🌳",
      title: "Ce que Dieu demande",
      intro: "Michée résume tout en trois verbes : pratiquer la justice, aimer la miséricorde, marcher humblement avec Dieu. Et le Psaume 1 montre ce que devient celui qui s'enracine dans sa Parole.",
      passages: [
        { ref: "Michée 6:8", book: 33, chapter: 6, text: {
          8: "On t'a fait connaître, ô homme, ce qui est bien ; et ce que l'Éternel demande de toi, c'est que tu pratiques la justice, que tu aimes la miséricorde, et que tu marches humblement avec ton Dieu."
        }},
        { ref: "Psaume 1:1-3", book: 19, chapter: 1, text: {
          1: "Heureux l'homme qui ne marche pas selon le conseil des méchants, qui ne s'arrête pas sur la voie des pécheurs, et qui ne s'assied pas en compagnie des moqueurs,",
          2: "Mais qui trouve son plaisir dans la loi de l'Éternel, et qui la médite jour et nuit !",
          3: "Il est comme un arbre planté près d'un courant d'eau, qui donne son fruit en sa saison, et dont le feuillage ne se flétrit point : tout ce qu'il fait lui réussit."
        }}
      ],
      keyword: { answers: ["arbre"], hint: "Psaume 1:3 : à quoi est comparé celui qui médite la Parole ?" },
      memo: { ref: "Michée 6:8", text: "Ce que l'Éternel demande de toi, c'est que tu pratiques la [justice], que tu aimes la [miséricorde], et que tu marches [humblement] avec ton Dieu.", distractors: ["vérité", "fidèlement"] },
      questions: [
        { id: "q1", type: "choix", text: "Des trois verbes de Michée, celui que je vis le mieux :", options: ["Pratiquer la justice", "Aimer la miséricorde", "Marcher humblement avec Dieu"] },
        { id: "q2", type: "choix", text: "Et celui où je dois le plus grandir :", options: ["Pratiquer la justice", "Aimer la miséricorde", "Marcher humblement avec Dieu"] },
        { id: "q3", type: "echelle", text: "Je médite la Parole de Dieu régulièrement.", low: "Jamais", high: "Chaque jour" },
        { id: "q4", type: "tupref", text: "Pour méditer la Bible, je préfère…", options: ["Un verset, longuement", "Un chapitre entier"] },
        { id: "q5", type: "ouverte", text: "Qui sont les « moqueurs » ou les mauvaises influences dont on devrait peut-être s'éloigner un peu ?" }
      ],
      defi: "Apprenez Michée 6:8 par cœur tous les deux et récitez-le l'un à l'autre en fin de semaine.",
      priere: "Seigneur, enracine-nous près de ta source. Apprends-nous la justice, la miséricorde et l'humilité."
    },
    {
      id: "dieu-6",
      emoji: "🦋",
      title: "Être transformés",
      intro: "Paul ne dit pas « faites des efforts pour paraître chrétiens », mais « laissez-vous transformer ». La vie avec Dieu change notre façon de penser, puis notre façon d'aimer.",
      passages: [
        { ref: "Romains 12:1-2, 9-12", book: 45, chapter: 12, text: {
          1: "Je vous exhorte donc, frères, par les compassions de Dieu, à offrir vos corps comme un sacrifice vivant, saint, agréable à Dieu, ce qui sera de votre part un culte raisonnable.",
          2: "Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu, ce qui est bon, agréable et parfait.",
          9: "Que la charité soit sans hypocrisie. Ayez le mal en horreur ; attachez-vous fortement au bien.",
          10: "Par amour fraternel, soyez pleins d'affection les uns pour les autres ; par honneur, usez de prévenances réciproques.",
          11: "Ayez du zèle, et non de la paresse. Soyez fervents d'esprit. Servez le Seigneur.",
          12: "Réjouissez-vous en espérance. Soyez patients dans l'affliction. Persévérez dans la prière."
        }}
      ],
      keyword: { answers: ["transformes", "transforme"], hint: "Verset 2 : ne vous conformez pas au siècle présent, mais soyez …" },
      memo: { ref: "Romains 12:12", text: "Réjouissez-vous en [espérance]. Soyez [patients] dans l'affliction. Persévérez dans la [prière].", distractors: ["joie", "foi"] },
      questions: [
        { id: "q1", type: "echelle", text: "Depuis que je connais Dieu, j'ai vraiment changé.", low: "Pas encore", high: "Énormément" },
        { id: "q2", type: "choix", text: "Ce qui me « conforme au siècle présent » le plus :", options: ["Les réseaux sociaux", "L'avis des autres", "La course à la réussite", "Le confort"] },
        { id: "q3", type: "tupref", text: "« Usez de prévenances » : j'apprécie surtout que tu…", options: ["Anticipes mes besoins", "Me fasses passer avant les autres"] },
        { id: "q4", type: "echelle", text: "Je persévère dans la prière, même quand Dieu semble silencieux.", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce que tu as vu changer en moi (en bien) depuis qu'on se connaît ?" }
      ],
      defi: "Faites un « jeûne » ensemble cette semaine : un jour sans réseaux sociaux, remplacé par un moment de prière ou de lecture.",
      priere: "Seigneur, renouvelle notre intelligence. Transforme-nous pour que notre amour soit sans hypocrisie."
    },
    {
      id: "dieu-7",
      emoji: "💗",
      title: "Aimés pour aimer",
      intro: "Avant tout ce que nous faisons pour Dieu, il y a ce qu'il a fait pour nous. « Nous l'aimons, parce qu'il nous a aimés le premier. » C'est la source de tout amour, y compris le vôtre.",
      passages: [
        { ref: "1 Jean 4:7-12, 19", book: 62, chapter: 4, text: {
          7: "Bien-aimés, aimons-nous les uns les autres ; car l'amour est de Dieu, et quiconque aime est né de Dieu et connaît Dieu.",
          8: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour.",
          9: "L'amour de Dieu a été manifesté envers nous en ce que Dieu a envoyé son Fils unique dans le monde, afin que nous vivions par lui.",
          10: "Et cet amour consiste, non point en ce que nous avons aimé Dieu, mais en ce qu'il nous a aimés et a envoyé son Fils comme victime expiatoire pour nos péchés.",
          11: "Bien-aimés, si Dieu nous a ainsi aimés, nous devons aussi nous aimer les uns les autres.",
          12: "Personne n'a jamais vu Dieu ; si nous nous aimons les uns les autres, Dieu demeure en nous, et son amour est parfait en nous.",
          19: "Pour nous, nous l'aimons, parce qu'il nous a aimés le premier."
        }}
      ],
      keyword: { answers: ["premier"], hint: "Verset 19 : nous l'aimons parce qu'il nous a aimés le …" },
      memo: { ref: "1 Jean 4:8, 19", text: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est [amour]. Nous l'[aimons], parce qu'il nous a aimés le [premier].", distractors: ["lumière", "dernier"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je me sens profondément aimé(e) par Dieu.", low: "Pas vraiment", high: "Complètement" },
        { id: "q2", type: "tupref", text: "Je ressens l'amour de Dieu surtout…", options: ["Dans les moments de calme", "À travers les gens qu'il met sur ma route"] },
        { id: "q3", type: "choix", text: "Ce qui m'aide le plus à croire que Dieu m'aime :", options: ["La croix de Jésus", "Ses réponses à mes prières", "Sa présence dans les épreuves", "L'amour des autres pour moi"] },
        { id: "q4", type: "echelle", text: "Je sens que Dieu m'aime à travers toi.", low: "Rarement", high: "Très souvent" },
        { id: "q5", type: "ouverte", text: "« Personne n'a jamais vu Dieu ; si nous nous aimons… Dieu demeure en nous. » Comment notre amour pourrait-il montrer Dieu aux autres ?" }
      ],
      defi: "Écrivez chacun une courte lettre à l'autre : « Je vois l'amour de Dieu en toi quand… » et lisez-la à voix haute.",
      priere: "Père, merci de nous avoir aimés le premier. Que notre amour soit le reflet du tien."
    }
  ]
});
