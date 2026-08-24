document.addEventListener('DOMContentLoaded', function() {
  const BUNDLE_SIZE = 6;
  const BUNDLE_PRICE = 99;
  const INDIVIDUAL_PRICE = 29;

  const productCards = document.querySelectorAll('.bundle-product-card');
  const progressFill = document.querySelector('.bundle-builder__progress-fill');
  const progressText = document.querySelector('.bundle-builder__progress-text');

  let selectedProducts = [];

  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.dataset.productId;
      const productTitle = card.dataset.productTitle;
      const productPrice = parseFloat(card.dataset.productPrice) || INDIVIDUAL_PRICE;

      if (card.classList.contains('selected')) {
        // Deselect
        card.classList.remove('selected');
        selectedProducts = selectedProducts.filter(p => p.id !== productId);
      } else {
        // Select (if under limit)
        if (selectedProducts.length < BUNDLE_SIZE) {
          card.classList.add('selected');
          selectedProducts.push({
            id: productId,
            title: productTitle,
            price: productPrice
          });
        }
      }

      updateBundleUI();
    });
  });

  function updateBundleUI() {
    const count = selectedProducts.length;
    const percentage = (count / BUNDLE_SIZE) * 100;
    const totalPrice = count * INDIVIDUAL_PRICE;
    const savings = count === BUNDLE_SIZE ? totalPrice - BUNDLE_PRICE : 0;

    // Update progress
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = count + ' of ' + BUNDLE_SIZE + ' selected';

    // Update ALL pricing elements (desktop + mobile)
    document.querySelectorAll('.bundle-builder__original-amount').forEach(el => {
      el.textContent = '$' + totalPrice.toFixed(2);
    });
    document.querySelectorAll('.bundle-builder__discounted-amount').forEach(el => {
      el.textContent = count === BUNDLE_SIZE ? '$' + BUNDLE_PRICE.toFixed(2) : '$0.00';
    });
    document.querySelectorAll('.bundle-builder__savings-amount').forEach(el => {
      el.textContent = '$' + savings.toFixed(2);
    });

    // Update ALL selected lists
    document.querySelectorAll('.bundle-builder__selected-list').forEach(list => {
      if (count === 0) {
        list.innerHTML = '<p class="bundle-builder__empty-message">Select 6 templates</p>';
      } else {
        list.innerHTML = selectedProducts.map(p => `
          <div class="bundle-builder__selected-item">
            <span>${p.title}</span>
            <button class="bundle-builder__remove" data-id="${p.id}">&times;</button>
          </div>
        `).join('');
      }
    });

    // Update ALL add to cart buttons
    document.querySelectorAll('.bundle-builder__add-to-cart').forEach(btn => {
      if (count === BUNDLE_SIZE) {
        btn.disabled = false;
        btn.textContent = 'Add 6 Templates to Cart — $99';
      } else {
        btn.disabled = true;
        btn.textContent = `Select ${BUNDLE_SIZE - count} more`;
      }
    });

    // Add remove handlers
    document.querySelectorAll('.bundle-builder__remove').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        selectedProducts = selectedProducts.filter(p => p.id !== id);
        const card = document.querySelector(`[data-product-id="${id}"]`);
        if (card) card.classList.remove('selected');
        updateBundleUI();
      };
    });
  }

  // Bind add-to-cart click handler
  document.querySelectorAll('.bundle-builder__add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      if (selectedProducts.length === BUNDLE_SIZE) {
        alert('Bundle added to cart! (Connected to SlideLab Bundle API)');
      }
    });
  });
});
