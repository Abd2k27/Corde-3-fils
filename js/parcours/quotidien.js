// Parcours : Le quotidien à deux — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "quotidien",
  emoji: "🏠",
  title: "Le quotidien à deux",
  short: "Quotidien",
  desc: "La foi dans la vraie vie : les paroles, l'argent, le service, les amis, le travail, le repos et la famille.",
  weeks: [
    {
      emoji: "💬",
      title: "Le pouvoir des paroles",
      intro: "« La mort et la vie sont au pouvoir de la langue. » Dans un couple, une phrase peut construire pour des années… ou blesser pour longtemps.",
      passages: [
        { ref: "Proverbes 18:21", book: 20, chapter: 18, text: {
          21: "La mort et la vie sont au pouvoir de la langue ; quiconque l'aime en mangera les fruits."
        }},
        { ref: "Proverbes 12:18", book: 20, chapter: 12, text: {
          18: "Tel, qui parle légèrement, blesse comme un glaive ; mais la langue des sages apporte la guérison."
        }},
        { ref: "Jacques 3:5, 9-10", book: 59, chapter: 3, text: {
          5: "De même, la langue est un petit membre, et elle se vante de grandes choses. Voici, comme un petit feu peut embraser une grande forêt !",
          9: "Par elle nous bénissons le Seigneur notre Père, et par elle nous maudissons les hommes faits à l'image de Dieu.",
          10: "De la même bouche sortent la bénédiction et la malédiction. Il ne faut pas, mes frères, qu'il en soit ainsi."
        }}
      ],
      keyword: { answers: ["foret"], hint: "Jacques 3:5 : un petit feu peut embraser une grande …" },
      memo: { ref: "Proverbes 18:21", text: "La [mort] et la [vie] sont au pouvoir de la [langue].", distractors: ["joie", "bouche"] },
      questions: [
        { id: "q1", type: "echelle", text: "Il m'arrive de dire des paroles blessantes sans le vouloir.", low: "Jamais", high: "Souvent" },
        { id: "q2", type: "choix", text: "La phrase qui me fait le plus de bien venant de toi :", options: ["« Je suis fier/fière de toi »", "« Je t'aime »", "« Merci »", "« Je suis là »"] },
        { id: "q3", type: "tupref", text: "Les compliments, je préfère les recevoir…", options: ["En privé", "Devant les autres"] },
        { id: "q4", type: "echelle", text: "Je parle de toi en bien quand tu n'es pas là.", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Quelle parole de ma part t'a fait le plus de bien ? Et y en a-t-il une qui t'a blessé(e) ?" }
      ],
      defi: "Chaque jour, dites à l'autre une parole qui « donne la vie » : un encouragement précis, pas juste « t'es génial(e) ».",
      priere: "Seigneur, mets une garde à notre bouche. Que nos paroles guérissent et construisent."
    },
    {
      emoji: "💰",
      title: "L'argent",
      intro: "Jésus parle plus d'argent que de beaucoup d'autres sujets. Ce n'est pas l'argent qui est mauvais, c'est l'amour de l'argent. Et c'est l'un des premiers sujets de dispute dans les couples.",
      passages: [
        { ref: "Hébreux 13:5", book: 58, chapter: 13, text: {
          5: "Ne vous livrez pas à l'amour de l'argent ; contentez-vous de ce que vous avez ; car Dieu lui-même a dit : Je ne te délaisserai point, et je ne t'abandonnerai point."
        }},
        { ref: "1 Timothée 6:6-8, 10", book: 54, chapter: 6, text: {
          6: "C'est, en effet, une grande source de gain que la piété avec le contentement ;",
          7: "car nous n'avons rien apporté dans le monde, et il est évident que nous n'en pouvons rien emporter ;",
          8: "si donc nous avons la nourriture et le vêtement, cela nous suffira.",
          10: "Car l'amour de l'argent est une racine de tous les maux ; et quelques-uns, en étant possédés, se sont égarés loin de la foi, et se sont jetés eux-mêmes dans bien des tourments."
        }},
        { ref: "Proverbes 3:9", book: 20, chapter: 3, text: {
          9: "Honore l'Éternel avec tes biens, et avec les prémices de tout ton revenu :"
        }}
      ],
      keyword: { answers: ["racine"], hint: "1 Timothée 6:10 : l'amour de l'argent est une … de tous les maux." },
      memo: { ref: "Hébreux 13:5", text: "Ne vous livrez pas à l'amour de l'[argent] ; [contentez]-vous de ce que vous avez ; car Dieu a dit : Je ne t'[abandonnerai] point.", distractors: ["monde", "oublierai"] },
      questions: [
        { id: "q1", type: "tupref", text: "Avec l'argent, je suis plutôt…", options: ["Économe : je mets de côté", "Généreux/se : je profite et je donne"] },
        { id: "q2", type: "echelle", text: "Je suis content(e) de ce que j'ai.", low: "Pas vraiment", high: "Pleinement" },
        { id: "q3", type: "choix", text: "Plus tard, comment gérer l'argent dans un couple ?", options: ["Tout en commun", "Un compte commun + chacun le sien", "Chacun le sien", "On verra ensemble"] },
        { id: "q4", type: "echelle", text: "Donner (à l'église, aux autres) a une vraie place dans ma vie.", low: "Peu", high: "Beaucoup" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce que tes parents t'ont appris (en bien ou en mal) sur l'argent ?" }
      ],
      defi: "Chacun note ses dépenses pendant 7 jours, puis partagez ce qui vous a surpris. Choisissez ensemble un don à faire.",
      priere: "Seigneur, garde nos cœurs de l'amour de l'argent. Apprends-nous le contentement et la générosité."
    },
    {
      emoji: "🤲",
      title: "Servir l'autre",
      intro: "Jésus, qui était Dieu, a pris la forme d'un serviteur. Dans le couple, la question n'est pas « qu'est-ce que l'autre fait pour moi ? » mais « comment puis-je le servir ? ».",
      passages: [
        { ref: "Philippiens 2:3-7", book: 50, chapter: 2, text: {
          3: "Ne faites rien par esprit de parti ou par vaine gloire, mais que l'humilité vous fasse regarder les autres comme étant au-dessus de vous-mêmes.",
          4: "Que chacun de vous, au lieu de considérer ses propres intérêts, considère aussi ceux des autres.",
          5: "Ayez en vous les sentiments qui étaient en Jésus-Christ,",
          6: "lequel, existant en forme de Dieu, n'a point regardé comme une proie à arracher d'être égal avec Dieu,",
          7: "mais s'est dépouillé lui-même, en prenant une forme de serviteur, en devenant semblable aux hommes ;"
        }}
      ],
      keyword: { answers: ["serviteur"], hint: "Verset 7 : Jésus a pris la forme d'un …" },
      memo: { ref: "Philippiens 2:4", text: "Que [chacun] de vous, au lieu de considérer ses propres [intérêts], considère aussi ceux des [autres].", distractors: ["désirs", "siens"] },
      questions: [
        { id: "q1", type: "choix", text: "La façon dont j'aime être servi(e) :", options: ["Un service concret (ranger, aider…)", "Un cadeau, même petit", "Du temps de qualité", "Un geste tendre"] },
        { id: "q2", type: "echelle", text: "Je pense à tes intérêts autant qu'aux miens.", low: "Rarement", high: "Toujours" },
        { id: "q3", type: "tupref", text: "Servir, pour moi, c'est plus naturel…", options: ["En faisant des choses", "En étant présent(e) et à l'écoute"] },
        { id: "q4", type: "echelle", text: "Je me sens servi(e) et pris(e) en compte par toi.", low: "Pas assez", high: "Pleinement" },
        { id: "q5", type: "ouverte", text: "Quel petit service te ferait vraiment plaisir cette semaine ?" }
      ],
      defi: "Faites le service que l'autre a demandé à la question 5, sans attendre qu'il/elle le rappelle.",
      priere: "Seigneur Jésus, toi qui t'es fait serviteur, donne-nous un cœur humble pour nous servir l'un l'autre."
    },
    {
      emoji: "🎒",
      title: "Porter les fardeaux",
      intro: "Le couple, c'est aussi se relayer : pleurer avec celui qui pleure, se réjouir avec celui qui se réjouit, et transmettre la consolation qu'on a reçue de Dieu.",
      passages: [
        { ref: "Galates 6:2", book: 48, chapter: 6, text: {
          2: "Portez les fardeaux les uns des autres, et vous accomplirez ainsi la loi de Christ."
        }},
        { ref: "Romains 12:15", book: 45, chapter: 12, text: {
          15: "Réjouissez-vous avec ceux qui se réjouissent ; pleurez avec ceux qui pleurent."
        }},
        { ref: "2 Corinthiens 1:3-4", book: 47, chapter: 1, text: {
          3: "Béni soit Dieu, le Père de notre Seigneur Jésus-Christ, le Père des miséricordes et le Dieu de toute consolation,",
          4: "qui nous console dans toutes nos afflictions, afin que, par la consolation dont nous sommes l'objet de la part de Dieu, nous puissions consoler ceux qui se trouvent dans quelque affliction !"
        }}
      ],
      keyword: { answers: ["fardeaux", "fardeau"], hint: "Galates 6:2 : portez les … les uns des autres." },
      memo: { ref: "Galates 6:2", text: "Portez les [fardeaux] les uns des autres, et vous [accomplirez] ainsi la loi de [Christ].", distractors: ["peines", "Dieu"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je te parle facilement de ce qui pèse sur moi.", low: "Difficilement", high: "Très facilement" },
        { id: "q2", type: "choix", text: "Mon « fardeau » principal en ce moment :", options: ["La fatigue", "Le stress du travail / des études", "Une situation familiale", "Des doutes ou de l'anxiété"] },
        { id: "q3", type: "tupref", text: "Quand tu vis une victoire, je…", options: ["Fais la fête avec toi", "Te dis calmement que je suis fier/fière"] },
        { id: "q4", type: "echelle", text: "Je sens que tu portes mes soucis avec moi.", low: "Pas assez", high: "Totalement" },
        { id: "q5", type: "ouverte", text: "Comment Dieu t'a-t-il consolé(e) dans une épreuve passée ? Comment pourrais-tu me transmettre cette consolation ?" }
      ],
      defi: "Chaque soir, demandez-vous : « Qu'est-ce qui a été lourd aujourd'hui ? Qu'est-ce qui a été beau ? »",
      priere: "Dieu de toute consolation, apprends-nous à porter les fardeaux l'un de l'autre."
    },
    {
      emoji: "🤝",
      title: "Les amis et l'entourage",
      intro: "On devient comme ceux qu'on fréquente. Un couple a besoin d'amis qui le tirent vers le haut, et d'un ami « plus attaché qu'un frère ».",
      passages: [
        { ref: "Proverbes 13:20", book: 20, chapter: 13, text: {
          20: "Celui qui fréquente les sages devient sage, mais celui qui se plaît avec les insensés s'en trouve mal."
        }},
        { ref: "Proverbes 18:24", book: 20, chapter: 18, text: {
          24: "Celui qui a beaucoup d'amis les a pour son malheur, mais il est tel ami plus attaché qu'un frère."
        }},
        { ref: "1 Corinthiens 15:33", book: 46, chapter: 15, text: {
          33: "Ne vous y trompez pas : les mauvaises compagnies corrompent les bonnes mœurs."
        }}
      ],
      keyword: { answers: ["frere"], hint: "Proverbes 18:24 : il est tel ami plus attaché qu'un …" },
      memo: { ref: "Proverbes 13:20", text: "Celui qui [fréquente] les [sages] devient sage, mais celui qui se plaît avec les [insensés] s'en trouve mal.", distractors: ["écoute", "riches"] },
      questions: [
        { id: "q1", type: "echelle", text: "Mes amis m'aident à grandir dans la foi.", low: "Pas vraiment", high: "Beaucoup" },
        { id: "q2", type: "tupref", text: "Côté vie sociale, je suis plutôt…", options: ["Beaucoup d'amis, souvent dehors", "Quelques amis proches, et du calme"] },
        { id: "q3", type: "choix", text: "Ce que j'aimerais qu'on fasse plus avec d'autres :", options: ["Recevoir des amis à la maison", "Sortir en groupe", "Partager des moments avec des couples chrétiens", "Voir plus nos familles"] },
        { id: "q4", type: "echelle", text: "Je me sens bien avec tes amis.", low: "Pas trop", high: "Très bien" },
        { id: "q5", type: "ouverte", text: "Qui est ton ami « plus attaché qu'un frère » ? Et est-ce que je suis aussi ton meilleur ami ?" }
      ],
      defi: "Organisez un moment avec des amis qui vous font du bien (un repas, une sortie), et priez pour eux ensuite.",
      priere: "Seigneur, merci pour nos amis. Entoure-nous de personnes sages et rends-nous de bons amis pour les autres."
    },
    {
      emoji: "⚖️",
      title: "Travail et repos",
      intro: "Dieu nous appelle à travailler « de bon cœur, comme pour le Seigneur »… et aussi à nous reposer. Ni paresse, ni épuisement : un rythme qui laisse de la place à Dieu et à l'autre.",
      passages: [
        { ref: "Colossiens 3:23-24", book: 51, chapter: 3, text: {
          23: "Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes,",
          24: "sachant que vous recevrez du Seigneur l'héritage pour récompense. Servez Christ, le Seigneur."
        }},
        { ref: "Exode 20:9-10", book: 2, chapter: 20, text: {
          9: "Tu travailleras six jours, et tu feras tout ton ouvrage.",
          10: "Mais le septième jour est le jour du repos de l'Éternel, ton Dieu : tu ne feras aucun ouvrage, ni toi, ni ton fils, ni ta fille, ni ton serviteur, ni ta servante, ni ton bétail, ni l'étranger qui est dans tes portes."
        }},
        { ref: "Matthieu 11:28-30", book: 40, chapter: 11, text: {
          28: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",
          29: "Prenez mon joug sur vous et recevez mes instructions, car je suis doux et humble de cœur ; et vous trouverez du repos pour vos âmes.",
          30: "Car mon joug est doux, et mon fardeau léger."
        }}
      ],
      keyword: { answers: ["septieme"], hint: "Exode 20:10 : quel jour est le jour du repos ?" },
      memo: { ref: "Matthieu 11:28", text: "Venez à moi, vous tous qui êtes [fatigués] et [chargés], et je vous donnerai du [repos].", distractors: ["perdus", "paix"] },
      questions: [
        { id: "q1", type: "echelle", text: "En ce moment, je me sens épuisé(e).", low: "Pas du tout", high: "Complètement" },
        { id: "q2", type: "tupref", text: "Mon repos idéal, c'est…", options: ["Rester à la maison, au calme", "Sortir, bouger, voir du monde"] },
        { id: "q3", type: "choix", text: "Ce qui empiète le plus sur notre temps ensemble :", options: ["Le travail", "Les études", "Le téléphone", "La fatigue"] },
        { id: "q4", type: "echelle", text: "Je travaille « comme pour le Seigneur ».", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "À quoi pourrait ressembler un vrai « jour de repos » à deux, avec Dieu au centre ?" }
      ],
      defi: "Bloquez une demi-journée « sabbat » cette semaine : sans travail, sans écrans, pour vous reposer, prier et profiter l'un de l'autre.",
      priere: "Seigneur, nous venons à toi fatigués. Donne-nous ton repos et apprends-nous un rythme de vie sain."
    },
    {
      emoji: "👶",
      title: "Les futurs enfants",
      intro: "« Les fils sont un héritage de l'Éternel. » Même si c'est encore loin, parler ensemble de la famille qu'on imagine aide à se connaître et à se préparer.",
      passages: [
        { ref: "Psaume 127:3-5", book: 19, chapter: 127, text: {
          3: "Voici, des fils sont un héritage de l'Éternel, le fruit des entrailles est une récompense.",
          4: "Comme les flèches dans la main d'un guerrier, ainsi sont les fils de la jeunesse.",
          5: "Heureux l'homme qui en a rempli son carquois ! Ils ne seront pas confus, quand ils parleront avec des ennemis à la porte."
        }},
        { ref: "Proverbes 22:6", book: 20, chapter: 22, text: {
          6: "Instruis l'enfant selon la voie qu'il doit suivre ; et quand il sera vieux, il ne s'en détournera pas."
        }},
        { ref: "Éphésiens 6:4", book: 49, chapter: 6, text: {
          4: "Et vous, pères, n'irritez pas vos enfants, mais élevez-les en les corrigeant et en les instruisant selon le Seigneur."
        }}
      ],
      keyword: { answers: ["fleches", "fleche"], hint: "Psaume 127:4 : les fils sont comme les … dans la main d'un guerrier." },
      memo: { ref: "Proverbes 22:6", text: "[Instruis] l'enfant selon la [voie] qu'il doit suivre ; et quand il sera vieux, il ne s'en [détournera] pas.", distractors: ["Aime", "souviendra"] },
      questions: [
        { id: "q1", type: "choix", text: "Combien d'enfants j'imagine avoir un jour ?", options: ["Aucun ou je ne sais pas", "1 ou 2", "3", "4 et plus"] },
        { id: "q2", type: "tupref", text: "Comme parent, je me vois plutôt…", options: ["Cadre et règles claires", "Douceur et beaucoup de liberté"] },
        { id: "q3", type: "choix", text: "Ce que je voudrais le plus transmettre à mes enfants :", options: ["La foi", "Le respect", "La confiance en soi", "L'amour de la famille"] },
        { id: "q4", type: "echelle", text: "J'aimerais éduquer mes enfants comme mes parents m'ont éduqué(e).", low: "Pas du tout", high: "Tout à fait" },
        { id: "q5", type: "ouverte", text: "Quel souvenir d'enfance aimerais-tu recréer pour tes propres enfants ?" }
      ],
      defi: "Racontez-vous chacun votre plus beau souvenir de famille, et ce que vous aimeriez faire différemment.",
      priere: "Seigneur, prépare nos cœurs à la famille que tu nous donneras peut-être un jour."
    }
  ]
});
