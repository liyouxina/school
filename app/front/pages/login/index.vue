<template>
	<view class="box">
		<view class="title mlr-36 size-40 bold">
			{{type==1?'账号登录':'验证码登录'}}
		</view>
		<!-- <view class="mlr-36 size-26 gray-2 mt-10">
			{{type==1?'如账号未设置密码，请使用验证码登录方式':'请使用手机号，快速登录'}}
		</view> -->
		<view class="mlr-36 mt-40">
			<u-field v-model="tel" :trim="true" label-width="0" placeholder="请输入手机号">
				<view slot="icon" class="img-icon">
					<image src="../../static/login-phone.png" mode=""></image>
				</view>
			</u-field>
		</view>
		<view class="code mlr-36 flex" v-if="type==2">
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
			<u-field v-model="pwd" v-if="type==1" :trim="true" :type="open?'text':'password'" label-width="0"
				maxlength="16" placeholder="请输入密码">
				<view slot="icon" class="img-icon">
					<image src="../../static/login-pwd.png" mode=""></image>
				</view>
				<u-icon slot="right" @click="open=false" v-show="open" name="eye-fill" color="#999" size="36"></u-icon>
				<u-icon slot="right" @click="open=true" v-show="!open" name="eye-off" color="#999" size="36"></u-icon>
			</u-field>
		</view>
		<view class="mlr-36 text-right size-26 gray-2 mt-30" v-if="type==1" @click="goForget">
			忘记密码?
		</view>
		<view class="mt-60 plr-36">
			<u-button type="primary" :disabled="!tel || (!pwd && !code)" @click="submit">登录</u-button>
		</view>
		<view class="plr-36 flex mt-30">
			<text class="gray-2 size-26" @click="goRegister">立即注册</text>
			<text class="green size-26"
				@click="type=type==2?1:2,tel='',pwd='',code=''">{{type==1?'验证码登录':'密码登录'}}</text>
		</view>
	</view>
</template>

<script>
	var _this;
	export default {
		data() {
			return {
				type: 1, //1=登录，2=验证码登录
				tel: '',
				code: '',
				pwd: '',
				vscode: '获取验证码',
				countNum: 60,
				countDownTimer: null,
				open: false,
				cid:''
			}
		},
		onLoad() {
			_this = this;
			// #ifdef APP-PLUS
			console.log(plus.push.getClientInfo().clientid)
			this.cid = plus.push.getClientInfo().clientid
			// #endif
		},
		methods: {
			// gophone() {
			// 	uni.navigateTo({
			// 		url: '/pages/login/phone'
			// 	})
			// },
			goRegister() {
				uni.navigateTo({
					url: '/pages/login/register'
				})
			},
			goForget() {
				uni.navigateTo({
					url: '/pages/login/forget-pwd?type=1'
				})
			},
			// 微信登录
			wxLogin() {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log(infoRes);
								// #ifdef MP-WEIXIN
								_this.$http('/addons/ddrive/wx_login/getOpenid', {
									code: loginRes.code,
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv
								}, "POST").then(data => {
									console.log(data);
									_this.getinfo(data.openid, data.unionId, infoRes
										.userInfo.nickName)
								})
								// #endif
								// #ifdef APP-PLUS
								_this.getinfo(infoRes.userInfo.openId, infoRes.userInfo.unionId,
									infoRes.userInfo.nickName)
								// #endif
							}
						})
					}
				});
			},
			mpGetUserInfo() {

			},
			getinfo(openid, unionId, name) {
				this.$http('/addons/ddrive/wx_login/wxlogin', {
					openid: openid,
					unionId: unionId,
					wx_name: name,
					cid: this.cid,
					// #ifdef MP-WEIXIN
					mini: 1
					// #endif
				}, "POST").then(data => {
					console.log(data);
					_this.$store.commit('getUserInfo', data.userinfo)
					setTimeout(() => {
						uni.showToast({
							title: '授权成功'
						})
					}, 100)
					if (data.userinfo.mobile) {
						uni.reLaunch({
							url: "/pages/home/index"
						})
					} else {
						uni.reLaunch({
							url: '/pages/login/phone?type=0'
						})
					}
				})
			},
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
					event: 'mobilelogin'
				}, 'POST').then(data => {
					uni.showToast({
						title: '短信已发送，请注意查收',
						icon: 'none'
					})
				})
			},
			submit() {
				if (this.type == 1) {
					// 密码登录
					this.$http('/addons/ddrive/user/login', {
						mobile: this.tel,
						password: this.pwd,
						cid:this.cid,
						app_type: 1
					}, 'POST').then(data => {
						this.$store.commit('getUserInfo', data.userinfo)
						uni.showToast({
							title: '登录成功'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/index'
							})
						}, 500)
					})
				} else {
					// 验证码登录
					this.$http('/addons/ddrive/user/mobilelogin', {
						mobile: this.tel,
						captcha: this.code,
						cid: this.cid
					}, 'POST').then(data => {
						this.$store.commit('getUserInfo', data.userinfo)
						uni.showToast({
							title: '登录成功'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/home/index'
							})
						}, 500)
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

		.line {
			width: 178rpx;
			height: 2rpx;
			background: #eee;
		}

		.img {
			position: relative;

			.button {
				width: 100rpx;
				position: absolute;
				margin: -50rpx;
				left: 50%;
				opacity: 0;
			}

			image {
				width: 92rpx;
				height: 92rpx;
			}
		}
	}
</style>
