/* =========================================================
   NDAJÉ — MODÈLE « DENTELLE ROSÉE » (mariage) — FICHE CLIENT
   C'est le SEUL fichier à modifier pour chaque commande de ce modèle.
   Ouverture : deux volets en dentelle en relief (assets/dentelle-volet.svg).
   Démo fictive : Mariama & Ousmane. Les numéros sont des exemples.
   ========================================================= */

window.NDAJE = {
  // --- Identité de l'événement -------------------------------------------
  type: "mariage",                        // mariage | bapteme | anniversaire | entreprise
  noms: { a: "Mariama", b: "Ousmane" },
  nomsComplets: "Mariama & Ousmane",
  date: "2027-09-18T15:00:00",            // début de la fête (compte à rebours, calendrier)
  dureeHeures: 9,                         // durée pour « Noter la date » (calendrier du téléphone)
  dateTexte: { fr: "Samedi 18 Septembre 2027", en: "Saturday, September 18, 2027" },
  dateLimiteRSVP: "2027-09-01",           // après cette date, le formulaire se ferme
  // Page souvenir : X jours après la fête, il ne reste que les noms, la date et un merci.
  // 30 par défaut. Option « Souvenir prolongé » payée : mettre 395 (30 jours + 1 an).
  souvenirApresJours: 30,

  // --- Couleurs et polices ----------------------------------------------------
  theme: {
    fond: "#FBF4F0",        // papier rosé
    surface: "#FFFBF8",     // cartes
    texte: "#4A332F",
    texteDoux: "#7A605A",
    accent: "#8E5A50",      // vieux rose
    accentDoux: "#F6E4DD",  // rose poudré pâle (pastilles)
    secondaire: "#B8936A",  // or rosé
    policeTitre: "'Cormorant Garamond', Georgia, serif",
    policeTexte: "'Jost', system-ui, sans-serif"
  },

  // --- Visuels (dans assets/). Laisser "" si absent -------------------------
  visuels: {
    volet: "assets/dentelle-volet.svg",      // dentelle en relief des volets (le droit = le même en miroir)
    photoCouverture: "assets/photo-couverture.jpg",
    photoPied: "assets/photo-1.jpg",         // petite photo en bas de page (facultative)
    // Logos des moyens de paiement (cagnotte). Absent = pastille de couleur.
    logoWave: "assets/logo-wave.png",
    logoOrangeMoney: "assets/logo-orange-money.png",
    musique: ""                              // ex. "assets/musique.mp3" : le bouton musique apparaît
  },

  // --- Programme ------------------------------------------------------------
  //  tag.style : "rose" (pastille rose) ou "ivoire" (pastille claire)
  programme: [
    {
      heure: "15h00",
      titre: { fr: "Cérémonie religieuse", en: "Religious ceremony" },
      texte: { fr: "Union des deux familles, bénédictions et prières pour le nouveau foyer.",
               en: "The union of both families, blessings and prayers for the new home." },
      tag: { fr: "Union", en: "Union", style: "rose" },
      lieu: "Grande Mosquée de Mbour",
      adresse: "Mbour",
      icone: "mosquee"
    },
    {
      heure: "17h30",
      titre: { fr: "Cocktail & Séance photos", en: "Cocktail & Photo session" },
      texte: { fr: "Rafraîchissements dans les jardins, photos avec les mariés et leurs proches.",
               en: "Refreshments in the gardens, photos with the couple and their loved ones." },
      tag: { fr: "Jardins", en: "Gardens", style: "ivoire" },
      icone: "photo"
    },
    {
      heure: "19h30",
      titre: { fr: "Dîner de réception", en: "Reception dinner" },
      texte: { fr: "Dîner, mots des familles et des amis, entrée des mariés.",
               en: "Dinner, words from family and friends, the couple's entrance." },
      tag: { fr: "Réception", en: "Reception", style: "rose" },
      icone: "repas"
    },
    {
      heure: "22h00",
      titre: { fr: "Gâteau & Soirée dansante", en: "Wedding cake & Dancing" },
      texte: { fr: "Ouverture du bal par Mariama & Ousmane, partage du gâteau et soirée dansante.",
               en: "Mariama & Ousmane open the dance floor, followed by the cake and dancing." },
      tag: { fr: "Soirée", en: "Party", style: "ivoire" },
      icone: "soiree"
    }
  ],

  // --- Code vestimentaire (laisser couleurs: [] pour masquer la section) -----
  dressCode: {
    couleurs: [
      { nom: { fr: "Rose Poudré", en: "Dusty Pink" }, hex: "#E8C3B5" },
      { nom: { fr: "Vieux Rose", en: "Old Rose" }, hex: "#B98276" },
      { nom: { fr: "Champagne", en: "Champagne" }, hex: "#E6CFA9" },
      { nom: { fr: "Ivoire", en: "Ivory" }, hex: "#FBF5F1" }
    ],
    style: { fr: "Tenues élégantes dans des tons doux : robes fluides, boubous en dentelle, costumes clairs.",
             en: "Elegant outfits in soft tones: flowing dresses, lace boubous, light suits." },
    interdit: { fr: "Prière de réserver le blanc à la mariée.",
                en: "Kindly keep white for the bride." }
  },

  // --- Lieu principal (boutons Google Maps et Waze) -------------------------
  lieu: {
    nom: "Domaine Les Filaos",
    adresse: "Route de Saly, Mbour",
    maps: "",          // lien Google Maps exact du client (sinon recherche par nom + adresse)
    waze: "",          // lien Waze exact (sinon recherche par adresse)
    info: { fr: "Parking sur place. Navette depuis Dakar sur demande.",
            en: "On-site parking. Shuttle from Dakar on request." }
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
    titulaire: "Mariama & Ousmane",
    wave: "77 000 00 00",
    orangeMoney: "78 000 00 00"
  },

  // --- Livre d'or : messages choisis avec les mariés (+ le mot de l'invité,
  //     affiché sur son téléphone après sa réponse). [] pour masquer s'il est vide.
  livreDor: [
    { auteur: "Tata Aminata", date: "2026-10-14",
      texte: "Que Dieu bénisse votre union et remplisse votre foyer de paix. Nous sommes si fiers de vous !" },
    { auteur: "Les cousins de Thiès", date: "2026-10-19",
      texte: "Mariama, Ousmane : tout notre amour pour ce grand jour. On sera là pour danser !" }
  ],

  // --- Réponses : URL du Google Apps Script (voir README). Vide = mode démo --
  rsvpUrl: "",

  // --- Textes (fr obligatoire ; wo et en facultatifs : une clé absente = français)
  textes: {
    fr: {
      bandeau: "Mariage · 18 Septembre 2027",
      marque: "Haute Papeterie",
      ouvrir: "Ouvrir l'invitation",
      vousEtesInvite: "Vous êtes cordialement invité·e",
      surtitre: "Mariage",
      devise: "« Unis par l'amour, bénis par nos familles »",
      fairePart: "Faire-part",
      confirmer: "Confirmer présence",
      noterDate: "Noter la date",
      partager: "Partager",
      partageTexte: "Vous êtes invité·e au mariage de Mariama & Ousmane :",
      lienCopie: "Lien copié !",
      reboursTitre: "Le grand jour approche",
      jours: "Jours", heures: "Heures", minutes: "Min", secondes: "Sec",
      reboursCitation: "« Deux cœurs, une seule promesse devant Dieu et les hommes. »",
      programmeSurtitre: "Déroulement solennel",
      programme: "Programme de la Célébration",
      programmeNote: "Merci de respecter l'heure pour le bon déroulement de la cérémonie.",
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
      bandeau: "Wedding · September 18, 2027",
      marque: "Fine Stationery",
      ouvrir: "Open the invitation",
      vousEtesInvite: "You are cordially invited",
      surtitre: "Wedding",
      devise: "“United by love, blessed by our families”",
      fairePart: "Official invitation",
      confirmer: "Confirm attendance",
      noterDate: "Save the date",
      partager: "Share",
      partageTexte: "You are invited to the wedding of Mariama & Ousmane:",
      lienCopie: "Link copied!",
      reboursTitre: "The big day is coming",
      jours: "Days", heures: "Hours", minutes: "Min", secondes: "Sec",
      reboursCitation: "“Two hearts, one promise before God and all.”",
      programmeSurtitre: "Order of the day",
      programme: "Celebration Programme",
      programmeNote: "Please be on time so the ceremony runs smoothly.",
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
