<template>
	<view class="bg-white w100 plr-36 pt-50 pb-60" style="box-shadow: 0px 0px 13px 0px rgba(18, 0, 98, 0.2);">
		<view class="size-36 bold">{{info.status==0?'排队中...':'订单已超时'}}</view>
		<view class="mt-10 mb-30">{{info.status==0?'司机马上接单了，请耐心等待...':'抱歉，当前暂无司机接单'}}</view>
		<!-- 按钮 -->
		<!-- status ，-2超时 0=呼叫中-->
		<view class="flex" v-if="info.status==0">
			<view class="gray-2 ptb-15 u-flex-1 center mr-30" style="border:1rpx solid #999;" @click="cancle">取消订单</view>
			<view class="green ptb-15 u-flex-1 center" style="border:1rpx solid #00C28E;" @click="toHome">再叫一位</view>
		</view>
		<view class="flex" v-if="info.status==-2">
			<view class="gray-2 ptb-15 u-flex-1 center mr-30" style="border:1rpx solid #999;" @click="toHome">更改地址</view>
			<view class="green ptb-15 u-flex-1 center" style="border:1rpx solid #00C28E;" @click="hujiao">重新呼叫</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object //-2超时 0=呼叫中
			},
			huoyun:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
			};
		},
		mounted() {
		},
		methods: {
			toHome() {
				uni.reLaunch({
					url: '/pages/home/index'
				})
			},
			// 取消
			cancle() {
				if(this.huoyun){
					uni.navigateTo({
						url:'/pages/huoyun/cancle-order?id='+this.info.id
					})
				}else{
					this.$http('/addons/ddrive/order/cancel', {
						order_id: this.info.id
					}, "POST").then(() => {
						this.$emit('update')
					})
				}
			},
			// 重新下单
			hujiao() {
				this.$http('/addons/ddrive/order/again', {
					order_id: this.info.id
				}, "POST").then(() => {
					this.$emit('init')
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
