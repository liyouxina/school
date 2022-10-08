<template>
	<view class="bg-white w100 pt-30 pb-40" style="border-radius: 10px 10px 0px 0px;">
		<view class="plr-36 flex">
			<view class="flex1 flex-middle">
				<view class="size-48 mr-20" @click="getCity">
					{{city}}
				</view>
				<view class="">
					<view class="">
						{{temperature}}°C
					</view>
					<view class="size-26 gray-2">
						{{weather}}
					</view>
				</view>
			</view>
			<view class="img-car">
				<image src="../../static/home-car.png" mode=""></image>
			</view>
		</view>
		<view class="bb ptb-25 flex" style="background: #f3f3f3;">
			<view class="center br u-flex-1">
				<u-icon name="clock" color="#06C391" class="gray-2 size-40"></u-icon>
				<view class="ml-20" @click="getTime">{{time}}</view>
				<view @click="time='预约时间'" v-show="time!='预约时间'" class="size-22 bg-green plr-5 white radius-10">重置</view>
			</view>
			<view class="center br u-flex-1">
				<u-icon name="account" color="#06C391" class="gray-2 size-38"></u-icon>
				<view class="ml-20" @click="daiti">代人叫代驾</view>
			</view>
		</view>
		<!-- 起始点 -->
		<view class="plr-36">
			<view class="flex_l ptb-30 bb" @click="getAddress(1)">
				<view class="bg-green radius mt-10" style="width: 16rpx;height: 16rpx;"></view>
				<view class="ml-30">
					<view class="">{{start.name}}</view>
					<view v-if="start.flag" class="blue size-24">推荐上车点</view>
					<view v-else class="size-24">{{start.address}}</view>
				</view>
			</view>
			<view class="flex_l ptb-30" @click="getAddress(2)">
				<view class="img-point mt-10">
					<image src="../../static/home-point.png" mode=""></image>
				</view>
				<view class="ml-30">
					<view v-if="end.address">
						<view class="">{{end.name}}</view>
						<view class="size-24">{{end.address}}</view>
					</view>
					<view v-else class="gray-2 size-32">你要去哪儿</view>
				</view>
			</view>
		</view>

		<!-- but -->
		<view class="mlr-36">
			<u-button type="primary" @click="dj_submit">呼叫代驾</u-button>
		</view>
		<!-- <view class="w100 bg-blue" style="height:2vh;" @click="dj_submit"></view> -->
		<!-- 时间 -->
		<u-popup v-model="showTime" mode="bottom" height="400" @close="$emit('close')">
			<longDate type="day" :openStatus="true" :getDayNum="3" :chooesMaxDay="3" @select="onSelectTime">
			</longDate>
		</u-popup>

	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import amapFile from '../../libs/amap-wx.js'
	import longDate from '../long-date/long-date.vue'
	export default {
		components: {
			longDate
		},
		//代人叫车
		props: ["other", "showTime","location"],
		data() {
			return {
				time: '预约时间',
				key:'bb6f4ed802756f963b37c184ce4e9766',
				weather: '晴',
				temperature: '20'
			}
		},
		computed:{
			...mapState(['city',"start","end"])
		},
		mounted() {
			console.log(this.city);
			this.myAmapFun = new amapFile.AMapWX({
				key: this.key
			});
			this.getWeather()
		},
		methods: {
			//获取天气
			getWeather() {
				let _this = this
				this.myAmapFun.getWeather({
					city: this.city,
					success: (data) => {
						console.log(data);
						_this.weather = data.liveData.weather
						_this.temperature = data.liveData.temperature
					},
					fail: (msg) => {
						uni.showToast({
							title: '没有开启位置权限',
							icon: 'none'
						})
					}
				});
			},
			getCity() {
				uni.navigateTo({
					url: '/pages/home/city'
				})
			},
			// 选时间
			getTime() {
				this.$emit('showTime')
			},
			daiti() {
				uni.navigateTo({
					url: '/pages/home/dj-other'
				})
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
					this.$emit('close')
				}
			},
			confirmTime(time) {
				console.log(time);
			},
			getAddress(type) {
				uni.navigateTo({
					url: '/pages/home/search?type=' + type +'&location='+this.location
				})
			},
			dj_submit() {
				if (Object.keys(this.end).length == 0) {
					uni.showToast({
						title: '请选择目的地',
						icon: 'none'
					})
				} else {
					let query = {
						time: this.time,
						other: this.other,
					}
					console.log(1111, query);
					uni.navigateTo({
						url: '/pages/home/dj-confirm?query=' + encodeURIComponent(JSON.stringify(query))
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	.img-car{
		image{
			width: 226rpx;
			height: 98rpx;
		}
	}
	.img-point{
		image{
			width: 24rpx;
			height: 24rpx;
		}
	}
</style>
