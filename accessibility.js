// Fonctions relatives à l’accessibilité

(function(){
  // Replace le focus dans l’élément main (#app)
  function focusMain() {
    const app = document.getElementById('app');
    if (app) {
      app.focus();
    }
  }

  window.Accessibility = { focusMain };
})();