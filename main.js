let productSection = document.querySelector('.products')

let cartSideBar = document.querySelector(".cart-sidebar")

let cartIcon = document.querySelector('.cart');

let cartClose = document.querySelector('.head-close-cart .fa-times');

let cartClearBtn = document.querySelector('.cart-clear-btn');

let totalCartAmount = document.querySelector('.total-amount')

let count = document.querySelector('.count')

let cartItemsContainer = document.querySelector('.cart-items')

let menuContent = document.querySelector('.menu-content');

let menu = document.querySelector('.menu')

let closeSideMenuVar = document.querySelector('.menu-content .for-left-margin .menu-heading i');

let sideMenuIcon = document.querySelector('.side-menu-icon')

let cart = [];
let DOMButtons = [];



class Products {

    async getProducts() {
        try {
            let productsObject = await fetch('products.json')
            let result = await productsObject.json();
            let products = result.items
            let arr = products.map((product) => {
                let {
                    title,
                    price
                } = product.fields
                let {
                    id
                } = product.sys
                let image = product.fields.image.fields.file.url
                return {
                    title,
                    price,
                    id,
                    image
                }
            })

            return arr

        } catch (error) {
            console.log(error)
        }

    }

}

class UIOfProducts {

    showProducts(products) {
        let html = ""
        for (const product of products) {
            html += `<div class="single-product" data-id=${product.id}>
                        <div class="image">

                            <img src="${product.image}" alt="product-${Number(product.id)}">
                            <h3><i class="fa fa-shopping-cart"></i> <span class="cart-btn" data-id=${product.id}>add to cart</span></h3>
                        </div>
                        <h2>${product.title}</h2>
                        <h4>$ ${product.price}</h4>
		            </div>`


        }

        productSection.innerHTML = html
    }

    buttonsFuntionality() {
        DOMButtons = [...document.querySelectorAll('.cart-btn')];
        DOMButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let id = event.currentTarget.dataset.id;

                let inCart = cart.find(item => item.id === id)
                if (inCart) {
                    event.currentTarget.innerText = 'in cart';
                    event.currentTarget.setAttribute('disabled', true);
                } else {
                    event.currentTarget.innerText = 'in cart';
                    event.currentTarget.setAttribute('disabled', true);
                    let cartItem = {
                        ...storage.getProducts()[id - 1],
                        amount: 1
                    }
                    cart.push(cartItem);
                    // Storeing items/products that are present in cart to setup cart when we reload
                    storage.saveInCartItems(cart);
                    // Setting cart values i.e amount ,number of items
                    this.setCartValues(cart);
                    // Add that item to cart which we have just clicked
                    this.addCartItem(cartItem);

                }
            })
        });
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let cartCount = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount
            cartCount += item.amount
        })
        totalCartAmount.innerText = '$' + parseFloat(tempTotal.toFixed(2))
        count.innerText = cartCount
    }

    addCartItem(item) {
        let div = document.createElement('div')
        div.classList.add('cart-items-parent')

        div.innerHTML = `<div class="cart-image">
                                <img src=${item.image} alt="Products-${item.id}">
                            </div>
                            <div class="title-remove">
                                <h4>${item.title}</h4>
                                <span class="price">$${item.price}</span>
                                <span class="remove-item" data-id=${item.id}>remove</span>
                            </div>
                            <div class="arrows-amount">
                                <i class="fa fa-caret-up" data-id=${item.id}></i>
                                <span class="item-amount">${item.amount}</span>
                                <i class="fa fa-caret-down" data-id=${item.id}></i>
                        </div>`

        cartItemsContainer.appendChild(div)
    }

    showCart() {
        cartSideBar.classList.add('cart-sidebar-open');
    }

    setUpUI() {
        // debugger
        cart = [...storage.getInCartItems()]
        this.setCartValues(cart);
        this.fillCart(cart)
        cartIcon.addEventListener('click', this.showCart)
        cartClose.addEventListener("click", this.hideCart)
        this.buttonsFuntionality()
        let productItems = [...document.querySelectorAll('.single-product')]
        cart.forEach((element, ind) => {
            productItems.forEach(item => {
                if (element.id === item.getAttribute('data-id')) {
                    let cartAddBtn = item.firstElementChild.lastElementChild.lastElementChild
                    cartAddBtn.innerText = 'in cart'
                    cartAddBtn.setAttribute('disabled', true)
                }
            });
        });
    }

    fillCart(cart) {
        cart.forEach(item => this.addCartItem(item))
    }

    hideCart() {
        cartSideBar.classList.remove('cart-sidebar-open')
    }

    cartLogic() {
        cartClearBtn.addEventListener('click', () => {
            this.clearCart();
        })
        // For adding funtionality to inc or dec or remove a specific item we can do it by two ways
        // 1.By adding separate event listners to all three elements 
        // 2.By adding event listner to parent of all items in cart and targeting inc or dec or remove 
        // elements by "event" argument e.g. event.current.
        cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-item")) {
                let id = e.target.dataset.id;
                let removeItem = e.target;
                removeItem.parentElement.parentElement.remove();
                this.removeItem(id);
            } else if (e.target.classList.contains('fa-caret-up')) {
                let id = e.target.dataset.id;
                let incAmount = cart.find(item => item.id === id);
                incAmount.amount += 1;
                storage.saveInCartItems(cart);
                ui.setCartValues(cart);
                e.target.nextElementSibling.innerText = incAmount.amount;
            } else if (e.target.classList.contains('fa-caret-down')) {
                let id = e.target.dataset.id;
                let decAmount = cart.find(item => item.id === id);
                console.log(typeof decAmount.amount);
                if (decAmount.amount > 1) {
                    decAmount.amount -= 1;
                    storage.saveInCartItems(cart);
                    ui.setCartValues(cart);
                    e.target.previousElementSibling.innerText = decAmount.amount;
                }
            }
        })
    }

    clearCart() {
        let cartItems = cart.map(item => item.id)

        cartItems.forEach(id => this.removeItem(id))
        while (cartItemsContainer.children.length > 0) {
            cartItemsContainer.removeChild(cartItemsContainer.firstChild)
        }
        this.hideCart()
    }

    removeItem(id) {

        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        storage.saveInCartItems(cart);
        let singleButton = DOMButtons[id - 1];
        singleButton.innerText = 'add to cart';
        singleButton.setAttribute('disabled', false);

    }

// -----------Open/Close Menu Functionality----------

    openSideMenu = function () {
        menuContent.classList.add('open-side-menu');
        sideMenuIcon.classList.remove('side-menu-icon-show');
    }

    closeSideMenu = function () {
        menuContent.classList.remove('open-side-menu');
        sideMenuIcon.classList.add('side-menu-icon-show');
    }
// -----------Open/Close Menu Functionality Ends----------

}

class storage {

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products))
    }
    static getProducts() {
        return JSON.parse(localStorage.getItem('products'))
    }
    static saveInCartItems(cart) {
        localStorage.setItem('items', JSON.stringify(cart))
    }
    static getInCartItems() {
        return localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    }
}


let product1 = new Products()

let ui = new UIOfProducts()

document.addEventListener("DOMContentLoaded", () => {


    product1.getProducts().then(products => {
        ui.showProducts(products);
        storage.saveProducts(products);
        ui.setUpUI();
    }).then(() => {
        ui.buttonsFuntionality();
        ui.cartLogic();
        // For Side Menu Bar
        menu.addEventListener('click', ui.openSideMenu);
        closeSideMenuVar.addEventListener('click', ui.closeSideMenu)

        // For Side Menu Icon Bar
        sideMenuIcon.addEventListener('click',ui.openSideMenu);
    });


})

