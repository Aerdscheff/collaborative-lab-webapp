<script>
/* Patch léger : enrichit la fiche avec ownerEmail/ownerName
   et enregistre la fiche dans Google Sheets après sauvegarde. */
(function () {
  function enrichProjectBeforeSave(p) {
    try {
      p.ownerEmail = (window.currentUser && currentUser.email) || null;
      p.ownerName  = (window.currentUser && currentUser.name)  || null;
    } catch (e) { console.warn('enrichProjectBeforeSave:', e); }
  }

  async function appendProjectToSheet(project) {
    try {
      const apiKey = (window.ENV && window.ENV.GOOGLE_SHEETS_API_KEY) || (window.settings && settings.googleSheetsApiKey);
      if (!apiKey) return; // pas de clé => on n'écrit pas
      const spreadsheetId = '14VFyrYXLlMFC8NTLSxi0QM_YZT4t-PWfVLCLYcFJ-44';
      const range = 'Feuille1!A:E';
      const body = {
        values: [[
          project.ownerName || '',
          project.ownerEmail || '',
          project.title || '',
          project.summary || '',
          new Date(project.createdAt || Date.now()).toLocaleString()
        ]]
      };
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } catch (e) { console.warn('appendProjectToSheet:', e); }
  }

  // Rends ces fonctions visibles pour index.html (injections ponctuelles)
  window.enrichProjectBeforeSave = enrichProjectBeforeSave;
  window.afterProjectSaved = appendProjectToSheet;
})();
</script>
