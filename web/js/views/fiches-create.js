export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Créer une nouvelle Fiche pédagogique</h2>
      <form id="fiche-create-form" class="form">
        <label>
          Titre :
          <input type="text" name="title" required>
        </label>
        <label>
          Niveaux :
          <input type="text" name="levels" placeholder="Primaire, secondaire...">
        </label>
        <label>
          Discipline :
          <input type="text" name="discipline">
        </label>
        <label>
          Résumé :
          <textarea name="resume" rows="3"></textarea>
        </label>
        <div class="actions">
          <button type="submit">💾 Créer</button>
          <button type="button" id="back">↩️ Retour</button>
        </div>
      </form>
    </section>
  `;

  document.getElementById("fiche-create-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Fiche créée avec succès !");
    window.location.hash = "#fiches";
  });

  document.getElementById("back").addEventListener("click", () => {
    window.location.hash = "#fiches";
  });
}
