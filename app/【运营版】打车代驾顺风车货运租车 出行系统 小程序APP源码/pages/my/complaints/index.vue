<template>
	<view>
		<view class="plr-36 ptb-30 bb">
			<view class="size-34 bold">
				我的行程
			</view>
			<view class="mt-30">
				{{sf_type==1?'顺风车':sf_type==2?'货运':'代驾'}} {{info.createtime}}
				<text class="gray-2 ptb-2 plr-10 ml-10" style="background: #eee;">已完成</text>
			</view>
			<view class="mt-30 flex1 flex-middle">
				<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{info.start_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-if="sf_type != 2">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{info.end_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-for="(item,i) in info.end_address" :key="i" v-if="sf_type == 2">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{item.end_address}}</text>
			</view>
		</view>
		<view class="mt-30 mb-10 plr-36 size-34 bold">
			投诉类型
		</view>
		<u-cell-item :title="item.name" v-for="(item,i) in list" :key="i" @click="goDetail(item.id,item.name)"></u-cell-item>
		<view class="mt-30 mb-10 plr-36 size-34 bold">
			其他功能
		</view>
		<u-cell-item title="查询处理进度" @click="goPro"></u-cell-item>
		<u-cell-item title="联系客服" @click="call"></u-cell-item>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:'',
				sf_type:'',
				info:{},
				list:[]
			}
		},
		onLoad(option) {
			this.orderId = option.id
			this.sf_type = option.sf_type
			this.init()
		},
		methods: {
			goDetail(id,name){
				uni.navigateTo({
					url:'/pages/my/complaints/lost?id=' + id + '&orderId=' + this.orderId + '&title=' + name+ '&sf_type=' + this.sf_type
				})
			},
			goPro(){
				uni.navigateTo({
					url:'/pages/my/complaints/progress'
				})
			},
			call() {
				this.$http('/addons/ddrive/user/consumer_hotline', {}, "POST").then(data => {
					uni.makePhoneCall({
						phoneNumber: data.tel //仅为示例
					});
				})
			},
			init(){
				this.$http('/addons/ddrive/user/complaint_category',{
					order_id: this.orderId,
					sf_type:this.sf_type
				},"POST").then(data=>{
					console.log(data);
					this.info = data.order_info
					this.list = data.list
				}).catch(()=>{
					setTimeout(()=>{
						uni.navigateBack({
							
						})
					},500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
