// Parcours : Le fruit de l'Esprit (Galates 5:22-23) — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "fruit",
  emoji: "🍎",
  title: "Le fruit de l'Esprit",
  short: "Fruit de l'Esprit",
  desc: "Neuf qualités que l'Esprit fait grandir en nous (Galates 5:22-23), une par semaine, vécues dans le couple.",
  weeks: [
    {
      id: "fruit-1",
      emoji: "❤️",
      title: "L'amour",
      intro: "Le fruit de l'Esprit est au singulier : c'est un seul fruit avec neuf saveurs, et l'amour vient en premier. Jésus en fait le signe distinctif de ses disciples.",
      passages: [
        { ref: "Galates 5:22-23", book: 48, chapter: 5, text: {
          22: "Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance ;",
          23: "la loi n'est pas contre ces choses."
        }},
        { ref: "Jean 13:34-35", book: 43, chapter: 13, text: {
          34: "Je vous donne un commandement nouveau : Aimez-vous les uns les autres ; comme je vous ai aimés, vous aussi, aimez-vous les uns les autres.",
          35: "A ceci tous connaîtront que vous êtes mes disciples, si vous avez de l'amour les uns pour les autres."
        }}
      ],
      keyword: { answers: ["nouveau"], hint: "Jean 13:34 : Jésus donne un commandement …" },
      memo: { ref: "Galates 5:22-23", text: "Le fruit de l'Esprit, c'est l'amour, la [joie], la paix, la [patience], la bonté, la bénignité, la fidélité, la [douceur], la tempérance.", distractors: ["force", "sagesse"] },
      questions: [
        { id: "q1", type: "choix", text: "Des 9 saveurs du fruit, celle qui me ressemble le plus :", options: ["L'amour / la bonté", "La joie / la paix", "La patience / la douceur", "La fidélité / la tempérance"] },
        { id: "q2", type: "choix", text: "Celle qui me manque le plus en ce moment :", options: ["L'amour / la bonté", "La joie / la paix", "La patience / la douceur", "La fidélité / la tempérance"] },
        { id: "q3", type: "echelle", text: "Les gens autour de nous peuvent voir que nous sommes disciples de Jésus à notre façon de nous aimer.", low: "Pas vraiment", high: "Clairement" },
        { id: "q4", type: "tupref", text: "« Comme je vous ai aimés » : l'amour de Jésus qui me touche le plus, c'est…", options: ["Son sacrifice", "Sa patience avec ses disciples"] },
        { id: "q5", type: "ouverte", text: "Quand t'es-tu senti(e) le plus aimé(e) par moi ?" }
      ],
      defi: "Chaque jour, faites un geste d'amour gratuit pour l'autre, sans rien attendre en retour.",
      priere: "Saint-Esprit, fais grandir ton fruit en nous, à commencer par l'amour."
    },
    {
      id: "fruit-2",
      emoji: "😄",
      title: "La joie",
      intro: "La joie biblique n'est pas l'absence de problèmes. C'est une force qui vient de Dieu : « la joie de l'Éternel sera votre force ».",
      passages: [
        { ref: "Philippiens 4:4", book: 50, chapter: 4, text: {
          4: "Réjouissez-vous toujours dans le Seigneur ; je le répète, réjouissez-vous."
        }},
        { ref: "Néhémie 8:10", book: 16, chapter: 8, text: {
          10: "Ils leur dirent : Allez, mangez des viandes grasses et buvez des liqueurs douces, et envoyez des portions à ceux qui n'ont rien de préparé, car ce jour est consacré à notre Seigneur ; ne vous affligez pas, car la joie de l'Éternel sera votre force."
        }},
        { ref: "Psaume 16:11", book: 19, chapter: 16, text: {
          11: "Tu me feras connaître le sentier de la vie ; il y a d'abondantes joies devant ta face, des délices éternelles à ta droite."
        }}
      ],
      keyword: { answers: ["force"], hint: "Néhémie 8:10 : la joie de l'Éternel sera votre …" },
      memo: { ref: "Philippiens 4:4", text: "[Réjouissez]-vous [toujours] dans le Seigneur ; je le [répète], réjouissez-vous.", distractors: ["parfois", "Priez"] },
      questions: [
        { id: "q1", type: "echelle", text: "En ce moment, je suis plein(e) de joie.", low: "Pas trop", high: "Débordant(e)" },
        { id: "q2", type: "choix", text: "Ce qui me donne le plus de joie dans notre relation :", options: ["Rire ensemble", "Nos moments de foi partagés", "Nos projets", "Le simple fait d'être ensemble"] },
        { id: "q3", type: "tupref", text: "Quand l'un de nous est triste, l'autre devrait…", options: ["Essayer de le faire rire", "Respecter sa tristesse"] },
        { id: "q4", type: "echelle", text: "Je garde la joie même quand les circonstances sont difficiles.", low: "Difficilement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Quel est ton souvenir le plus joyeux de nous deux ?" }
      ],
      defi: "Faites ensemble quelque chose de purement joyeux cette semaine (une sortie, un jeu, une danse dans le salon…) et remerciez Dieu pour ce moment.",
      priere: "Seigneur, que ta joie soit notre force, dans les bons jours comme dans les difficiles."
    },
    {
      id: "fruit-3",
      emoji: "🕊️",
      title: "La paix",
      intro: "Paul promet une paix « qui surpasse toute intelligence », qui garde nos cœurs. Et Jésus appelle heureux ceux qui procurent la paix, y compris dans leur couple.",
      passages: [
        { ref: "Philippiens 4:6-7", book: 50, chapter: 4, text: {
          6: "Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.",
          7: "Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ."
        }},
        { ref: "Romains 12:18", book: 45, chapter: 12, text: {
          18: "S'il est possible, autant que cela dépend de vous, soyez en paix avec tous les hommes."
        }},
        { ref: "Matthieu 5:9", book: 40, chapter: 5, text: {
          9: "Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu !"
        }}
      ],
      keyword: { answers: ["intelligence"], hint: "Philippiens 4:7 : la paix de Dieu surpasse toute …" },
      memo: { ref: "Philippiens 4:7", text: "Et la [paix] de Dieu, qui surpasse toute [intelligence], gardera vos [cœurs] et vos pensées en Jésus-Christ.", distractors: ["joie", "âmes"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je me sens en paix intérieurement en ce moment.", low: "Agité(e)", high: "Très paisible" },
        { id: "q2", type: "tupref", text: "Dans un conflit, je suis plutôt celui/celle qui…", options: ["Cherche à faire la paix vite", "A besoin de temps avant de revenir"] },
        { id: "q3", type: "choix", text: "Ce qui me vole le plus ma paix :", options: ["Les soucis du futur", "Les conflits avec les proches", "Le bruit et l'agitation", "Mes propres pensées"] },
        { id: "q4", type: "echelle", text: "Je me sens en paix quand je suis avec toi.", low: "Pas toujours", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Y a-t-il une relation (famille, ami) où « autant que cela dépend de nous » on pourrait faire la paix ?" }
      ],
      defi: "Avant chaque discussion importante de la semaine, priez 30 secondes ensemble pour demander la paix de Dieu.",
      priere: "Seigneur, garde nos cœurs dans ta paix. Fais de nous des artisans de paix."
    },
    {
      id: "fruit-4",
      emoji: "🌾",
      title: "La patience",
      intro: "Le laboureur attend la pluie sans s'énerver contre le ciel. La patience, c'est savoir attendre… et se supporter l'un l'autre avec amour.",
      passages: [
        { ref: "Éphésiens 4:2-3", book: 49, chapter: 4, text: {
          2: "en toute humilité et douceur, avec patience, vous supportant les uns les autres avec charité,",
          3: "vous efforçant de conserver l'unité de l'esprit par le lien de la paix."
        }},
        { ref: "Jacques 5:7-8", book: 59, chapter: 5, text: {
          7: "Soyez donc patients, frères, jusqu'à l'avènement du Seigneur. Voici, le laboureur attend le précieux fruit de la terre, prenant patience à son égard, jusqu'à ce qu'il ait reçu les pluies de la première et de l'arrière-saison.",
          8: "Vous aussi, soyez patients, affermissez vos cœurs, car l'avènement du Seigneur est proche."
        }},
        { ref: "Proverbes 14:29", book: 20, chapter: 14, text: {
          29: "Celui qui est lent à la colère a une grande intelligence, mais celui qui est prompt à s'emporter proclame sa folie."
        }}
      ],
      keyword: { answers: ["laboureur"], hint: "Jacques 5:7 : qui attend le précieux fruit de la terre ?" },
      memo: { ref: "Éphésiens 4:2", text: "En toute [humilité] et douceur, avec [patience], vous [supportant] les uns les autres avec charité.", distractors: ["joie", "aimant"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je suis patient(e) avec tes défauts.", low: "Pas assez", high: "Très" },
        { id: "q2", type: "choix", text: "Ce qui teste le plus ma patience :", options: ["Les retards", "Qu'on ne m'écoute pas", "La lenteur des choses (projets, réponses)", "Les répétitions"] },
        { id: "q3", type: "tupref", text: "Quand je suis à bout, ça se voit…", options: ["Tout de suite", "Rarement, je garde pour moi"] },
        { id: "q4", type: "echelle", text: "Je sens que tu es patient(e) avec moi.", low: "Pas toujours", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Pour quoi aimerais-tu que je sois plus patient(e) avec toi ?" }
      ],
      defi: "Repérez chacun un « déclencheur d'impatience » et choisissez une réaction à la place (respirer, prier, se taire 10 secondes). Faites le point en fin de semaine.",
      priere: "Seigneur, donne-nous la patience du laboureur, et apprends-nous à nous supporter avec amour."
    },
    {
      id: "fruit-5",
      emoji: "🎁",
      title: "La bonté",
      intro: "La bonté va plus loin que la politesse : faire du bien sans rien attendre, comme Dieu qui est bon même pour les ingrats. Elle commence souvent à la maison.",
      passages: [
        { ref: "Luc 6:31, 35-36", book: 42, chapter: 6, text: {
          31: "Ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux.",
          35: "Mais aimez vos ennemis, faites du bien, et prêtez sans rien espérer. Et votre récompense sera grande, et vous serez fils du Très-Haut, car il est bon pour les ingrats et pour les méchants.",
          36: "Soyez donc miséricordieux, comme votre Père est miséricordieux."
        }}
      ],
      keyword: { answers: ["ingrats"], hint: "Verset 35 : Dieu est bon pour les … et pour les méchants." },
      memo: { ref: "Luc 6:31", text: "Ce que vous [voulez] que les hommes fassent pour vous, [faites]-le de même pour [eux].", distractors: ["aimez", "nous"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je fais du bien sans attendre de retour.", low: "Rarement", high: "Toujours" },
        { id: "q2", type: "choix", text: "La bonté de l'autre qui me touche le plus :", options: ["Ses attentions", "Sa générosité", "Son écoute", "Son aide concrète"] },
        { id: "q3", type: "tupref", text: "Être bon(ne), c'est plus difficile…", options: ["Avec les inconnus", "Avec les proches"] },
        { id: "q4", type: "echelle", text: "Je suis aussi gentil(le) avec toi qu'avec les autres.", low: "Moins", high: "Autant ou plus" },
        { id: "q5", type: "ouverte", text: "Qui autour de nous aurait besoin de notre bonté cette semaine ?" }
      ],
      defi: "Faites ensemble une bonne action discrète pour quelqu'un qui ne pourra pas vous la rendre.",
      priere: "Père, tu es bon envers tous. Rends-nous bons et miséricordieux comme toi."
    },
    {
      id: "fruit-6",
      emoji: "🌿",
      title: "La bénignité (la bienveillance)",
      intro: "La bénignité, c'est la bienveillance : une douceur active qui met l'autre à l'aise. Boaz en est un bel exemple : il accueille Ruth l'étrangère avec respect et générosité.",
      passages: [
        { ref: "Ruth 2:10-12", book: 8, chapter: 2, text: {
          10: "Alors elle tomba sur sa face et se prosterna contre terre, et elle lui dit : Comment ai-je trouvé grâce à tes yeux, pour que tu t'intéresses à moi, à moi qui suis une étrangère ?",
          11: "Boaz lui répondit : On m'a rapporté tout ce que tu as fait pour ta belle-mère depuis la mort de ton mari, et comment tu as quitté ton père et ta mère et le pays de ta naissance, pour aller vers un peuple que tu ne connaissais point auparavant.",
          12: "Que l'Éternel te rende ce que tu as fait, et que ta récompense soit entière de la part de l'Éternel, le Dieu d'Israël, sous les ailes duquel tu es venue te réfugier !"
        }},
        { ref: "Colossiens 4:6", book: 51, chapter: 4, text: {
          6: "Que votre parole soit toujours accompagnée de grâce, assaisonnée de sel, afin que vous sachiez comment il faut répondre à chacun."
        }}
      ],
      keyword: { answers: ["ailes", "aile"], hint: "Ruth 2:12 : sous les … duquel tu es venue te réfugier." },
      memo: { ref: "Colossiens 4:6", text: "Que votre [parole] soit toujours accompagnée de [grâce], assaisonnée de [sel].", distractors: ["douceur", "miel"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je mets facilement les autres à l'aise.", low: "Pas trop", high: "Très facilement" },
        { id: "q2", type: "choix", text: "Ce que Boaz fait de plus beau pour Ruth :", options: ["Il la remarque", "Il reconnaît ce qu'elle a fait", "Il la bénit", "Il la protège"] },
        { id: "q3", type: "tupref", text: "Je me sens accueilli(e) quand on…", options: ["S'intéresse à mon histoire", "M'aide concrètement"] },
        { id: "q4", type: "echelle", text: "Ma famille se sent bien accueillie par toi (ou le serait).", low: "Pas encore", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Comme Boaz, dis à l'autre une chose qu'il/elle a faite et que tu as remarquée, même si personne ne l'a vue." }
      ],
      defi: "Accueillez quelqu'un avec une bienveillance particulière cette semaine : un nouveau à l'église, un collègue, un voisin.",
      priere: "Seigneur, que nos paroles soient pleines de grâce, et nos cœurs ouverts aux autres."
    },
    {
      id: "fruit-7",
      emoji: "🌅",
      title: "La fidélité",
      intro: "La fidélité de Dieu se renouvelle chaque matin. La nôtre se construit dans les petites choses : tenir ses promesses, même les plus simples.",
      passages: [
        { ref: "Lamentations 3:22-23", book: 25, chapter: 3, text: {
          22: "Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme ;",
          23: "Elles se renouvellent chaque matin. Oh ! que ta fidélité est grande !"
        }},
        { ref: "Luc 16:10", book: 42, chapter: 16, text: {
          10: "Celui qui est fidèle dans les moindres choses l'est aussi dans les grandes, et celui qui est injuste dans les moindres choses l'est aussi dans les grandes."
        }}
      ],
      keyword: { answers: ["matin"], hint: "Lamentations 3:23 : elles se renouvellent chaque …" },
      memo: { ref: "Lamentations 3:22-23", text: "Les [bontés] de l'Éternel ne sont pas épuisées. Elles se renouvellent chaque [matin]. Oh ! que ta [fidélité] est grande !", distractors: ["jour", "grâce"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je tiens mes petites promesses (rappeler, être à l'heure…).", low: "Rarement", high: "Toujours" },
        { id: "q2", type: "choix", text: "La « petite chose » où ta fidélité me rassure le plus :", options: ["Tu me réponds / tu me rappelles", "Tu es à l'heure", "Tu fais ce que tu as dit", "Tu es constant(e) dans ta foi"] },
        { id: "q3", type: "tupref", text: "Je préfère…", options: ["Promettre peu et tout tenir", "Promettre beaucoup et faire de mon mieux"] },
        { id: "q4", type: "echelle", text: "Je sens la fidélité de Dieu dans ma vie en ce moment.", low: "Peu", high: "Fortement" },
        { id: "q5", type: "ouverte", text: "Raconte un moment où Dieu t'a montré sa fidélité." }
      ],
      defi: "Faites-vous chacun une petite promesse concrète pour la semaine (et tenez-la !).",
      priere: "Seigneur, ta fidélité est grande. Rends-nous fidèles dans les petites choses comme dans les grandes."
    },
    {
      id: "fruit-8",
      emoji: "🪶",
      title: "La douceur",
      intro: "La douceur n'est pas de la faiblesse : c'est de la force maîtrisée. Jésus appelle heureux les « débonnaires », et Paul demande de corriger avec douceur.",
      passages: [
        { ref: "Matthieu 5:5", book: 40, chapter: 5, text: {
          5: "Heureux les débonnaires, car ils hériteront la terre !"
        }},
        { ref: "Galates 6:1", book: 48, chapter: 6, text: {
          1: "Frères, si un homme vient à être surpris en quelque faute, vous qui êtes spirituels, redressez-le avec un esprit de douceur. Prends garde à toi-même, de peur que tu ne sois aussi tenté."
        }},
        { ref: "Philippiens 4:5", book: 50, chapter: 4, text: {
          5: "Que votre douceur soit connue de tous les hommes. Le Seigneur est proche."
        }}
      ],
      keyword: { answers: ["debonnaires", "debonnaire"], hint: "Matthieu 5:5 : heureux les … car ils hériteront la terre." },
      memo: { ref: "Philippiens 4:5", text: "Que votre [douceur] soit [connue] de tous les hommes. Le Seigneur est [proche].", distractors: ["bonté", "là"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je suis doux/douce dans ma façon de te parler.", low: "Pas assez", high: "Toujours" },
        { id: "q2", type: "tupref", text: "Quand tu fais une erreur, je te le dis plutôt…", options: ["Directement", "Avec beaucoup de précautions"] },
        { id: "q3", type: "choix", text: "Le moment où j'ai le plus de mal à être doux/douce :", options: ["Quand je suis fatigué(e)", "Quand je suis stressé(e)", "Quand je me sens injustement traité(e)", "Quand j'ai faim 😅"] },
        { id: "q4", type: "echelle", text: "Je me sens corrigé(e) avec douceur quand tu me fais une remarque.", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Comment aimerais-tu que je te fasse une remarque difficile ?" }
      ],
      defi: "Cette semaine, baissez volontairement le ton à chaque désaccord. Notez combien de fois vous y arrivez.",
      priere: "Seigneur Jésus, toi qui es doux et humble de cœur, rends-nous doux l'un envers l'autre."
    },
    {
      id: "fruit-9",
      emoji: "🧘",
      title: "La tempérance (la maîtrise de soi)",
      intro: "Le dernier fruit est la maîtrise de soi. Sans elle, dit Proverbes, on est comme une ville sans murailles. Avec elle, on vaut mieux qu'un héros.",
      passages: [
        { ref: "Proverbes 16:32", book: 20, chapter: 16, text: {
          32: "Celui qui est lent à la colère vaut mieux qu'un héros, et celui qui est maître de lui-même, que celui qui prend des villes."
        }},
        { ref: "Proverbes 25:28", book: 20, chapter: 25, text: {
          28: "Comme une ville forcée et sans murailles, ainsi est l'homme qui n'est pas maître de lui-même."
        }},
        { ref: "Tite 2:11-12", book: 56, chapter: 2, text: {
          11: "Car la grâce de Dieu, source de salut pour tous les hommes, a été manifestée.",
          12: "Elle nous enseigne à renoncer à l'impiété et aux convoitises mondaines, et à vivre dans le siècle présent selon la sagesse, la justice et la piété,"
        }}
      ],
      keyword: { answers: ["murailles", "muraille"], hint: "Proverbes 25:28 : comme une ville forcée et sans …" },
      memo: { ref: "Proverbes 16:32", text: "Celui qui est lent à la [colère] vaut mieux qu'un [héros], et celui qui est [maître] de lui-même, que celui qui prend des villes.", distractors: ["parole", "roi"] },
      questions: [
        { id: "q1", type: "choix", text: "Là où j'ai le plus de mal à me maîtriser :", options: ["Le téléphone / les écrans", "La nourriture", "Mes paroles / ma colère", "Les dépenses"] },
        { id: "q2", type: "echelle", text: "Je suis maître de moi-même dans les moments de tension.", low: "Rarement", high: "Toujours" },
        { id: "q3", type: "tupref", text: "Pour tenir une bonne résolution, j'ai besoin…", options: ["D'une règle stricte", "De quelqu'un qui m'encourage"] },
        { id: "q4", type: "echelle", text: "On s'aide mutuellement à garder la maîtrise de soi.", low: "Pas encore", high: "Beaucoup" },
        { id: "q5", type: "ouverte", text: "Maintenant que vous avez parcouru les 9 saveurs du fruit : laquelle a le plus grandi en toi ? Laquelle vois-tu grandir en moi ?" }
      ],
      defi: "Choisissez chacun un domaine de maîtrise de soi et faites un petit « jeûne » d'une semaine (ex. pas de réseaux après 22 h). Encouragez-vous chaque jour.",
      priere: "Saint-Esprit, merci pour ton fruit. Continue de le faire mûrir en nous, jour après jour."
    }
  ]
});
