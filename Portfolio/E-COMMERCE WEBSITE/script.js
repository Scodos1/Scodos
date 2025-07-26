// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const productGrid = document.getElementById('product-grid');
const productModal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count');
const authBtn = document.getElementById('auth-btn');

// Authentication Elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Admin Elements
const dashboardLink = document.getElementById('dashboard-link');
const productsLink = document.getElementById('products-link');
const ordersLink = document.getElementById('orders-link');
const logoutBtn = document.getElementById('logout-btn');
const dashboardContent = document.getElementById('dashboard-content');
const productsContent = document.getElementById('products-content');
const ordersContent = document.getElementById('orders-content');
const addProductBtn = document.getElementById('add-product-btn');
const productModalAdmin = document.getElementById('product-modal-admin');
const productForm = document.getElementById('product-form');

// Data Storage
let products = JSON.parse(localStorage.getItem('products')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize default admin if no users exist
if (users.length === 0) {
    const defaultAdmin = {
        id: 1,
        name: 'Admin',
        email: 'admin@kimzfeet.com',
        password: 'admin123',
        role: 'admin'
    };
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
}

// Initialize sample products if none exist
if (products.length === 0) {
    const sampleProducts = [
        {
            id: 1,
            name: 'Classic Leather Oxford',
            price: 149.99,
            description: 'Handcrafted full-grain leather oxford shoes with cushioned insole for all-day comfort.',
            image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            stock: 50
        },
        {
            id: 2,
            name: 'Casual Canvas Sneakers',
            price: 79.99,
            description: 'Lightweight canvas sneakers with rubber sole for maximum flexibility and comfort.',
            image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            stock: 75
        },
        {
            id: 3,
            name: 'Premium Leather Loafers',
            price: 129.99,
            description: 'Sophisticated leather loafers with a sleek design perfect for business or casual wear.',
            image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            stock: 30
        },
        {
            id: 4,
            name: 'Sport Running Shoes',
            price: 99.99,
            description: 'High-performance running shoes with breathable mesh and cushioned sole for impact absorption.',
            image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            stock: 60
        }
    ];
    products = sampleProducts;
    localStorage.setItem('products', JSON.stringify(products));
}

// Update cart count display
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    if (mobileCartCount) mobileCartCount.textContent = count;
}

// Mobile menu toggle
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// Display products
function displayProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-outline view-details" data-id="${product.id}">View Details</button>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-modal-details">
                <h2>${product.name}</h2>
                <div class="product-modal-price">$${product.price.toFixed(2)}</div>
                <div class="product-modal-description">
                    ${product.description}
                </div>
                <div class="quantity-selector">
                    <button class="decrease-qty">-</button>
                    <input type="number" value="1" min="1" max="${product.stock}" class="qty-input">
                    <button class="increase-qty">+</button>
                </div>
                <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    // Quantity selector functionality
    const decreaseBtn = modalBody.querySelector('.decrease-qty');
    const increaseBtn = modalBody.querySelector('.increase-qty');
    const qtyInput = modalBody.querySelector('.qty-input');

    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let value = parseInt(qtyInput.value);
        if (value < product.stock) {
            qtyInput.value = value + 1;
        }
    });

    // Add to cart from modal
    const addToCartBtn = modalBody.querySelector('.add-to-cart-modal');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        addToCart(productId, quantity);
        productModal.style.display = 'none';
    });

    productModal.style.display = 'block';
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            price: product.price,
            name: product.name,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
        if (productModalAdmin) productModalAdmin.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
    if (productModalAdmin && e.target === productModalAdmin) {
        productModalAdmin.style.display = 'none';
    }
});

// Authentication functionality
if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginError.textContent = '';
            
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            loginError.textContent = 'Invalid email or password';
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;

        if (password !== confirm) {
            registerError.textContent = 'Passwords do not match';
            return;
        }

        if (users.some(u => u.email === email)) {
            registerError.textContent = 'Email already registered';
            return;
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            password,
            role: 'customer'
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        registerError.textContent = '';
        window.location.href = 'index.html';
    });
}

// Admin functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

if (dashboardLink && productsLink && ordersLink) {
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'block';
        productsContent.style.display = 'none';
        ordersContent.style.display = 'none';
    });

    productsLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        productsContent.style.display = 'block';
        ordersContent.style.display = 'none';
        displayAdminProducts();
    });

    ordersLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        productsContent.style.display = 'none';
        ordersContent.style.display = 'block';
        displayAllOrders();
    });
}

