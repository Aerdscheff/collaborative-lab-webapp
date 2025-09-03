import { HomeView, FichesView, ProfileView, MessagesView } from "./views.js";

const routes = {
  "/": HomeView,
  "/fiches": FichesView,
  "/profil": ProfileView,
  "/messages": MessagesView,
};

async function render() {
  const hash = location.hash.replace("#", "") || "/";
  const View = routes[hash] || HomeView;
  const node = await View();
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.append(node);
  app.focus?.();
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
