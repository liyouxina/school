<template>
	<view>
		<view class="header">
			<image src="../../static/booklist-header.png" mode=""></image>
		</view>
		<empty top="180" v-if="list.length==0" text="暂无车主"></empty>
		<view style="padding-bottom: 150rpx;">
			<view @click="toDetail(item.id)" class="mlr-36 mt-30 plr-30 ptb-20" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.15);" v-for="(item,i) in list"
			 :key="i">
				<view class="text-center blue bold">
					{{item.start_time}}
				</view>
				<view class="flex mt-10">
					<view class="">
						<text class="gray-2">【车主】</text>{{item.driver_name}}
					</view>
					<view class="flex1 flex-middle">
						<text class="gray-2">【余座】</text>{{item.more_seats}}
						<u-icon name="arrow-right" color="rgba(51,51,51,0.3)" size="35"></u-icon>
					</view>
				</view>
				<view class="mt-10">
					<text class="gray-2">【车型】</text>{{item.car_type}}
				</view>
				<view class="flex1 mt-10">
					<text class="gray-2">【路线】</text>
					<view class="u-flex-1">
						{{item.route}}
					</view>
				</view>
				<view class="flex1 mt-10">
					<text class="gray-2">【备注】</text>
					<view class="u-flex-1">
						{{item.remark}}
					</view>
				</view>
				<view class="mt-10">
					<text class="gray-2">【评分】</text>
					<text class="red">{{item.score}}分</text>
				</view>
				<view class="flex flex-end mt-20">
					<view class="">
						摊费<text class="red">￥{{item.car_price}}</text>/座
					</view>
					<view class="bg-green white ptb-10 plr-20 ml-20" @click.stop="book(item.id)">
						预订
					</view>
				</view>
			</view>
		</view>
		<u-loadmore v-show="list.length>9" :status="status" icon-type="flower" bg-color="transperant" margin-top="30"
		 margin-bottom="30" />
		<bookTip class="fixed-bottom"></bookTip>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				list:[],
				page:1,
				status: 'loadmore',
			};
		},
		computed:{
			...mapState(['start','end','city1','city2'])
		},
		onShow() {
			this.page = 1
			this.list = []
			this.init()
		},
		mounted() {
			uni.setNavigationBarTitle({
				title:this.city1+'——'+this.city2
			})
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
		methods:{
			init(){
				this.$http('/addons/ddrive/sforder/order_index',{
					order_type:2,
					start_city: this.start.city,
					end_city: this.end.city,
					page: this.page
				},"POST").then(data=>{
					console.log(data);
					if (data.length < 10) {
						this.status = "nomore"
					} else {
						this.page = this.page + 1
						this.status = "loadmore"
					}
					this.list = this.list.concat(data)
					uni.stopPullDownRefresh();
				})
			},
			book(id){
				uni.navigateTo({
					url:'/pages/shunfeng/confirm-book?id='+id
				})
			},
			toDetail(id){
				uni.navigateTo({
					url:'/pages/shunfeng/order-detail?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		image {
			width: 100%;
			height: 310rpx;
		}
	}
</style>
