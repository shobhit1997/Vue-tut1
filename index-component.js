
var eventBus = new Vue()
Vue.component('product-details',{
	props:{
		details:{
			type:Array,
			required:true
		}
	},
	template:`<ul>
			  <li v-for="detail in details">{{ detail }}</li>
			  </ul>`
});



Vue.component('product',{

	props:{
		premium:{
			type:Boolean,
			required:true
		}
	},

	template:`<div class="product">
				<div class="product-image">
					<img v-bind:src="image">
				</div>
				<div class="product-info">
				<h1>{{ product }}</h1>
				<p v-if="quantity > 10">In Stock!</p>
				<p v-else-if="quantity > 0 && quantity <= 10">Almost Sold Out!</p>
				<p v-else 
				:class="{outOfStock : quantity<=10}"
				>Sold Out!</p>
				<p v-show="onSale">On Sale!</p>
				<p>Shipping {{shipping}}</p>
				<product-details :details="details"></product-details>
				<h3>Variants</h3>
				<div class="color-box" 
				v-for="(variant,index) in variants"
				:key="variant.variantId"
				:style="{backgroundColor:variant.variantColor}"
				@mouseover="updateImage(index)">
				</div>
				<h3>Sizes</h3>
				<div v-for="size in sizes">
				<p>{{ size }}</p>
				</div>

				<button v-on:click="addToCart" :disabled="quantity <=0"
				:class="{disabledButton: quantity<=0}"
				>Add to Cart</button>
				<br>
				<button v-on:click="removeFromCart" v-if="cart > 0">Remove from Cart</button>
				</div>
              	<product-tabs :reviews="reviews"></product-tabs>
				</div>`,
	data (){ 
		return {
			brand:'Adidas',
			product:'Socks',
			selectedVariant: 0,
			onSale: true,
			details:['Cotton','Synthetic'],
			variants:[
			{
				variantId:656,
				variantColor:'Green',
				image : './assets/images/green-socks.jpg',
				quantity:50
			},
			{
				variantId:646,
				variantColor:'Blue',
				image:'./assets/images/blue-socks.jpg',
				quantity:0
			}
			],
			sizes:['S','M','L','XL'],
			cart:0,
			reviews: []
		}
	},
	methods:{
		addToCart:function(){
			this.cart+=1;
			this.$emit('add-to-cart');
		},
		removeFromCart(){
			this.cart-=1;
			this.$emit('remove-from-cart');
		},
		updateImage(index){
			this.selectedVariant=index;
		},
		addReview(productReview) {
          this.reviews.push(productReview)
        }
	},
	computed:{
		title(){
			return this.product+this.brand;
		},
		quantity(){
			return this.variants[this.selectedVariant].quantity;
		},
		image(){
			return this.variants[this.selectedVariant].image;
		},
		shipping(){
			if(this.premium)
				return 'free';
			else
				return 2.99;
		}

	},
	 mounted() {
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })
      }

});


Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

       <p>Would you recommend this product?</p>
        <label>
          Yes
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
        rating: null,
        recommend:null,
        errors: []
      }
    },
    methods: {
      onSubmit() {
        if(this.name && this.review && this.rating && this.recommend) {
          let productReview = {
            name: this.name,
            review: this.review,
            rating: this.rating,
            recommend:this.recommend
          }
          eventBus.$emit('review-submitted', productReview)
          this.name = null
          this.review = null
          this.rating = null
          this.recommend=null
        } else {
          if(!this.name) this.errors.push("Name required.")
          if(!this.review) this.errors.push("Review required.")
          if(!this.rating) this.errors.push("Rating required.")
          if(!this.recommend) this.error.push("Recommendation required");
        }
      }
    }
  });


Vue.component('product-tabs', {
    props: {
      reviews: {
        type: Array,
        required: false
      }
    },
    template: `
      <div>
      
        <div>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
          >{{ tab }}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="review in reviews">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
    
      </div>
    `,
    data() {
      return {
        tabs: ['Reviews', 'Make a Review'],
        selectedTab: 'Reviews'
      }
    }
  })



var app=new Vue({
	el :'#app',
	data:{
		premium:true,
		cart:0
	},
	methods:{
		addToCart(){
			this.cart+=1;
		},
		removeFromCart(){
			this.cart-=1;
		}
	}

})