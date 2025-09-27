/**
 * Affiche un loader plein écran avec un spinner.
 */
export function showGlobalLoader(app) {
  app.innerHTML = `
    <div class="flex items-center justify-center h-full py-12">
      <div class="animate-spin h-12 w-12 border-4 border-t-transparent border-[#E25C5C] rounded-full"></div>
    </div>
  `;
}

/**
 * Applique une animation fade-in sur un container.
 */
export function fadeIn(app) {
  app.classList.remove("fade-in");
  void app.offsetWidth; // force reflow
  app.classList.add("fade-in");
}
