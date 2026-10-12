# Ndaje — instructions pour Claude Code

Tu travailles sur **Ndaje** (« le rassemblement » en wolof), un studio sénégalais d'**invitations digitales** pour cérémonies : mariages, baptêmes, anniversaires, événements d'entreprise.
Slogan : *Chaque fête mérite son invitation*.

Équipe :
- **Mimi** : développeuse web/mobile. C'est elle qui te parle. Réponds-lui en **français**, simplement, sans jargon inutile.
- **Aicha** : infographiste. Elle livre les maquettes, couleurs et visuels, mais ne code pas.

Ndaje démarre **sans budget** : privilégie toujours des solutions gratuites (Vercel, GitHub Pages, Google Sheets + Apps Script, Supabase gratuit). Ne propose jamais un service payant sans le dire clairement et sans proposer une alternative gratuite.

---

## Le produit

Une invitation = **un mini-site par événement**, partagé par un lien WhatsApp. Le client paie **une fois par événement**. Les invités ne paient jamais Ndaje.

Fonctionnalités :
- Enveloppe animée d'ouverture, couverture avec noms et photo, compte à rebours
- Programme en plusieurs étapes avec bouton « Itinéraire » (Google Maps)
- Confirmation de présence (RSVP) : nom, téléphone, choix (cérémonie / soirée / les deux / absent), nombre de personnes, message
- Cagnotte Wave / Orange Money : **l'argent va directement au client, jamais à Ndaje**. Ndaje n'encaisse ni ne stocke jamais cet argent.
- Galerie photo, musique optionnelle, bascule français / wolof
- Tableau de bord privé pour les organisateurs (totaux, filtres, export CSV pour le traiteur)

Formules : Essentiel 20 000 FCFA (48 h) · Premium 50 000 FCFA (5 jours) · Prestige 120 000 FCFA (7 jours). Options : wolof +10 000, express 24 h +20 000.

---

## Architecture du template

```
invitation/
  index.html   structure (générique)
  style.css    mise en forme (générique, lit les variables CSS)
  app.js       moteur : lit config.js et construit toute la page
  config.js    ★ FICHE CLIENT : seul fichier qui change d'un client à l'autre
  assets/      ★ visuels d'Aicha, noms de fichiers fixes
dashboard/
  index.html   tableau de bord (?api=URL_SCRIPT&cle=CLE&titre=…)
apps-script/
  Code.gs      reçoit les RSVP (doPost) et les sert au tableau de bord (doGet, protégé par clé)
README.md      guide pas à pas pour Mimi et Aicha
```

### Règles d'architecture (à respecter dans chaque modification)

1. **HTML, CSS et JavaScript purs**, sans framework ni étape de build. Ça doit pouvoir s'ouvrir avec `python3 -m http.server`. Ne propose React / Next.js que si Mimi le demande, ou pour la future plateforme en libre-service.
2. **Tout ce qui est propre à un client va dans `config.js`**. Ne code jamais en dur un nom, une date, une couleur, un lieu ou un numéro dans `index.html`, `style.css` ou `app.js`. Si une nouvelle fonctionnalité a besoin d'un réglage, ajoute une clé dans `config.js`, avec un commentaire en français et une valeur par défaut qui marche si la clé est absente.
3. **Rétrocompatibilité** : une ancienne fiche client doit continuer à fonctionner après une évolution du moteur.
4. **Convention des visuels** (dans `assets/`, Aicha s'en sert pour livrer) : `monogramme.svg`, `motif.svg`, `photo-couverture.jpg`, `photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg`, `apercu-whatsapp.jpg` (1200×630), `musique.mp3`. Un fichier absent ne doit jamais casser la page : l'emplacement disparaît proprement.
5. **Les couleurs et polices** passent par `theme` dans `config.js`, puis par les variables CSS (`--fond`, `--accent`, `--secondaire`…).
6. **Textes** : tout texte visible passe par `textes.fr` / `textes.wo`. Si une clé wolof manque, on affiche le français. N'invente jamais de traduction wolof présentée comme définitive : marque-la « à faire relire » et dis-le à Mimi.
7. **Mode démo** : sans `rsvpUrl`, tout doit marcher en local (réponses stockées dans `localStorage`, données fictives dans le tableau de bord).

---

## Qualité attendue

- **Mobile d'abord** : 99 % des invités ouvrent le lien sur téléphone depuis WhatsApp, souvent sur un Android d'entrée de gamme avec une connexion moyenne. Teste à 360 px et 390 px de large.
- **Léger** : page complète sous 1,5 Mo, photos compressées, `loading="lazy"`, aucune bibliothèque lourde.
- **Aperçu WhatsApp** : balises `og:title`, `og:description`, `og:image` toujours présentes.
- **Accessibilité** : contrastes lisibles, boutons d'au moins 44 px, `prefers-reduced-motion` respecté, labels sur tous les champs.
- **Élégance** : style haut de gamme, sobre (« papeterie de mariage de luxe »), touches culturelles sénégalaises discrètes. Pas d'emoji dans l'interface, pas d'effets clinquants.

## Sécurité et données (non négociable)

- Jamais de `innerHTML` avec des données venant du client ou des invités : utiliser `textContent` et `createElement`.
- Dans Apps Script, nettoyer chaque valeur (longueur max, préfixe `'` devant `= + - @` pour éviter l'injection de formules dans le Sheet), valider le champ `presence`, utiliser `LockService`.
- La clé du tableau de bord n'apparaît **jamais** dans l'invitation publique.
- Ne jamais mettre de vrais numéros de téléphone ou noms de clients dans le dépôt Git public. Les fiches clients réelles vont dans un dossier ignoré par Git (`clients/`) ou un dépôt privé.
- Les numéros de cagnotte s'affichent tels que le client les a donnés ; on ne fait aucun traitement de paiement.

---

## Workflow pour un nouveau client

Quand Mimi dit « nouveau client » et colle les infos du formulaire :
1. Copier `invitation/` dans `clients/<prenom-a>-<prenom-b>/` (ex. `clients/aissatou-cheikh/`).
2. Remplir `config.js` à partir de ses infos. **Lister les infos manquantes** au lieu de les inventer (heures, adresses, numéros…).
3. Choisir les icônes du programme parmi `mosquee`, `eglise`, `mairie`, `maison`, `soiree`, `repas`.
4. Générer une nouvelle clé de tableau de bord unique pour ce client.
5. Vérifier la page en local à 390 px, avec et sans `?direct=1`, puis tester un envoi de RSVP.
6. Rendre la **checklist avant envoi** du README, en indiquant ce qui reste à faire par un humain (relecture wolof, test sur un vrai téléphone, aperçu WhatsApp).

## Commandes utiles

```bash
python3 -m http.server 8000      # puis http://localhost:8000/invitation/?direct=1
                                  # et   http://localhost:8000/dashboard/
```

Mise en ligne : Vercel (projet statique, aucun réglage de build) ou GitHub Pages.

---

## Comment travailler avec Mimi

- Avant une modification importante, explique en 2 ou 3 phrases ce que tu vas faire, puis fais-le.
- Après chaque changement, dis **quels fichiers ont changé** et **comment le tester**.
- Si un changement touche `config.js`, montre la nouvelle clé avec un exemple.
- Garde le `README.md` à jour quand tu changes une convention, une clé de config ou une étape de mise en ligne.
- Si une demande va contre ces règles (framework lourd, service payant, données sensibles en clair), dis-le et propose une meilleure option.
- Les idées de futures évolutions (plateforme en libre-service, paiement intégré, génération d'invitations par IA) sont les bienvenues, mais ne les code que si Mimi le demande.
