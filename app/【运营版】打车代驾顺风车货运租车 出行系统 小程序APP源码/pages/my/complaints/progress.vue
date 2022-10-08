<template>
	<view>
		<empty v-if="list.length==0" text="暂无投诉记录"></empty>
		<view @click="goDetail(item.id,item.name)" class="mlr-36 mt-30 ptb-30 plr-30 radius-10 bg-white" style="
		box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.15);" v-for="(item,i) in list" :key="i">
			<view class="flex">
				<view class="bold">
					{{item.name}}
				</view>
				<view class="flex1 flex-middle">
					{{item.createtime}}
					<u-icon name="arrow-right" color="rgba(51,51,51,0.3)" size="40" class="ml-10"></u-icon>
				</view>
			</view>
			<view class="mt-10">
				{{item.type==1?'代驾':item.type==2?'顺风车':'货运'}} {{item.create_time|formatDate(1)}}
			</view>
			<view class="mt-30 flex1 flex-middle">
				<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20">{{item.start_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-if="item.type != 3">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20 u-flex-1 u-line-1">{{item.end_address}}</text>
			</view>
			<view class="mt-30 flex1 flex-middle" v-for="(item1,i) in item.shaddress" :key="i" v-if="item.type == 3">
				<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				<text class="ml-20 u-flex-1 u-line-1">{{item1.end_address}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			goDetail(id,name){
				uni.navigateTo({
					url:'/pages/my/complaints/progress-detail?id=' + id + '&name=' + name
				})
			},
			init() {
				this.$http('/addons/ddrive/user/complaint_schedule', {
					
				}, "POST").then(data => {
					this.list = data.order_info
					uni.stopPullDownRefresh();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
