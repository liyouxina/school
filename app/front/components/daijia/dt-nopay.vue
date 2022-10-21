<template>
	<view class="">
		<u-popup v-model="show" mode="bottom" :closeable="true" @close="close">
			<view class="">
				<view class="plr-40 center ptb-30 bb">待支付金额</view>
				<view class="plr-40 mt-30">
					<view class="size-36 bold">
						您有一笔待支付订单
					</view>
					<view class="mt-5">
						您有一笔订单未支付，请支付后再叫车吧。
					</view>
				</view>
				<view class="ptb-50">
					<u-button type="primary" @click="submit">去支付</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		props: ['show'],
		data(){
			return{
				
			}
		},
		methods:{
			close() {
				this.$emit('close')
			},
			submit(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
</style>
