<template>
	<view class="flex flex-column vh100 w100" v-if="info.status">
		<view class="u-flex-1 w100">
			<map style="width: 100%; height: 100%;position: relative;" :scale="12" :latitude="latitude" :longitude="longitude"
			 :markers="covers" :polyline="polyline">
			 <!-- #ifndef MP-WEIXIN -->
			 <cover-image class="navigation" @click="toNav" src="../../static/nav.png"></cover-image>
			 <!-- #endif -->
				<!-- <cover-image class="" @click="toAnquan" style="width: 210rpx;height: 80rpx;position: absolute;bottom: 30rpx;left: 30rpx;"
				 src="../../static/anquan.png"></cover-image> -->
			</map>
		</view>
		<paidui class="w100" :huoyun="true" @update="update" @init="init" v-if="info.status==0||info.status==-2" :info="info"></paidui>
		<dtQuxiao class="w100" :huoyun="true" v-if="info.status==-1" :refund_id="refund_id" :info="info"></dtQuxiao>
		<dtSiji class="w100" :huoyun="true" @pay="ispay=true" v-if="arr3.includes(info.status*1)&&!ispay" :info="info"></dtSiji>
		<!-- <dtPay class="w100" @update="update" @close="ispay=false" v-if="info.status==3&&ispay" :info="info"></dtPay> -->
	</view>
</template>

