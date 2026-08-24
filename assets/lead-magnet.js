document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.lead-magnet__form');
  const successMessage = document.querySelector('.lead-magnet__success-message');

  if (form && successMessage) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // In production with Shopify backend, this can also submit via fetch/form API
      // Transition to success message view
      form.style.display = 'none';
      successMessage.style.display = 'block';

      // Scroll smoothly to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
