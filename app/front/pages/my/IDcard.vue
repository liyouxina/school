<template>
	<view>
		<view class="plr-40 mt-30">
			以上信息用于核实您的真实身份
		</view>
		<view class="plr-40 mt-10 size-26 gray-2">
			实名认证可能会影响您的叫车服务，请认真填写
		</view>
		<view class="mlr-36">
			<u-field v-model="name" label-width="0" placeholder="请输入真实姓名"></u-field>
			<u-field v-model="idcard" label-width="0" placeholder="请输入身份证号码"></u-field>
		</view>
		<view class="mlr-36">
			<view class="img text-center mt-50">
				<image :src="img1" mode="" @click="chooseImg1"></image>
			</view>
			<view class="size-28 text-center mt-10">
				点击上传<text class="ml-10" style="color: #FF5C50;">人像面</text>
			</view>
			<view class="img text-center mt-60">
				<image :src="img2" mode="" @click="chooseImg2"></image>
			</view>
			<view class="size-28 text-center mt-10">
				点击上传<text class="ml-10" style="color: #FF5C50;">国徽面</text>
			</view>
		</view>
		<view class="pd-40">
			<u-button type="primary" :disabled="!name || !idcard || !imgurl1 || !imgurl2" class="mt-60" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import {upload} from '../../common/common.js'
	export default {
		data() {
			return {
				name:'',
				idcard:'',
				img1:'../../static/IDcard-1.png',
				imgurl1:'',
				img2:'../../static/IDcard-2.png',
				imgurl2:'',
				submitbtn:true
			}
		},
		methods: {
			chooseImg1(){
				console.log(111111111);
				upload().then(data=>{
					this.img1 = data[0].img1
					this.imgurl1 = data[0].img2
				})
			},
			chooseImg2(){
				upload().then(data=>{
					this.img2 = data[0].img1
					this.imgurl2 = data[0].img2
				})
			},
			submit(){
				if(this.submitbtn == true){
					this.submitbtn = false
					this.$http('/addons/ddrive/user/verified',{
						type:1,
						truename: this.name,
						idcard: this.idcard,
						front_card_image: this.imgurl1,
						back_card_image: this.imgurl2,
						sign_areas:'',
						areas:'',
						driver_license:'',
						driver_front_image:'',
						driver_back_image:'',
						card_brand:'',
						card_type:'',
						number_plate:'',
						card_front_image:'',
						card_back_image:''
					},"POST").then(data=>{
						this.$store.dispatch('updateUserInfo')
						uni.showToast({
							title: '提交成功,请耐心等待',
							icon:'none'
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
	.img{
		image{
			width: 398rpx;
			height: 254rpx;
		}
	}
</style>
