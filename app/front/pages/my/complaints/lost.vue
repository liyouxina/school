<template>
	<view>
		<view class="plr-36 ptb-30 bb">
			<view class="size-34 bold">
				问题行程
			</view>
			<view class="mt-30">
				{{sf_type==1?'顺风车':sf_type==2?'货运':'代驾'}} {{info.createtime}}
				<text class="gray-2 size-26 ptb-5 plr-10 mlr-10" style="background: #eee;">已完成</text>
			</view>
			<view class="mt-30 flex1 flex-middle">
				<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{info.start_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-if="sf_type!=2">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{info.end_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-for="(item,i) in info.end_address" v-if="sf_type==2">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{item.end_address}}</text>
			</view>
		</view>
		<view class="mt-30 plr-36 size-34 bold">
			填写备注
		</view>
		<view class="mt-40 mlr-36 border">
			<u-field type="textarea" class="w100" v-model="message" :auto-height="false" :clearable="false" label-width="0"
			 placeholder="请详细描述行程中您遇到的问题"></u-field>
		</view>
		<view class="mt-30 plr-36 size-34 bold">
			上传凭证
		</view>
		<view class="plr-36 mt-30 size-26 gray-2">
			只支持jpg、png格式，一次最多上传5张，每张照片不大于500kb，若超过次险种，请直接联系客服。
		</view>
		<view class="plr-36 mt-30 img">
			<image :src="item.img1" class="mr-20 mb-15" mode="" @click="chooseImg" v-for="(item,i) in img" :key="i"></image>
		</view>
		<view class="plr-36 pt-40 pb-60">
			<u-button type="primary" :disabled="!message || !imgurl" @click="submit">确定</u-button>
		</view>
	</view>
</template>

<script>
	import {
		upload
	} from '../../../common/common.js'
	export default {
		data() {
			return {
				info: {},
				orderId: '', //订单id
				sf_type:'',
				id: '', //投诉id
				message: '',
				img: [{
					img1: '../../../static/upload-img.png'
				}], //本地预览路径
				imgurl: '', //上传图片路径
			}
		},
		onLoad(option) {
			this.id = option.id
			this.sf_type = option.sf_type
			this.orderId = option.orderId
			uni.setNavigationBarTitle({
				title: option.title
			});
			this.init()
		},
		methods: {
			init() {
				this.$http('/addons/ddrive/user/complaint_category', {
					order_id: this.orderId,
					sf_type:this.sf_type
				}, "POST").then(data => {
					this.info = data.order_info
				})
			},
			chooseImg() {
				upload(5).then(data => {
					console.log(data);
					this.img = data
					let arr=[]
					data.forEach(item=>{
						arr.push(item.img2)
					});
					this.imgurl = arr.join(',')
					console.log(arr.join(','));
				})
			},
			submit() {
				this.$http('/addons/ddrive/user/complaint', {
					order_id: this.orderId,
					complaint_id: this.id,
					remark: this.message,
					certificate_image: this.imgurl,
					sf_type:this.sf_type
				}, "POST").then(data => {
					uni.showToast({
						title: '投诉成功,请等待审核结果',
						icon: 'none'
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/my/complaints/progress'
						})
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img {
		image {
			width: 200rpx;
			height: 200rpx;
		}
	}
</style>
