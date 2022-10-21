<template>
	<view>
		<view class="bg min100 ptb-30 plr-35">
			<empty v-if="list.length==0" text="暂无订单"></empty>
			<view class="mb-20" v-for="(item,i) in list" :key="i">
				<view @click="goDetail(item.id)" class="ptb-30 plr-30 radius-10 bg-white">
					<view class="flex">
						<view class="">
							货运 {{item.appointment_time_text?item.appointment_time_text:'立即出发'}}
							<text v-if="item.status != '-2' && item.status != '-1' && item.status != '99'" class="white size-26 ptb-5 plr-15 mlr-15 bg-green white">
								{{item.status_text}}
							</text>
							<text v-else class="gray-2 size-26 ptb-5 plr-15 mlr-15" style="background: #eee;">{{item.status_text}}</text>
						</view>
						<u-icon name="arrow-right" color="rgba(51,51,51,0.3)" size="40"></u-icon>
					</view>
					<view class="mt-30 flex1 flex-middle">
						<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
						<text class="ml-20">{{item.start_city}}--{{item.start}}</text>
					</view>
					<view class="mt-30 flex1 flex-middle" v-for="(items,index) in item.shaddress" :key="index">
						<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
						<text class="ml-20">{{items.end_city}}--{{items.end}}</text>
					</view>
				</view>
			</view>
			<u-loadmore v-show="list.length>9" :status="status" icon-type="flower" bg-color="transperant" margin-top="30"
			 margin-bottom="30" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				page: 1,
				status: 'loadmore',
			};
		},
		onPullDownRefresh() {
			this.page = 1
			this.list = []
			this.init()
		},
		onReachBottom() {
			//避免多次触发
			if (this.status == 'loading' || this.status == 'nomore') {
				return;
			}
			this.status = "loading";
			this.init()
		},
		onLoad() {
			this.init()
		},
		methods: {
			goDetail(id){
				uni.navigateTo({
					url:'/pages/huoyun/order-detail?id=' + id
				})
			},
			init() {
				this.$http('/addons/ddrive/hyorder/index', {
					page: this.page,
					status:'all'
				}, "POST").then(res => {
					let data = res.data
					if (data.length < 10) {
						this.status = "nomore"
					} else {
						this.page = this.page + 1
						this.status = "loadmore"
					}
					this.list = this.list.concat(data)
					uni.stopPullDownRefresh();
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
