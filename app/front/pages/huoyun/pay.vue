<template>
	<view class="box">
		<view class="mt-85 text-center size-26">
			<text class="mr-10">支付剩余时间</text>
			<u-count-down :timestamp="time" font-size="26"></u-count-down>
		</view>
		<view class="yellow bold mt-15 text-center">
			<text>￥</text>
			<text class="size-40">{{price}}</text>
		</view>
		<view class="bg-white pt-30 mt-80">
			<view class="size-34 bold plr-36 mb-20">
				支付方式
			</view>
			<view class="plr-36">
				<u-radio-group v-model="value" active-color="#00C28E">
					<u-radio name="1" class="w100 bb ptb-30">
						<view class="flex_l">
							<image style="width: 55rpx;height: 55rpx; margin-right: 20rpx;" src="../../static/wx.png" mode=""></image>
							微信支付
						</view>
					</u-radio>
					<!-- #ifdef APP-PLUS -->
					<u-radio name="2" class="w100 ptb-30">
						<view class="flex_l">
							<image style="width: 55rpx;height: 55rpx; margin-right: 20rpx;" src="../../static/zfb.png" mode=""></image>
							支付宝支付
						</view>
					</u-radio>
					<!-- #endif -->
					<!-- <u-radio name="3" class="w100 ptb-30">
						<view class="flex_l">
							<image style="width: 55rpx;height: 55rpx; margin-right: 20rpx;" src="../../static/wallet.png" mode=""></image>
							余额支付
						</view>
					</u-radio> -->
				</u-radio-group>
			</view>
		</view>
		<view class="fixed-bottom pd-36">
			<u-button type="primary" >社区版无支付功能，如需商业版请联系作者</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				order_id: '',
				coupon_id:'',
				price: '',
				time: 0,
				value: 1,
				code: '',
			};
		},
		computed: {
			...mapState(['url'])
		},
		onLoad(option) {
			this.order_id = option.id
			this.coupon_id = option.coupon_id
			this.init()
			// #ifdef H5
			console.log(location.href);
			// 回调回来接收code，然后调取支付
			if (location.href.includes('code')) {
				this.code = location.href.split('?')[1].split('&')[0].split('=')[1]
				this.payAPI()
			} else {
				this.$store.commit('getUrl', encodeURIComponent(location.href))
			}
			// #endif
		},
		methods: {
			init() {
				this.$http('/addons/ddrive/hyorder/info', {
					order_id: this.order_id
				}).then(data => {
					this.price = data.discount_price
					this.time = data.createtime + 15 * 60 - (new Date()).getTime() / 1000
				})
			},

			payAPI(query='') {
				this.$http('/addons/ddrive/hyorder/driver_pay', {
					order_id: this.order_id,
					coupon_id:this.coupon_id,
					// #ifdef APP-PLUS
					method: 'app',
					type: query?query:'user_wechat',
					// #endif
					// #ifdef MP-WEIXIN
					type: 'mini_wechat',
					code: this.code,
					method:'miniapp',
					// #endif
					// #ifdef H5
					method: 'mp',
					code: this.code,
					// #endif
				}, "POST").then(data => {
					console.log('支付参数1', data, this.value);
					//{
					//	appid: "wxd5cdb23fa8a8a8a4"
					//	noncestr: "ElHzMeZUqs676yRK"
					//	package: "Sign=WXPay"
					//	partnerid: "1601210852"
					//	prepayid: "wx271544341817098433edb8b12397d20000"
					//	sign: "5E26B16FE8B6995D333F09A44A5C7EC3"
					//	timestamp: "1603784674"
					//}
					// 调取支付接口获取支付参数
					// 1、余额支付直接支付成功
					// 2、微信支付：则判断支付环境，分别走app支付、小程序支付和H5支付
					// 3、支付宝支付：走app支付
					if (this.value == 3) {
						uni.showToast({
							title: '支付成功'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/home/pay-success'
							})
						}, 1000)
					} else if (this.value == 1) {
						// #ifdef APP-PLUS
						console.log(999999);
						let _this = this
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: data, //微信、支付宝订单数据
							success: function(res) {
								console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/huoyun/order-detail?id=' + _this.order_id
									})
								}, 1000)
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
								uni.showToast({
									title: '支付失败，请重新支付',
									icon: 'none'
								})
							}
						});
						// #endif
						// #ifdef MP-WEIXIN
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(res) {
								console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/huoyun/order-detail?id=' + _this.order_id
									})
								}, 1000)
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
								uni.showToast({
									title: '支付失败，请重新支付',
									icon: 'none'
								})
							}
						});
						// #endif
						// #ifdef H5
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								appId: data.appId, //公众号名称，由商户传入
								nonceStr: data.nonceStr, //随机串
								package: data.package,
								signType: data.signType, //微信签名方式：
								timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
								paySign: data.paySign //微信签名
							},
							function(res) {
								if (res.err_msg == "get_brand_wcpay_request:ok") {
									// 使用以上方式判断前端返回,微信团队郑重提示：
									//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									uni.showToast({
										title: '支付成功'
									})
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/huoyun/order-detail?id=' + _this.order_id
										})
									}, 1000)
								} else {
									uni.showToast({
										title: '支付失败，请重新支付',
										icon: 'none'
									})
								}
							});
						// #endif
					} else if (this.value == 2) {
						// #ifdef APP-PLUS
						let _this = this
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: data, //微信、支付宝订单数据
							success: function(res) {
								console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title: '支付成功'
								})
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/huoyun/order-detail?id=' + _this.order_id
									})
								}, 1000)
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
								uni.showToast({
									title: '支付失败，请重新支付',
									icon: 'none'
								})
							}
						});
						// #endif
					}
				})
			},
			radioChange(e) {
				this.value = e.detail.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	/deep/.u-radio {
		display: flex;
		flex-direction: row-reverse;
	}

	/deep/.u-radio-group {
		width: 100% !important;
	}

	/deep/.u-radio__label {
		width: 100%;
	}
</style>
