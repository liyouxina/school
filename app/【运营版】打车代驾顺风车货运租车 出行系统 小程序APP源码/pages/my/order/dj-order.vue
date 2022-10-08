<template>
	<view class="bg min100 ptb-30 plr-35">
		<empty v-if="list.length==0" text="暂无订单"></empty>
		<view class="mb-20" v-for="(item,i) in list" :key="i">
			<djOrder :item="item"></djOrder>
		</view>
		<u-loadmore v-show="list.length>9" :status="status" icon-type="flower" bg-color="transperant" margin-top="30"
		 margin-bottom="30" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				page: 1,
				status: 'loadmore',
			}
		},
		onShow() {
			this.page = 1
			this.status = 'loadmore'
			this.list = []
			this.init()
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
		methods: {
			init() {
				this.$http('/addons/ddrive/order/index', {
					status: 'all',
					page: this.page
				}, "POST").then(data => {
					if (data.data.length < 10) {
						this.status = "nomore"
					} else {
						this.page = this.page + 1
						this.status = "loadmore"
					}
					this.list = this.list.concat(data.data)
					uni.stopPullDownRefresh();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
