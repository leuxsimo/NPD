document.addEventListener('DOMContentLoaded', function() {
  const BUNDLE_SIZE = 6;
  const BUNDLE_PRICE = 99;
  const INDIVIDUAL_PRICE = 29;
  
  const productCards = document.querySelectorAll('.bundle-product-card');
  const selectedList = document.querySelector('.bundle-builder__selected-list');
  const progressFill = document.querySelector('.bundle-builder__progress-fill');
  const progressText = document.querySelector('.bundle-builder__progress-text');
  const originalAmount = document.querySelector('.bundle-builder__original-amount');
  const discountedAmount = document.querySelector('.bundle-builder__discounted-amount');
  const savingsAmount = document.querySelector('.bundle-builder__savings-amount');
  const addToCartBtn = document.querySelector('.bundle-builder__add-to-cart');
  
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
    
    // Update pricing
    if (originalAmount) originalAmount.textContent = '$' + totalPrice.toFixed(2);
    if (discountedAmount) discountedAmount.textContent = count === BUNDLE_SIZE ? '$' + BUNDLE_PRICE.toFixed(2) : '$0.00';
    if (savingsAmount) savingsAmount.textContent = '$' + savings.toFixed(2);
    
    // Update selected list
    if (selectedList) {
      if (count === 0) {
        selectedList.innerHTML = '<p class="bundle-builder__empty-message">Select 6 templates to build your bundle</p>';
      } else {
        selectedList.innerHTML = selectedProducts.map(p => `
          <div class="bundle-builder__selected-item">
            <span>${p.title}</span>
            <button class="bundle-builder__remove" data-id="${p.id}" type="button">&times;</button>
          </div>
        `).join('');
        
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
    }
    
    // Enable/disable button
    if (addToCartBtn) {
      if (count === BUNDLE_SIZE) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Add 6 Templates to Cart — $99';
      } else {
        addToCartBtn.disabled = true;
        const remaining = BUNDLE_SIZE - count;
        addToCartBtn.textContent = `Select ${remaining} more template${remaining !== 1 ? 's' : ''}`;
      }
    }
  }
  
  // Add to cart handler
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (selectedProducts.length === BUNDLE_SIZE) {
        alert('Bundle added to cart! (Connected to SlideLab Bundle API)');
      }
    });
  }
});
