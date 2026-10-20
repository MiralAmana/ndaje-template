/* =========================================================
   NDAJÉ — MOTEUR COMMUN DES MODÈLES (modeles/*)
   Un seul moteur pour tous les modèles : chaque modèle n'a que son
   index.html (mêmes identifiants), son style.css, sa fiche config.js et
   ses visuels. Chargé par <script src="../../moteur/moteur.js">.
   Lit config.js et construit l'invitation. Pas besoin de le modifier
   pour un nouveau client. Aucune donnée n'est insérée avec innerHTML.
   Les réponses partent au même format que le modèle de base
   (même Google Apps Script, même tableau de bord).
   ========================================================= */
(function () {
  "use strict";

  const C = window.NDAJE;
  if (!C) { document.body.textContent = "config.js est introuvable."; return; }
  document.documentElement.classList.add("js");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const params = new URLSearchParams(location.search);
  const animations = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mode aperçu (page « Créer » du site Ndajé) ----------
     ?apercu=1&a=…&b=…&date=AAAA-MM-JJ&heure=10h00&lieu=… : les infos tapées par le
     futur client remplacent celles de la fiche, pour lui montrer le vrai rendu.
     Rien n'est envoyé ni mélangé avec les vraies réponses. Tout passe par textContent. */
  const modeApercu = params.has("apercu");
  if (modeApercu) {
    const court = (v, n) => String(v || "").trim().slice(0, n);
    const ancienA = (C.noms || {}).a, ancienB = (C.noms || {}).b;
    const a = court(params.get("a"), 40), b = court(params.get("b"), 40);
    const remplacerNoms = (txt) => {
      if (typeof txt !== "string" || !a) return txt;
      let r = txt;
      if (ancienA) r = r.split(ancienA).join(a);
      if (ancienB && b) r = r.split(ancienB).join(b);
      return r;
    };
    const remplacerObjet = (o) => {
      if (!o || typeof o !== "object") return remplacerNoms(o);
      const copie = {};
      for (const k of Object.keys(o)) copie[k] = remplacerNoms(o[k]);
      return copie;
    };
    if (a) {
      (C.programme || []).forEach(e => { e.titre = remplacerObjet(e.titre); e.texte = remplacerObjet(e.texte); });
      for (const l of Object.keys(C.textes || {})) {
        for (const k of Object.keys(C.textes[l] || {})) C.textes[l][k] = remplacerNoms(C.textes[l][k]);
      }
      C.noms = { a: a, b: b };
      C.nomsComplets = b ? a + " & " + b : a;
    }
    const d = params.get("date") || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const h = /(\d{1,2})\s*[h:]\s*(\d{2})?/i.exec(params.get("heure") || "");
      const hh = h ? String(Math.min(23, +h[1])).padStart(2, "0") : "10";
      const mm = h && h[2] ? h[2] : "00";
      C.date = d + "T" + hh + ":" + mm + ":00";
      const jour = new Date(C.date);
      const fmt = (loc, o) => { const s = jour.toLocaleDateString(loc, o); return s.charAt(0).toUpperCase() + s.slice(1); };
      const long = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      C.dateTexte = { fr: fmt("fr-FR", long), en: fmt("en-GB", long) };
      const court2 = { day: "numeric", month: "long", year: "numeric" };
      if (C.textes && C.textes.fr) C.textes.fr.bandeau = "Célébration officielle · " + fmt("fr-FR", court2);
      if (C.textes && C.textes.en) C.textes.en.bandeau = "Official celebration · " + fmt("en-GB", court2);
      C.dateLimiteRSVP = "";
    }
    const lieu = court(params.get("lieu"), 80);
    if (lieu) C.lieu = Object.assign({}, C.lieu, { nom: lieu, adresse: "", maps: "", waze: "" });
    C.rsvpUrl = "";   // jamais d'envoi depuis un aperçu
    C.livreDor = [];  // un nouveau client n'a pas encore de messages
  }
  const cle = "ndaje:" + (modeApercu ? "apercu:" : "") + (C.nomsComplets || "evenement");
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(cle + ":" + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(cle + ":" + k, JSON.stringify(v)); } catch (e) { /* navigateur privé */ } }
  };

  // Crée un élément sans innerHTML (aucune injection possible)
  function el(tag, attrs = {}, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "style") n.setAttribute("style", v);
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    enfants.flat().forEach(e => e != null && n.append(e));
    return n;
  }
  function icone(nom, classe = "ic") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", classe); svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + nom);
    svg.append(use);
    return svg;
  }

  /* ---------- Langues (fr obligatoire, wo / en si présentes) ---------- */
  const T = C.textes || { fr: {} };
  const langues = ["fr", "wo", "en"].filter(l => l === "fr" || (T[l] && Object.keys(T[l]).length));
  let langue = store.get("langue");
  if (langues.indexOf(langue) === -1) langue = "fr";
  const t = (k) => (T[langue] && T[langue][k]) || (T.fr && T.fr[k]) || "";
  const tr = (o) => o == null ? "" : typeof o === "string" ? o : (o[langue] || o.fr || "");

  /* ---------- Thème (couleurs et polices d'Aicha) ---------- */
  const th = C.theme || {};
  const vars = { fond: "--fond", surface: "--surface", texte: "--texte", texteDoux: "--texte-doux",
    accent: "--accent", accentDoux: "--accent-doux", secondaire: "--secondaire",
    policeTitre: "--police-titre", policeTexte: "--police-texte" };
  for (const [k, v] of Object.entries(vars)) if (th[k]) document.documentElement.style.setProperty(v, th[k]);
  if (th.accent) $('meta[name="theme-color"]').setAttribute("content", th.accent);

  /* ---------- Page souvenir : X jours après la fête ---------- */
  const joursSouvenir = typeof C.souvenirApresJours === "number" ? C.souvenirApresJours : 30;
  const debut = new Date(C.date).getTime();
  const modeSouvenir = params.has("souvenir") || (!modeApercu && !isNaN(debut) && Date.now() > debut + joursSouvenir * 864e5); // en aperçu : toujours l'invitation complète

  /* ---------- Identité ---------- */
  const noms = C.noms || { a: "" };
  const initiales = [noms.a, noms.b].filter(Boolean).map(n => n.trim().charAt(0).toUpperCase()).join("&");
  $$("[data-nom-a]").forEach(n => { n.textContent = noms.a || ""; });
  $$("[data-nom-b]").forEach(n => { n.textContent = noms.b || ""; n.parentElement.querySelector("em").hidden = !noms.b; });
  $$("[data-initiales]").forEach(n => { n.textContent = initiales; });
  $$("[data-noms-courts]").forEach(n => { n.textContent = noms.b ? noms.a + " & " + noms.b : noms.a; });
  document.title = (noms.b ? noms.a + " & " + noms.b : noms.a) + " — " + tr(C.dateTexte);
  $("#annee").textContent = new Date().getFullYear();

  /* ---------- Visuels : un fichier absent disparaît proprement ---------- */
  const V = C.visuels || {};
  $$("[data-visuel]").forEach(img => {
    const src = V[img.dataset.visuel];
    const absent = () => {
      img.hidden = true;
      if (img.dataset.visuel === "photoCouverture") img.closest("figure").classList.add("sans-photo");
    };
    if (!src) { absent(); return; }
    img.addEventListener("error", absent);
    img.src = src;
  });

  /* ---------- Bouquet d'Aicha : décors en fond (séparateurs, coins, cartes) ----------
     Absent dans config.js = on garde les petites fleurs dessinées. */
  if (V.bouquetPetit || V.bouquet) {
    const url = (s) => 'url("' + encodeURI(s).replace(/"/g, "%22") + '")';
    document.documentElement.style.setProperty("--bouquet", url(V.bouquet || V.bouquetPetit));
    document.documentElement.style.setProperty("--bouquet-petit", url(V.bouquetPetit || V.bouquet));
    document.documentElement.classList.add("avec-bouquet");
  }

  /* ---------- Textes (rappelé à chaque changement de langue) ---------- */
  function appliquerTextes() {
    document.documentElement.lang = langue === "wo" ? "wo" : langue;
    $$("[data-t]").forEach(n => { n.textContent = t(n.dataset.t); });
    $$("[data-ph]").forEach(n => { n.placeholder = t(n.dataset.ph); });
    $$("[data-date-texte]").forEach(n => { n.textContent = tr(C.dateTexte); });
    $$(".cagnotte-etranger").forEach(n => { n.hidden = !t("cagnotteEtranger"); });
    construireProgramme();
    construireDress();
    construireLieu();
    construireChoix();
    construireLivre();
    if (etatMerci) $("#merci-texte").textContent = t(etatMerci);
    if (limite) $("#date-limite").textContent = limite.toLocaleDateString(langue === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });
    $$("#langues button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === langue ? "true" : "false"));
  }

  /* ---------- Programme ---------- */
  function lienCarte(lieu, adresse, exact) {
    if (exact) return exact;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([lieu, adresse].filter(Boolean).join(", "));
  }
  function construireProgramme() {
    const ol = $("#programme");
    if (modeSouvenir || !(C.programme || []).length) { ol.closest("section").hidden = true; return; }
    ol.replaceChildren(...C.programme.map((e, i) => {
      const tag = e.tag ? el("span", { class: "etape__tag etape__tag--" + (e.tag.style || "rose"), text: tr(e.tag) }) : null;
      return el("li", { class: "etape", style: "--i:" + i },
        el("span", { class: "etape__icone" }, icone(e.icone || "coeur")),
        el("div", { class: "etape__contenu" },
          el("div", { class: "etape__haut" }, el("span", { class: "etape__heure", text: e.heure || "" }), tag),
          el("h3", { class: "etape__titre", text: tr(e.titre) }),
          e.texte ? el("p", { class: "etape__texte", text: tr(e.texte) }) : null
        )
      );
    }));
  }

  /* ---------- Code vestimentaire ---------- */
  function construireDress() {
    const d = C.dressCode;
    const section = $("#dress");
    if (modeSouvenir || !d || !(d.couleurs || []).length) { section.hidden = true; return; }
    section.hidden = false;
    $("#palette").replaceChildren(...d.couleurs.map((c, i) =>
      el("li", { style: "--i:" + i },
        el("span", { class: "pastille-couleur", style: "background:" + (/^#[0-9a-f]{3,8}$/i.test(c.hex) ? c.hex : "#ccc") }),
        el("strong", { text: tr(c.nom) }),
        el("small", { text: c.hex || "" })
      )
    ));
    $("#dress-texte").textContent = tr(d.style);
    $("#dress-interdit span").textContent = tr(d.interdit);
    $("#dress-interdit").hidden = !tr(d.interdit);
    $("#dress-style").hidden = !tr(d.style) && !tr(d.interdit);
  }

  /* ---------- Lieu ---------- */
  function construireLieu() {
    const L = C.lieu;
    const section = $("#lieu");
    if (modeSouvenir || !L || !L.nom) { section.hidden = true; $('.barre [data-cible="lieu"]').hidden = true; return; }
    section.hidden = false;
    $("#lieu-nom").textContent = L.nom;
    $("#lieu-adresse").textContent = L.adresse || "";
    $("#lien-maps").href = lienCarte(L.nom, L.adresse, L.maps);
    $("#lien-waze").href = L.waze || ("https://waze.com/ul?q=" + encodeURIComponent([L.nom, L.adresse].filter(Boolean).join(", ")) + "&navigate=yes");
    $("#lieu-info").textContent = tr(L.info);
    $("#lieu-info-bloc").hidden = !tr(L.info);
  }

  /* ---------- Compte à rebours ---------- */
  const casesRebours = { j: $("#cr-j"), h: $("#cr-h"), m: $("#cr-m"), s: $("#cr-s") };
  function ecrire(n, v) {
    if (n.textContent === v) return;
    n.textContent = v;
    if (animations) { n.classList.remove("change"); void n.offsetWidth; n.classList.add("change"); }
  }
  function tic() {
    const s = Math.max(0, Math.floor((debut - Date.now()) / 1000));
    ecrire(casesRebours.j, String(Math.floor(s / 86400)).padStart(2, "0"));
    ecrire(casesRebours.h, String(Math.floor(s % 86400 / 3600)).padStart(2, "0"));
    ecrire(casesRebours.m, String(Math.floor(s % 3600 / 60)).padStart(2, "0"));
    ecrire(casesRebours.s, String(s % 60).padStart(2, "0"));
  }
  if (!isNaN(debut) && !modeSouvenir) { tic(); setInterval(tic, 1000); }

  /* ---------- Noter la date (fichier calendrier .ics, sans service extérieur) ---------- */
  function ics() {
    const d = new Date(debut);
    const fin = new Date(debut + (C.dureeHeures || 8) * 36e5);
    const f = (x) => x.getFullYear() + String(x.getMonth() + 1).padStart(2, "0") + String(x.getDate()).padStart(2, "0") +
      "T" + String(x.getHours()).padStart(2, "0") + String(x.getMinutes()).padStart(2, "0") + "00";
    const echap = (s) => String(s || "").replace(/[\\,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const lieu = C.lieu ? [C.lieu.nom, C.lieu.adresse].filter(Boolean).join(", ") : "";
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ndaje//Invitation//FR", "BEGIN:VEVENT",
      "UID:" + debut + "-" + encodeURIComponent(C.nomsComplets || "fete") + "@ndaje",
      "DTSTAMP:" + f(new Date()), "DTSTART:" + f(d), "DTEND:" + f(fin),
      "SUMMARY:" + echap(C.nomsComplets), "LOCATION:" + echap(lieu), "DESCRIPTION:" + echap(location.href),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }
  $("#noter-date").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([ics()], { type: "text/calendar;charset=utf-8" }));
    const a = el("a", { href: url, download: (C.nomsComplets || "invitation").replace(/[^\w-]+/g, "-") + ".ics" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  if (modeSouvenir || isNaN(debut)) $("#noter-date").hidden = true;

  /* ---------- Partager (WhatsApp, ou partage du téléphone) ---------- */
  function avis(texte) {
    const a = $("#avis"); a.textContent = texte; a.hidden = false;
    clearTimeout(avis.minuterie); avis.minuterie = setTimeout(() => { a.hidden = true; }, 2200);
  }
  $$("[data-partager]").forEach(b => b.addEventListener("click", async () => {
    const lien = location.origin + location.pathname;
    const texte = t("partageTexte");
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text: texte, url: lien }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(texte + " " + lien), "_blank", "noopener");
  }));

  /* ---------- Confirmation de présence ---------- */
  const form = $("#formulaire");
  const limite = C.dateLimiteRSVP ? new Date(C.dateLimiteRSVP + "T23:59:59") : null;
  let choixActuel = null;
  let etatMerci = null; // "merci" | "merciAbsent" | "ferme" : retraduit au changement de langue
  function construireChoix() {
    const options = [...(C.choixPresence || [{ id: "les-deux", fr: "Présent·e" }]), { id: "absent", absent: true }];
    $("#choix").replaceChildren(...options.map(o =>
      el("label", {},
        el("input", { type: "radio", name: "presence", value: o.id, checked: choixActuel === o.id, required: true }),
        el("span", { text: o.absent ? t("absent") : tr(o) })
      )
    ));
    const max = Math.max(1, Math.min(20, C.maxPersonnes || 6));
    const actuel = +$("#personnes").value || 1;
    $("#personnes").replaceChildren(...Array.from({ length: max }, (_, i) => {
      const n = i + 1;
      const libelle = n + " " + (n === 1 ? t("personne") : t("personnes")) + (n === 2 ? " " + t("accompagne") : "");
      return el("option", { value: n, text: libelle, selected: n === actuel });
    }));
  }
  form.addEventListener("change", e => {
    if (e.target.name !== "presence") return;
    choixActuel = e.target.value;
    $("#champ-nombre").hidden = choixActuel === "absent";
  });
  if (C.ligneRsvp) {
    const lien = $("#ligne-rsvp");
    lien.hidden = false;
    lien.href = "tel:" + C.ligneRsvp.replace(/[^\d+]/g, "");
    $("#ligne-rsvp-num").textContent = C.ligneRsvp;
  }

  function afficherMerci(absent, jouer) {
    form.hidden = true;
    $("#merci").hidden = false;
    etatMerci = absent ? "merciAbsent" : "merci";
    $("#merci-texte").textContent = t(etatMerci);
    if (jouer && animations) eclats($("#merci"));
  }
  function eclats(cible) {
    const r = cible.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + 40;
    const teintes = ["#7E2236", "#E8B4B8", "#C9A24B", "#F1C3C8"];
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 120;
      const p = el("span", { class: "eclat", style:
        `left:${cx}px;top:${cy}px;background:${teintes[i % 4]};--x:${Math.cos(angle) * dist}px;--y:${Math.sin(angle) * dist - 60}px;--r:${Math.random() * 540 - 270}deg` });
      document.body.append(p);
      setTimeout(() => p.remove(), 1400);
    }
  }

  if (modeSouvenir) {
    $("#rsvp").hidden = true;
    $('.barre [data-cible="rsvp"]').hidden = true;
  } else if (limite && Date.now() > limite.getTime()) {
    form.hidden = true;
    $("#merci").hidden = false;
    $(".merci__icone").hidden = true;
    etatMerci = "ferme";
    $("#merci-texte").textContent = t(etatMerci);
  } else {
    const deja = store.get("reponse");
    if (deja) afficherMerci(deja.presence === "absent", false);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const erreur = $("#erreur");
    erreur.hidden = true;
    const f = form.elements;
    const donnees = {
      evenement: C.nomsComplets,
      nom: f.nom.value.trim(),
      telephone: f.telephone.value.trim(),
      presence: choixActuel,
      personnes: choixActuel === "absent" ? 0 : +f.personnes.value,
      message: f.message.value.trim(),
      date: new Date().toISOString()
    };
    if (!donnees.nom || !donnees.telephone || !donnees.presence) {
      erreur.textContent = t("erreurChamps"); erreur.hidden = false; return;
    }
    const bouton = form.querySelector("[type=submit]");
    bouton.disabled = true;
    try {
      if (C.rsvpUrl) {
        // Google Apps Script : "text/plain" évite le blocage CORS du navigateur
        await fetch(C.rsvpUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(donnees) });
      } else {
        const demo = store.get("demo") || []; demo.push(donnees); store.set("demo", demo); // mode démo
      }
      store.set("reponse", donnees);
      afficherMerci(donnees.presence === "absent", true);
      if (donnees.message) construireLivre(true);
    } catch (err) {
      erreur.textContent = t("erreur"); erreur.hidden = false;
    } finally {
      bouton.disabled = false;
    }
  });

  /* ---------- Cagnotte ---------- */
  // Logo officiel (visuels.logoWave / logoOrangeMoney) ; fichier absent = pastille avec icône.
  function logoPaiement(m) {
    const bloc = el("span", { class: "moyen__logo" }, icone(m.ic));
    if (!m.logo) return bloc;
    const img = el("img", { src: m.logo, alt: "", width: "40", height: "40" });
    img.addEventListener("error", () => { bloc.classList.remove("moyen__logo--img"); bloc.replaceChildren(icone(m.ic)); });
    bloc.classList.add("moyen__logo--img");
    bloc.replaceChildren(img);
    return bloc;
  }
  const cg = C.cagnotte || {};
  if (!modeSouvenir && cg.active && (cg.wave || cg.orangeMoney)) {
    $("#cagnotte").hidden = false;
    $("#titulaire").textContent = cg.titulaire || "";
    const moyens = [];
    if (cg.wave) moyens.push({ nom: "Wave Sénégal", num: cg.wave, classe: "wave", ic: "wave", logo: V.logoWave });
    if (cg.orangeMoney) moyens.push({ nom: "Orange Money", num: cg.orangeMoney, classe: "om", ic: "billet", logo: V.logoOrangeMoney });
    $("#moyens").replaceChildren(...moyens.map(m => {
      const libelle = el("span", { "data-t": "copier", text: t("copier") });
      const bouton = el("button", { class: "copier", type: "button" }, icone("copier"), libelle);
      bouton.addEventListener("click", async () => {
        const brut = m.num.replace(/\s/g, "");
        try { await navigator.clipboard.writeText(brut); }
        catch (e) {
          const tmp = el("textarea", { style: "position:fixed;opacity:0" }); tmp.value = brut;
          document.body.append(tmp); tmp.select(); document.execCommand("copy"); tmp.remove();
        }
        bouton.classList.add("copie"); libelle.textContent = t("copie");
        setTimeout(() => { bouton.classList.remove("copie"); libelle.textContent = t("copier"); }, 1800);
      });
      return el("div", { class: "moyen moyen--" + m.classe },
        logoPaiement(m),
        el("div", {}, el("div", { class: "moyen__nom", text: m.nom }), el("div", { class: "moyen__numero", text: m.num })),
        bouton);
    }));
  }

  /* ---------- Livre d'or ---------- */
  function quand(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const jours = Math.floor((Date.now() - d.getTime()) / 864e5);
    if (jours < 1) return t("aLinstant");
    if (jours === 1) return t("hier");
    if (jours < 30) return [t("ilYa"), jours, t("jour")].filter(Boolean).join(" ");
    return d.toLocaleDateString(langue === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long" });
  }
  function construireLivre(nouveau) {
    const liste = Array.isArray(C.livreDor) ? C.livreDor.filter(m => m && m.texte) : [];
    const moi = store.get("reponse");
    const cartes = [];
    if (moi && moi.message) {
      cartes.push(el("article", { class: "message message--moi" + (nouveau ? " nouveau" : "") },
        el("div", { class: "message__haut" }, el("span", { class: "message__auteur", text: moi.nom || t("vous") }), el("span", { class: "message__date", text: quand(moi.date) })),
        el("p", { class: "message__texte", text: "« " + moi.message + " »" })));
    }
    liste.forEach(m => cartes.push(el("article", { class: "message" },
      el("div", { class: "message__haut" }, el("span", { class: "message__auteur", text: m.auteur || "" }), el("span", { class: "message__date", text: quand(m.date) })),
      el("p", { class: "message__texte", text: "« " + m.texte + " »" }))));
    $("#messages").replaceChildren(...cartes);
    $("#livre").hidden = !cartes.length;
  }

  /* ---------- Page souvenir : on masque le reste ---------- */
  if (modeSouvenir) {
    $("#souvenir").hidden = false;
    ["#rebours", "#cagnotte"].forEach(s => { $(s).hidden = true; });
    $('.barre [data-cible="programme-section"]').hidden = true;
    $('.couverture__actions a[href="#rsvp"]').hidden = true;
  }

  /* ---------- Langues : boutons ---------- */
  if (langues.length > 1) {
    $("#langues").replaceChildren(...langues.map(l => el("button", { type: "button", "data-lang": l, text: l.toUpperCase(),
      onclick: () => { langue = l; store.set("langue", l); appliquerTextes(); } })));
  }
  appliquerTextes();

  /* ---------- Musique ---------- */
  const audio = $("#musique");
  const boutonMusique = $("#musique-btn");
  if (V.musique) {
    audio.src = V.musique;
    boutonMusique.hidden = false;
    boutonMusique.addEventListener("click", () => {
      if (audio.paused) audio.play().catch(() => {}); else audio.pause();
    });
    audio.addEventListener("play", () => boutonMusique.setAttribute("aria-pressed", "true"));
    audio.addEventListener("pause", () => boutonMusique.setAttribute("aria-pressed", "false"));
  }

  /* ---------- Pétales qui tombent sur la couverture ---------- */
  if (animations && !modeSouvenir) {
    const zone = $(".petales");
    for (let i = 0; i < 9; i++) {
      zone.append(el("span", { class: "petale", style:
        `left:${5 + Math.random() * 90}%;--duree:${8 + Math.random() * 6}s;--attente:${Math.random() * 8}s;--derive:${Math.random() * 80 - 40}px;--tour:${Math.random() * 400 + 120}deg;transform:scale(${.7 + Math.random() * .6})` }));
    }
  }

  /* ---------- Apparition au défilement (+ sécurité 4 s) ---------- */
  let observateurActif = false;
  const obs = "IntersectionObserver" in window ? new IntersectionObserver(entrees => {
    observateurActif = true;
    entrees.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); } });
  }, { threshold: .15, rootMargin: "0px 0px -30px 0px" }) : null;
  function observer() {
    $$(".revele:not(.visible)").forEach(n => obs ? obs.observe(n) : n.classList.add("visible"));
    setTimeout(() => { if (!observateurActif) $$(".revele").forEach(n => n.classList.add("visible")); }, 4000);
  }

  /* ---------- Barre du bas : section en cours ---------- */
  const liensBarre = $$(".barre a[data-cible]");
  if ("IntersectionObserver" in window) {
    const espion = new IntersectionObserver(entrees => {
      entrees.forEach(en => {
        if (!en.isIntersecting) return;
        liensBarre.forEach(a => a.classList.toggle("actif", a.dataset.cible === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    liensBarre.forEach(a => { const s = document.getElementById(a.dataset.cible); if (s) espion.observe(s); });
  }

  /* ---------- Ouverture de l'enveloppe ---------- */
  const enveloppe = $("#enveloppe");
  function demarrer() {
    document.documentElement.classList.add("ouverte");
    observer();
  }
  function ouvrir() {
    if (V.musique) audio.play().catch(() => {});
    if (!animations) { enveloppe.remove(); demarrer(); return; }
    enveloppe.classList.add("ouvre");
    eclats($("#ouvrir"));
    setTimeout(demarrer, 1500);
    setTimeout(() => enveloppe.remove(), 2400);
  }
  if (params.has("direct") || modeSouvenir) {
    enveloppe.remove();
    demarrer();
  } else {
    enveloppe.hidden = false;
    document.body.style.overflow = "hidden";
    $("#ouvrir").addEventListener("click", () => { document.body.style.overflow = ""; ouvrir(); });
    $("#ouvrir").focus({ preventScroll: true });
  }
})();