<script>
	import amapFile from '../../libs/amap-wx.js'
	export default {
		data() {
			return {
				id: '', //订单id
				info: {}, //-2超时，-1=已取消,0=呼叫中,1=已接单,2=进行中,3=待支付,4=司机已到达,5=预约单司机待出发,99=已完成'
				timer1: null, //排队超时
				arr1: [0, 1, 2, 4, 5, 3], //需要定时器
				arr2: [-2, -1, 99], //清除定时
				arr3: [1, 2, 3, 4, 5, 99], //显示司机组件
				ispay: false, //支付弹窗
				// 地图
				latitude: '',
				longitude: '',
				polyline: [],
				covers: [],
				refund_id:'',//退款详情id
			}
		},
		computed: {
			// covers() {
			// 	return [{
			// 		id: 1,
			// 		latitude: this.latitude,
			// 		longitude: this.longitude,
			// 		iconPath: '../../static/now.png',
			// 		title: '当前位置',
			// 		width: 25,
			// 		height: 25
			// 	}, {
			// 		id: 2,
			// 		latitude: this.info.start_latitude,
			// 		longitude: this.info.start_longitude,
			// 		iconPath: '../../static/start.png',
			// 		title: '起点位置',
			// 		width: 40,
			// 		height: 40
			// 	}, {
			// 		id: 3,
			// 		latitude: this.info.end_latitude,
			// 		longitude: this.info.end_longitude,
			// 		iconPath: '../../static/end.png',
			// 		title: '终点位置',
			// 		width: 40,
			// 		height: 40
			// 	}]
			// }
		},
		onLoad(option) {
			this.id = option.id
			if(option.refund_id){
				this.refund_id = option.refund_id
			}
		},
		onShow() {
			this.init()
		},
		onUnload() {
			clearInterval(this.timer1)
		},
		onHide() {
			clearInterval(this.timer1)
		},
		methods: {
			init() {
				let _this = this
				this.$http('/addons/ddrive/hyorder/info', {
					order_id: this.id
				}, "POST").then(data => {
					this.info = data
					uni.setNavigationBarTitle({
						title:this.info.status_text
					})
					if (this.arr1.includes(this.info.status * 1)) {
						this.timer1 = setInterval(() => {
							this.update()
						}, 5000)
					}
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							console.log('当前位置的经度1：' + res.longitude);
							console.log('当前位置的纬度1：' + res.latitude);
							_this.longitude = res.longitude
							_this.latitude = res.latitude
							_this.covers = [{
								id: 1,
								latitude: _this.latitude,
								longitude: _this.longitude,
								iconPath: '../../static/now.png',
								title: '当前位置',
								width: 25,
								height: 25
							}, {
								id: 2,
								latitude: _this.info.start_latitude,
								longitude: _this.info.start_longitude,
								iconPath: '../../static/start.png',
								title: '起点位置',
								width: 40,
								height: 40
							}]
							_this.info.shaddress.forEach((item, i) => {
								_this.covers.push({
									id: 3 + i,
									latitude: item.end_latitude,
									longitude: item.end_longitude,
									iconPath: '../../static/end.png',
									title: '终点位置',
									width: 40,
									height: 40
								})
							})
							
							_this.polyline = []
							_this.getLine()
						}
					});
				})
			},
			update() {
				this.$http('/addons/ddrive/hyorder/info', {
					order_id: this.id
				}, "POST").then(data => {
					this.info = data
					if (this.arr2.includes(this.info.status * 1)) {
						clearInterval(this.timer1)
					}
				})
			},
			getLine() {
				var that = this;
				var key = '4212e2ed80856520bc1a2e44153333fc';
				var myAmapFun = new amapFile.AMapWX({
					key: key
				});
				// 1 还没接到人  所在地到起点，起点到终点
				let arr = ['0', '1', '5', '4']
				let end=[]
				this.info.shaddress.forEach((item) => {
					end.push(item.end_longitude + ',' + item.end_latitude)
				})
				console.log(22222222,end);
				// if (arr.includes(this.info.status)) {
					this.lineData(myAmapFun, this.longitude + ',' + this.latitude, this.info.start_longitude + ',' + this.info.start_latitude,
						"#ffb04e")
					this.lineData(myAmapFun, this.info.start_longitude + ',' + this.info.start_latitude,end[0],"#ff4b4e")
					if(end.length>1){
						end.forEach((item,i)=>{
							this.lineData(myAmapFun,end[i],end[i+1],"#28d32e")
						})
					}
				// }
				// 2 途中  所在地到终点
				// if (this.info.status == 2) {
				// 	this.lineData(myAmapFun, this.info.start_longitude + ',' + this.info.start_latitude, this.longitude + ',' + this.latitude,
				// 		"#c6c6c5")
				// 	this.lineData(myAmapFun, this.longitude + ',' + this.latitude, end.split(',') ,
				// 		"#28d32e")
				// }
				// 3 完成、取消、待支付：起点到终点
				// let arr1 = ['-2', '-1', '3', '99']
				// if (arr1.includes(this.info.status)) {
				// 	this.lineData(myAmapFun, this.info.start_longitude + ',' + this.info.start_latitude, end.split(',') ,
				// 		"#28d32e")
				// }
			},
			lineData(myAmapFun, origin, destination, color) {
				let that = this
				myAmapFun.getDrivingRoute({
					origin,
					destination,
					success(data) {
						if (data.paths && data.paths[0] && data.paths[0].steps) {
							var steps = data.paths[0].steps;
							var points = [];
							for (var i = 0; i < steps.length; i++) {
								var poLen = steps[i].polyline.split(';');
								for (var j = 0; j < poLen.length; j++) {
									points.push({
										longitude: parseFloat(poLen[j].split(',')[0]),
										latitude: parseFloat(poLen[j].split(',')[1])
									})
								}
							}
						}
						that.polyline.push({
							points: points,
							color,
							width: 10,
							arrowLine: true,
						})
					},
					fail(info) {
						console.log(444444, info);
					}
				});
			},
			toNav(status) {
				// if (status == 2) {
				// 	plus.runtime.openURL("androidamap://navi?sourceApplication=ddcar&lat=" + this.info.end_latitude + "&lon=" + this.info
				// 		.end_longitude + "&dev=0&style=2")
				// } else {
					// plus.runtime.openURL("androidamap://navi?sourceApplication=appname&lat=" + this.info.shaddress[this.info.shaddress.length-1].end_latitude + "&lon=" +
						// this.info.shaddress[this.info.shaddress.length-1].end_longitude + "&dev=0&style=2")
				// }
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						console.log(res.platform);
						if(res.platform=='android'){
							plus.runtime.openURL("androidamap://navi?sourceApplication=appname&lat=" + _this.info.shaddress[_this.info.shaddress.length-1].end_latitude + "&lon=" +
								_this.info.shaddress[_this.info.shaddress.length-1].end_longitude + "&dev=0&style=2")
						}else if(res.platform=='ios'){
							plus.runtime.openURL("iosamap://navi?sourceApplication=appname&lat=" + _this.info.shaddress[_this.info.shaddress.length-1].end_latitude + "&lon=" +
								_this.info.shaddress[_this.info.shaddress.length-1].end_longitude + "&dev=0&style=2")
						}
					}
				})
			},
			toAnquan() {
				uni.navigateTo({
					url: '/pages/home/security'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.navigation {
		position: fixed;
		right: 10rpx;
		top: 100rpx;
		width: 100rpx;
		height: 100rpx;
	}
</style>
