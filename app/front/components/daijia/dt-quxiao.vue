<template>
	<view class="w100 bg-white pb-40" style="border-radius: 10rpx 10rpx 0 0;">
		<view class="flex plr-36 pt-30 ">
			<view class="size-36 bold">
				订单取消成功
			</view>
			<view v-if="huoyun&&info.pay_method==1" class="blue" @click="toRefund">查看退款详情<u-icon name="arrow-right ml-10"></u-icon></view>
		</view>
		<view class="plr-36 pb-20 mt-10 bb">
			订单已取消，您可以重新呼叫
		</view>
		<view class="plr-36 pt-30 flex1 flex-middle">
			<u-icon name="clock" size="40" color="#999"></u-icon>
			<text class="ml-20">{{info.createtime|formatDate(1)}}</text>
		</view>
		<view class="plr-36 pt-30 flex1 flex-middle">
			<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
			<text class="ml-20">{{info.start}}</text>
		</view>
		<view v-if="!huoyun" class="plr-36 pt-30 flex1 flex-middle">
			<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
			<text class="ml-20">{{info.end}}</text>
		</view>
		<view v-else v-for="(item,i) in info.shaddress" :key="i" class="plr-36 pt-30 flex1 flex-middle">
			<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
			<text class="ml-20">{{item.end}}</text>
		</view>
		<view class="mlr-36 mt-50 change-green white text-center size-32" style="height: 96rpx;line-height: 96rpx;" @click="submit">
			重新叫车
		</view>
	</view>
</template>

<script>
	export default {
		props: ['info',"huoyun",'refund_id'], //-1取消
		data() {
			return {
				value: ''
			}
		},
		methods: {
			toRefund(){
				console.log(this.info);
				uni.navigateTo({
					url:'/pages/huoyun/refund-detail?id='+this.refund_id
				})
			},
			submit(){
				uni.reLaunch({
					url: '/pages/home/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background-color: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	/deep/.u-radio {
		display: flex;
		flex-direction: row-reverse;
	}
	
	/deep/.u-radio__label {
		margin-left: 0;
		margin-right: 0;
	}

	.img {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
