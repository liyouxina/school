<template>
	<view :class="[index==0?'flex flex-column vh100 w100':'']">
		<view :class="[tabList.length>1?'u-flex-2':'u-flex-2','bg-white w100']" :style="'padding-top:'+height+'px;'">
			<view class="plr-36 flex">
				<view class="img-pic" @click="toMy">
					<image :src="token?'../../static/home-online.png':'../../static/home-offline.png'" mode=""></image>
				</view>
				<view class="img-logo">
					<image src="../../static/logo-title.png" mode=""></image>
				</view>
				<view class="" style="width: 76rpx;"></view>
			</view>
			<!-- <view :class="['center','relative',tabList.length>1?'pd-20':'pd-40']" @click=
			"getCity">
				<view class="size-34 mr-10">{{city}}</view>
				<u-icon name="arrow-down"></u-icon>
			</view> -->
			<u-tabs :list="tabList" font-size="32" bg-color="#fff" height="90" active-color="#00C28E"
				inactive-color="#777" :is-scroll="false" :current="index" @change="change">
			</u-tabs>
		</view>
		<view class="u-flex-7 w100" style="height: 580rpx;" v-show="current==0">
			<map id="map" style="width: 100%; height: 100%;position: relative;" :latitude="latitude"
				:longitude="longitude" :markers="covers" :polyline="polyline" @regionchange="getCenterMap">
				<!-- <cover-image class="" @click="toAnquan" style="width: 210rpx;height: 80rpx;position: absolute;bottom: 140rpx;left: 30rpx;"
				 src="../../static/anquan.png"></cover-image> -->
				<!-- <cover-image class="" @click="toMy"
					style="width: 210rpx;height: 80rpx;position: absolute;bottom: 240rpx;left: 30rpx;"
					src="../../static/home-user1.png"></cover-image> -->
				<cover-image @click="toDetail" v-if="list.length>0&&list[0].status==0" class=""
					style="width: 100%;height: 80rpx;position: absolute;bottom: 20rpx;left: 0rpx;"
					src="../../static/home-1.png"></cover-image>
				<cover-image @click="toDetail" v-if="list.length>0&&(list[0].status==1||list[0].status==5)" class=""
					style="width: 100%;height: 80rpx;position: absolute;bottom: 20rpx;left: 0rpx;"
					src="../../static/home-2.png"></cover-image>
				<cover-image @click="toDetail" v-if="list.length>0&&list[0].status==4" class=""
					style="width: 100%;height: 80rpx;position: absolute;bottom: 20rpx;left: 0rpx;"
					src="../../static/home-3.png"></cover-image>
				<cover-image @click="toDetail" v-if="list.length>0&&list[0].status==2" class=""
					style="width: 100%;height: 80rpx;position: absolute;bottom: 20rpx;left: 0rpx;"
					src="../../static/home-4.png"></cover-image>
				<cover-image @click="toDetail" v-if="list.length>0&&list[0].status==3" class=""
					style="width: 100%;height: 80rpx;position: absolute;bottom: 20rpx;left: 0rpx;"
					src="../../static/home-5.png"></cover-image>
				<cover-view v-if="showTime" @click="showTime=false"
					style="width: 100%;height: 100%;background-color: rgba(0,0,0,.7);"></cover-view>
				<cover-image @click="goCenter" class=""
					style="width:100rpx;height: 100rpx;position: absolute;bottom: 120rpx;right: 10rpx;"
					src="../../static/now1.png"></cover-image>
			</map>
		</view>
		<view class="u-flex-7 w100" v-show="current==0">
			<indexAddress :location="longitude+','+latitude" @close="showTime=false" @showTime="showTime=true"
				:other="other" :showTime="showTime" :city="city"></indexAddress>
		</view>
		<sfindex v-show="current==1" class="w100"></sfindex>
		<hyindex v-show="current==2" :hylist="hylist" class="w100"></hyindex>
	</view>
</template>

