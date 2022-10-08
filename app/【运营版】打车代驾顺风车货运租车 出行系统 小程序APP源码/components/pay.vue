<template>
	<view>
		<u-popup v-model="show" mode="bottom" :closeable="true" @close="close">
			<view class="plr-40">
				<view class="center ptb-30">选择支付方式</view>
				<u-radio-group v-model="value">
					<u-radio name="2" class="w100 bb ptb-30">
						微信支付
					</u-radio>
					<u-radio name="1" class="w100 ptb-30">
						余额支付
					</u-radio>
				</u-radio-group>
				<view class="ptb-50">
					<u-button type="primary" @click="pay">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {baseUrl} from '../common/http.js';
	export default {
		props: ['show','money'],
		data() {
			return {
				value: 2,//1=余额，2=微信
			};
		},
		created() {
			console.log(this.money);
		},
		methods: {
			close() {
				this.$emit('close')
			},
			pay() {
				if (this.value == 1) {
					this.$http('/addons/ddrive/user/service_pay', {
						type: this.value
					}, "POST").then(data => {
						uni.showToast({
							title: '支付成功'
						})
						this.close()
						uni.$emit('money')
					})
				} else if (this.value == 2) {
					//微信支付
					this.$http('/addons/ddrive/user/service_pay', {
						type: this.value
					}, "POST").then(data => {
						console.log(data);
						let _this = this
						//data返回参数
						//{
						//	appid: "wxd5cdb23fa8a8a8a4"
						//	noncestr: "ElHzMeZUqs676yRK"
						//	package: "Sign=WXPay"
						//	partnerid: "1601210852"
						//	prepayid: "wx271544341817098433edb8b12397d20000"
						//	sign: "5E26B16FE8B6995D333F09A44A5C7EC3"
						//	timestamp: "1603784674"
						//}
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: data, //微信、支付宝订单数据
							success: function(res) {
								console.log('success:' + JSON.stringify(res));
								uni.showToast({
									title: '支付成功'
								})
								_this.close()
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					})
				}
			}
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
