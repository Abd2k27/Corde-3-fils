// Parcours : Le mariage en profondeur — Louis Segond 1910
window.PARCOURS = window.PARCOURS || [];
window.PARCOURS.push({
  id: "mariage",
  emoji: "💍",
  title: "Le mariage en profondeur",
  short: "Mariage",
  desc: "Ce que la Bible dit du mariage : l'union, l'honneur, le don de soi, la fidélité et un amour fort comme la mort.",
  weeks: [
    {
      emoji: "🔗",
      title: "Ce que Dieu a uni",
      intro: "Interrogé sur le divorce, Jésus revient au commencement : Dieu a fait l'homme et la femme, et c'est lui qui les unit. Le mariage n'est pas qu'un contrat entre deux personnes : Dieu y est partie prenante.",
      passages: [
        { ref: "Matthieu 19:4-6", book: 40, chapter: 19, text: {
          4: "Il répondit : N'avez-vous pas lu que le créateur, au commencement, fit l'homme et la femme",
          5: "et qu'il dit : C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, et les deux deviendront une seule chair ?",
          6: "Ainsi ils ne sont plus deux, mais ils sont une seule chair. Que l'homme donc ne sépare pas ce que Dieu a joint."
        }}
      ],
      keyword: { answers: ["joint"], hint: "Verset 6 : que l'homme ne sépare pas ce que Dieu a …" },
      memo: { ref: "Matthieu 19:6", text: "Ainsi ils ne sont plus [deux], mais ils sont une seule [chair]. Que l'homme donc ne sépare pas ce que Dieu a [joint].", distractors: ["un", "âme"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je vois le mariage comme un engagement pour toute la vie.", low: "Pas forcément", high: "Absolument" },
        { id: "q2", type: "choix", text: "Ce qui peut le plus « séparer » un couple aujourd'hui :", options: ["Le manque de communication", "Les écrans et les distractions", "L'argent", "L'éloignement de Dieu"] },
        { id: "q3", type: "tupref", text: "« Quitter son père et sa mère », pour moi, c'est surtout…", options: ["Devenir indépendants ensemble", "Faire passer le couple en premier"] },
        { id: "q4", type: "echelle", text: "Les mariages autour de moi me donnent envie de me marier.", low: "Pas vraiment", high: "Beaucoup" },
        { id: "q5", type: "ouverte", text: "Qu'est-ce qui, selon toi, protège un mariage sur 50 ans ?" }
      ],
      defi: "Interrogez un couple marié depuis longtemps (grands-parents, couple de l'église) : « Quel est votre secret ? » Partagez la réponse.",
      priere: "Seigneur, si tu nous unis un jour, garde ce que tu auras joint."
    },
    {
      emoji: "👑",
      title: "S'honorer l'un l'autre",
      intro: "Pierre parle d'une beauté intérieure « d'un grand prix devant Dieu », et demande aux maris d'honorer leur femme comme cohéritière de la grâce. L'honneur, c'est voir la valeur de l'autre.",
      passages: [
        { ref: "1 Pierre 3:3-4, 7", book: 60, chapter: 3, text: {
          3: "Ayez, non cette parure extérieure qui consiste dans les cheveux tressés, les ornements d'or, ou les habits qu'on revêt,",
          4: "mais la parure intérieure et cachée dans le cœur, la pureté incorruptible d'un esprit doux et paisible, qui est d'un grand prix devant Dieu.",
          7: "Maris, montrez à votre tour de la sagesse dans vos rapports avec vos femmes, comme avec un sexe plus faible ; honorez-les, comme devant aussi hériter avec vous de la grâce de la vie. Qu'il en soit ainsi, afin que rien ne vienne faire obstacle à vos prières."
        }}
      ],
      keyword: { answers: ["parure"], hint: "Verset 4 : la … intérieure et cachée dans le cœur." },
      memo: { ref: "1 Pierre 3:7", text: "Honorez-les, comme devant aussi [hériter] avec vous de la [grâce] de la vie, afin que rien ne vienne faire obstacle à vos [prières].", distractors: ["vivre", "paix"] },
      questions: [
        { id: "q1", type: "choix", text: "Ce qui me fait me sentir honoré(e) :", options: ["Que tu parles bien de moi aux autres", "Que tu me demandes mon avis", "Que tu me remercies", "Que tu me défendes"] },
        { id: "q2", type: "echelle", text: "Je trouve que j'accorde plus d'importance à l'intérieur qu'à l'apparence.", low: "Pas assez", high: "Oui, vraiment" },
        { id: "q3", type: "tupref", text: "« Afin que rien ne fasse obstacle à vos prières » : notre relation influence notre vie de prière…", options: ["Oui, beaucoup", "Pas vraiment, ce sont deux choses séparées"] },
        { id: "q4", type: "echelle", text: "Je me sens honoré(e) par toi.", low: "Pas assez", high: "Pleinement" },
        { id: "q5", type: "ouverte", text: "Quelle beauté « intérieure et cachée » est-ce que je vois en toi et que les autres ne voient peut-être pas ?" }
      ],
      defi: "Honorez l'autre en public cette semaine : dites devant des amis ou de la famille une qualité que vous admirez chez lui/elle.",
      priere: "Seigneur, apprends-nous à nous honorer, à voir la valeur que tu as mise en l'autre."
    },
    {
      emoji: "🎁",
      title: "Se donner l'un à l'autre",
      intro: "Paul décrit le mariage comme un don mutuel, où chacun appartient à l'autre et où rien ne se décide sans « commun accord ». Une réciprocité radicale pour l'époque, et encore aujourd'hui.",
      passages: [
        { ref: "1 Corinthiens 7:3-5", book: 46, chapter: 7, text: {
          3: "Que le mari rende à sa femme ce qu'il lui doit, et que la femme agisse de même envers son mari.",
          4: "La femme n'a pas autorité sur son propre corps, mais c'est le mari ; et pareillement, le mari n'a pas autorité sur son propre corps, mais c'est la femme.",
          5: "Ne vous privez point l'un de l'autre, si ce n'est d'un commun accord pour un temps, afin de vaquer à la prière ; puis retournez ensemble, de peur que Satan ne vous tente par votre incontinence."
        }}
      ],
      keyword: { answers: ["accord"], hint: "Verset 5 : rien sans un commun …" },
      memo: { ref: "Philippiens 2:2", text: "Ayant un même [sentiment], un même [amour], une même âme, une même [pensée].", distractors: ["désir", "foi"] },
      questions: [
        { id: "q1", type: "echelle", text: "Dans notre relation, je donne autant que je reçois.", low: "Je reçois plus", high: "Je donne plus" },
        { id: "q2", type: "tupref", text: "La réciprocité dans le couple, pour moi c'est…", options: ["Chacun donne 50 %", "Chacun donne 100 %"] },
        { id: "q3", type: "choix", text: "Ce que je retiens le plus de ce passage :", options: ["L'égalité entre mari et femme", "Le don de soi", "La place de la prière", "La protection contre la tentation"] },
        { id: "q4", type: "echelle", text: "On sait prendre nos décisions « d'un commun accord ».", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Que signifiera pour toi « ne plus s'appartenir à soi-même » dans le mariage ? Qu'est-ce qui t'attire ou te fait peur là-dedans ?" }
      ],
      defi: "Prenez une petite décision de la semaine (sortie, repas, organisation) uniquement « d'un commun accord » : on discute jusqu'à ce que les deux soient vraiment d'accord.",
      priere: "Seigneur, apprends-nous à nous donner l'un à l'autre, librement et avec joie."
    },
    {
      emoji: "🔒",
      title: "La fidélité",
      intro: "Malachie rappelle que Dieu est témoin de l'alliance entre un homme et « la femme de sa jeunesse ». La fidélité ne commence pas après le mariage : elle se cultive dès aujourd'hui.",
      passages: [
        { ref: "Malachie 2:14", book: 39, chapter: 2, text: {
          14: "Et vous dites : Pourquoi ?… Parce que l'Éternel a été témoin entre toi et la femme de ta jeunesse, à laquelle tu es infidèle, bien qu'elle soit ta compagne et la femme de ton alliance."
        }},
        { ref: "Proverbes 5:18", book: 20, chapter: 5, text: {
          18: "Que ta source soit bénie, et fais ta joie de la femme de ta jeunesse,"
        }},
        { ref: "Hébreux 13:4", book: 58, chapter: 13, text: {
          4: "Que le mariage soit honoré de tous, et le lit conjugal exempt de souillure, car Dieu jugera les impudiques et les adultères."
        }}
      ],
      keyword: { answers: ["temoin"], hint: "Malachie 2:14 : l'Éternel a été … entre toi et la femme de ta jeunesse." },
      memo: { ref: "Hébreux 13:4", text: "Que le [mariage] soit [honoré] de [tous].", distractors: ["amour", "gardé"] },
      questions: [
        { id: "q1", type: "choix", text: "La plus grande menace pour la fidélité aujourd'hui :", options: ["Les réseaux sociaux", "La routine", "Le manque de dialogue", "L'éloignement physique"] },
        { id: "q2", type: "tupref", text: "Les mots de passe et les téléphones dans un couple…", options: ["Tout partagé, rien à cacher", "Chacun son espace, en confiance"] },
        { id: "q3", type: "echelle", text: "Je me sens en sécurité dans notre relation.", low: "Pas encore", high: "Totalement" },
        { id: "q4", type: "echelle", text: "Je mets des limites claires dans mes relations avec les autres (amitiés, collègues…).", low: "Pas assez", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "« Fais ta joie de la femme (ou du mari) de ta jeunesse. » Comment garder la joie d'être ensemble dans 20 ans ?" }
      ],
      defi: "Fixez ensemble une ou deux règles de protection de votre couple (ex. pas de messages privés ambigus, transparence sur les rencontres).",
      priere: "Seigneur, tu es témoin de notre engagement. Garde-nous fidèles en pensée, en parole et en acte."
    },
    {
      emoji: "💎",
      title: "Plus précieux que les perles",
      intro: "Proverbes 31 décrit une femme forte, sage et qui craint Dieu. Ses qualités sont un modèle pour les deux : la confiance, le courage, la sagesse, la crainte de Dieu plutôt que l'apparence.",
      passages: [
        { ref: "Proverbes 31:10-12, 25-26, 28-30", book: 20, chapter: 31, text: {
          10: "Qui peut trouver une femme vertueuse ? Elle a bien plus de valeur que les perles.",
          11: "Le cœur de son mari a confiance en elle, et les produits ne lui feront pas défaut.",
          12: "Elle lui fait du bien, et non du mal, tous les jours de sa vie.",
          25: "Elle est revêtue de force et de gloire, et elle se rit de l'avenir.",
          26: "Elle ouvre la bouche avec sagesse, et des instructions aimables sont sur sa langue.",
          28: "Ses fils se lèvent, et la disent heureuse ; son mari se lève, et lui donne des louanges :",
          29: "Plusieurs filles ont une conduite vertueuse ; mais toi, tu les surpasses toutes.",
          30: "La grâce est trompeuse, et la beauté est vaine ; la femme qui craint l'Éternel est celle qui sera louée."
        }}
      ],
      keyword: { answers: ["perles", "perle"], hint: "Verset 10 : elle a bien plus de valeur que les …" },
      memo: { ref: "Proverbes 31:30", text: "La [grâce] est trompeuse, et la [beauté] est vaine ; la femme qui [craint] l'Éternel est celle qui sera louée.", distractors: ["richesse", "aime"] },
      questions: [
        { id: "q1", type: "choix", text: "La qualité de ce texte que je vois le plus chez toi :", options: ["La confiance qu'on peut avoir en toi", "La force et le courage", "La sagesse dans tes paroles", "La crainte de Dieu"] },
        { id: "q2", type: "tupref", text: "« Elle se rit de l'avenir » : face à l'avenir, je suis plutôt…", options: ["Serein(e)", "Inquiet/inquiète"] },
        { id: "q3", type: "echelle", text: "Je te dis assez souvent ce que j'admire chez toi (v. 28).", low: "Rarement", high: "Très souvent" },
        { id: "q4", type: "echelle", text: "L'apparence compte beaucoup pour moi dans le couple.", low: "Peu", high: "Énormément" },
        { id: "q5", type: "ouverte", text: "« Mais toi, tu les surpasses toutes. » Écris à l'autre une louange sincère, comme le mari du verset 28." }
      ],
      defi: "Chacun écrit à l'autre une liste de 5 qualités qu'il/elle admire, et la lui lit à voix haute.",
      priere: "Seigneur, donne-nous la vraie beauté : celle d'un cœur qui te craint."
    },
    {
      emoji: "🍇",
      title: "Un foyer béni",
      intro: "Le Psaume 128 dessine un foyer heureux : une vigne féconde, des plants d'olivier autour de la table. Et Paul rappelle l'essentiel : « Que tout ce que vous faites se fasse avec charité. »",
      passages: [
        { ref: "Psaume 128:1-4", book: 19, chapter: 128, text: {
          1: "Heureux tout homme qui craint l'Éternel, qui marche dans ses voies !",
          2: "Tu jouis alors du travail de tes mains, tu es heureux, tu prospères.",
          3: "Ta femme est comme une vigne féconde dans l'intérieur de ta maison ; tes fils sont comme des plants d'olivier autour de ta table.",
          4: "C'est ainsi qu'est béni l'homme qui craint l'Éternel."
        }},
        { ref: "1 Corinthiens 16:13-14", book: 46, chapter: 16, text: {
          13: "Veillez, demeurez fermes dans la foi, soyez des hommes, fortifiez-vous.",
          14: "Que tout ce que vous faites se fasse avec charité."
        }},
        { ref: "Colossiens 3:19", book: 51, chapter: 3, text: {
          19: "Maris, aimez vos femmes, et ne vous aigrissez pas contre elles."
        }}
      ],
      keyword: { answers: ["vigne"], hint: "Psaume 128:3 : la femme est comme une … féconde." },
      memo: { ref: "1 Corinthiens 16:13-14", text: "[Veillez], demeurez [fermes] dans la foi, fortifiez-vous. Que tout ce que vous faites se fasse avec [charité].", distractors: ["Priez", "joie"] },
      questions: [
        { id: "q1", type: "choix", text: "Pour moi, un foyer « béni », c'est d'abord…", options: ["Un foyer où l'on prie", "Un foyer où l'on rit", "Un foyer ouvert aux autres", "Un foyer en paix"] },
        { id: "q2", type: "tupref", text: "Notre future table, je l'imagine…", options: ["Calme, à deux ou en petit comité", "Bruyante, avec famille et amis"] },
        { id: "q3", type: "echelle", text: "« Ne vous aigrissez pas » : je garde facilement de la rancune.", low: "Jamais", high: "Souvent" },
        { id: "q4", type: "echelle", text: "Je fais les choses « avec charité » même quand je suis fatigué(e).", low: "Rarement", high: "Toujours" },
        { id: "q5", type: "ouverte", text: "Décris en quelques phrases un dimanche idéal dans notre futur foyer." }
      ],
      defi: "Préparez et partagez un repas ensemble cette semaine, en commençant par un temps de remerciement à Dieu.",
      priere: "Seigneur, bénis notre futur foyer. Qu'il soit plein de foi, de paix et de charité."
    },
    {
      emoji: "🔥",
      title: "Un amour fort comme la mort",
      intro: "Le Cantique des cantiques célèbre l'amour entre un homme et une femme. Il finit par une déclaration : l'amour est fort comme la mort, les grandes eaux ne peuvent l'éteindre.",
      passages: [
        { ref: "Cantique des cantiques 2:16", book: 22, chapter: 2, text: {
          16: "Mon bien-aimé est à moi, et je suis à lui ; il fait paître son troupeau parmi les lis."
        }},
        { ref: "Cantique des cantiques 8:6-7", book: 22, chapter: 8, text: {
          6: "Mets-moi comme un sceau sur ton cœur, comme un sceau sur ton bras ; car l'amour est fort comme la mort, la jalousie est inflexible comme le séjour des morts ; ses ardeurs sont des ardeurs de feu, une flamme de l'Éternel.",
          7: "Les grandes eaux ne peuvent éteindre l'amour, et les fleuves ne le submergeraient pas ; quand un homme offrirait tous les biens de sa maison contre l'amour, il ne s'attirerait que le mépris."
        }}
      ],
      keyword: { answers: ["sceau"], hint: "Cantique 8:6 : « Mets-moi comme un … sur ton cœur »." },
      memo: { ref: "Cantique 8:7", text: "Les grandes [eaux] ne peuvent [éteindre] l'[amour].", distractors: ["flammes", "noyer"] },
      questions: [
        { id: "q1", type: "echelle", text: "Je me sens profondément aimé(e) par toi.", low: "Pas assez", high: "Pleinement" },
        { id: "q2", type: "choix", text: "Les « grandes eaux » qui pourraient menacer notre amour :", options: ["Les épreuves de la vie", "La routine", "Les autres (familles, entourage)", "Nos propres défauts"] },
        { id: "q3", type: "tupref", text: "Je préfère les déclarations d'amour…", options: ["Écrites (lettre, message)", "Dites en face"] },
        { id: "q4", type: "echelle", text: "Je suis fier/fière de dire « mon bien-aimé (ma bien-aimée) est à moi, et je suis à lui (à elle) ».", low: "Timidement", high: "À tout le monde" },
        { id: "q5", type: "ouverte", text: "Écris à l'autre une déclaration inspirée du Cantique : « Tu es pour moi comme… »" }
      ],
      defi: "Écrivez-vous chacun une lettre d'amour (à l'ancienne, sur papier) et échangez-les.",
      priere: "Seigneur, toi qui es la source de l'amour, mets en nous un amour que rien ne peut éteindre."
    }
  ]
});
