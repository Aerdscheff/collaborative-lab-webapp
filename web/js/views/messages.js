export function render(app) {
  app.innerHTML = `
    <section class="card">
      <h2>Messagerie interne</h2>
      <div class="message">
        <p><strong>Admin :</strong> Bienvenue dans la plateforme !</p>
        <small>Reçu le 12/09/2025</small>
      </div>
      <div class="message">
        <p><strong>Marie :</strong> Souhaites-tu collaborer sur un projet biodiversité ?</p>
        <small>Reçu le 20/09/2025</small>
      </div>
      <form id="new-message" class="form">
        <label>
          Nouveau message :
          <textarea name="content" rows="3" required></textarea>
        </label>
        <button type="submit">✉️ Envoyer</button>
      </form>
    </section>
  `;

  document.getElementById("new-message").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message envoyé !");
  });
}
