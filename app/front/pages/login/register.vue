<template>
	<view class="box">
		<view class="title mlr-36 size-40 bold">
			注册账号
		</view>
		<view class="mlr-36 size-26 gray-2 mt-10">
			请使用手机号，快速注册
		</view>
		<view class="mlr-36 mt-40">
			<u-field v-model="tel" :trim="true" label-width="0" placeholder="请输入手机号">
				<view slot="icon" class="img-icon">
					<image src="../../static/login-phone.png" mode=""></image>
				</view>
			</u-field>
		</view>
		<view class="code mlr-36 flex">
			<view class="flex1 flex-middle">
				<view class="img-icon mr-10">
					<image src="../../static/login-code.png" mode=""></image>
				</view>
				<input type="text" v-model="code" placeholder="请输入验证码" />
			</view>
			<view class="code1 white text-center" @click="getcode">
				{{vscode}}
			</view>
		</view>
		<view class="mlr-36 mt-10">
			<u-field v-model="pwd" :trim="true" :type="open?'text':'password'" label-width="0" maxlength="16"
				placeholder="请输入6-16位密码">
				<view slot="icon" class="img-icon">
					<image src="../../static/login-pwd.png" mode=""></image>
				</view>
				<u-icon slot="right" @click="open=false" v-show="open" name="eye-fill" color="#999" size="36"></u-icon>
				<u-icon slot="right" @click="open=true" v-show="!open" name="eye-off" color="#999" size="36"></u-icon>
			</u-field>
		</view>
		<view class="mt-100 plr-36">
			<u-button type="primary" :disabled="!tel || !code || !pwd" @click="submit">立即注册</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '',
				code: '',
				pwd: '',
				vscode: '获取验证码',
				countNum: 60,
				countDownTimer: null,
				open: false,
				submitbtn: true, //防止重复点击
			}
		},
		onLoad() {

		},
		methods: {
			// 获取短信验证码
			getcode() {
				var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
				if (!myreg.test(this.tel)) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				if (this.vscode != '获取验证码' && this.vscode != '重新发送') {
					return
				}
				this.countNum = 60
				this.countDownTimer = setInterval(() => {
					if (this.countNum < 1) {
						clearInterval(this.countDownTimer)
						this.vscode = "重新发送";
						return;
					}
					this.countNum--;
					this.vscode = this.countNum + '秒重发';
				}, 1000)
				this.$http('/api/sms/send', {
					mobile: this.tel,
					event: 'register'
				}, 'POST').then(data => {
					uni.showToast({
						title: '短信已发送，请注意查收',
						icon: 'none'
					})
				})
			},
			// 提交注册
			submit() {
				if (this.submitbtn == true) {
					this.submitbtn = false
					this.$http('/addons/ddrive/user/mobilelogin', {
						mobile: this.tel,
						captcha: this.code,
						password: this.pwd,
						event: 'register',
					}, "POST").then(data => {
						console.log(data);
						this.submitbtn = true
						uni.showToast({
							title: '注册成功'
						})
						setTimeout(() => {
							uni.navigateBack({

							})
						}, 500)
					}).catch(() => {
						this.submitbtn = true
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-field {
		padding: 13px 0 !important;
	}

	/deep/.u-btn {
		height: 96rpx !important;
		border-radius: 10rpx !important;
	}

	/deep/.u-primary-hover {
		background: linear-gradient(to right, #00b6b4, #00d496) !important;
	}

	/deep/.u-btn--primary--disabled {
		background-color: $bg-1 !important;
	}

	.box {
		width: 100%;
		height: 100vh;
		background: url(../../static/login-bg.png) no-repeat;
		background-size: 100% 100%;
		overflow: hidden;

		//非小程序
		/* #ifndef MP-WEIXIN */
		.title {
			margin-top: 200rpx;
		}

		/* #endif */
		//小程序
		/* #ifdef MP-WEIXIN */
		.title {
			margin-top: 100rpx;
		}

		/* #endif */
		.img-icon {
			height: 44rpx;

			image {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.code {
			margin-top: 10rpx;
			padding-top: 14rpx;
			padding-bottom: 15rpx;
			border-bottom: 1rpx solid #f5f6f7;

			input {
				margin-left: 8rpx;
				font-size: 26rpx;
			}

			.code1 {
				width: 180rpx;
				height: 70rpx;
				font-size: 26rpx;
				line-height: 70rpx;
				background: $bg-green;
			}
		}
	}
</style>