<script>
	import amapFile from '../../libs/amap-wx.js'
	import Voice from '@/components/baidu.js';
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				index: 0,
				current: '',
				timer3: null,
				other: {}, //代人叫车
				list: [],
				hylist: [],
				timer: null,
				showTime: false,
				// 地图
				amapPlugin: null,
				key: 'bb6f4ed802756f963b37c184ce4e9766',
				latitude: '',
				longitude: '',
				latitude1: '', //打开地图时的中心点
				longitude1: '', //打开地图时的中心点
				polyline: [],
				mapContext: null,
				appMap: null
			}
		},
		computed: {
			...mapState(['city', 'height', "start", "tabList", 'token']),
			covers() {
				return [{
					id: 1,
					latitude: this.latitude,
					longitude: this.longitude,
					// #ifdef MP-WEIXIN
					iconPath: '../../static/now.png',
					// #endif
					// #ifndef MP-WEIXIN
					iconPath: '../../static/now2.png',
					// #endif
					title: '当前位置',
					width: 30,
					height: 45
				}]
			}
		},
		//分享
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {

			}
		},
		onShareTimeline(res) {
			console.log(111111111);
			return {

			}
		},
		onReady() {
			this.mapContext = uni.createMapContext('map')
			// #ifdef APP-PLUS
			this.appMap = this.mapContext.$getAppMap()
			let _this = this

			this.appMap.onstatuschanged = function(e) {
				_this.latitude = e.center.latitude
				_this.longitude = e.center.longitude
				console.log(11111111);
				_this.amapPlugin.getRegeo({
					location: e.center.longitude + ',' + e.center.latitude,
					success(data) {
						console.log(data);
						let city;
						if (!_this.city) {
							if (typeof data[0].regeocodeData.addressComponent.city == 'object') {
								city = data[0].regeocodeData.addressComponent.province
							} else {
								city = data[0].regeocodeData.addressComponent.city
							}
							// _this.$store.commit('getCity', city)
						}
						let start = {
							city: city,
							latitude: data[0].latitude,
							longitude: data[0].longitude,
							address: data[0].name,
							name: data[0].desc,
							flag: true
						}
						_this.$store.commit('getStart', start)
						console.log(_this.start);
					}
				})
			}
			// #endif
		},
		onLoad(option) {
			this.getpush()
			this.timer3 = setInterval(() => {
				if (this.tabList && this.tabList[0]) {
					this.current = this.tabList[0].id
					clearInterval(this.timer3)
					this.timer3 = null
				}
			}, 200)
			// 定位
			this.amapPlugin = new amapFile.AMapWX({
				key: this.key
			});
			uni.$on('other', (data) => {
				this.other = data
			})
		},
		onHide() {
			clearInterval(this.timer)
			this.timer = null
		},
		onUnload() {
			uni.$off('other')
			clearInterval(this.timer)
			this.timer = null
		},
		onShow() {
			this.getRegeo()
			this.timer = setInterval(() => {
				this.getList()
			}, 3000)
		},
		methods: {
			getpush: function() {
				// #ifdef APP-PLUS  
				// plus.push.addEventListener('receive', function(msg) {
				// 	// console.log(msg)
				// 	// _this.msg = JSON.stringify(msg)
				// 	plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
				// 		if (plus.os.name.toLowerCase() === 'android') {
				// 			Voice(msg.content);
				// 		} else {
				// 			Voice(msg.payload.content);
				// 		}
				// 	})
				// }, true)
				// #endif
			},
			getCenterMap() {
				let _this = this
				// #ifdef MP-WEIXIN
				this.mapContext.getCenterLocation({
					success: (res) => {
						console.log(res);
						if (res.longitude != 0) {
							_this.longitude = res.longitude
							_this.latitude = res.latitude
							_this.mapContext.translateMarker({
								markerId: 1,
								destination: {
									longitude: res.longitude,
									latitude: res.latitude
								},
								duration: 2000,
								animationEnd() {
									console.log(111111);
								}
							})
							_this.amapPlugin.getRegeo({
								location: res.longitude + ',' + res.latitude,
								success(data) {
									console.log(data);
									let city;
									if (!_this.city) {
										if (typeof data[0].regeocodeData.addressComponent.city ==
											'object') {
											city = data[0].regeocodeData.addressComponent.province
										} else {
											city = data[0].regeocodeData.addressComponent.city
										}
									}
									let start = {
										city: city,
										latitude: data[0].latitude,
										longitude: data[0].longitude,
										address: data[0].name,
										name: data[0].desc,
										flag: true
									}
									_this.$store.commit('getStart', start)
								}
							})
						}
					}
				})
				// #endif
			},
			goCenter() {
				this.mapContext.moveToLocation({
					longitude: this.longitude1,
					latitude: this.latitude1,
					success() {
						console.log(11111111);
					}
				})
			},
			getList() {
				this.$http('/addons/ddrive/order/order_taking', {}, "POST").then(data => {
					this.list = data.data
					this.hylist = data.hy
				})
			},
			toDetail() {
				if (this.list.length == 1) {
					uni.navigateTo({
						url: '/pages/home/detail?id=' + this.list[0].id
					})
				} else {
					uni.navigateTo({
						url: '/pages/my/order/dj-order'
					})
				}
			},
			toAnquan() {
				uni.navigateTo({
					url: '/pages/home/security'
				})
			},
			change(index) {
				this.index = index;
				this.current = this.tabList[index].id;
				if (this.current == 2) {
					uni.$emit('price')
				}
			},
			toMy() {
				if (this.token) {
					uni.navigateTo({
						url: '/pages/my/index'
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			// 获取定位
			getRegeo() {
				let _this = this
				// uni.showLoading({
				// 	title: '获取定位信息中'
				// });
				this.amapPlugin.getRegeo({
					success: (data) => {
						let city;
						if (!_this.city) {
							if (typeof data[0].regeocodeData.addressComponent.city == 'object') {
								city = data[0].regeocodeData.addressComponent.province
							} else {
								city = data[0].regeocodeData.addressComponent.city
							}
							_this.$store.commit('getCity', city)
						}
						_this.latitude = data[0].latitude
						_this.longitude = data[0].longitude
						_this.latitude1 = data[0].latitude
						_this.longitude1 = data[0].longitude
						if (!_this.start.name) {
							let start = {
								city: city,
								latitude: data[0].latitude,
								longitude: data[0].longitude,
								address: data[0].name,
								name: data[0].desc,
								flag: true
							}
							_this.$store.commit('getStart', start)
						}
						// uni.hideLoading();
					},
					fail: (msg) => {
						uni.showToast({
							title: '没有开启位置权限',
							icon: 'none'
						})
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	.img-pic {
		image {
			width: 76rpx;
			height: 76rpx;
		}
	}

	.img-logo {
		image {
			width: 168rpx;
			height: 42rpx;
		}
	}
</style>
