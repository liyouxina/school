<template>
	<view>
		<view class="mt-30 text-center bold">
			{{name}}
		</view>
		<view class="mt-20 text-center size-26 gray-2">
			*已同意客服听取本次行程录音作为判责依据
		</view>
		<view class="mt-20 center">
			<view class="bg-green ptb-10 plr-15 white" v-if="info.status=='0'">
				处理中
			</view>
			<view class="ptb-10 plr-15 white" style="background: #999;" v-if="info.status=='-1' || info.status=='1'">
				已完成
			</view>
		</view>
		<view class="plr-36 mt-80 flex1">
			<view class="img">
				<image src="../../../static/select-1.png" mode=""></image>
			</view>
			<view class="ml-30">
				<view class="gray-2">
					处理结果
				</view>
				<view class="gray-2 mt-20">
					{{info.handling_opinions}}
				</view>
				<view class="gray-2 mt-20" v-if="info.updatetime">
					{{info.updatetime}}
				</view>
			</view>
		</view>
		<view class="plr-36 mt-30 flex1">
			<view class="img">
				<image src="../../../static/select-2.png" mode=""></image>
			</view>
			<view class="ml-30">
				<view class="gray-2">
					提交成功
				</view>
				<view class="gray-2 mt-20">
					{{info.remark}}
				</view>
				<view class="mt-20">
					<image :src="item" mode="" style="width: 200rpx;height: 200rpx;" v-for="(item,i) in info.certificate_image" :key="i"></image>
				</view>
				<view class="gray-2 mt-20">
					{{info.createtime}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				name:'',
				info:''
			}
		},
		onLoad(option) {
			this.id = option.id
			this.name = option.name
			this.init()
		},
		methods: {
			init(){
				this.$http('/addons/ddrive/user/complaint_info',{
					complaint_id: this.id
				},"POST").then(data=>{
					console.log(data);
					this.info = data.complaint_info
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img{
		image{
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
