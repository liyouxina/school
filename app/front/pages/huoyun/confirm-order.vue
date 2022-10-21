<template>
	<view class="bt">
		<view class="flex plr-36 ptb-20">
			<view class="bold">
				{{type==1?'小面':type==2?'中面':type==3?'依维柯':type==4?'中货':type==5?'5米2':'6米8'}}
			</view>
			<view class="img-header">
				<image :src="img" mode="aspectFill"></image>
			</view>
		</view>
		<view class="" style="height: 20rpx;background: #F8F8F8;"></view>
		<view class="plr-36 ptb-30">
			<view class="flex1 flex-middle">
				<view class="">
					<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				</view>
				<view class="ml-20">
					{{start.name}}
				</view>
			</view>
			<view class="flex1 flex-middle mt-30" v-for="(item,i) in hyaddress" :key="i">
				<view class="">
					<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				</view>
				<view class="ml-20 u-flex-1 flex">
					<view class="">
						{{item.address.name}}
					</view>
					<view class="">
						{{item.floor}}
					</view>
				</view>
			</view>
			<!-- <view class="mt-30 flex">
				<view class="flex1 flex-middle">
					<view class="">
						搬运服务
					</view>
					<view class="ml-10" @click="show=true">
						<u-icon name="question-circle" color="#999"></u-icon>
					</view>
				</view>
				<view class="">
					<u-switch v-model="checked" size="30"></u-switch>
				</view>
			</view> -->
		</view>
		<view class="" style="height: 20rpx;background: #F8F8F8;"></view>
		<view class="">
			<view class="active" @click="show=true">
				<u-cell-item title="用车时间" :value="time=='预约'?'现在用车':time"></u-cell-item>
			</view>
			<view class="active">
				<u-cell-item title="联系电话" :value="userInfo.mobile" :arrow="false"></u-cell-item>
			</view>
			<view :class="[num=='请选择跟车人数'?'':'active']">
				<u-cell-item title="跟车人数(必填)" :value="num" @click="show1=true"></u-cell-item>
			</view>
		</view>
		<view class="" style="height: 20rpx;background: #F8F8F8;"></view>
		<view class="">
			<view :class="[demand?'active':'']">
				<u-cell-item title="额外需求" :value="demand_name" @click="goDemand"></u-cell-item>
			</view>
			<view :class="[remark=='如货物类别等'?'':'active','remark']">
				<u-cell-item title="订单备注" :value="remark" @click="goRemark"></u-cell-item>
			</view>
		</view>
		<view class="" style="height: 20rpx;background: #F8F8F8;"></view>
		<view class="active">
			<u-cell-item title="支付方式" :value="pay" @click="show2=true"></u-cell-item>
			<u-cell-item title="优惠券" class="red" :value="coupon_title" @click="goCoupon" v-if="iscoupon"></u-cell-item>
		</view>
		<view class="plr-36 pt-30" style="background: #F8F8F8;padding-bottom: 420rpx;">
			<view class="flex1 flex-middle">
				<u-radio-group v-model="value" active-color="#00C28E" @change="radioGroupChange">
					<u-radio name="1" ch :label-disabled="false"></u-radio>
				</u-radio-group>
				<view class="">
					我已阅读并同意
					<text class="green" @click="goDetails(18,'货物托运居间服务协议')">《货物托运居间服务协议》</text>
				</view>
			</view>
		</view>
		<view class="fixed-bottom">
			<view class="size-26 center plr-36" style="height: 60rpx;background: rgba(0,194,142,.3);">
				<view class="green">
					若产生高速费、停车费和搬运费，请用户额外支付
				</view>
				<view class="img-warning">
					<image src="../../static/my-icon-6.png" mode=""></image>
				</view>
			</view>
			<view class="bg-white">
				<view class="center ptb-35">
					<text class="red size-26 bold">￥</text>
					<text class="red size-40 bold">{{money}}</text>
					<text class="ml-10" @click="goChagre">费用标准</text>
				</view>
				<view class="mlr-36 pb-35">
					<u-button type="primary" @click="submit">确认叫车</u-button>
				</view>
			</view>
		</view>
		<!-- 时间 -->
		<u-popup v-model="show" mode="bottom" height="400" @close="show=false">
			<longDate type="day" :openStatus="true" :getDayNum="3" :chooesMaxDay="3" @select="onSelectTime">
			</longDate>
		</u-popup>
		<!-- 跟车人数 -->
		<u-select v-model="show1" :list="list" @confirm="confirm"></u-select>
		<!-- 支付方式 -->
		<u-select v-model="show2" :list="list1" @confirm="confirm1"></u-select>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import longDate from '../../components/long-date/long-date.vue'
	import NP from 'number-precision'
	export default {
		data() {
			return {
				coupon_id: '',
				type: 0,
				money: 0,
				time: '',
				img: '',
				checked: false,
				num: '请选择跟车人数',
				demand: '',
				demand_name: '是否需要搬运、返程等服务',
				remark: '如货物类别等',
				pay: '在线支付', //支付方式
				coupon: {},
				iscoupon: true, //是否显示优惠券
				show: false,
				show1: false,
				value: '1',
				list: [{
						value: '1',
						label: '0人'
					},
					{
						value: '2',
						label: '1人'
					},
					{
						value: '3',
						label: '2人'
					}
				],
				show2: false,
				list1: [{
						value: '1',
						label: '在线支付'
					},
					{
						value: '2',
						label: '货到付款'
					}
				],
				end_address: [],
				coupon_title: '', //优惠券提示
			};
		},
		computed: {
			...mapState(['userInfo', 'address', 'start', 'hyaddress'])
		},
		components: {
			longDate
		},
		onLoad(option) {
			this.$store.dispatch('updateUserInfo')
			this.coupon_title = this.userInfo.coupon_count + '张优惠券';
			this.type = option.id
			this.time = option.time
			this.money = option.price
			this.init()
			//额外需求
			uni.$on('demand', res => {
				console.log(res);
				this.demand = res.demand
				this.getPrice()
				if (res.demand) {
					if (res.demand.split(',').length > 2) {
						this.demand_name = res.demand_name + '等；'
					} else {
						this.demand_name = res.demand_name
					}
				} else {
					this.demand_name = "是否需要搬运、返程等服务"
				}
			})
			//备注
			uni.$on('remark', res => {
				this.remark = res.remark
			})
			//优惠券
			uni.$on("coupon", (res) => {
				console.log(res);
				this.coupon = res
				// this.money = NP.minus(this.money,res.price||0)
				this.coupon_title = '-' + res.price
				this.getPrice()
			})
		},
		methods: {
			init() {
				this.$http('/addons/ddrive/freight/Info', {
					car_id: this.type
				}, "POST").then(data => {
					this.img = data.car_image
				})
			},
			getPrice() {
				// let coupon_id = this.coupon.id?this.coupon.id:''
				this.$http('/addons/ddrive/hyorder/amount', {
					start_lat: this.start.latitude,
					start_lng: this.start.longitude,
					end_address: JSON.stringify(this.hyaddress),
					car_id: this.type,
					demand: this.demand.includes('2') ? 1 : '',
					coupond_id: this.coupon.id || ''
				}, "POST").then(data => {
					this.money = data.distance_price
				}).catch(() => {
					this.money = '--'
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
					this.show = false
				}
			},
			//跟车人数
			confirm(e) {
				this.num = e[0].label
			},
			//支付方式
			confirm1(e) {
				this.pay = e[0].label
				if (e[0].label == '货到付款') {
					this.iscoupon = false
					this.coupon = ''
					this.getPrice()
				} else {
					this.iscoupon = true
					this.coupon_title = this.userInfo.coupon_count + '张优惠券';
					this.coupon = ''
				}
			},
			//费用标准
			goChagre() {
				uni.navigateTo({
					url: '/pages/huoyun/charge?id=' + this.type
				})
			},
			//额外需求
			goDemand() {
				uni.navigateTo({
					url: '/pages/huoyun/other-demand'
				})
			},
			//备注
			goRemark() {
				uni.navigateTo({
					url: '/pages/huoyun/remark'
				})
			},
			// 优惠券
			goCoupon() {
				uni.navigateTo({
					url: "/pages/my/coupon/list?sf_type=2&id=''&price=" + this.money
				})
			},
			goDetails(id, title) {
				uni.navigateTo({
					url: '/pages/my/details?id=' + id + '&title=' + title
				})
			},
			submit() {
				let coupon_id = this.coupon.id ? this.coupon.id : ''
				if (this.num != '请选择跟车人数') {
					this.$http('/addons/ddrive/hyorder/create', {
						car_id: this.type,
						appointment_time: this.time == '预约' ? '' : this.time,
						people_num: this.num.split('人')[0],
						demand: this.demand,
						start_address: JSON.stringify(this.start),
						remark: this.remark == '如货物类别等' ? '' : this.remark,
						pay_method: this.pay == '在线支付' ? 1 : 2,
						mobile: this.userInfo.mobile,
						coupon_id: coupon_id,
						sh_address: JSON.stringify(this.hyaddress)
					}, "POST").then(data => {
						if (coupon_id) {
							this.$store.dispatch('updateUserInfo')
						}
						uni.showToast({
							title: '提交订单成功',
							icon: 'none'
						})
						uni.redirectTo({
							url: this.pay == '在线支付' ? '/pages/huoyun/pay?id=' + data.order_id +
								'&coupon_id=' + this.coupon_id : '/pages/huoyun/order-detail?id=' + data
								.order_id
						})
					})
				} else {
					uni.showToast({
						title: '请先选择跟车人数',
						icon: 'none'
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
	
	/deep/.active .u-cell__value {
		color: #333;
	}

	/deep/.active .u-cell__value {
		color: #333;
	}

	/deep/.remark .u-cell__value {
		margin-left: 80rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/deep/.red .u-cell__value {
		color: $red;
	}

	.img-header {
		height: 100rpx;

		image {
			width: 100rpx;
			height: 100rpx;
		}
	}

	.img-warning {
		height: 40rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
