const toggle = document.getElementById('darkModeToggle');
const icon = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', theme);
  toggle.checked = (theme === 'dark');
  icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  const color = theme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)' // light watermark on dark bg
    : 'rgba(0, 0, 0, 0.1)';      // dark watermark on light bg
  setWatermark(color);
}

// Initial load: saved theme or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}
 // Toggle handler
toggle.addEventListener('change', () => {
  applyTheme(toggle.checked ? 'dark' : 'light');
});