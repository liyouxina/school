<template>
	<view style="border-top: 1rpx solid #f8f8f8;">
		<view class="mlr-36 mt-30">
			更改手机号码后，下次登录可使用新手机号码登录。当前手机号码：{{userInfo.mobile}}
		</view>
		<view class="mlr-36 mt-40">
			<u-field v-model="tel" :trim="true" label-width="0" placeholder="请输入手机号"></u-field>
		</view>
		<view class="code mlr-36 flex">
			<input type="text" v-model="code" placeholder="请输入验证码"/>
			<view class="code1 white text-center" @click="getcode">
				{{vscode}}
			</view>
		</view>
		<view class="fixed-bottom plr-36 pb-80">
			<u-button type="primary" :disabled="!tel || !code" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				tel:'',
				code:'',
				vscode:'获取验证码',
				countNum:60,
				countDownTimer:null,
				submitbtn:true
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods: {
			// 获取短信验证码
			getcode(){
				var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
				if(!myreg.test(this.tel)){
					uni.showToast({
						title:'请输入手机号',
						icon: 'none'
					})
					return
				}
				if(this.vscode != '获取验证码' && this.vscode != '重新发送'){
					return
				}
				this.countNum = 60
				this.countDownTimer = setInterval(()=> {
					if (this.countNum < 1) {
						clearInterval(this.countDownTimer)
						this.vscode = "重新发送";
						return;
					}
					this.countNum--;
					this.vscode = this.countNum + '秒重发';
				}, 1000)
				this.$http('/api/sms/send',{
					mobile: this.tel,
					event: 'changemobile'
				},'POST').then(data=>{
					uni.showToast({
						title:'短信已发送，请注意查收',
						icon:'none'
					})
				})
			},
			submit(){
				if(this.submitbtn == true){
					this.submitbtn = false
					this.$http('/addons/ddrive/user/changemobile',{
						mobile: this.tel,
						captcha: this.code
					},"POST").then(data=>{
						this.$store.dispatch('updateUserInfo')
						uni.showToast({
							title: '修改手机号成功',
							icon: 'none'
						})
						setTimeout(()=>{
							uni.navigateBack({})
						},1000)
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
	}
	
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	
	/deep/.u-btn--primary--disabled {
		background-color: $bg-1 !important;
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
</style>
