<template>
	<view class="">
		<view class="my-header">
			<view class="status_bar" :style="'height:'+height+'px;'"></view>
			<view class="flex size-36 white plr-36 ptb-20">
				<view class="" style="width: 40rpx;" @click="back">
					<u-icon name="arrow-left" size="40"></u-icon>
				</view>
				<view class="">
					个人中心
				</view>
				<view class="" style="width: 40rpx;"></view>
			</view>
		</view>
		<view class="my-card mlr-36 radius-10">
			<view class="img-pic text-center">
				<image src="../../static/siji.png" mode=""></image>
			</view>
			<view class="text-center">
				{{!token?'':userInfo.nickname?userInfo.nickname:userInfo.wx_name}}
			</view>
			<view class="flex1 mt-20">
				<view class="text-center" style="width: 33.333%;" v-if="hasDJ">
					<navigator hover-class="none" url="/pages/my/order/dj-order">
						<view class="img-nav">
							<image src="../../static/my-daijia.png" mode=""></image>
						</view>
						<view class="size-26">
							代驾单
						</view>
					</navigator>
				</view>
				<view class="text-center" style="width: 33.333%;" v-if="hasSF">
					<navigator hover-class="none" url="/pages/shunfeng/order-list">
						<view class="img-nav">
							<image src="../../static/my-sf.png" mode=""></image>
						</view>
						<view class="size-26">
							顺风单
						</view>
					</navigator>
				</view>
				<view class="text-center" style="width: 33.333%;" v-if="hasHY">
					<navigator hover-class="none" url="/pages/huoyun/order">
						<view class="img-nav">
							<image src="../../static/my-hy.png" mode=""></image>
						</view>
						<view class="size-26">
							货运单
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="mt-40">
			<u-cell-item title="安全中心" @click="goSecurity">
				<view slot="icon" class="img-icon mr-20">
					<image src="../../static/my-security.png" mode=""></image>
				</view>
			</u-cell-item>
		</view>
		<u-cell-item title="实名认证" @click="goIDcard">
			<view slot="icon" class="img-icon mr-20">
				<image src="../../static/my-IDcard.png" mode=""></image>
			</view>
		</u-cell-item>
		<u-cell-item title="优惠券" @click="goCoupon">
			<view slot="icon" class="img-icon mr-20">
				<image src="../../static/my-coupon.png" mode=""></image>
			</view>
		</u-cell-item>
		<u-cell-item title="投诉进度" @click="goPro">
			<view slot="icon" class="img-icon mr-20">
				<image src="../../static/my-complaints.png" mode=""></image>
			</view>
		</u-cell-item>
		<u-cell-item title="联系客服" @click="call">
			<view slot="icon" class="img-icon mr-20">
				<image src="../../static/my-customer.png" mode=""></image>
			</view>
		</u-cell-item>
		<u-cell-item title="设置" @click="goSet">
			<view slot="icon" class="img-icon mr-20">
				<image src="../../static/my-set.png" mode=""></image>
			</view>
		</u-cell-item>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				fee: '', //平台服务费
				income: '', //累计收入
				money: '', //可提现金额
				today_money: '', //今日收入
				IDcard: '未认证',
				Driver: '未认证',
				Owner: '',
				show: false, //支付
				show1: true,
			}
		},
		computed: {
			...mapState(['userInfo', 'token', 'height', 'tabList']),
			hasSF() {
				let a = false
				this.tabList.forEach(item => {
					if (item.id == 1) a = true
				})
				return a
			},
			hasDJ() {
				let a = false
				this.tabList.forEach(item => {
					if (item.id == 0) a = true
				})
				return a
			},
			hasHY() {
				let a = false
				this.tabList.forEach(item => {
					if (item.id == 2) a = true
				})
				return a
			},
		},
		onShow() {

		},
		methods: {
			back() {
				uni.navigateBack({

				})
			},
			//安全中心
			goSecurity(){
				uni.navigateTo({
					url:'/pages/home/security'
				})
			},
			//实名认证
			goIDcard() { 
				if (this.userInfo.real_verified == 0 || this.userInfo.real_verified == -1) {
					uni.navigateTo({
						url: '/pages/my/IDcard'
					})
				} else if (this.userInfo.real_verified == 2) {
					uni.showToast({
						title: '审核中，请耐心等待..',
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '/pages/my/IDcard-success'
					})
				}
			},
			//优惠券
			goCoupon(){
				uni.navigateTo({
					url:'/pages/my/coupon/index'
				})
			},
			//投诉进度
			goPro() {
				uni.navigateTo({
					url: '/pages/my/complaints/progress'
				})
			},
			//联系客服
			call() {
				this.$http('/addons/ddrive/user/consumer_hotline', {}, "POST").then(data => {
					uni.makePhoneCall({
						phoneNumber: data.tel //仅为示例
					});
				})
			},
			//设置
			goSet() { 
				uni.navigateTo({
					url: '/pages/my/set/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my-header {
		height: 318rpx;
		background: url(../../static/my-bg.png) no-repeat;
		background-size: 100% 100%;
	}

	.my-card {
		height: 320rpx;
		margin-top: -85rpx;
		background: linear-gradient(#43D0C3, #E2FAF5, #F7FFFD);
		box-shadow: 4px 4px 12px 0px rgba(124, 122, 122, 0.35);

		.img-pic {
			image {
				width: 150rpx;
				height: 150rpx;
				margin-top: -65rpx;
			}
		}

		.img-nav {
			image {
				width: 90rpx;
				height: 90rpx;
			}
		}
	}

	.img-icon {
		height: 46rpx;

		image {
			width: 46rpx;
			height: 46rpx;
		}
	}
</style>
