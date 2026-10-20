/* =========================================================
   NDAJÉ — MODÈLE « UNION SACRÉE » — FICHE CLIENT
   C'est le SEUL fichier à modifier pour chaque commande de ce modèle.
   (Les visuels d'Aicha vont dans assets/, mêmes noms que le modèle de base.)
   Démo fictive : Joseph & Matilda. Les numéros sont des exemples.
   ========================================================= */

window.NDAJE = {
  // --- Identité de l'événement -------------------------------------------
  type: "mariage",                        // mariage | bapteme | anniversaire | entreprise
  noms: { a: "Joseph", b: "Matilda" },
  nomsComplets: "Joseph & Matilda",
  date: "2027-08-28T09:00:00",            // début de la fête (compte à rebours, calendrier)
  dureeHeures: 12,                        // durée pour « Noter la date » (calendrier du téléphone)
  dateTexte: { fr: "Samedi 28 Août 2027", en: "Saturday, August 28, 2027" },
  dateLimiteRSVP: "2027-08-10",           // après cette date, le formulaire se ferme
  // Page souvenir : X jours après la fête, il ne reste que les noms, la date et un merci.
  // 30 par défaut. Option « Souvenir prolongé » payée : mettre 395 (30 jours + 1 an).
  souvenirApresJours: 30,

  // --- Couleurs et polices (maquette d'Aicha) ------------------------------
  theme: {
    fond: "#F7F3EE",        // papier
    surface: "#FFFDF8",     // cartes
    texte: "#2B1A1E",
    texteDoux: "#6B5A5E",
    accent: "#7E2236",      // lie-de-vin
    accentDoux: "#F6E3E5",  // rose très pâle (pastilles)
    secondaire: "#C9A24B",  // or
    policeTitre: "'Cormorant Garamond', Georgia, serif",
    policeTexte: "'Montserrat', system-ui, sans-serif"
  },

  // --- Visuels livrés par Aicha (dans assets/). Laisser "" si absent -----
  visuels: {
    monogramme: "",                          // ex. "assets/monogramme.svg" (sceau de l'enveloppe)
    photoCouverture: "assets/photo-couverture.jpg",
    photoPied: "assets/photo-1.jpg",         // petite photo en bas de page (facultative)
    // Logos des moyens de paiement (cagnotte). Absent = pastille de couleur.
    logoWave: "assets/logo-wave.png",
    logoOrangeMoney: "assets/logo-orange-money.png",
    // Bouquet aquarelle (fond transparent) : ouverture, séparateurs, coins, cartes.
    // Laisser "" pour revenir aux petites fleurs dessinées.
    bouquet: "assets/bouquet.webp",          // grand (ouverture)
    bouquetPetit: "assets/bouquet-petit.webp", // petit (décors)
    musique: ""                              // ex. "assets/musique.mp3" : le bouton musique apparaît
  },

  // --- Programme ------------------------------------------------------------
  //  tag.style : "rose" (pastille rose) ou "ivoire" (pastille claire)
  programme: [
    {
      heure: "09h00",
      titre: { fr: "Bénédiction Nuptiale Solennelle", en: "Solemn Nuptial Blessing" },
      texte: { fr: "Échange des consentements et des alliances sacrées en présence de nos familles et témoins chéris.",
               en: "Exchange of vows and sacred rings before our beloved families and witnesses." },
      tag: { fr: "Culte & Alliances", en: "Service & Rings", style: "rose" },
      lieu: "Le Domaine des Roses",
      adresse: "Route des Almadies, Dakar",
      icone: "eglise"
    },
    {
      heure: "11h30",
      titre: { fr: "Cortège d'Honneur & Séance Photos", en: "Procession & Photo Session" },
      texte: { fr: "Immortalisation des moments de grâce avec la mariée, le marié, les demoiselles et garçons d'honneur.",
               en: "Capturing graceful moments with the bride, the groom, bridesmaids and groomsmen." },
      tag: { fr: "Jardin Floral", en: "Flower Garden", style: "ivoire" },
      icone: "photo"
    },
    {
      heure: "13h30",
      titre: { fr: "Banquet & Toast d'Honneur", en: "Banquet & Toast" },
      texte: { fr: "Gastronomie raffinée, rafraîchissements d'accueil et allocutions empreintes d'amour et de bénédiction.",
               en: "Fine cuisine, welcome drinks and speeches full of love and blessings." },
      tag: { fr: "Réception", en: "Reception", style: "rose" },
      icone: "repas"
    },
    {
      heure: "16h30",
      titre: { fr: "Pièce Montée & Bal des Mariés", en: "Wedding Cake & First Dance" },
      texte: { fr: "Ouverture du bal par Matilda & Joseph, partage du gâteau royal et festivités dansantes.",
               en: "Matilda & Joseph open the ball, followed by the royal cake and dancing." },
      tag: { fr: "Célébration", en: "Celebration", style: "ivoire" },
      icone: "soiree"
    }
  ],

  // --- Code vestimentaire (laisser couleurs: [] pour masquer la section) -----
  dressCode: {
    couleurs: [
      { nom: { fr: "Lie-de-Vin", en: "Burgundy" }, hex: "#7E2236" },
      { nom: { fr: "Rose Poudré", en: "Dusty Rose" }, hex: "#E8B4B8" },
      { nom: { fr: "Ivoire Pur", en: "Pure Ivory" }, hex: "#F8F4EB" },
      { nom: { fr: "Or Brossé", en: "Brushed Gold" }, hex: "#D4AF37" }
    ],
    style: { fr: "Tenues d'apparat chic, robes longues romantiques, costumes élégants ou somptueux bazins riches brodés d'or.",
             en: "Elegant formal wear, long romantic dresses, fine suits or rich gold-embroidered bazin." },
    interdit: { fr: "Prière de réserver le blanc immaculé exclusivement à la divine mariée.",
                en: "Kindly keep pure white for the bride alone." }
  },

  // --- Lieu principal (boutons Google Maps et Waze) -------------------------
  lieu: {
    nom: "Le Domaine des Roses & Salons d'Honneur",
    adresse: "Route des Almadies & Corniche Ouest, Dakar",
    maps: "",          // lien Google Maps exact du client (sinon recherche par nom + adresse)
    waze: "",          // lien Waze exact (sinon recherche par adresse)
    info: { fr: "Service voiturier discret et parking sécurisé sur présentation du présent faire-part mobile.",
            en: "Valet service and secure parking on presentation of this mobile invitation." }
  },

  // --- Confirmation de présence ----------------------------------------------
  //  « id » doit rester parmi : ceremonie, soiree, les-deux (le Google Sheet les valide).
  choixPresence: [
    { id: "les-deux", fr: "Avec grande joie", en: "With great joy" }
  ],
  maxPersonnes: 4,
  ligneRsvp: "77 000 00 00",   // numéro affiché « Ligne officielle RSVP » ("" pour masquer)

  // --- Cagnotte (l'argent va DIRECTEMENT au client, jamais à Ndajé) -------
  cagnotte: {
    active: true,
    titulaire: "Joseph & Matilda",
    wave: "77 000 00 00",
    orangeMoney: "78 000 00 00"
  },

  // --- Livre d'or : messages choisis avec les mariés (+ le mot de l'invité,
  //     affiché sur son téléphone après sa réponse). [] pour masquer s'il est vide.
  livreDor: [
    { auteur: "Tante Rebecca & Oncle Kwamé", date: "2026-10-12",
      texte: "Que l'Éternel répande sa grâce sur Joseph et Matilda. Vous formez un couple d'exception. À très vite !" },
    { auteur: "Khadija & Ibrahima", date: "2026-10-18",
      texte: "Toute notre affection pour ce beau jour. Que votre foyer soit rempli de paix et de rires." }
  ],

  // --- Réponses : URL du Google Apps Script (voir README). Vide = mode démo --
  rsvpUrl: "",

  // --- Textes (fr obligatoire ; wo et en facultatifs : une clé absente = français)
  textes: {
    fr: {
      bandeau: "Célébration officielle · 28 Août 2027",
      marque: "Haute Papeterie",
      ouvrir: "Ouvrir l'invitation",
      vousEtesInvite: "Vous êtes cordialement invité·e",
      surtitre: "Union Sacrée",
      devise: "« Deux âmes unies par la grâce et la bénédiction »",
      fairePart: "Faire-part officiel",
      confirmer: "Confirmer présence",
      noterDate: "Noter la date",
      partager: "Partager",
      partageTexte: "Vous êtes invité·e au mariage de Joseph & Matilda :",
      lienCopie: "Lien copié !",
      reboursTitre: "Le grand jour approche",
      jours: "Jours", heures: "Heures", minutes: "Min", secondes: "Sec",
      reboursCitation: "« Deux cœurs, une seule promesse devant Dieu et les hommes. »",
      programmeSurtitre: "Déroulement solennel",
      programme: "Programme de la Célébration",
      programmeNote: "Merci de respecter l'heure pour préserver la quiétude des moments liturgiques.",
      dressSurtitre: "Harmonie & Éclat",
      dressTitre: "Code Vestimentaire",
      dressTexte: "Afin de composer ensemble une atmosphère féerique et douce, nous vous suggérons notre palette nuptiale d'exception :",
      styleRecommande: "Style recommandé",
      lieuSurtitre: "Orientation & Lieu",
      lieuTitre: "Lieu des Réjouissances",
      ouvrirMaps: "Google Maps",
      ouvrirWaze: "Ouvrir Waze",
      stationnement: "Stationnement & Accueil :",
      presenceSurtitre: "Réponse souhaitée",
      presenceTitre: "Confirmation de Présence",
      presenceSousTitre: "Votre bienveillance est attendue avant le",
      ligneRsvp: "Ligne officielle RSVP :",
      nom: "Votre Nom & Prénom(s)",
      nomExemple: "Ex : Famille Diop ou M. & Mme Mensah",
      telephone: "Téléphone / WhatsApp",
      telephoneExemple: "Ex : +221 77 000 00 00",
      serezVous: "Serez-vous des nôtres ?",
      absent: "En union de cœur",
      nombre: "Nombre d'invités confirmés",
      personne: "personne", personnes: "personnes", accompagne: "(avec mon accompagnant·e)",
      message: "Vœu ou mot doux pour les mariés",
      messageExemple: "Écrivez vos vœux d'amour et de bénédiction…",
      envoyer: "Confirmer mon inscription solennelle",
      merci: "Merci ! Votre présence est confirmée. Nous avons hâte de vous accueillir.",
      merciAbsent: "Merci de nous avoir prévenus. Vous serez dans nos pensées et nos prières.",
      ferme: "Les réponses sont closes. Contactez directement les mariés.",
      erreurChamps: "Merci d'indiquer votre nom, votre téléphone et votre réponse.",
      erreur: "Oups, l'envoi a échoué. Vérifiez votre connexion et réessayez.",
      cagnotteSurtitre: "Attentions délicates",
      cagnotteTitre: "Cagnotte & Gestes d'Amour",
      cagnotteTexte: "Votre présence est notre plus précieux présent. Si vous désirez participer à l'envol de notre nouveau foyer :",
      cagnotteEtranger: "Depuis l'étranger, envoyez sur ces numéros avec une application de transfert : Sendwave, TapTapSend, Remitly, WorldRemit, Western Union ou Orange Money Europe.",
      cagnotteNote: "« Une urne scellée d'or sera également disponible à la réception pour recueillir vos enveloppes. »",
      copier: "Copier", copie: "Copié !",
      auNomDe: "Au nom de",
      livreSurtitre: "Paroles affectueuses",
      livreTitre: "Le Livre d'Or",
      vous: "Votre mot", aLinstant: "À l'instant", hier: "Hier", ilYa: "Il y a", jour: "jours",
      signature: "Création & conception signée",
      maison: "Maison Ndajé — Haute papeterie digitale",
      droits: "Tous droits réservés. L'amour est éternel.",
      navAccueil: "Accueil", navProgramme: "Programme", navRsvp: "RSVP", navAcces: "Accès", navPartager: "Partager",
      musique: "Musique",
      souvenirTitre: "Merci d'avoir partagé ce jour avec nous",
      souvenirTexte: "Votre présence et vos messages ont rendu cette fête inoubliable."
    },
    en: {
      bandeau: "Official celebration · August 28, 2027",
      marque: "Fine Stationery",
      ouvrir: "Open the invitation",
      vousEtesInvite: "You are cordially invited",
      surtitre: "Sacred Union",
      devise: "“Two souls united by grace and blessing”",
      fairePart: "Official invitation",
      confirmer: "Confirm attendance",
      noterDate: "Save the date",
      partager: "Share",
      partageTexte: "You are invited to the wedding of Joseph & Matilda:",
      lienCopie: "Link copied!",
      reboursTitre: "The big day is coming",
      jours: "Days", heures: "Hours", minutes: "Min", secondes: "Sec",
      reboursCitation: "“Two hearts, one promise before God and all.”",
      programmeSurtitre: "Order of the day",
      programme: "Celebration Programme",
      programmeNote: "Please be on time to preserve the serenity of the ceremony.",
      dressSurtitre: "Harmony & Radiance",
      dressTitre: "Dress Code",
      dressTexte: "To create a soft and enchanting atmosphere together, we suggest our wedding palette:",
      styleRecommande: "Suggested style",
      lieuSurtitre: "Directions & Venue",
      lieuTitre: "Celebration Venue",
      ouvrirMaps: "Google Maps",
      ouvrirWaze: "Open Waze",
      stationnement: "Parking & Welcome:",
      presenceSurtitre: "Kindly reply",
      presenceTitre: "RSVP",
      presenceSousTitre: "Please reply before",
      ligneRsvp: "Official RSVP line:",
      nom: "Your full name",
      nomExemple: "e.g. The Diop family or Mr & Mrs Mensah",
      telephone: "Phone / WhatsApp",
      telephoneExemple: "e.g. +221 77 000 00 00",
      serezVous: "Will you join us?",
      absent: "With you in heart",
      nombre: "Number of guests",
      personne: "person", personnes: "people", accompagne: "(with my partner)",
      message: "A wish or kind word for the couple",
      messageExemple: "Write your wishes of love and blessing…",
      envoyer: "Confirm my attendance",
      merci: "Thank you! Your attendance is confirmed. We can't wait to welcome you.",
      merciAbsent: "Thank you for letting us know. You will be in our thoughts and prayers.",
      ferme: "Replies are closed. Please contact the couple directly.",
      erreurChamps: "Please enter your name, your phone number and your answer.",
      erreur: "Oops, sending failed. Check your connection and try again.",
      cagnotteSurtitre: "Gentle gestures",
      cagnotteTitre: "Wedding Gifts",
      cagnotteTexte: "Your presence is our most precious gift. If you wish to contribute to our new home:",
      cagnotteEtranger: "From abroad, send to these numbers with a transfer app: Sendwave, TapTapSend, Remitly, WorldRemit, Western Union or Orange Money Europe.",
      cagnotteNote: "“A sealed golden box will also be available at the reception for your envelopes.”",
      copier: "Copy", copie: "Copied!",
      auNomDe: "In the name of",
      livreSurtitre: "Kind words",
      livreTitre: "Guestbook",
      vous: "Your message", aLinstant: "Just now", hier: "Yesterday", ilYa: "", jour: "days ago",
      signature: "Designed & crafted by",
      maison: "Maison Ndajé — Fine digital stationery",
      droits: "All rights reserved. Love is eternal.",
      navAccueil: "Home", navProgramme: "Programme", navRsvp: "RSVP", navAcces: "Venue", navPartager: "Share",
      musique: "Music",
      souvenirTitre: "Thank you for sharing this day with us",
      souvenirTexte: "Your presence and your messages made this celebration unforgettable."
    },
    // Wolof : à faire relire par la famille avant toute livraison (rien d'inventé ici).
    // Toute clé absente s'affiche en français. Laisser {} pour masquer le bouton WO.
    wo: {}
  }
};
