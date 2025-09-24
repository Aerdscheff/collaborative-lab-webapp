export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Mon Profil</h2>
      <form id="profile-form" class="form">
        <label>
          Nom complet :
          <input type="text" name="name" placeholder="Votre nom" required>
        </label>
        <label>
          Email :
          <input type="email" name="email" disabled value="user@example.com">
        </label>
        <label>
          Biographie :
          <textarea name="bio" rows="4" placeholder="Décrivez votre parcours pédagogique..."></textarea>
        </label>
        <label>
          Niveaux / âges :
          <input type="text" name="levels" placeholder="Primaire, secondaire...">
        </label>
        <label>
          Disciplines :
          <input type="text" name="disciplines" placeholder="Maths, sciences, langues...">
        </label>
        <label>
          Objectifs de Développement Durable (ODD) :
          <input type="text" name="odd" placeholder="ODD 4, ODD 12...">
        </label>
        <button type="submit">💾 Enregistrer</button>
      </form>
    </section>
  `;

  const form = document.getElementById("profile-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Profil sauvegardé :", data);
    alert("Profil mis à jour avec succès !");
  });
}
