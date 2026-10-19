/* =========================================================
   NDAJE — MOTEUR DU TEMPLATE
   Lit config.js et construit l'invitation. Pas besoin de le modifier
   pour un nouveau client.
   ========================================================= */
(function () {
  "use strict";

  const C = window.NDAJE;
  if (!C) { document.body.textContent = "config.js est introuvable."; return; }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const APERCU_PARAMS = new URLSearchParams(location.search);

  /* ---------- Mode aperçu (page « Créer » du site Ndajé) ----------
     ?apercu=1&a=…&b=…&date=AAAA-MM-JJ&heure=10h00&lieu=… : les infos tapées par le
     futur client remplacent celles de la fiche, pour lui montrer le vrai rendu.
     Rien n'est envoyé ni mélangé avec les vraies réponses. Tout passe par textContent. */
  const modeApercu = APERCU_PARAMS.has("apercu");
  if (modeApercu) {
    const court = (v, n) => String(v || "").trim().slice(0, n);
    const ancienA = (C.noms || {}).a, ancienB = (C.noms || {}).b;
    const a = court(APERCU_PARAMS.get("a"), 40), b = court(APERCU_PARAMS.get("b"), 40);
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
    const d = APERCU_PARAMS.get("date") || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const h = /(\d{1,2})\s*[h:]\s*(\d{2})?/i.exec(APERCU_PARAMS.get("heure") || "");
      const hh = h ? String(Math.min(23, +h[1])).padStart(2, "0") : "10";
      const mm = h && h[2] ? h[2] : "00";
      C.date = d + "T" + hh + ":" + mm + ":00";
      const jour = new Date(C.date);
      const fmt = (loc, o) => { const s = jour.toLocaleDateString(loc, o); return s.charAt(0).toUpperCase() + s.slice(1); };
      const long = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      C.dateTexte = fmt("fr-FR", long);
      C.dateLimiteRSVP = "";
    }
    C.rsvpUrl = "";   // jamais d'envoi depuis un aperçu
    C.livreDor = [];  // un nouveau client n'a pas encore de messages
  }
  const cle = "ndaje:" + (modeApercu ? "apercu:" : "") + (C.nomsComplets || "evenement");
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(cle + ":" + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(cle + ":" + k, JSON.stringify(v)); } catch (e) { /* navigateur privé */ } }
  };

  // Petit utilitaire pour créer des éléments sans innerHTML (pas d'injection possible)
  function el(tag, attrs = {}, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    enfants.flat().forEach(e => e != null && n.append(e));
    return n;
  }

  /* ---------- Langue ---------- */
  let langue = store.get("langue") || "fr";
  const aDuWolof = C.textes.wo && Object.keys(C.textes.wo).length > 0;
  if (!aDuWolof) langue = "fr";

  const t = (k) => (C.textes[langue] && C.textes[langue][k]) || C.textes.fr[k] || "";
  const tr = (obj) => typeof obj === "string" ? obj : (obj[langue] || obj.fr || "");

  function appliquerTextes() {
    document.documentElement.lang = langue === "wo" ? "wo" : "fr";
    $$("[data-t]").forEach(n => { n.textContent = t(n.dataset.t); });
    $$("#langues button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === langue)));
    construireProgramme();
    construireChoix();
  }

  /* ---------- Thème ---------- */
  const th = C.theme || {};
  const vars = {
    "--fond": th.fond, "--surface": th.surface, "--texte": th.texte, "--texte-doux": th.texteDoux,
    "--accent": th.accent, "--accent-doux": th.accentDoux, "--secondaire": th.secondaire,
    "--police-titre": th.policeTitre, "--police-texte": th.policeTexte
  };
  for (const [k, v] of Object.entries(vars)) if (v) document.documentElement.style.setProperty(k, v);
  const metaCouleur = el("meta", { name: "theme-color", content: th.fond || "#FBF7EF" });
  document.head.append(metaCouleur);

  /* ---------- Page souvenir ---------- */
  // X jours après la fête (souvenirApresJours, 30 par défaut), on ne garde que les noms,
  // la date, les photos et un merci. ?souvenir=1 dans l'URL force ce mode pour le montrer.
  const joursSouvenir = typeof C.souvenirApresJours === "number" ? C.souvenirApresJours : 30;
  const finFete = new Date(C.date).getTime();
  const modeSouvenir = new URLSearchParams(location.search).has("souvenir") ||
    (!isNaN(finFete) && Date.now() > finFete + joursSouvenir * 86400000);

  /* ---------- Identité ---------- */
  const titresType = {
    mariage: "Vous êtes invité·e au mariage de",
    bapteme: "Vous êtes invité·e au baptême de",
    anniversaire: "Vous êtes invité·e à l'anniversaire de",
    entreprise: "Vous êtes invité·e à"
  };
  $(".enveloppe__pour").textContent = titresType[C.type] || titresType.mariage;
  $$("[data-noms]").forEach(n => { n.textContent = C.noms.b ? `${C.noms.a} & ${C.noms.b}` : C.noms.a; });
  $$("[data-nom-a]").forEach(n => { n.textContent = C.noms.a; });
  $$("[data-nom-b]").forEach(n => { n.textContent = C.noms.b || ""; });
  if (!C.noms.b) $(".titre-noms em").remove();
  $$("[data-initiales]").forEach(n => { n.textContent = (C.noms.a[0] || "") + (C.noms.b ? C.noms.b[0] : ""); });
  $$("[data-date-texte]").forEach(n => { n.textContent = C.dateTexte; });
  document.title = `${C.noms.b ? C.noms.a + " & " + C.noms.b : C.noms.a} — ${C.dateTexte}`;

  /* ---------- Visuels d'Aicha ---------- */
  // Si un fichier n'existe pas encore, l'emplacement disparaît proprement.
  $$("[data-visuel]").forEach(img => {
    const src = C.visuels[img.dataset.visuel];
    if (!src) { img.setAttribute("src", ""); return; }
    img.addEventListener("error", () => img.setAttribute("src", ""), { once: true });
    img.src = src;
  });
  if (C.visuels.motif) {
    const test = new Image();
    test.onload = () => document.documentElement.style.setProperty("--motif", `url("${C.visuels.motif}")`);
    test.src = C.visuels.motif;
  }
  const galerie = $("#galerie");
  (C.visuels.photos || []).forEach(src => {
    const img = el("img", { src, alt: "", loading: "lazy", class: "revele", onerror() { this.remove(); } });
    galerie.append(img);
  });

  /* ---------- Programme ---------- */
  const icones = {
    mosquee: "M12 3c2.5 2 4 3.6 4 5.5V10H8V8.5C8 6.6 9.5 5 12 3zM5 21V12h14v9M9 21v-4a3 3 0 0 1 6 0v4M4 21h16",
    eglise: "M12 2v4M10 4h4M7 21V11l5-5 5 5v10M4 21h16M10 21v-4h4v4",
    mairie: "M3 21h18M4 10h16M12 3l9 7H3l9-7zM6 10v11M10 10v11M14 10v11M18 10v11",
    maison: "M3 11l9-7 9 7M5 9.5V21h14V9.5M10 21v-6h4v6",
    soiree: "M8 3h8l-1 7a3 3 0 0 1-6 0L8 3zM12 13v8M8 21h8M18 4l2-1M19 8h2",
    repas: "M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-1.5 1-2 3-2 6h4V3M17 9v12",
    default: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
  };
  function icone(nom) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.4");
    svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", icones[nom] || icones.default);
    svg.append(p);
    return svg;
  }
  function lienCarte(etape) {
    if (etape.maps) return etape.maps; // lien Google Maps exact fourni par le client
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${etape.lieu}, ${etape.adresse}`);
  }
  function construireProgramme() {
    if (modeSouvenir) return; // pas d'adresses sur la page souvenir
    const ol = $("#programme");
    ol.replaceChildren(...C.programme.map(e =>
      el("li", { class: "etape revele visible" },
        el("div", { class: "etape__icone" }, icone(e.icone)),
        el("div", { class: "carte etape__carte" },
          el("div", { class: "etape__heure", text: e.heure }),
          el("h3", { class: "etape__titre", text: tr(e.titre) }),
          el("div", { class: "etape__lieu", text: e.lieu }),
          el("div", { class: "etape__lieu", text: e.adresse }),
          el("a", { class: "etape__lien", href: lienCarte(e), target: "_blank", rel: "noopener", text: "→ " + t("itineraire") })
        )
      )
    ));
  }

  /* ---------- Compte à rebours ---------- */
  const cible = new Date(C.date).getTime();
  function tic() {
    const d = Math.max(0, cible - Date.now());
    const s = Math.floor(d / 1000);
    $("#cr-j").textContent = Math.floor(s / 86400);
    $("#cr-h").textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
    $("#cr-m").textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
    $("#cr-s").textContent = String(s % 60).padStart(2, "0");
  }
  tic(); setInterval(tic, 1000);

  /* ---------- Formulaire de présence ---------- */
  const form = $("#rsvp");
  let choixActuel = null;
  function construireChoix() {
    const zone = $("#choix");
    const options = [...C.choixPresence, { id: "absent", fr: C.textes.fr.absent, wo: (C.textes.wo || {}).absent, absent: true }];
    zone.replaceChildren(...options.map(o =>
      el("label", { class: o.absent ? "choix--absent" : "" },
        el("input", { type: "radio", name: "presence", value: o.id, checked: choixActuel === o.id, required: true }),
        el("span", { text: o.absent ? t("absent") : tr(o) })
      )
    ));
  }
  form.addEventListener("change", e => {
    if (e.target.name !== "presence") return;
    choixActuel = e.target.value;
    $("#champ-nombre").hidden = choixActuel === "absent";
  });

  const nbInput = form.elements.personnes;
  nbInput.max = C.maxPersonnes || 6;
  $$(".compteur button").forEach(b => b.addEventListener("click", () => {
    const v = Math.min(+nbInput.max, Math.max(1, (+nbInput.value || 1) + +b.dataset.pas));
    nbInput.value = v;
  }));

  const limite = C.dateLimiteRSVP ? new Date(C.dateLimiteRSVP + "T23:59:59") : null;
  if (limite) {
    $("#date-limite").textContent = limite.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  function afficherMerci(absent) {
    form.hidden = true;
    const m = $("#rsvp-merci");
    m.textContent = absent ? t("merciAbsent") : t("merci");
    m.hidden = false;
  }

  if (limite && Date.now() > limite.getTime()) {
    form.hidden = true;
    const m = $("#rsvp-merci");
    m.textContent = t("ferme"); m.hidden = false;
  } else {
    const deja = store.get("reponse");
    if (deja) afficherMerci(deja.presence === "absent");
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
      erreur.textContent = "Merci de remplir votre nom, votre téléphone et votre choix de présence.";
      erreur.hidden = false;
      return;
    }
    const bouton = form.querySelector("[type=submit]");
    bouton.disabled = true;
    try {
      if (C.rsvpUrl) {
        // Google Apps Script : "text/plain" évite le blocage CORS du navigateur
        await fetch(C.rsvpUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(donnees) });
      } else {
        // Mode démo : on garde les réponses dans ce navigateur
        const demo = store.get("demo") || [];
        demo.push(donnees); store.set("demo", demo);
      }
      store.set("reponse", donnees);
      afficherMerci(donnees.presence === "absent");
    } catch (err) {
      erreur.textContent = t("erreur");
      erreur.hidden = false;
    } finally {
      bouton.disabled = false;
    }
  });

  /* ---------- Cagnotte ---------- */
  const cg = C.cagnotte || {};
  if (!modeSouvenir && cg.active && (cg.wave || cg.orangeMoney)) {
    $("#cagnotte").hidden = false;
    $("#titulaire").textContent = cg.titulaire || "";
    const moyens = [];
    const VI = C.visuels || {};
    if (cg.wave) moyens.push({ nom: "Wave", num: cg.wave, logo: "moyen__logo--wave", court: "W", img: VI.logoWave });
    if (cg.orangeMoney) moyens.push({ nom: "Orange Money", num: cg.orangeMoney, logo: "moyen__logo--om", court: "OM", img: VI.logoOrangeMoney });
    $("#cagnotte-moyens").replaceChildren(...moyens.map(m => {
      const bouton = el("button", { class: "bouton", type: "button", "data-t": "copier", text: t("copier") });
      bouton.addEventListener("click", async () => {
        const brut = m.num.replace(/\s/g, "");
        try { await navigator.clipboard.writeText(brut); }
        catch (e) {
          const tmp = el("textarea", { style: "position:fixed;opacity:0" }); tmp.value = brut;
          document.body.append(tmp); tmp.select(); document.execCommand("copy"); tmp.remove();
        }
        bouton.textContent = t("copie");
        setTimeout(() => { bouton.textContent = t("copier"); }, 1800);
      });
      return el("div", { class: "carte moyen" },
        (() => {
          // Logo officiel si fourni (visuels.logoWave / logoOrangeMoney), sinon pastille W / OM
          const d = el("div", { class: "moyen__logo " + m.logo, text: m.court, "aria-hidden": "true" });
          if (!m.img) return d;
          const i = el("img", { src: m.img, alt: "" });
          i.addEventListener("error", () => { d.classList.remove("moyen__logo--img"); d.textContent = m.court; });
          d.textContent = ""; d.classList.add("moyen__logo--img"); d.append(i);
          return d;
        })(),
        el("div", { class: "moyen__infos" },
          el("div", { class: "moyen__nom", text: m.nom }),
          el("div", { class: "moyen__numero", text: m.num })
        ),
        bouton
      );
    }));
  }

  if (modeSouvenir) {
    $("#souvenir").hidden = false;
    [$(".rebours"), $("#programme"), $("#rsvp"), $("#cagnotte")].forEach(n => {
      const section = n && n.closest("section");
      if (section) section.hidden = true;
    });
  }

  /* ---------- Langues ---------- */
  if (aDuWolof) {
    $("#langues").hidden = false;
    $$("#langues button").forEach(b => b.addEventListener("click", () => {
      langue = b.dataset.lang; store.set("langue", langue); appliquerTextes();
    }));
  }
  appliquerTextes();

  /* ---------- Apparition au défilement ---------- */
  const obs = "IntersectionObserver" in window
    ? new IntersectionObserver(entrees => entrees.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      }), { threshold: 0.15 })
    : null;
  function observer() { $$(".revele:not(.visible)").forEach(n => obs ? obs.observe(n) : n.classList.add("visible")); }

  /* ---------- Ouverture de l'enveloppe ---------- */
  const enveloppe = $("#enveloppe");
  const main = $("#invitation");
  const musique = $("#musique");
  if (C.visuels.musique) musique.src = C.visuels.musique;

  function ouvrir() {
    enveloppe.classList.add("ouvre");
    main.hidden = false;
    observer();
    if (C.visuels.musique) musique.play().catch(() => {});
    setTimeout(() => enveloppe.classList.add("ouverte"), 700);
    setTimeout(() => enveloppe.remove(), 1600);
  }
  $("#ouvrir").addEventListener("click", ouvrir);
  // ?direct=1 dans l'URL saute l'enveloppe (pratique pour les tests et les captures)
  if (new URLSearchParams(location.search).has("direct")) { enveloppe.remove(); main.hidden = false; observer(); }
})();
