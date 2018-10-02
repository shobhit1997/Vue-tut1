var app=new Vue({
	el :'#app',
	data : {
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
		cart:0
	},
	methods:{
		addToCart:function(){
			this.cart+=1;
		},
		removeFromCart(){
			this.cart-=1;
		},
		updateImage(index){
			this.selectedVariant=index;
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
		}

	}

})