function displayAdminDashboard() {
    if (!dashboardContent) return;

    // Calculate stats
    const totalSales = orders.reduce((total, order) => total + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = users.filter(u => u.role === 'customer').length;

    // Update stats
    document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-customers').textContent = totalCustomers;

    // Display recent orders
    const ordersTable = document.getElementById('orders-table');
    if (ordersTable) {
        const tbody = ordersTable.querySelector('tbody');
        tbody.innerHTML = '';

        const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        recentOrders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn btn-sm view-order" data-id="${order.id}">View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function displayAdminProducts() {
    const productsTable = document.getElementById('products-table');
    if (!productsTable) return;

    const tbody = productsTable.querySelector('tbody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm edit-btn edit-product" data-id="${product.id}">Edit</button>
                <button class="btn btn-sm delete-btn delete-product" data-id="${product.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(productId);
            }
        });
    });
}

function displayAllOrders() {
    const ordersTable = document.getElementById('all-orders-table');
    if (!ordersTable) return;

    const tbody = ordersTable.querySelector('tbody');
    tbody.innerHTML = '';

    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-sm view-order" data-id="${order.id}">View</button>
                <button class="btn btn-sm edit-btn update-status" data-id="${order.id}">Update</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;

    productModalAdmin.style.display = 'block';
}

function deleteProduct(productId) {
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        document.getElementById('product-modal-title').textContent = 'Add New Product';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        productModalAdmin.style.display = 'block';
    });
}

if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const description = document.getElementById('product-description').value;
        const image = document.getElementById('product-image').value;

        if (id) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name,
                    price,
                    stock,
                    description,
                    image
                };
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({
                id: newId,
                name,
                price,
                stock,
                description,
                image
            });
        }

        localStorage.setItem('products', JSON.stringify(products));
        productModalAdmin.style.display = 'none';
        displayAdminProducts();
    });
}

// Initialize the appropriate page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    if (currentUser) {
        if (authBtn) authBtn.textContent = 'Logout';
        if (window.location.pathname.includes('auth.html')) {
            window.location.href = 'index.html';
        }
    }

    // Set up logout functionality for auth button
    if (authBtn) {
        authBtn.addEventListener('click', (e) => {
            if (currentUser) {
                e.preventDefault();
                currentUser = null;
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }

    // Display appropriate content based on page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        displayProducts();
        updateCartCount();
    } else if (window.location.pathname.includes('admin.html')) {
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'auth.html';
        } else {
            displayAdminDashboard();
        }
    }
});

// Cart Page Functionality
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="index.html#products" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="remove-item" data-index="${index}">Remove</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-selector">
                    <button class="decrease-qty" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${product.stock}" class="qty-input" data-index="${index}">
                    <button class="increase-qty" data-index="${index}">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update summary
    const shipping = subtotal > 0 ? 5.99 : 0; // Flat rate shipping
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Add event listeners
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateCartItemQuantity(index, cart[index].quantity - 1);
        });
    });

    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateCartItemQuantity(index, cart[index].quantity + 1);
        });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const newQuantity = parseInt(e.target.value);
            updateCartItemQuantity(index, newQuantity);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeCartItem(index);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!currentUser) {
                window.location.href = 'auth.html';
                return;
            }
            showCheckoutModal();
        });
    }
}

function updateCartItemQuantity(index, newQuantity) {
    const product = products.find(p => p.id === cart[index].productId);
    if (!product) return;

    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > product.stock) newQuantity = product.stock;

    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function showCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (!checkoutModal) return;

    // Pre-fill form if user is logged in
    if (currentUser) {
        document.getElementById('full-name').value = currentUser.name || '';
        document.getElementById('email').value = currentUser.email || '';
    }

    checkoutModal.style.display = 'block';

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });
    }
}

function processOrder() {
    // Create order
    const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = orderTotal > 0 ? 5.99 : 0;

    const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customerId: currentUser ? currentUser.id : null,
        customerName: document.getElementById('full-name').value,
        items: [...cart],
        subtotal: orderTotal,
        shipping: shipping,
        total: orderTotal + shipping,
        status: 'Processing',
        shippingAddress: document.getElementById('address').value,
        paymentMethod: document.getElementById('payment').value
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Update product stock
    cart.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            products[productIndex].stock -= item.quantity;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show confirmation
    document.getElementById('checkout-modal').style.display = 'none';
    const confirmationModal = document.getElementById('confirmation-modal');
    document.getElementById('order-id').textContent = `#${orderId}`;
    confirmationModal.style.display = 'block';
}

// Initialize cart page
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
    updateCartCount();
}