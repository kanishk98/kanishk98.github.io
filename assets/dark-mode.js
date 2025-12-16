(function() {
  // Update button text based on current theme
  function updateButtonText() {
    const button = document.getElementById('themeToggle');
    if (button) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      button.innerText = isDark ? 'light mode' : 'dark mode';
    }
  }

  // Get the user's theme preference
  function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply the theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  // Toggle theme
  window.toggleDarkMode = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateButtonText();
  };

  // Set initial theme on page load
  applyTheme(getTheme());
  
  // Update button text after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateButtonText);
  } else {
    updateButtonText();
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
      updateButtonText();
    }
  });
})();
