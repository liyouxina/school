<template>
	<view class='bg-white' style="padding-bottom: 400rpx;">
		<u-tabs :list="list" :is-scroll="false" bar-width="0" active-color="#00C28E" :current="current" @change="change" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.14);"></u-tabs>
		<view class="pd-36 center" v-if="info">
			<image :src="info.car_image" style="width: 260rpx;height: 180rpx;" mode=""></image>
			<view class="ml-30">
				<view>载重{{info.load}}</view>
				<view class="bold mtb-20">长宽高{{info.length}}*{{info.width}}*{{info.height}}米</view>
				<view class="gray-2">载货体积{{info.volume}}方</view>
			</view>
		</view>

		<!-- 起始点 -->
		<view class="plr-36 bg">
			<view class="flex_l ptb-30 bb" @click="getAddress(1)">
				<view class="bg-green radius mt-10" style="width: 16rpx;height: 16rpx;"></view>
				<view class="ml-30">
					<view class="">{{start.name}}</view>
					<view class="size-28 mt-10 gray-2">{{start.address}}</view>
				</view>
			</view>
			<view class="flex_l ptb-30 bb" v-for="(item,i) in hyaddress" :key="i">
				<view class="bg-orange radius mt-10" style="width: 16rpx;height: 16rpx;"></view>
				<view class="ml-30 u-flex-1 flex">
					<view v-if="item.address" class="u-flex-1 mr-20">
						<view class="">{{item.address.name}}</view>
						<view class="size-28 mt-10 gray-2">{{item.address.address}}</view>
					</view>
					<u-icon class="size-38" @click="delAddr(i)" name="close-circle" color="#"></u-icon>
				</view>
			</view>
			<view class="flex_l ptb-30 bb" v-if="hyaddress&&hyaddress.length==0">
				<view class="bg-red radius mt-10" style="width: 28rpx;height: 28rpx;"></view>
				<view class="ml-30">
					<view class="gray-2" @click="toAddress">请选择收货地址</view>
				</view>
			</view>
			<view class="gray-2 pd-25" v-else @click="toAddress">+添加收货地</view>
		</view>

		<view class="fixed-bottom bg-white">
			<view v-if="hylist&&hylist.length>0&&hylist[0]">
				<!-- 代驾 -2=已超时,-1=已取消,0=呼叫中,1=已接单,2=进行中,3=待支付,4=司机已到达,5=预约单待司机出发,99=已完成 -->
				<image src="../../static/hy-1.png" v-show="hylist[0].status==0" @click="toDetail" style="width: 100%;height: 120rpx;" mode=""></image>
				<image src="../../static/hy-2.png" v-show="hylist[0].status==1||hylist[0].status==5" @click="toDetail" style="width: 100%;height: 120rpx;" mode=""></image>
				<image src="../../static/hy-3.png" v-show="hylist[0].status==4" @click="toDetail" style="width: 100%;height: 120rpx;" mode=""></image>
				<image src="../../static/hy-4.png" v-show="hylist[0].status==2||hylist[0].status==3" @click="toDetail" style="width: 100%;height: 120rpx;" mode=""></image>
			</view>
			<view class="center pt-20">
				<view class="red bold">
					<text class="size-26">￥</text>
					<text class="size-40">{{price||'--'}}</text>
				</view>
				<view class="size-26 ml-20 green" @click="toCharge">费用标准</view>
			</view>
			<view class="flex pd-30">
				<view @click="toConfirm" class="u-flex-1 center white bg-green border-green text-center" style="height: 90rpx;">现在用车</view>
				<view class="u-flex-1 center green border-green ml-30" style="height: 90rpx;" @click="getTime">
					<image src="../../static/hy-time.png" style="width: 40rpx;height: 40rpx;" mode=""></image>
					<view class="ml-20">
						<view>{{time}}</view>
						<view @click="time='预约'" v-show="time!='预约'" style="width: 70rpx;" class="size-22 bg-green center white radius-10">重置</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 时间 -->
		<u-popup v-model="showTime" mode="bottom" height="400" @close="showTime=false">
			<longDate type="day" :openStatus="true" :getDayNum="3" :chooesMaxDay="3" @select="onSelectTime">
			</longDate>
		</u-popup>

	</view>
</template>

<script>

	import {
		mapState
	} from 'vuex'
	import amapFile from '../../libs/amap-wx.js'
	import longDate from '../long-date/long-date.vue'
	export default {
		data() {
			return {
				list: [],
				carList: [],
				current: 0,
				time: '预约',
				showTime: false,
				price: '--',
			}
		},
		components: {
			longDate
		},
		props:["hylist"],
		computed: {
			...mapState(["start", "hyaddress"]),
			info() {
				return this.carList[this.current]
			}
		},
		watch: {
			start(newVal) {
				if (this.hyaddress.length > 0&& this.list.length>0) {
					this.getPrice()
				}
			},
			hyaddress(newVal) {
				if (Object.keys(this.start).length > 0 ) {
					this.getPrice()
				}
			},
			current(newVal) {
				if (this.hyaddress.length > 0 && Object.keys(this.start).length > 0) {
					this.getPrice()
				}
			}
		},
		mounted() {
			this.$http('/addons/ddrive/freight/car_name').then(data => {
				this.list = data
			})
			this.$http('/addons/ddrive/freight/carInfo').then(data => {
				this.carList = data
			})
			uni.$on('price',()=>{
				this.current =0
				if (this.hyaddress.length > 0 && Object.keys(this.start).length > 0) {
					this.getPrice()
				}
			})
		},
		
		methods: {
			toDetail() {
				if (this.hylist.length == 1) {
					uni.navigateTo({
						url: '/pages/huoyun/order-detail?id=' + this.hylist[0].id
					})
				} else {
					uni.navigateTo({
						url: '/pages/huoyun/order'
					})
				}
			},
			getPrice() {
				this.$http('/addons/ddrive/hyorder/amount', {
					start_lat: this.start.latitude,
					start_lng: this.start.longitude,
					end_address: JSON.stringify(this.hyaddress),
					car_id: this.list[this.current].id
				}, "POST").then(data => {
					this.price = data.distance_price
				}).catch(() => {
					this.price = '--'
				})
			},
			change(index) {
				this.current = index;
			},
			toCharge() {
				uni.navigateTo({
					url: '/pages/huoyun/charge?tab=' + this.current
				})
			},
			toAddress() {
				uni.navigateTo({
					url: '/pages/huoyun/address'
				})
			},
			getAddress(type) {
				let location = this.start.longitude + ',' + this.start.latitude
				uni.navigateTo({
					url: '/pages/home/search?type=' + type + '&location=' + location
				})
			},
			delAddr(index) {
				this.$store.commit('delHyAddress', index)
			},
			// 选时间
			getTime() {
				this.showTime = true
			},
			// 确定时间
			onSelectTime(res) {
				console.log(res);
				if (res.tip) {
					uni.showToast({
						title: res.tip,
						icon: 'none'
					})
				} else {
					this.time = res.time
					this.showTime = false
					this.toConfirm()
					this.time = '预约'
				}
			},
			confirmTime(time) {
				console.log(time);
			},

			toConfirm() {
				if (this.hyaddress.length == 0) {
					uni.showToast({
						title: '请选择目的地',
						icon: 'none'
					})
				} else {
					uni.navigateTo({
						url: '/pages/huoyun/confirm-order?time=' + this.time + '&id=' + this.list[this.current].id + '&price=' + this.price
					})
				}
			}
		}
	}
</script>

<style scoped lang='scss'>

</style>
