// 📖 Contenu des 7 semaines — texte biblique : Louis Segond 1910 (domaine public)
// Types de questions : "echelle" (1-10), "tupref" (A/B), "choix" (liste), "ouverte" (texte libre, pas de devinette)
// Numéros de livres (pour l'API getBible) : Genèse 1, Deutéronome 5, Josué 6, Ruth 8, Psaumes 19,
// Proverbes 20, Ecclésiaste 21, Matthieu 40, Actes 44, 1 Corinthiens 46, Éphésiens 49, Colossiens 51, Jacques 59

window.WEEKS = [
  {
    id: 1,
    emoji: "🌱",
    title: "Le plan de Dieu pour le couple",
    intro: "Avant même le premier péché, Dieu regarde sa création et dit qu'une chose n'est « pas bon » : que l'homme soit seul. Le couple, c'est son idée avant d'être la nôtre.",
    passages: [
      { ref: "Genèse 2:18-25", book: 1, chapter: 2, text: {
        18: "L'Éternel Dieu dit : Il n'est pas bon que l'homme soit seul ; je lui ferai une aide semblable à lui.",
        19: "L'Éternel Dieu forma de la terre tous les animaux des champs et tous les oiseaux du ciel, et il les fit venir vers l'homme, pour voir comment il les appellerait, et afin que tout être vivant portât le nom que lui donnerait l'homme.",
        20: "Et l'homme donna des noms à tout le bétail, aux oiseaux du ciel et à tous les animaux des champs ; mais, pour l'homme, il ne trouva point d'aide semblable à lui.",
        21: "Alors l'Éternel Dieu fit tomber un profond sommeil sur l'homme, qui s'endormit ; il prit une de ses côtes, et referma la chair à sa place.",
        22: "L'Éternel Dieu forma une femme de la côte qu'il avait prise de l'homme, et il l'amena vers l'homme.",
        23: "Et l'homme dit : Voici cette fois celle qui est os de mes os et chair de ma chair ! on l'appellera femme, parce qu'elle a été prise de l'homme.",
        24: "C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, et ils deviendront une seule chair.",
        25: "L'homme et sa femme étaient tous deux nus, et ils n'en avaient point honte."
      }}
    ],
    keyword: { answers: ["attachera", "sattachera"], hint: "Verset 24 : que fera l'homme envers sa femme ?" },
    memo: { ref: "Genèse 2:24", text: "C'est pourquoi l'homme [quittera] son père et sa mère, et s'[attachera] à sa femme, et ils deviendront une seule [chair].", distractors: ["aimera", "âme"] },
    questions: [
      { id: "q1", type: "echelle", text: "À quel point je me sens être « une aide » pour toi au quotidien ?", low: "Pas du tout", high: "Énormément" },
      { id: "q2", type: "tupref", text: "Pour me sentir proche de toi, je préfère…", options: ["Un long moment à discuter", "Faire une activité ensemble"] },
      { id: "q3", type: "choix", text: "Ce qui nous rend le plus « une seule chair » aujourd'hui, c'est…", options: ["Nos discussions", "Nos projets communs", "Notre foi", "Les moments simples du quotidien"] },
      { id: "q4", type: "echelle", text: "Quelle place Dieu a-t-il dans notre relation aujourd'hui ?", low: "Aucune", high: "Au centre" },
      { id: "q5", type: "ouverte", text: "Le verset 25 parle d'être « sans honte » l'un devant l'autre. Qu'est-ce qui m'aiderait à être encore plus transparent(e) avec toi ?" }
    ],
    defi: "Chaque soir de la semaine, dites à l'autre une chose pour laquelle vous remerciez Dieu à son sujet.",
    priere: "Seigneur, merci de nous avoir réunis. Apprends-nous à être une vraie aide l'un pour l'autre."
  },
  {
    id: 2,
    emoji: "🪢",
    title: "Dieu au centre : la corde à trois fils",
    intro: "Deux valent mieux qu'un… mais une corde à trois fils ne se rompt pas facilement. Le troisième fil, c'est Dieu : c'est lui qui tient quand nos forces lâchent.",
    passages: [
      { ref: "Ecclésiaste 4:9-12", book: 21, chapter: 4, text: {
        9: "Deux valent mieux qu'un, parce qu'ils retirent un bon salaire de leur travail.",
        10: "Car, s'ils tombent, l'un relève son compagnon ; mais malheur à celui qui est seul et qui tombe, sans avoir un second pour le relever !",
        11: "De même, si deux couchent ensemble, ils auront chaud ; mais celui qui est seul, comment aura-t-il chaud ?",
        12: "Et si quelqu'un est plus fort qu'un seul, les deux peuvent lui résister ; et la corde à trois fils ne se rompt pas facilement."
      }},
      { ref: "Psaume 127:1", book: 19, chapter: 127, text: {
        1: "Si l'Éternel ne bâtit la maison, ceux qui la bâtissent travaillent en vain ; si l'Éternel ne garde la ville, celui qui la garde veille en vain."
      }}
    ],
    keyword: { answers: ["corde"], hint: "Verset 12 : qu'est-ce qui ne se rompt pas facilement ?" },
    memo: { ref: "Ecclésiaste 4:12", text: "Et la [corde] à [trois] fils ne se [rompt] pas facilement.", distractors: ["deux", "chaîne"] },
    questions: [
      { id: "q1", type: "echelle", text: "À quelle fréquence on parle de Dieu ensemble ?", low: "Jamais", high: "Tout le temps" },
      { id: "q2", type: "tupref", text: "Prier ensemble, je préfère…", options: ["À voix haute, chacun son tour", "En silence, main dans la main"] },
      { id: "q3", type: "choix", text: "Quand je « tombe » (fatigue, doute, stress), ce dont j'ai le plus besoin, c'est…", options: ["Qu'on m'écoute", "Qu'on prie pour moi", "Qu'on me change les idées", "Des solutions concrètes"] },
      { id: "q4", type: "echelle", text: "Je me sens soutenu(e) par toi quand ça va mal.", low: "Pas du tout", high: "Totalement" },
      { id: "q5", type: "ouverte", text: "« Si l'Éternel ne bâtit la maison… » Concrètement, à quoi ressemblerait « laisser Dieu bâtir » notre relation ?" }
    ],
    defi: "Priez ensemble au moins 3 fois cette semaine, même 2 minutes (en appel si vous n'êtes pas ensemble).",
    priere: "Seigneur, sois le troisième fil de notre corde. Bâtis toi-même ce que nous construisons à deux."
  },
  {
    id: 3,
    emoji: "❤️",
    title: "L'amour en actes",
    intro: "Paul ne définit pas l'amour par des sentiments mais par des actes. Ici, « charité » traduit le grec agapè : l'amour qui choisit de donner.",
    passages: [
      { ref: "1 Corinthiens 13:4-7", book: 46, chapter: 13, text: {
        4: "La charité est patiente, elle est pleine de bonté ; la charité n'est point envieuse ; la charité ne se vante point, elle ne s'enfle point d'orgueil,",
        5: "elle ne fait rien de malhonnête, elle ne cherche point son intérêt, elle ne s'irrite point, elle ne soupçonne point le mal,",
        6: "elle ne se réjouit point de l'injustice, mais elle se réjouit de la vérité ;",
        7: "elle excuse tout, elle croit tout, elle espère tout, elle supporte tout."
      }}
    ],
    keyword: { answers: ["patiente"], hint: "Verset 4 : la toute première qualité de l'amour ?" },
    memo: { ref: "1 Corinthiens 13:7", text: "Elle [excuse] tout, elle croit tout, elle [espère] tout, elle [supporte] tout.", distractors: ["oublie", "donne"] },
    questions: [
      { id: "q1", type: "choix", text: "La qualité de cette liste que je vis le mieux envers toi :", options: ["Patiente", "Pleine de bonté", "Ne s'irrite point", "Supporte tout"] },
      { id: "q2", type: "choix", text: "Celle sur laquelle je dois le plus progresser :", options: ["Patiente", "Ne cherche point son intérêt", "Ne s'irrite point", "Ne soupçonne point le mal"] },
      { id: "q3", type: "tupref", text: "Me sentir aimé(e), c'est plutôt…", options: ["Recevoir des mots doux", "Recevoir un coup de main concret"] },
      { id: "q4", type: "echelle", text: "Je suis patient(e) avec toi.", low: "Rarement", high: "Toujours" },
      { id: "q5", type: "ouverte", text: "Remplace « la charité » par ton prénom au verset 4. Quelle phrase sonne le plus faux pour toi aujourd'hui ?" }
    ],
    defi: "Chacun fait un acte d'amour « invisible » pour l'autre cette semaine, sans le dire. À la fin de la semaine, essayez de deviner ce que l'autre a fait.",
    priere: "Seigneur, apprends-nous un amour patient et plein de bonté, qui ne cherche pas son propre intérêt."
  },
  {
    id: 4,
    emoji: "🗣️",
    title: "Se parler, gérer les conflits",
    intro: "Prompt à écouter, lent à parler, lent à se mettre en colère. La recette est simple ; l'appliquer en plein désaccord, beaucoup moins.",
    passages: [
      { ref: "Jacques 1:19-20", book: 59, chapter: 1, text: {
        19: "Sachez-le, mes frères bien-aimés. Ainsi, que tout homme soit prompt à écouter, lent à parler, lent à se mettre en colère ;",
        20: "car la colère de l'homme n'accomplit pas la justice de Dieu."
      }},
      { ref: "Proverbes 15:1", book: 20, chapter: 15, text: {
        1: "Une réponse douce calme la fureur, mais une parole dure excite la colère."
      }},
      { ref: "Éphésiens 4:26-27, 29-32", book: 49, chapter: 4, text: {
        26: "Si vous vous mettez en colère, ne péchez point ; que le soleil ne se couche pas sur votre colère,",
        27: "et ne donnez pas accès au diable.",
        29: "Qu'il ne sorte de votre bouche aucune parole mauvaise, mais, s'il y a lieu, quelque bonne parole, qui serve à l'édification et communique une grâce à ceux qui l'entendent.",
        30: "N'attristez pas le Saint-Esprit de Dieu, par lequel vous avez été scellés pour le jour de la rédemption.",
        31: "Que toute amertume, toute animosité, toute colère, toute clameur, toute calomnie, et toute espèce de méchanceté, disparaissent du milieu de vous.",
        32: "Soyez bons les uns envers les autres, compatissants, vous pardonnant réciproquement, comme Dieu vous a pardonné en Christ."
      }}
    ],
    keyword: { answers: ["soleil"], hint: "Éphésiens 4:26 : qu'est-ce qui ne doit pas se coucher sur notre colère ?" },
    memo: { ref: "Jacques 1:19", text: "Que tout homme soit prompt à [écouter], lent à [parler], lent à se mettre en [colère].", distractors: ["prier", "juger"] },
    questions: [
      { id: "q1", type: "tupref", text: "En plein désaccord, j'ai tendance à…", options: ["Vouloir régler ça tout de suite", "Avoir besoin de temps avant d'en parler"] },
      { id: "q2", type: "echelle", text: "Je me sens vraiment écouté(e) quand je te parle de quelque chose d'important.", low: "Jamais", high: "Toujours" },
      { id: "q3", type: "choix", text: "Ce qui m'énerve le plus pendant une dispute :", options: ["Qu'on me coupe la parole", "Le ton qui monte", "Le silence / être ignoré(e)", "Qu'on ressorte le passé"] },
      { id: "q4", type: "echelle", text: "« Que le soleil ne se couche pas sur votre colère » : on y arrive…", low: "Jamais", high: "Toujours" },
      { id: "q5", type: "ouverte", text: "Quelle « réponse douce » pourrais-tu me dire la prochaine fois que ça chauffe, pour calmer le jeu ?" }
    ],
    defi: "Créez votre « mot de pause » : un mot code qui veut dire « on souffle et on en reparle calmement dans 30 minutes ». Essayez-le au moins une fois.",
    priere: "Seigneur, rends-nous prompts à écouter et lents à nous mettre en colère. Mets des paroles douces dans nos bouches."
  },
  {
    id: 5,
    emoji: "🕊️",
    title: "Pardon et grâce",
    intro: "« Soixante-dix fois sept fois » : Jésus ne donne pas un quota, il décrit un état d'esprit. On pardonne parce qu'on a soi-même été pardonné.",
    passages: [
      { ref: "Colossiens 3:12-15", book: 51, chapter: 3, text: {
        12: "Ainsi donc, comme des élus de Dieu, saints et bien-aimés, revêtez-vous d'entrailles de miséricorde, de bonté, d'humilité, de douceur, de patience.",
        13: "Supportez-vous les uns les autres, et, si l'un a sujet de se plaindre de l'autre, pardonnez-vous réciproquement. De même que Christ vous a pardonné, pardonnez-vous aussi.",
        14: "Mais par-dessus toutes ces choses revêtez-vous de la charité, qui est le lien de la perfection.",
        15: "Et que la paix de Christ, à laquelle vous avez été appelés pour former un seul corps, règne dans vos cœurs. Et soyez reconnaissants."
      }},
      { ref: "Matthieu 18:21-22", book: 40, chapter: 18, text: {
        21: "Alors Pierre s'approcha de lui, et dit : Seigneur, combien de fois pardonnerai-je à mon frère, lorsqu'il péchera contre moi ? Sera-ce jusqu'à sept fois ?",
        22: "Jésus lui dit : Je ne te dis pas jusqu'à sept fois, mais jusqu'à soixante-dix fois sept fois."
      }}
    ],
    keyword: { answers: ["lien"], hint: "Colossiens 3:14 : la charité est le … de la perfection." },
    memo: { ref: "Colossiens 3:13", text: "[Supportez]-vous les uns les autres, et, si l'un a sujet de se plaindre de l'autre, [pardonnez]-vous réciproquement. De même que [Christ] vous a pardonné, pardonnez-vous aussi.", distractors: ["Aimez", "Dieu"] },
    questions: [
      { id: "q1", type: "echelle", text: "Il m'est facile de demander pardon.", low: "Très difficile", high: "Très facile" },
      { id: "q2", type: "echelle", text: "Il m'est facile de pardonner vraiment (sans ressortir l'histoire plus tard).", low: "Très difficile", high: "Très facile" },
      { id: "q3", type: "tupref", text: "Quand tu me demandes pardon, je préfère…", options: ["Des mots clairs : « Je suis désolé(e) de… »", "Des actes qui montrent que tu as changé"] },
      { id: "q4", type: "choix", text: "Ce qui rend le pardon difficile pour moi :", options: ["La fierté", "La peur que ça recommence", "La blessure encore là", "Je ne sais pas comment le dire"] },
      { id: "q5", type: "ouverte", text: "Y a-t-il quelque chose, petit ou grand, que j'aimerais te pardonner ou te demander de me pardonner ? (Tu peux répondre « on en parle de vive voix ».)" }
    ],
    defi: "Écrivez chacun un petit mot « Merci de m'avoir pardonné(e) quand… » et échangez-les.",
    priere: "Seigneur, merci pour ton pardon. Aide-nous à nous pardonner comme tu nous as pardonnés."
  },
  {
    id: 6,
    emoji: "💍",
    title: "Le mariage, une alliance",
    intro: "Ruth s'engage « jusqu'à la mort », Paul compare le couple à l'amour du Christ pour l'Église. Dans la Bible, le mariage est une alliance, pas un simple contrat.",
    passages: [
      { ref: "Ruth 1:16-17", book: 8, chapter: 1, text: {
        16: "Ruth répondit : Ne me presse pas de te laisser, de retourner loin de toi ! Où tu iras j'irai, où tu demeureras je demeurerai ; ton peuple sera mon peuple, et ton Dieu sera mon Dieu ;",
        17: "où tu mourras je mourrai, et j'y serai enterrée. Que l'Éternel me traite dans toute sa rigueur, si autre chose que la mort vient à me séparer de toi !"
      }},
      { ref: "Éphésiens 5:21-33", book: 49, chapter: 5, text: {
        21: "vous soumettant les uns aux autres dans la crainte de Christ.",
        22: "Femmes, soyez soumises à vos maris, comme au Seigneur ;",
        23: "car le mari est le chef de la femme, comme Christ est le chef de l'Église, qui est son corps, et dont il est le Sauveur.",
        24: "Or, de même que l'Église est soumise à Christ, les femmes aussi doivent l'être à leurs maris en toutes choses.",
        25: "Maris, aimez vos femmes, comme Christ a aimé l'Église, et s'est livré lui-même pour elle,",
        26: "afin de la sanctifier par la parole, après l'avoir purifiée par le baptême d'eau,",
        27: "afin de faire paraître devant lui cette Église glorieuse, sans tache, ni ride, ni rien de semblable, mais sainte et irrépréhensible.",
        28: "C'est ainsi que les maris doivent aimer leurs femmes comme leurs propres corps. Celui qui aime sa femme s'aime lui-même.",
        29: "Car jamais personne n'a haï sa propre chair ; mais il la nourrit et en prend soin, comme Christ le fait pour l'Église,",
        30: "parce que nous sommes membres de son corps.",
        31: "C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, et les deux deviendront une seule chair.",
        32: "Ce mystère est grand ; je dis cela par rapport à Christ et à l'Église.",
        33: "Du reste, que chacun de vous aime sa femme comme lui-même, et que la femme respecte son mari."
      }}
    ],
    keyword: { answers: ["mystere"], hint: "Éphésiens 5:32 : « Ce … est grand »." },
    memo: { ref: "Ruth 1:16", text: "Où tu [iras] j'irai, où tu demeureras je demeurerai ; ton [peuple] sera mon peuple, et ton Dieu sera mon [Dieu].", distractors: ["chemin", "maison"] },
    questions: [
      { id: "q1", type: "echelle", text: "Quand je pense au mariage, je me sens…", low: "Pas encore prêt(e)", high: "Prêt(e)" },
      { id: "q2", type: "choix", text: "Pour moi, l'alliance du mariage, c'est avant tout…", options: ["Une promesse devant Dieu", "Choisir l'autre chaque jour", "Construire une famille", "Tenir bon, même dans les difficultés"] },
      { id: "q3", type: "tupref", text: "« Aimer comme Christ s'est livré » (v. 25), ça se voit surtout dans…", options: ["Les grands sacrifices", "Les petits renoncements du quotidien"] },
      { id: "q4", type: "ouverte", text: "Comment comprends-tu le verset 21, « vous soumettant les uns aux autres » ? Qu'est-ce que ça changerait pour nous ?" },
      { id: "q5", type: "ouverte", text: "Ruth dit « Où tu iras j'irai ». Qu'est-ce que j'ai envie de te promettre aujourd'hui ?" }
    ],
    defi: "Écrivez ensemble 3 promesses pour votre couple (même simples) et ajoutez-les au journal.",
    priere: "Seigneur, apprends-nous à aimer comme le Christ aime : fidèlement, humblement, jusqu'au bout."
  },
  {
    id: 7,
    emoji: "🏡",
    title: "Un foyer qui sert Dieu",
    intro: "« Moi et ma maison, nous servirons l'Éternel. » Aquilas et Priscille travaillaient ensemble, ouvraient leur maison et enseignaient ensemble : un couple en mission.",
    passages: [
      { ref: "Josué 24:15", book: 6, chapter: 24, text: {
        15: "Et si vous ne trouvez pas bon de servir l'Éternel, choisissez aujourd'hui qui vous voulez servir, ou les dieux que servaient vos pères au delà du fleuve, ou les dieux des Amoréens dans le pays desquels vous habitez. Moi et ma maison, nous servirons l'Éternel."
      }},
      { ref: "Deutéronome 6:6-9", book: 5, chapter: 6, text: {
        6: "Et ces commandements, que je te donne aujourd'hui, seront dans ton cœur.",
        7: "Tu les inculqueras à tes enfants, et tu en parleras quand tu seras dans ta maison, quand tu iras en voyage, quand tu te coucheras et quand tu te lèveras.",
        8: "Tu les lieras comme un signe sur tes mains, et ils seront comme des fronteaux entre tes yeux.",
        9: "Tu les écriras sur les poteaux de ta maison et sur tes portes."
      }},
      { ref: "Actes 18:1-3, 24-26", book: 44, chapter: 18, text: {
        1: "Après cela, Paul partit d'Athènes, et se rendit à Corinthe.",
        2: "Il y trouva un Juif nommé Aquilas, originaire du Pont, récemment arrivé d'Italie avec sa femme Priscille, parce que Claude avait ordonné à tous les Juifs de sortir de Rome. Il se lia avec eux ;",
        3: "et, comme il avait le même métier, il demeura chez eux et y travailla : ils étaient faiseurs de tentes.",
        24: "Un Juif nommé Apollos, originaire d'Alexandrie, homme éloquent et versé dans les Écritures, vint à Éphèse.",
        25: "Il était instruit dans la voie du Seigneur, et, fervent d'esprit, il annonçait et enseignait avec exactitude ce qui concerne Jésus, bien qu'il ne connût que le baptême de Jean.",
        26: "Il se mit à parler librement dans la synagogue. Aquilas et Priscille, l'ayant entendu, le prirent avec eux, et lui exposèrent plus exactement la voie de Dieu."
      }}
    ],
    keyword: { answers: ["tentes", "tente"], hint: "Actes 18:3 : quel était le métier d'Aquilas et Priscille ? Faiseurs de…" },
    memo: { ref: "Josué 24:15", text: "Moi et ma [maison], nous [servirons] l'[Éternel].", distractors: ["famille", "aimerons"] },
    questions: [
      { id: "q1", type: "choix", text: "Dans notre futur foyer, la pratique spirituelle qui compte le plus pour moi :", options: ["Prier ensemble", "Lire la Bible ensemble", "Aller à l'église ensemble", "Accueillir et servir les autres"] },
      { id: "q2", type: "tupref", text: "Notre maison idéale, c'est plutôt…", options: ["Un cocon calme pour nous deux", "Une maison ouverte, toujours pleine de monde"] },
      { id: "q3", type: "echelle", text: "Je nous vois servir Dieu ensemble (église, association, accueil…).", low: "Pas vraiment", high: "Complètement" },
      { id: "q4", type: "choix", text: "Comme Aquilas et Priscille, un projet qu'on pourrait faire à deux :", options: ["Servir dans notre église", "Aider des personnes dans le besoin", "Recevoir des amis autour d'un repas", "Lancer un petit groupe de lecture"] },
      { id: "q5", type: "ouverte", text: "« Tu les écriras sur les poteaux de ta maison. » Quel verset aimerais-tu afficher chez nous un jour, et pourquoi ?" }
    ],
    defi: "Choisissez ensemble un verset « pour votre couple » et affichez-le (fond d'écran, post-it, cadre…).",
    priere: "Seigneur, que notre couple et notre futur foyer te servent. Ouvre notre cœur et notre maison aux autres."
  }
];
