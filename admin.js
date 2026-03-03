const STORAGE_KEY = 'jl-store-products';
const ADMIN_SESSION_KEY = 'jl-admin-auth';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'jlstore123';

const defaultProducts = [
  { id: 'p1', category: 'joias', name: 'Colar Aurora', description: 'Ouro 18k com ponto de luz em zircônia premium.', price: 'R$ 499,00', gradient: 'linear-gradient(135deg, #624522, #d8af74)' },
  { id: 'p2', category: 'joias', name: 'Brinco Pérola Nobre', description: 'Prata 925 com pérolas cultivadas de alto brilho.', price: 'R$ 329,00', gradient: 'linear-gradient(135deg, #8f8f95, #f7ece0)' },
  { id: 'p3', category: 'perfumes', name: 'Perfume Noir Élégance', description: 'Notas amadeiradas com toque oriental sofisticado.', price: 'R$ 289,00', gradient: 'linear-gradient(135deg, #1f1f1f, #70532f)' },
  { id: 'p5', category: 'acessorios', name: 'Óculos Glam Black', description: 'Acessório premium com acabamento sofisticado.', price: 'R$ 219,00', gradient: 'linear-gradient(135deg, #1f1f1f, #7a7a7a)' }
];

const loginSection = document.getElementById('login-section');
const panelSection = document.getElementById('panel-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const form = document.getElementById('product-form');
const tableBody = document.getElementById('products-table-body');
const cancelEditBtn = document.getElementById('cancel-edit');

const fieldId = document.getElementById('product-id');
const fieldCategory = document.getElementById('product-category');
const fieldName = document.getElementById('product-name');
const fieldDescription = document.getElementById('product-description');
const fieldPrice = document.getElementById('product-price');
const fieldGradient = document.getElementById('product-gradient');

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

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function isAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function normalizeCategory(category) {
  return category || 'joias';
}

function labelCategory(category) {
  if (category === 'perfumes') return 'Perfumes';
  if (category === 'acessorios') return 'Acessórios';
  return 'Joias';
}

function renderAuth() {
  const auth = isAuthenticated();
  loginSection.hidden = auth;
  panelSection.hidden = !auth;
  if (auth) renderProductsTable();
}

function renderProductsTable() {
  tableBody.innerHTML = loadProducts().map((product) => `
      <tr>
        <td>${labelCategory(normalizeCategory(product.category))}</td>
        <td><strong>${product.name}</strong><p>${product.description}</p></td>
        <td>${product.price}</td>
        <td class="actions">
          <button type="button" class="btn btn-small" data-action="edit" data-id="${product.id}">Editar</button>
          <button type="button" class="btn btn-small btn-light" data-action="delete" data-id="${product.id}">Excluir</button>
        </td>
      </tr>
    `).join('');
}

function resetForm() {
  fieldId.value = '';
  form.reset();
  fieldCategory.value = 'joias';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    loginError.hidden = true;
    renderAuth();
    return;
  }

  loginError.hidden = false;
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  renderAuth();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const products = loadProducts();
  const currentId = fieldId.value;

  const payload = {
    id: currentId || crypto.randomUUID(),
    category: normalizeCategory(fieldCategory.value),
    name: fieldName.value.trim(),
    description: fieldDescription.value.trim(),
    price: fieldPrice.value.trim(),
    gradient: fieldGradient.value.trim()
  };

  if (!payload.name || !payload.description || !payload.price || !payload.gradient) return;

  const nextProducts = currentId
    ? products.map((item) => (item.id === currentId ? payload : item))
    : [...products, payload];

  saveProducts(nextProducts);
  resetForm();
  renderProductsTable();
});

cancelEditBtn.addEventListener('click', resetForm);

tableBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!id) return;

  const products = loadProducts();

  if (action === 'delete') {
    saveProducts(products.filter((item) => item.id !== id));
    renderProductsTable();
    return;
  }

  if (action === 'edit') {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    fieldId.value = product.id;
    fieldCategory.value = normalizeCategory(product.category);
    fieldName.value = product.name;
    fieldDescription.value = product.description;
    fieldPrice.value = product.price;
    fieldGradient.value = product.gradient;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

renderAuth();
