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

    // Update pricing (both desktop and mobile)
    const originalAmounts = document.querySelectorAll('.bundle-builder__original-amount');
    const discountedAmounts = document.querySelectorAll('.bundle-builder__discounted-amount');
    const savingsAmounts = document.querySelectorAll('.bundle-builder__savings-amount');

    originalAmounts.forEach(el => el.textContent = '$' + totalPrice.toFixed(2));
    discountedAmounts.forEach(el => el.textContent = count === BUNDLE_SIZE ? '$' + BUNDLE_PRICE.toFixed(2) : '$0.00');
    savingsAmounts.forEach(el => el.textContent = '$' + savings.toFixed(2));

    // Update selected lists (both desktop and mobile)
    const selectedLists = document.querySelectorAll('.bundle-builder__selected-list');
    selectedLists.forEach(list => {
      if (count === 0) {
        list.innerHTML = '<p class="bundle-builder__empty-message">Select 6 templates to build your bundle</p>';
      } else {
        list.innerHTML = selectedProducts.map(p => `
          <div class="bundle-builder__selected-item">
            <span>${p.title}</span>
            <button class="bundle-builder__remove" data-id="${p.id}">&times;</button>
          </div>
        `).join('');
      }
    });

    // Update add to cart buttons (both desktop and mobile)
    const addToCartBtns = document.querySelectorAll('.bundle-builder__add-to-cart');
    addToCartBtns.forEach(btn => {
      if (count === BUNDLE_SIZE) {
        btn.disabled = false;
        btn.textContent = 'Add 6 Templates to Cart — $99';
      } else {
        btn.disabled = true;
        btn.textContent = `Select ${BUNDLE_SIZE - count} more template${BUNDLE_SIZE - count !== 1 ? 's' : ''}`;
      }
    });

    // Add remove handlers
    document.querySelectorAll('.bundle-builder__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        selectedProducts = selectedProducts.filter(p => p.id !== id);
        const targetCard = document.querySelector(`[data-product-id="${id}"]`);
        if (targetCard) targetCard.classList.remove('selected');
        updateBundleUI();
      });
    });
  }

  // Add to cart handler for all buttons
  document.querySelectorAll('.bundle-builder__add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      if (selectedProducts.length === BUNDLE_SIZE) {
        alert('Bundle added to cart! (Connected to SlideLab Bundle API)');
      }
    });
  });
});
