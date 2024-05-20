document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
});

document.querySelector('.cart').addEventListener('click', openCart);

function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById('productContainer');
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('item');
                productItem.setAttribute('data-id', product.id);
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2 class="name">${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <button onclick="addToCart(this)">Add to Cart</button>
                `;
                productContainer.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error loading products:', error));
}

function openCart() {
    const cartTab = document.querySelector('#cartTab');
    cartTab.classList.add('open');
}

function closeCart() {
    const cartTab = document.querySelector('#cartTab');
    cartTab.classList.remove('open');
}

function addToCart(button) {
    const item = button.closest('.item');
    const productId = item.getAttribute('data-id');
    const productName = item.querySelector('.name').innerText;
    const productPrice = item.querySelector('.price').innerText;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        };
        cartItems.push(cartItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function renderCart() {
    const listCart = document.querySelector('#listCart');
    listCart.innerHTML = '';
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');
        cartItem.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.price}</p>
            <div class="quantity">
                <button onclick="decreaseQuantity('${item.id}')">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity('${item.id}')">+</button>
            </div>
        `;
        listCart.appendChild(cartItem);
    });
}

function increaseQuantity(id) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.id === id);
    item.quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function decreaseQuantity(id) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.id === id);

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cartItems = cartItems.filter(item => item.id !== id);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function showTransactionPopup() {
    const transactionModal = document.querySelector('#transactionModal');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartSummary = document.querySelector('#cartSummary');
    cartSummary.innerHTML = '';
  
    if (cartItems.length === 0) {
      cartSummary.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      let total = 0;
      cartItems.forEach(item => {
        // Check if price is a valid number before parsing
        const parsedPrice = parseFloat(item.price.replace('₱', '')) || 27000;
        const itemPrice = parsedPrice * item.quantity;
        total += itemPrice;
        cartSummary.innerHTML += `
          <div>
            <h2>${item.name}</h2>
            <p>${item.price} x ${item.quantity} = ₱${itemPrice.toFixed(2)}</p>
          </div>
        `;
      });
      cartSummary.innerHTML += `<h3>Total: ₱${total.toFixed(2)}</h3>`;
    }
  
    transactionModal.style.display = 'block';
  }
  
function closeTransactionPopup() {
    const transactionModal = document.querySelector('#transactionModal');
    transactionModal.style.display = 'none';
}

function processTransaction() {
    const contact = document.getElementById('contact').value;
    const payment = document.getElementById('payment').value;

    if (contact && payment) {
        alert('Your payment has been processed. Thank you for buying!');
        localStorage.removeItem('cartItems');
        renderCart();
        closeTransactionPopup();
        closeCart();
    } else {
        alert('Please fill in all the fields.');
    }
}

function payCart() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        alert("You don't have anything in your cart.");
    } else {
        showTransactionPopup();
    }
}

function loadCart() {
    renderCart();
}