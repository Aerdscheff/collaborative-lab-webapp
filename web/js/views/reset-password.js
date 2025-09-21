# Assure-toi d’être sur la branche main
git checkout main

# Applique le patch
cat <<'PATCH' | git apply -
From 0c1f9a7a1234567890abcdef1234567890abcdef Mon Sep 17 00:00:00 2001
From: Katy Fox <katy@aerdscheff.lu>
Date: Sun, 21 Sep 2025 22:45:00 +0200
Subject: fix(frontend): replace reset-password.js with minimal valid version

Ensure Netlify build succeeds by providing a syntactically valid
reset-password view. Logic will be expanded later.

---
 web/js/views/reset-password.js | 21 +++++++++++++++++++++
 1 file changed, 21 insertions(+), 0 deletions(-)
 create mode 100644 web/js/views/reset-password.js

diff --git a/web/js/views/reset-password.js b/web/js/views/reset-password.js
index 0000000..1111111
--- /dev/null
+++ b/web/js/views/reset-password.js
@@ -0,0 +1,21 @@
+// Minimal reset-password view
+// Valid JS to unblock Netlify build
+
+export function render(app) {
+  app.innerHTML = `
+    <section class="reset-password">
+      <h1>Réinitialiser votre mot de passe</h1>
+      <form id="reset-form">
+        <label>
+          Nouveau mot de passe
+          <input type="password" name="password" required />
+        </label>
+        <label>
+          Confirmer le mot de passe
+          <input type="password" name="passwordConfirm" required />
+        </label>
+        <button type="submit">Mettre à jour</button>
+      </form>
+      <p class="info">Cette vue est en construction.</p>
+    </section>
+  `;
+}
PATCH
