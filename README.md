# Ndaje — Template d'invitation

Un template unique, réutilisable pour chaque client. Pour une nouvelle commande, on ne touche qu'à **deux choses** :

1. `invitation/config.js` : les infos du client (noms, programme, couleurs, cagnotte, textes)
2. `invitation/assets/` : les visuels livrés par Aicha

Tout le reste (animations, programme, carte, RSVP, cagnotte, langues) se construit tout seul.

```
ndaje-template/
├── invitation/          ← le lien envoyé aux invités
│   ├── index.html       structure de la page (ne pas modifier)
│   ├── style.css        mise en forme (ne pas modifier)
│   ├── app.js           moteur : lit config.js et construit la page (ne pas modifier)
│   ├── config.js        ★ FICHE CLIENT, à remplir pour chaque commande
│   └── assets/          ★ VISUELS D'AICHA
├── dashboard/
│   └── index.html       tableau de bord des mariés (confirmations en direct)
└── apps-script/
    └── Code.gs          enregistre les réponses dans un Google Sheet (gratuit)
```

## Tester tout de suite (2 minutes)

```bash
cd ndaje-template
python3 -m http.server 8000
```

- Invitation : http://localhost:8000/invitation/
- Tableau de bord : http://localhost:8000/dashboard/

Sans configuration, tout fonctionne en **mode démo** : les réponses au formulaire restent dans le navigateur et apparaissent dans le tableau de bord (avec quelques réponses fictives).

Astuce : ajoutez `?direct=1` à l'adresse de l'invitation pour sauter l'enveloppe pendant que vous travaillez.

---

## Ce qu'Aicha livre (convention de fichiers)

Elle dépose ses fichiers dans `invitation/assets/` **avec exactement ces noms**. Un fichier absent n'est pas un problème : son emplacement disparaît proprement de la page.

| Fichier | Contenu | Format conseillé |
| --- | --- | --- |
| `monogramme.svg` | Initiales du couple (sceau de l'enveloppe, haut et bas de page) | SVG, fond transparent, carré |
| `motif.svg` | Bande de motif wax qui se répète en bordure | SVG, environ 44 × 22, se raccorde à gauche et à droite |
| `photo-couverture.jpg` | Grande photo d'ouverture | JPG, 1080 × 1350 (portrait 4:5), moins de 400 Ko |
| `photo-1.jpg`, `photo-2.jpg`, `photo-3.jpg` | Galerie | JPG, environ 1080 px de large, moins de 300 Ko chacune |
| `apercu-whatsapp.jpg` | Image qui s'affiche quand le lien est partagé sur WhatsApp | JPG, 1200 × 630 |
| `musique.mp3` (optionnel) | Musique d'ambiance après l'ouverture | MP3, moins de 2 Mo |

Elle donne aussi ses **couleurs** (codes hex de sa maquette) : vous les copiez dans `theme` de `config.js`.

Les deux SVG présents actuellement sont **provisoires**, pour que la démo soit jolie.

Pour compresser les photos gratuitement : [squoosh.app](https://squoosh.app).

---

## Pour chaque nouveau client

1. **Copier** le dossier `invitation/` (ex. `aissatou-cheikh/`).
2. **Remplir `config.js`** avec le formulaire du client : noms, date, programme, couleurs, cagnotte.
   - L'`icone` de chaque étape : `mosquee`, `eglise`, `mairie`, `maison`, `soiree`, `repas`.
   - Si le client donne un lien Google Maps exact, ajoutez `maps: "https://maps.app.goo.gl/…"` à l'étape.
   - Wolof : complétez `textes.wo` et faites **relire par la famille**. Toute clé absente s'affiche en français. Si `wo` est vide, le bouton FR/WO disparaît.
3. **Déposer les visuels** d'Aicha dans `assets/`.
4. **Brancher le Google Sheet** (ci-dessous) et coller l'URL dans `rsvpUrl`.
5. **Mettre en ligne** (ci-dessous).
6. **Tester sur téléphone** avec la checklist en bas de page, puis envoyer le lien au client.

---

## Brancher les réponses sur Google Sheets (gratuit, 5 minutes)

1. Créez un Google Sheet vide, nommé par exemple « Ndaje — Aïssatou & Cheikh ».
2. Menu **Extensions → Apps Script**. Supprimez le contenu et collez tout `apps-script/Code.gs`.
3. Changez `CLE_TABLEAU_DE_BORD` (ex. `aissatou-cheikh-4821`). Enregistrez.
4. **Déployer → Nouveau déploiement** → type **Application Web**.
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
5. Autorisez l'accès (Google affiche un avertissement « application non validée » : *Paramètres avancés → Accéder au projet*, c'est votre propre script).
6. Copiez l'**URL de l'application Web** (finit par `/exec`) et collez-la dans `rsvpUrl` de `config.js`.

Chaque réponse ajoute une ligne dans l'onglet « Réponses » du Sheet. Vous pouvez partager ce Sheet avec les mariés en lecture seule.

> Si vous modifiez `Code.gs` plus tard : **Déployer → Gérer les déploiements → Modifier → Nouvelle version**, sinon l'ancienne version reste active.

## Le tableau de bord des mariés

Envoyez aux mariés ce lien (après la mise en ligne) :

```
https://VOTRE-SITE/dashboard/?api=URL_DU_SCRIPT&cle=VOTRE_CLE&titre=Aïssatou%20%26%20Cheikh
```

Ils y voient en direct : personnes attendues, nombre à la cérémonie et à la soirée (« Les deux » compte dans les deux), absents, messages, et un lien WhatsApp vers chaque invité. Bouton **Exporter** pour donner la liste au traiteur (s'ouvre dans Excel).

La page se met à jour toute seule chaque minute. La clé empêche les inconnus de voir la liste : ne la mettez jamais dans l'invitation.

## Mise en ligne gratuite sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com) (avec GitHub).
2. Poussez le dossier sur GitHub, puis **Add New → Project → Import**. Aucun réglage de build : c'est du HTML pur.
3. Vous obtenez une adresse `ndaje-xxx.vercel.app`. Invitation : `/invitation/`, tableau de bord : `/dashboard/`.
4. Plus tard, avec le domaine `ndaje.sn` : un sous-domaine par client (`aissatou-cheikh.ndaje.sn`) dans **Settings → Domains**.

5. Le fichier `vercel.json` (à la racine) redirige `/` vers `/invitation/`.
6. **Aperçu WhatsApp** : dans `invitation/index.html`, remplacez l'adresse des balises `og:url` et `og:image` par l'adresse réelle de l'invitation (WhatsApp exige une adresse complète `https://…`, pas un chemin relatif). À refaire pour chaque client, puis `git push`.

Alternative : GitHub Pages fonctionne aussi.

---

## Checklist avant d'envoyer le lien

- [ ] Noms, date et heures vérifiés avec le client
- [ ] Chaque bouton « Itinéraire » ouvre le bon lieu
- [ ] Une réponse test apparaît dans le Google Sheet, puis supprimée
- [ ] Les numéros Wave / Orange Money sont ceux du client, bouton « Copier » testé
- [ ] Testé sur un Android et un iPhone, sur WhatsApp (aperçu du lien correct)
- [ ] Textes wolof relus par la famille
- [ ] Date limite de réponse (`dateLimiteRSVP`) bien réglée
- [ ] Lien du tableau de bord envoyé aux mariés uniquement
