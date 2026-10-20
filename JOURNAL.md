# Ndajé — Journal de bord des modèles

Suivi du travail sur les modèles d'invitation : ce qui est fait, en cours, et ce qui attend la validation de Mimi.
Mis à jour à chaque étape. Le plus récent en haut.

## Objectif

**Au moins 10 modèles par type d'événement** : Anniversaire, Baptême, Entreprise, Mariage.
Ordre de travail : Anniversaire → Baptême → Entreprise → deuxième Mariage (puis on complète jusqu'à 10 par type).

## Méthode (mise à jour le 2026-10-20 : Mimi fournit les modèles)

Mimi envoie des modèles (images, liens Figma ou sites qui lui plaisent). Pour chacun, Claude :
1. indique le type d'événement le plus adapté (mariage, baptême, anniversaire, entreprise) et pourquoi ;
2. liste ce qu'il faut adapter pour Ndajé (sections manquantes, textes, éléments à ne pas reprendre tels quels) ;
3. code le modèle après validation de Mimi (comme Union Sacrée).

_Ancienne méthode (pistes créées par Claude), abandonnée :_

| Étape | Qui | Quoi |
|---|---|---|
| A. Pistes visuelles | Claude | Une planche de pistes par type (page privée), une couverture d'exemple par piste |
| — | **Mimi valide** | Choisit les pistes à développer |
| B. Maquettes | Claude | Écrans clés au format téléphone (ouverture, couverture, programme, réponse, sections du type) |
| — | **Mimi valide** | Commente, Claude ajuste |
| C. Code | Claude | Modèle complet : animations, mode aperçu, page souvenir, intégration au site |
| — | **Agent sécurité de Mimi** | Relit avant chaque mise en ligne |
| — | **Mimi** | Pousse sur GitHub (commandes PowerShell fournies) |

Avant l'étape C du premier nouveau modèle : créer un **moteur commun** (un seul `app.js` pour tous les modèles,
chaque modèle = son style + sa fiche `config.js` + ses visuels), pour ne pas maintenir 40 copies.

## État des modèles

| Type | Modèle | État |
|---|---|---|
| Mariage | Démo de base (`invitation/`) | En ligne |
| Mariage | Union Sacrée (`modeles/union-sacree/`) | En ligne |
| Mariage | Dentelle Rosée (`modeles/dentelle-rosee/`) | **Codé — attend la validation de Mimi** (d'après un modèle Pinterest/Invitely fourni par Mimi : ouverture à volets) |
| Anniversaire | 6 pistes proposées par Claude | **Refusées par Mimi** (2026-10-20) — remplacées par ses propres modèles |
| Baptême | — | À venir |
| Entreprise | — | À venir |

## Historique

### 2026-10-20 — Dentelle Rosée (mariage) + moteur commun
- Modèle fourni par Mimi (Pinterest, invitation Invitely) : on reprend **l'ouverture** (deux volets en dentelle en relief, sceau ovale, bouton « Ouvrir l'invitation »), le reste au choix de Claude dans le même style.
- Dentelle dessinée par Ndajé en SVG (pas d'image d'Invitely) : `modeles/dentelle-rosee/assets/dentelle-volet.svg`.
- **Moteur commun** créé : `moteur/moteur.js`, utilisé par Union Sacrée et Dentelle Rosée (l'ancien `union-sacree/app.js` est supprimé).
- Site : carte « Dentelle Rosée » sur la page Modèles, choix dans la page Créer (vrai aperçu).
- Prochaine action : Mimi valide le modèle ; puis prochains modèles qu'elle envoie.

### 2026-10-20 — Changement de méthode
- Mimi n'aime pas les 6 pistes Anniversaire : abandonnées.
- Nouvelle méthode : Mimi fournit les modèles, Claude les classe par type d'événement et les adapte.
- Prochaine action : Mimi envoie ses premiers modèles.

### 2026-10-20 — Anniversaire, étape A
- Planche « Ndajé — Pistes Anniversaire » publiée en page privée (toile de design) : https://claude.ai/artifact/Qeq7bSqi2S2G3aJ2UH7Nhj
- 6 pistes, chacune montrée en premier écran d'invitation (390 × 844) avec des noms et dates fictifs.
- Prochaine action : Mimi choisit les pistes à développer en maquettes complètes.
