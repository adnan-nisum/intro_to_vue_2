Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
    <li v-for="detail in details"> {{detail}} </li>
    </ul>
    `
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: false
        }
    },
    template: ` 
    <div class="product">
            <div class="product-image">
                <img v-bind:src="image" alt="">
            </div>

            <div class="product-info">
                <h1> {{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>


                <product-details :details="details"></product-details>


                <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                    :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
                </div>

                <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">
                    Add to Cart</button>
                <div class="cart">
                    <p>Cart ({{cart}})</p>
                </div>
            </div>
        </div>
        `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            description: 'These are my favourirte socks',
            details: ["80% Cotton", "20% polyester", "Gender_neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'Green',
                    variantImage: './assets/vmSocks-green.png',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'Blue',
                    variantImage: './assets/vmSocks-blue.png',
                    variantQuantity: 0,
                }
            ],
            cart: 0
        }
    },

    methods: {
        addToCart() {
            this.cart += 1;
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium: false
    }
})