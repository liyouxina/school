<template>
	<view class="bg w100 min100 pt-1">
		<empty v-if="list.length==0" text="暂无优惠券"></empty>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sf_type:'',
				id:'',
				list:[],
				price:''
			}
		},
		onLoad(option) {
			this.sf_type = option.sf_type
			this.id = option.id
			this.price = option.price
			this.init()
		},
		methods: {
			init(){
				
			},
			useCoupon(status,id,p){
				if(status==0) return
				uni.$emit("coupon",{id:id,price:p})
				uni.navigateBack({
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-top{
	  border-bottom: 1rpx dashed #d8d8d8;
	  position: relative;
	 }
	 .list-top::before{
	  position: absolute;
	  content: "";
	  width: 52rpx;
	  height: 52rpx;
	  border-radius: 50%;
	  background: #f8f8f8;
	  left: -26rpx;
	  bottom: -26rpx;
	 }
	 .list-top::after{
	  position: absolute;
	  content: "";
	  width: 52rpx;
	  height: 52rpx;
	  border-radius: 50%;
	  background: #f8f8f8;
	  right: -26rpx;
	  bottom: -26rpx;
	 }
</style>
