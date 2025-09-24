export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Modifier mon Profil</h2>
      <form id="profile-edit-form" class="form">
        <label>
          Nom complet :
          <input type="text" name="name" value="Jean Dupont" required>
        </label>
        <label>
          Email :
          <input type="email" name="email" disabled value="jean.dupont@example.com">
        </label>
        <label>
          Biographie :
          <textarea name="bio" rows="4">Enseignant en sciences naturelles passionné par l’écologie.</textarea>
        </label>
        <label>
          Niveaux / âges :
          <input type="text" name="levels" value="Primaire">
        </label>
        <label>
          Disciplines :
          <input type="text" name="disciplines" value="Sciences naturelles">
        </label>
        <label>
          Objectifs de Développement Durable (ODD) :
          <input type="text" name="odd" value="ODD 4, ODD 15">
        </label>
        <div class="actions">
          <button type="submit">💾 Sauvegarder</button>
          <button type="button" id="back">↩️ Retour</button>
        </div>
      </form>
    </section>
  `;

  document.getElementById("profile-edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Modifications enregistrées !");
  });

  document.getElementById("back").addEventListener("click", () => {
    window.location.hash = "#profil";
  });
}
