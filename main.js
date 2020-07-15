let productSection = document.querySelector('.products')






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

    buttonsFuntionality(){
        DOMButtons = [...document.querySelectorAll('.cart-btn')]
        console.log(DOMButtons);
        DOMButtons.forEach(button => {
            button.addEventListener('click',()=>{
                console.log(button.attributes);
            })
        });
    }
}

class storage {

    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products))
    }
}


let product1 = new Products()

let ui = new UIOfProducts()

document.addEventListener("DOMContentLoaded", () => {
    product1.getProducts().then(products => {
        ui.showProducts(products)
        storage.saveProducts(products)
        ui.buttonsFuntionality()
    })


})