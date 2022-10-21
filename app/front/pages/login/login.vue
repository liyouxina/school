<template>
	<view class="box">
		<view class="img-logo text-center">
			<image src="../../static/logo-title.png" mode=""></image>
		</view>
		<view class="mlr-36" style="margin-top: 136rpx;">
			<view class="img text-center ptb-50" @click="wxLogin">
				<button type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo" class="button">登录</button>
				<view class="center radius-10 white" style="background: #4CBF00;">
					<image src="../../static/vx.png" mode=""></image>
					<view class="">
						微信一键登录
					</view>
				</view>
			</view>
			<view class="text-center size-28" style="color: #777;" @click="goLogin">
				输入手机号登录/注册
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	export default {
		data() {
			return {
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
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
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
									_this.getinfo(data.openid,data.unionId,infoRes.userInfo.nickName)
								})
								// #endif
								// #ifdef APP-PLUS
								_this.getinfo(infoRes.userInfo.openId,infoRes.userInfo.unionId,infoRes.userInfo.nickName)
								// #endif
							}
						})
					}
				});
			},
			mpGetUserInfo() {

			},
			getinfo(openid,unionId,name) {
				this.$http('/addons/ddrive/wx_login/wxlogin', {
					openid: openid,
					unionId:unionId,
					wx_name: name,
					cid:this.id,
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
			}
		}
	}
</script>

<style lang="scss" scoped>

	/deep/.u-btn {
		height: 96rpx !important;
	}

	.box {
		width: 100%;
		height: 100vh;
		background: url(../../static/login-bg.png) no-repeat;
		background-size: 100% 100%;
		overflow: hidden;

		.img-logo{
			margin-top: 240rpx;
			image{
				width: 272rpx;
				height: 68rpx;
			}
		}

		.img {
			position: relative;

			.button {
				width: 100%;
				position: absolute;
				opacity: 0;
			}

			image {
				width: 92rpx;
				height: 92rpx;
			}
		}
	}
</style>
