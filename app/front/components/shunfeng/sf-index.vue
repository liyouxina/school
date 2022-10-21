<template>
	<view>
		<!-- <view class="flex">
			<view class="img">
				<image src="../../static/home-horn.png" mode=""></image>
			</view>
			<view class="size-26 gray-2">
				617聚合出行日百万补贴优惠券等您来体验！
			</view>
		</view> -->
		<view class="mlr-36 mt-20 ptb-40 plr-30" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.15);">
			<view class="text-center green bold">
				城际顺风车
			</view>
			<view class="flex mt-20">
				<view class="u-flex-1 ptb-30">
					<view class="flex1 flex-middle">
						<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
						<view :class="[city1?'':'gray-2','ml-40']" @click="goSearch(1)">
							{{city1||'请选择出发城市'}}
						</view>
					</view>
					<view class="ml-56 mtb-30" style="height: 1rpx;background: #eee;"></view>
					<view class="flex1 flex-middle">
						<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
						<view :class="[city2?'':'gray-2','ml-40']" @click="goSearch(2)">
							{{city2||'请选择终点城市'}}
						</view>
					</view>
				</view>
				<view class="img-switch ml-20" @click="change">
					<image src="../../static/switching-icon.png" mode=""></image>
				</view>
			</view>
			<view class="mt-40">
				<u-button type="primary" :disabled="!city1 || !city2" @click="search">查询车主</u-button>
			</view>
		</view>
		<swiper :autoplay="true" :interval="5000" :circular="true" v-if="list.length>0">
			<swiper-item v-for="(item,i) in list" :key="i" @click="goDetail(item.id)">
				<view class="mlr-36 mt-30" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.15);">
					<view class="img-clock plr-36 flex1 flex-middle ptb-20 bb">
						<image src="../../static/home-clock.png" mode=""></image>
						<text class="ml-15">当前预约</text>
					</view>
					<view class="plr-36 ptb-30 flex">
						<view class="">
							<view class="">
								{{item.start_city}}
								<text class="mlr-10">→</text>
								{{item.end_city}}
							</view>
							<view class="size-26 green mt-10">
								{{item.start_time}}
							</view>
							<view class="size-26 gray-2 mt-10" v-if="item.status*1==1">
								系统持续为您匹配中
							</view>
							<view class="size-26 gray-2 mt-10" v-if="item.status*1==2">
								待司机确认分摊费用
							</view>
							<view class="size-26 gray-2 mt-10" v-if="item.status*1==3">
								等待开始行程
							</view>
							<view class="size-26 gray-2 mt-10" v-if="item.status*1==4">
								正在行程中
							</view>
						</view>
						<view class="green ptb-6 plr-16" style="border: 1rpx solid #00C28E;" v-if="item.status*1==4">
							支付
						</view>
						<view class="green ptb-6 plr-16" style="border: 1rpx solid #00C28E;" v-if="item.status*1==3">
							待出发
						</view>
						<view class="green ptb-6 plr-16" style="border: 1rpx solid #00C28E;" v-if="item.status*1==2">
							待确认
						</view>
						<view class="green ptb-6 plr-16" style="border: 1rpx solid #00C28E;" v-if="item.status*1==1">
							{{item.order_type==1?'取消预订':'预订'}}
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="plr-36 size-34 mt-20 bold">
			推荐路线
		</view>
		<view class="plr-80 flex flex-wrap pb-50">
			<view class="mt-30"  style="width: 40%;" v-for="(item,i) in line" :key="i" @click="clickLine(item)">
				<view :class="[i%2!=0?'text-right':'']">
					{{item}}
					<!-- 杭州市
					<text class="mlr-10">→</text>
					郑州市 -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				list:[],
				line:[],
			};
		},
		computed: {
			...mapState(['city1', 'city2'])
		},
		mounted() {
			this.init()
			this.getLine()
		},
		methods: {
			init() {
				this.$http('/addons/ddrive/sforder/index_order', "POST").then(data => {
					// console.log(data);
					this.list = data
				})
			},
			getLine(){
				this.$http('/addons/ddrive/sforder/recommend_route', "POST").then(data => {
					// console.log(data);
					this.line = data
				})
			},
			goSearch(i) {
				uni.navigateTo({
					url: '/pages/home/search?type=' + i
				})
			},
			goDetail(id){
				uni.navigateTo({
					url:'/pages/shunfeng/order-detail?id=' + id
				})
			},
			change() {
				let start = this.city1
				let end = this.city2
				this.$store.commit('getCity1',end)
				this.$store.commit('getCity2',start)
			},
			search() {
				uni.navigateTo({
					url: '/pages/shunfeng/book-list'
				})
			},
			clickLine(item){
				this.$store.commit('getCity1',item.split('->')[0])
				this.$store.commit('getCity2',item.split('->')[1])
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	/deep/uni-swiper {
		height: 340rpx;
	}

	.img-switch {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.img {
		image {
			width: 36rpx;
			height: 36rpx;
		}
	}

	.img-clock {
		image {
			width: 36rpx;
			height: 36rpx;
		}
	}
</style>
