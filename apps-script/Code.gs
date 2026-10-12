/**
 * NDAJE — RÉCEPTION DES CONFIRMATIONS DE PRÉSENCE
 * À coller dans Google Sheets > Extensions > Apps Script (un Sheet par client).
 *
 * - doPost : l'invitation envoie chaque réponse ici → une ligne dans l'onglet "Réponses".
 * - doGet  : le tableau de bord lit les réponses (protégé par une clé secrète).
 */

// Changez cette clé pour chaque client (ex. un mot + des chiffres). Elle va dans le lien du tableau de bord.
const CLE_TABLEAU_DE_BORD = "aissatou-cheikh-4821";

const ONGLET = "Réponses";
const COLONNES = ["Date", "Nom", "Téléphone", "Présence", "Personnes", "Message"];

function feuille_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ONGLET);
  if (!sh) {
    sh = ss.insertSheet(ONGLET);
    sh.appendRow(COLONNES);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLONNES.length).setFontWeight("bold");
  }
  return sh;
}

function propre_(v, max) {
  // Empêche les formules malveillantes dans le Sheet (=, +, -, @ en début de cellule)
  let s = String(v == null ? "" : v).slice(0, max || 200).trim();
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const presencesValides = ["ceremonie", "soiree", "les-deux", "absent"];
    if (!d.nom || !d.telephone || presencesValides.indexOf(d.presence) === -1) {
      return json_({ ok: false, erreur: "Données incomplètes" });
    }
    const personnes = d.presence === "absent" ? 0 : Math.max(1, Math.min(20, parseInt(d.personnes, 10) || 1));
    feuille_().appendRow([
      new Date(),
      propre_(d.nom, 80),
      propre_(d.telephone, 25),
      d.presence,
      personnes,
      propre_(d.message, 400)
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, erreur: String(err) });
  } finally {
    verrou.releaseLock();
  }
}

function doGet(e) {
  if (!e.parameter || e.parameter.cle !== CLE_TABLEAU_DE_BORD) {
    return json_({ ok: false, erreur: "Clé invalide" });
  }
  const valeurs = feuille_().getDataRange().getValues();
  const lignes = valeurs.slice(1).map(function (r) {
    return {
      date: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      nom: r[1], telephone: r[2], presence: r[3], personnes: Number(r[4]) || 0, message: r[5]
    };
  });
  return json_({ ok: true, reponses: lignes });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
