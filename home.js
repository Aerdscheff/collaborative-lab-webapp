:root {
  --color-primary: #f06292;   /* rose dominant */
  --color-secondary: #81c784; /* vert tendre */
  --color-accent: #9575cd;    /* violet doux */
  --color-glow: #4dd0e1;      /* turquoise subtil pour effets */
  --color-bg: #f9f9f9;
  --color-text: #333333;

  --font-main: 'Roboto', sans-serif;
  --font-title: 'Exo 2', sans-serif; /* touche futuriste subtile */
}

/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-main);
  background: var(--color-bg) url('/home-top-bottom.png') no-repeat bottom center;
  background-size: cover;
  color: var(--color-text);
  padding-top: 70px; /* espace pour header */
  line-height: 1.6;
}

/* HEADER */
header {
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  color: white;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 1000;
}

header .logo {
  display: flex;
  align-items: center;
  font-family: var(--font-title);
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

header .logo img {
  height: 40px;
  margin-right: 10px;
}

nav a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

nav a:hover {
  color: var(--color-glow);
  text-shadow: 0 0 6px var(--color-glow);
}

/* MAIN */
main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}

h1, h2, h3 {
  font-family: var(--font-title);
  margin-bottom: 0.5rem;
}

h1 {
  color: var(--color-primary);
  font-size: 2rem;
  letter-spacing: 1px;
}

h2 {
  color: var(--color-accent);
}

/* CARDS */
.card {
  background: rgba(255,255,255,0.9);
  padding: 1.5rem;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
  backdrop-filter: blur(3px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* FORMULAIRES */
form.form label {
  display: block;
  margin-bottom: 1rem;
  font-weight: bold;
}

form.form input,
form.form textarea,
form.form select {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

form.form input:focus,
form.form textarea:focus,
form.form select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 6px var(--color-glow);
  outline: none;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* BOUTONS */
button {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  box-shadow: 0 0 12px var(--color-glow);
}

/* MESSAGES */
.message {
  background: #fff3f8;
  border-left: 4px solid var(--color-primary);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
}

/* FOOTER */
footer {
  background: rgba(255,255,255,0.9);
  padding: 1rem 2rem;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 0.9rem;
}

footer .partners img {
  height: 30px;
  margin: 0 0.5rem;
  filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
}

/* ANIMATION DE TRANSITION ENTRE LES VUES */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* LOADER ANIMÉ SUBTIL */
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255,255,255,0.3);
  border-top: 5px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1.5s ease-in-out infinite;
  box-shadow: 0 0 8px var(--color-glow);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
