(function() {
  const root = document.documentElement;
  // Set color variables for new pink design
  root.style.setProperty('--bg', '#FDF2F7');
  root.style.setProperty('--ink', '#2F1D2E');
  root.style.setProperty('--muted', '#C48CA5');
  root.style.setProperty('--earth', '#E4578E');
  root.style.setProperty('--clay', '#F5A2C1');
  root.style.setProperty('--moss', '#FBD7E7');
  root.style.setProperty('--sky', '#FDE6F4');

  // Simple toast function for notifications
  window.UI = {
    toast: function(msg, type = 'info') {
      alert(msg);
    }
  };
})();
