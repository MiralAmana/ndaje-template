/* =========================================================
   NDAJE — FICHE CLIENT
   C'est le SEUL fichier à modifier pour chaque nouvelle commande.
   (Les visuels d'Aicha vont dans le dossier assets/, voir README.)
   ========================================================= */

window.NDAJE = {
  // --- Identité de l'événement -------------------------------------------
  type: "mariage",                       // mariage | bapteme | anniversaire | entreprise
  noms: { a: "Aïssatou", b: "Cheikh" },
  nomsComplets: "Aïssatou Diop & Cheikh Ndiaye",
  date: "2026-12-19T10:00:00",           // date + heure du début (compte à rebours)
  dateTexte: "Samedi 19 décembre 2026",
  dateLimiteRSVP: "2026-12-05",          // après cette date, le formulaire se ferme

  // --- Couleurs (proposées par Aicha, copiées depuis sa maquette) ---------
  theme: {
    fond: "#FBF7EF",        // blanc cassé
    surface: "#FFFFFF",
    texte: "#1F2A24",
    texteDoux: "#5E6B63",
    accent: "#B8913A",      // doré
    accentDoux: "#E9DCC0",
    secondaire: "#1F5B45",  // vert émeraude
    policeTitre: "'Cormorant Garamond', Georgia, serif",
    policeTexte: "'Jost', system-ui, sans-serif"
  },

  // --- Visuels livrés par Aicha (dans assets/). Laisser "" si absent -----
  visuels: {
    monogramme: "assets/monogramme.svg",   // initiales A & C
    motif: "assets/motif.svg",             // motif wax discret (bordures)
    photoCouverture: "assets/photo-couverture.jpg",
    photos: [
      "assets/photo-1.jpg",
      "assets/photo-2.jpg",
      "assets/photo-3.jpg"
    ],
    musique: ""                            // ex. "assets/musique.mp3" (optionnel)
  },

  // --- Programme ------------------------------------------------------------
  programme: [
    {
      heure: "10h00",
      titre: { fr: "Cérémonie religieuse", wo: "Takk" },
      lieu: "Mosquée de Grand Yoff",
      adresse: "Grand Yoff, Dakar",
      icone: "mosquee"
    },
    {
      heure: "13h00",
      titre: { fr: "Déjeuner familial", wo: "Añ ak njaboot gi" },
      lieu: "Maison familiale Diop",
      adresse: "Grand Yoff, Dakar",
      icone: "maison"
    },
    {
      heure: "20h00",
      titre: { fr: "Réception et soirée", wo: "Xew gi" },
      lieu: "Les Jardins de l'Océan",
      adresse: "Route des Almadies, Dakar",
      icone: "soiree"
    }
  ],

  // --- Choix proposés dans le formulaire de présence ----------------------
  //  "id" est ce qui sera enregistré dans Google Sheets.
  choixPresence: [
    { id: "ceremonie", fr: "La cérémonie", wo: "Takk bi" },
    { id: "soiree", fr: "La soirée", wo: "Xew gi" },
    { id: "les-deux", fr: "Les deux", wo: "Ñaari yi" }
  ],
  maxPersonnes: 6,

  // --- Cagnotte (l'argent va DIRECTEMENT au client, jamais à Ndajé) -------
  cagnotte: {
    active: true,
    titulaire: "Aïssatou Diop",
    wave: "77 000 00 00",
    orangeMoney: "77 000 00 00"
  },

  // --- Connexion Google Sheets (voir README, étape « RSVP ») ---------------
  //  Laisser vide pour le mode démo : les réponses restent dans le navigateur.
  rsvpUrl: "",

  // --- Textes (fr obligatoire, wo optionnel : à faire relire par la famille)
  //  Si une clé wolof manque, la version française s'affiche.
  textes: {
    fr: {
      ouvrir: "Ouvrir l'invitation",
      invitation: "Avec la bénédiction de nos familles, nous avons la joie de vous inviter à célébrer notre union. Votre présence sera notre plus beau cadeau.",
      compteRebours: "Le grand jour dans",
      jours: "jours", heures: "heures", minutes: "min", secondes: "s",
      programme: "Programme",
      itineraire: "Itinéraire",
      presenceTitre: "Confirmez votre présence",
      presenceSousTitre: "Merci de répondre avant le",
      nom: "Votre nom complet",
      telephone: "Téléphone (WhatsApp)",
      vousSerez: "Vous serez présent·e à",
      absent: "Je ne pourrai pas venir",
      nombre: "Nombre de personnes",
      message: "Un mot pour les mariés (facultatif)",
      envoyer: "Envoyer ma réponse",
      merci: "Merci ! Votre réponse a bien été enregistrée.",
      merciAbsent: "Merci de nous avoir prévenus. Vous serez dans nos pensées.",
      ferme: "Les réponses sont closes. Contactez directement les mariés.",
      cagnotteTitre: "Offrir un cadeau",
      cagnotteTexte: "Vous êtes loin ou souhaitez nous gâter ? Vous pouvez envoyer votre participation directement :",
      copier: "Copier", copie: "Copié !",
      auNomDe: "Au nom de",
      erreur: "Oups, l'envoi a échoué. Vérifiez votre connexion et réessayez.",
      creePar: "Invitation créée par"
    },
    wo: {
      ouvrir: "Ubbi invitation bi",
      merci: "Jërëjëf !",
      creePar: "Ndajé moo ko defar"
    }
  }
};
