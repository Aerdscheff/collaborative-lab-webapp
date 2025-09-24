export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Réinitialiser le mot de passe</h2>
      <form id="reset-password-form" class="form">
        <label>
          Email :
          <input type="email" name="email" required>
        </label>
        <button type="submit">🔒 Réinitialiser</button>
      </form>
    </section>
  `;

  document.getElementById("reset-password-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Si cet email est enregistré, un lien de réinitialisation a été envoyé.");
  });
}
