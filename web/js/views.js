import { API } from "./api.js";

const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k.startsWith("on") && typeof v === "function")
      n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  });
  children.flat().forEach((c) =>
    n.append(c?.nodeType ? c : document.createTextNode(String(c ?? "")))
  );
  return n;
};

export async function HomeView() {
  const box = el(
    "section",
    { class: "card" },
    el("h1", { class: "h1" }, "Bienvenue sur Collaborative Lab"),
    el(
      "p",
      {},
      "Créez et partagez des fiches pédagogiques. L’app fonctionne hors-ligne et exporte vos données. "
    ),
    el(
      "p",
      { class: "meta" },
      "Back/API (FastAPI/Render), Auth Supabase, Sheets/Drive, EmailJS en cours."
    )
  );
  return box;
}

export async function FichesView() {
  const wrap = el("section", { class: "card" });
  wrap.append(el("h2", {}, "Fiches"));

  // Formulaire création
  const form = el("form", { class: "form", onsubmit: onCreate });
  form.append(
    el("label", {}, "Titre", el("input", { name: "titre", required: true, placeholder: "Ex: Compost & cycles" })),
    el("label", {}, "Niveaux (CSV)", el("input", { name: "niveaux", placeholder: "8-12, 12-15" })),
    el("label", {}, "Disciplines (CSV)", el("input", { name: "disciplines", placeholder: "SVT, Techno" })),
    el("label", {}, "Tags (CSV)", el("input", { name: "tags", placeholder: "compost, sols" })),
    el("label", {}, "Résumé", el("textarea", { name: "resume", rows: 2 })),
    el("button", { class: "btn", type: "submit" }, "Créer")
  );
  wrap.append(form);

  // Filtres + grille
  const filter = el("div", { class: "form" },
    el("input", { id: "filterNiv", placeholder: "Filtrer par niveau (ex: 8-12)", oninput: renderList })
  );
  wrap.append(filter);

  const grid = el("div", { class: "grid", id: "fichesGrid" });
  wrap.append(grid);

  let fiches = await API.getFiches();
  renderList();

  function splitCsv(s = "") {
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }

  async function onCreate(ev) {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    await API.createFiche({
      titre: d.titre?.trim(),
      niveaux: splitCsv(d.niveaux),
      disciplines: splitCsv(d.disciplines),
      tags: splitCsv(d.tags),
      resume: d.resume?.trim(),
    });
    fiches = await API.getFiches();
    form.reset();
    renderList();
  }

  async function renderList() {
    const key = $("#filterNiv").value.trim();
    const list = key ? await API.getFiches({ niveau: key }) : fiches;
    grid.innerHTML = "";
    list.forEach((f) => {
      grid.append(
        el("article", { class: "card" },
          el("span", { class: "badge" }, "Consented (v1)"),
          el("h3", {}, f.titre),
          el("div", { class: "meta" }, `Niveaux : ${(f.niveaux || []).join(", ")}`),
          el("div", { class: "meta" }, `Disciplines : ${(f.disciplines || []).join(", ")}`),
          el("p", {}, f.resume || ""),
          el("div", { class: "tags" }, ...(f.tags || []).map((t) => el("span", { class: "tag" }, t)))
        )
      );
    });
  }

  return wrap;
}

export async function ProfileView() {
  const p = await API.getProfile();
  const wrap = el("section", { class: "card" }, el("h2", {}, "Profil enseignant·e"));
  const form = el("form", { class: "form", onsubmit: onSave },
    el("label", {}, "Nom", el("input", { name: "name", value: p.name || "" })),
    el("label", {}, "Email", el("input", { name: "email", value: p.email || "" })),
    el("label", {}, "Niveaux (CSV)", el("input", { name: "niveaux", value: (p.niveaux || []).join(", ") })),
    el("label", {}, "Disciplines (CSV)", el("input", { name: "disciplines", value: (p.disciplines || []).join(", ") })),
    el("label", {}, "ODD (CSV)", el("input", { name: "odd", value: (p.odd || []).join(", ") })),
    el("button", { class: "btn", type: "submit" }, "Enregistrer")
  );
  wrap.append(form);

  async function onSave(ev) {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
    await API.updateProfile({
      name: d.name?.trim(),
      email: d.email?.trim(),
      niveaux: split(d.niveaux),
      disciplines: split(d.disciplines),
      odd: split(d.odd),
    });
    alert("Profil enregistré.");
  }

  return wrap;
}

export async function MessagesView() {
  const msgs = await API.getMessages ? await API.getMessages() : [];
  const wrap = el("section", { class: "card" }, el("h2", {}, "Messagerie"));
  const btn = el("button", { class: "btn", onclick: onAll }, "Tout marquer comme lu");
  const ul = el("ul", { class: "messages" });
  wrap.append(btn, ul);
  render();

  function render() {
    ul.innerHTML = "";
    msgs.forEach((m) =>
      ul.append(
        el("li", { class: "msg " + (m.lu ? "" : "unread") },
          el("strong", {}, m.subject), " — ", m.body
        )
      )
    );
  }

  async function onAll() {
    if (API.markAllRead) {
      await API.markAllRead();
      msgs.forEach((m) => (m.lu = true));
      render();
    }
  }

  return wrap;
}
