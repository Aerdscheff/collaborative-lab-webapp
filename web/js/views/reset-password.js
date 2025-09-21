// Reset password view minimal
export function render(app) {
  app.innerHTML = `
    <section class="reset-password">
      <h1>Réinitialiser votre mot de passe</h1>
      <form id="reset-form">
        <label>
          Nouveau mot de passe
          <input type="password" name="password" required />
        </label>
        <label>
          Confirmer le mot de passe
          <input type="password" name="passwordConfirm" required />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
      <p class="info">Cette vue est en construction.</p>
    </section>
  `;
}
