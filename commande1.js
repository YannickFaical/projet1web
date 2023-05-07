// Récupération des éléments du DOM
const quantityInput = document.getElementById('quantity');
const priceElement = document.querySelector('.price');
const totalElement = document.querySelector('.total');

// Calcul du prix total en temps réel
quantityInput.addEventListener('input', () => {
  const quantity = quantityInput.value;
  const price = parseInt(priceElement.innerText);
  const total = quantity * price;
  totalElement.innerText = total;
});
