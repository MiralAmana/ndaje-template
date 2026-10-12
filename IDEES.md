# Ndajé — Idées d'évolution

Ce fichier garde les idées pour plus tard. **Rien ici n'est codé** tant que Mimi ne le demande pas.

## Décision : templates gratuits

Ndajé proposera aussi des **templates gratuits**, en plus des invitations sur mesure payantes (Essentiel, Premium, Prestige).

À définir avec Mimi et Aicha :
- Combien de templates gratuits au départ, et quels styles (Aicha les dessine ?).
- Ce qui est limité dans la version gratuite (ex. nombre d'invités, durée en ligne, pas de wolof, pas de tableau de bord) pour que les formules payantes gardent leur intérêt.
- Comment le client en crée un lui-même : formulaire simple, ou remplissage de `config.js` par Ndajé ?
- Un lien « passer au sur-mesure » dans l'invitation gratuite (hypothèse, à valider).
- Contrainte : rester sans budget (Vercel, Google Sheets, pas de service payant).

## Idées venues de l'étude de ChungDoi (chungdoi.com, octobre 2026)

ChungDoi : plateforme étrangère en libre-service, 19,99 US$ (~12 000 FCFA) par invitation, essai gratuit de 3 jours jusqu'à 20 invités, ~20 modèles, pas de wolof, paiement par carte seulement.

1. **Lien personnel par invité** : le nom de l'invité s'affiche sur l'enveloppe (ex. `?invite=Awa`), avec un message d'accueil adapté. Il faut penser à ne pas mettre de vrais noms dans le dépôt public.
2. **Export en image ou vidéo** de l'invitation, pour les statuts WhatsApp.
3. **Livre d'or** : les invités laissent un mot sur l'invitation (attention : afficher avec `textContent`, jamais `innerHTML`).
4. **Essai gratuit** : laisser le client voir son invitation avant de payer. La démo publique va déjà dans ce sens.
5. **Changer de modèle sans tout ressaisir** : déjà possible chez nous, puisque tout passe par `config.js` (le même contenu peut recevoir un autre `theme`).

## Nos points forts à garder

Design sur mesure d'Aicha, wolof, cagnotte Wave / Orange Money, touches culturelles sénégalaises, service fait pour le client.
