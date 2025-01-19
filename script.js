const productList = document.getElementById('product-list');
const categorySelect = document.getElementById('category-select');
const pageSize = 6;
let currentPage = 1;
let selectedCategory = 'all';

async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
    }
}

async function fetchProducts() {
    try {
        let url = `https://fakestoreapi.com/products?limit=${pageSize}&page=${currentPage}`;
        if (selectedCategory !== 'all') {
            url += `&category=${selectedCategory}`;
        }
        const response = await fetch(url);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

function renderProducts(products) {
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('col-md-4', 'mb-4', 'product-item');

        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3>${product.title}</h3>
            <p>Цена: $${product.price}</p>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Удалить товар</button>
        `;

        productList.appendChild(productItem);
    });
}


function displayProduct(product) {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';

    productItem.innerHTML = `
        <img src="${product.image}" class="product-image" alt="${product.title}">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">₽${product.price.toFixed(2)}</p>
        <button class="btn btn-info">Добавить в корзину</button>
    `;

    productList.appendChild(productItem);
}

async function addProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        image: "https://via.placeholder.com/150" 
    };

    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        if (response.ok) {
            alert('Товар успешно добавлен.');
            productList.innerHTML = '';
            currentPage = 1;
            fetchProducts();
        }
    } catch (error) {
        alert('Ошибка при добавлении товара: ' + error.message);
    }
}

async function deleteProduct(id) {
    try {
        await fetch(`https://fakestoreapi.com/products/${id}`, { method: 'DELETE' });
        alert('Товар успешно удален.');
        productList.innerHTML = '';
        currentPage = 1;
        fetchProducts();
    } catch (error) {
        alert('Ошибка при удалении товара: ' + error.message);
    }
}

function filterProducts() {
    selectedCategory = categorySelect.value;
    productList.innerHTML = '';
    currentPage = 1;
    fetchProducts();
}

function loadMore() {
    currentPage++;
    fetchProducts();
}


window.onload = function() {
    fetchCategories();
    fetchProducts();
};


