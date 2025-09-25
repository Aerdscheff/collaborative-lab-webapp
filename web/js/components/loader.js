// web/js/components/loader.js
export function renderLoader(containerId, message = "Chargement...") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-10">
      <!-- Cercle respirant -->
      <div class="relative">
        <div class="w-12 h-12 rounded-full bg-[#E25C5C] animate-pulse"></div>
        <div class="absolute inset-0 rounded-full bg-[#E25C5C] opacity-50 animate-ping"></div>
      </div>
      <p class="mt-4 text-gray-600 font-medium">${message}</p>
    </div>
  `;
}
