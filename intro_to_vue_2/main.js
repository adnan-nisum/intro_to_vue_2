// Event bus
var eventBus = new Vue()

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
            </div>

            <product-tabs :reviews="reviews"></product-tabs>

            

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
            reviews: [],
        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length"> 
                <b>Please correct the following error(s): </b>
                <ul>
                    <li v-for="error in errors"> {{error}} </li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="ratting">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
                </select>
            </p>
            
            <p>Would you recommend this product?</p>
            <label> Yes
                <input type="radio" value="Yes" v-model="recommend"/>
            </label>
            <label>
                No
                <input type="radio" value="No" v-model="recommend"/>
            </label>
                
            <p>
                <input type="submit" value="Submit">  
            </p>    
        </form>    
    `,
    data() {
        return {
            name: null,
            review: null,
            ratting: null,
            recommend: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.ratting) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    ratting: this.ratting,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null
                this.ratting = null
                this.recommend = null
            } else {
                if (!this.name) this.errors.push('Name Required')
                if (!this.review) this.errors.push('Review Required')
                if (!this.ratting) this.errors.push('Ratting Required')
                if (!this.recommend) this.errors.push('Recommendation Required')
            }
        }
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span 
                class="tab" 
                :class="{activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab"
                > {{tab}} </span>

             <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet. </p>
                <ul v-else>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>Ratting: {{review.ratting}}</p>
                        <p>{{review.review}}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a Review'"></product-review>

        </div>


    `,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})



var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})