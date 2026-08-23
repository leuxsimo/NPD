// Minimal Shopify OS 2.0 Global JavaScript Helper

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu drawer toggle helper
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menuDrawer = document.querySelector('[data-menu-drawer]');
  if (menuBtn && menuDrawer) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      menuDrawer.classList.toggle('is-active');
    });
  }
});
