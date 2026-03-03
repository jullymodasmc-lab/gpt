const STORAGE_KEY = 'jl-store-products';
const CART_KEY = 'jl-store-cart';
const WHATSAPP_NUMBER = '5549999740039';

const defaultProducts = [
  { id: 'p1', category: 'joias', name: 'Colar Aurora', description: 'Ouro 18k com ponto de luz em zircônia premium.', price: 'R$ 499,00', gradient: 'linear-gradient(135deg, #624522, #d8af74)' },
  { id: 'p2', category: 'joias', name: 'Brinco Pérola Nobre', description: 'Prata 925 com pérolas cultivadas de alto brilho.', price: 'R$ 329,00', gradient: 'linear-gradient(135deg, #8f8f95, #f7ece0)' },
  { id: 'p3', category: 'perfumes', name: 'Perfume Noir Élégance', description: 'Notas amadeiradas com toque oriental sofisticado.', price: 'R$ 289,00', gradient: 'linear-gradient(135deg, #1f1f1f, #70532f)' },
  { id: 'p4', category: 'perfumes', name: 'Perfume Lumière Rose', description: 'Fragrância floral marcante e elegante para noite.', price: 'R$ 259,00', gradient: 'linear-gradient(135deg, #5a2c45, #d29ab0)' },
  { id: 'p5', category: 'acessorios', name: 'Óculos Glam Black', description: 'Acessório premium com acabamento sofisticado.', price: 'R$ 219,00', gradient: 'linear-gradient(135deg, #1f1f1f, #7a7a7a)' },
  { id: 'p6', category: 'acessorios', name: 'Bolsa Mini Elegance', description: 'Bolsa compacta com design moderno e luxuoso.', price: 'R$ 279,00', gradient: 'linear-gradient(135deg, #3d2d24, #a48166)' }
];

const grid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutWhatsapp = document.getElementById('checkout-whatsapp');
const clearCart = document.getElementById('clear-cart');
const tabButtons = document.querySelectorAll('.tab-btn');

let activeCategory = 'joias';

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function priceToNumber(price) {
  return Number(price.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

function toBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function normalizeCategory(category) {
  return category || 'joias';
}

function renderProducts() {
  const products = loadProducts().filter((product) => normalizeCategory(product.category) === activeCategory);

  if (!products.length) {
    grid.innerHTML = '<p>Nenhum produto nesta categoria ainda.</p>';
    return;
  }

  grid.innerHTML = products.map((product) => `
      <article class="card">
        <div class="thumb" style="background-image: ${product.gradient}" role="img" aria-label="${product.name}"></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong>${product.price}</strong>
        <button class="btn btn-add-cart" data-id="${product.id}" type="button">Adicionar ao carrinho</button>
      </article>
    `).join('');
}

function renderCart() {
  const cart = loadCart();
  if (!cart.length) {
    cartItems.innerHTML = '<li>Seu carrinho está vazio.</li>';
    cartTotal.textContent = 'R$ 0,00';
    checkoutWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    return;
  }

  cartItems.innerHTML = cart
    .map((item, index) => `<li>${item.name} — ${item.price} <button type="button" class="btn btn-small btn-light" data-remove-index="${index}">Remover</button></li>`)
    .join('');

  const total = cart.reduce((sum, item) => sum + priceToNumber(item.price), 0);
  cartTotal.textContent = toBRL(total);

  const orderLines = cart.map((item) => `• ${item.name} - ${item.price}`).join('\n');
  const message = encodeURIComponent(`Olá! Quero finalizar este pedido da JL STORE:\n${orderLines}\n\nTotal: ${toBRL(total)}`);
  checkoutWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category || 'joias';
    tabButtons.forEach((tab) => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-selected', String(tab === button));
    });
    renderProducts();
  });
});

grid.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const productId = target.dataset.id;
  if (!productId) return;

  const product = loadProducts().find((item) => item.id === productId);
  if (!product) return;

  const cart = loadCart();
  cart.push({ name: product.name, price: product.price });
  saveCart(cart);
  renderCart();
});

cartItems.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const index = Number(target.dataset.removeIndex);
  if (Number.isNaN(index)) return;

  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
});

clearCart.addEventListener('click', () => {
  saveCart([]);
  renderCart();
});

renderProducts();
renderCart();
