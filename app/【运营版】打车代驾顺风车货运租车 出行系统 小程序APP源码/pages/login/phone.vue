<template>
	<view class="box">
		<view class="title mlr-36 size-40 bold">
			绑定手机号
		</view>
		<view class="mlr-36 size-26 gray-2 mt-10">
			请使用手机号，快速登录
		</view>
		<view class="mlr-36 mt-40">
			<u-field v-model="tel" :trim="true" label-width="0" placeholder="请输入手机号"></u-field>
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
		<view class="mt-100 plr-36">
			<u-button type="primary" :disabled="!tel || !code" @click="submit">立即绑定</u-button>
		</view>
		<view class="mt-40 text-center gray-2" @click="goHome" v-if="type==0">
			暂不绑定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,//0=登录后绑定，1=设置中绑定
				tel: '',
				code:'',
				vscode:'获取验证码',
				countNum: 60,
				countDownTimer: null,
				submitbtn:true
			}
		},
		onLoad(option) {
			this.type = option.type
		},
		methods: {
			goHome(){
				uni.reLaunch({
					url: '/pages/home/index'
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
			submit(){
				if(this.submitbtn == true){
					this.submitbtn = false
					this.$http('/addons/ddrive/user/bindOnAccount',{
						mobile: this.tel,
						captcha: this.code
					},"POST").then(data=>{
						console.log(data);
						this.$store.dispatch('updateUserInfo')
						uni.showToast({
							title: '绑定成功'
						})
						if(this.type == 0){
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/home/index'
								})
							}, 500)
						}else{
							setTimeout(() => {
								uni.navigateBack({
									
								})
							}, 500)
						}
					}).catch(data=>{
						this.submitbtn = true
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-field{
		padding: 13px 0 !important;
	}
	/deep/.u-btn{
		height: 96rpx !important;
		border-radius: 10rpx !important;
	}
	
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
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
		.code{
			margin-top: 10rpx;
			padding-top: 14rpx;
			padding-bottom: 15rpx;
			border-bottom: 1rpx solid #f5f6f7;
			input{
				margin-left: 8rpx;
				font-size: 26rpx;
			}
			.code1{
				width: 180rpx;
				height: 70rpx;
				font-size: 26rpx;
				line-height: 70rpx;
				background: $bg-green;
			}
		}
	}
</style>
