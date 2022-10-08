<template>
	<view style="padding-bottom: 150rpx;">
		<!-- 出发-目的地 -->
		<view class="flex plr-36 ptb-20" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.09);">
			<view class="bold">
				{{info.start_city}}-{{info.end_city}}
			</view>
			<view class="green">
				{{info.statusText}}
			</view>
		</view>
		<!-- 详情 -->
		<view class="plr-36 pb-30 bb">
			<view class="list flex1 flex-middle mt-30">
				<image src="../../static/icon-1.png" mode=""></image>
				<view class="gray-2 mlr-10">【起点】</view>
				<view class="">
					{{info.start_city}}-{{info.start_name}}
				</view>
			</view>
			<view class="list flex1 flex-middle mt-30">
				<image src="../../static/icon-2.png" mode=""></image>
				<view class="gray-2 mlr-10">【终点】</view>
				<view class="">
					{{info.end_city}}-{{info.end_name}}
				</view>
			</view>
			<view class="list flex1 flex-middle mt-30">
				<image src="../../static/icon-3.png" mode=""></image>
				<view class="gray-2 mlr-10">【出发时间】</view>
				<view class="">
					{{info.start_time}}
				</view>
			</view>
			<view class="list flex1 flex-middle mt-30" v-if="info.order_type==2&&info.status==1">
				<image src="../../static/icon-4.png" mode=""></image>
				<view class="gray-2 mlr-10">【余座】</view>
				<view class="">
					{{info.more_seats}}人
				</view>
			</view>
			<view class="list flex1 flex-middle mt-30" v-else>
				<image src="../../static/icon-4.png" mode=""></image>
				<view class="gray-2 mlr-10">【预定座位】</view>
				<view class="">
					{{info.people_num}}人
				</view>
			</view>
			<view class="list flex1 mt-30" v-if="info.order_type==2">
				<image src="../../static/icon-5.png" mode=""></image>
				<view class="gray-2 mlr-10 mt-6">【路线】</view>
				<view class="u-flex-1 mt-6">
					{{info.route}}
				</view>
			</view>
			<view class="list flex1 flex-middle mt-30" v-if="info.order_type==2">
				<image src="../../static/icon-6.png" mode=""></image>
				<view class="gray-2 mlr-10">【车型】</view>
				<view class="">
					{{info.car_type}}
				</view>
			</view>
			<view class="list flex1 mt-30" v-if="info.remark">
				<image src="../../static/icon-7.png" mode=""></image>
				<view class="gray-2 mlr-10 mt-6">【备注】</view>
				<view class="mt-6">
					{{info.remark}}
				</view>
			</view>
		</view>
		<!-- 司机-电话 -->
		<view style="height: 300rpx;" v-if="info.order_type==1&&info.status==1"></view>
		<view class="flex plr-36 ptb-25" v-else>
			<view class="flex1 flex-middle">
				<view class="img-siji">
					<image src="../../static/siji.png" mode=""></image>
				</view>
				<view class="ml-20">
					<view class="size-34 bold">
						{{info.truename}}
					</view>
					<view class="mt-10">
						分摊费用：<text class="red" v-if="info.car_price">￥{{info.car_price}}/座</text><text v-else class="red">暂无报价</text>
					</view>
				</view>
			</view>
			<view class="img-tel" @click="call(info.tel)" v-if="info.status!=1&&info.status!=5">
				<image src="../../static/tel.png" mode=""></image>
			</view>
			<!-- 投诉 -->
			<view class="img-tel" @click="tousu()" v-if="info.status==5">
				<image src="../../static/complaints-icon.png" mode=""></image>
			</view>
		</view>

		<!-- 取消按钮 -->
		<view class="plr-36 mt-100" v-if="info.order_type==2&&info.status!=4&&info.status!=5">
			<u-button type="primary" @click="book" v-if="info.status==1">预订</u-button>
			<u-button type="primary" @click="cancel" v-if="info.status==3">取消预订</u-button>
		</view>
		<view class="plr-36 mt-100" v-if="info.order_type==1&&info.status!=4&&info.status!=5">
			<u-button type="primary" @click="cancel" v-if="[1,2,3].includes(info.status*1)">取消预约</u-button>
		</view>
		<view class="plr-36 mt-100" v-if="info.status==4&&info.pay_status==0">
			<u-button type="primary" @click="pay">立即支付</u-button>
		</view>
		<view class="plr-36 mt-100" v-if="info.status==4&&info.pay_status==1">
			<u-button type="primary" disabled="true">订单已支付</u-button>
		</view>


		<!-- 评价该服务 -->
		<view class="plr-36 ptb-40  mt-100" v-if="info.status==5">
			<view class="mb-40">
				<text class="bold">评价该服务</text>
				<text class="gray-2 size-26 plr-10 mlr-15" style="background: #eee;">匿名</text>
			</view>
			<view class="center">
				<u-rate @change="comment" :count="5" v-model="score" active-color="#EA0000" inactive-color="#999" :disabled="false"
				 gutter="50" size="50"></u-rate>
			</view>
		</view>

		<!-- 温馨提示 -->
		<view class="plr-36 mt-30" v-if="info.order_type==1&&info.status==1">
			<view class="">
				温馨提示：
			</view>
			<view class="size-26 mt-10">
				1.拼单提交成功后，系统会为您匹配与您出行时间相符的车主， 并实时通知给您。
			</view>
			<view class="size-26 mt-10">
				2.<text class="green">匹配成功，不是预约成功。</text>此功能仅仅是通知提醒功能，拼 友还是要自己判断车主路线是否适合自己，并进行预订。
			</view>
		</view>
		<view class="plr-36 mt-30" v-if="info.order_type==1&&info.status==2">
			<view class="">
				温馨提示：
			</view>
			<view class="size-26 mt-10">
				注：司机接单后，会有司机与您电话联系，并与您协商分摊费 用，请注意接听电话
			</view>
		</view>
		<view class="plr-36 mt-30" v-if="info.status==3">
			<view class="">
				温馨提示：
			</view>
			<view class="size-26 mt-10">
				1.如您行程改变，请尽可能提前退订，<text class="green">{{info.time}}</text>前可退订.
			</view>
			<view class="size-26 mt-10">
				2.请在上车后，将分摊费用<text class="green">支付给车主</text>，平台不代收费用。
			</view>
			<view class="size-26 mt-10">
				3.如车主有违规行为，点我<text class="green">投诉车主</text>
			</view>
		</view>
		<bookTip class="fixed-bottom bg-white" v-if="info.order_type==2&&info.status==1"></bookTip>
		<u-popup v-model="show" mode="bottom">
			<dtPay @close="show=false" @update="init" :info="info"></dtPay>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				info: {}, //-2 超时-1=已取消,1=待接单,2=待确认,3=待出发,4=行驶中,5=已完成
				show:false, //支付
				score:0,
				arr:[1,2,3,4],
				timer:null
			};
		},
		onLoad(option) {
			this.id = option.id
		},
		onShow() {
			this.init()
		},
		onUnload() {
			clearInterval(this.timer)
			this.timer = null
		},
		onHide() {
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			init() {
				this.$http('/addons/ddrive/sforder/info', {
					order_id: this.id
				}).then(data => {
					this.info = data
					if(this.arr.includes(data.status*1)&&!this.timer){
						this.timer = setInterval(()=>{
							this.update()
						},2000)
					}
					this.score = data.score
					uni.setNavigationBarTitle({
						title: this.info.statusText
					})
				})
			},
			update() {
				this.$http('/addons/ddrive/sforder/info', {
					order_id: this.id
				}).then(data => {
					this.info = data
					if(!this.arr.includes(data.status*1)&&this.timer){
						clearInterval(this.timer)
						this.timer = null
					}
					this.score = data.score
					uni.setNavigationBarTitle({
						title: this.info.statusText
					})
				})
			},
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel //仅为示例
				});
			},
			tousu(){
				uni.navigateTo({
					url:'../../pages/my/complaints/index?sf_type=1&id='+this.id
				})
			},
			// 预订
			book() {
				uni.navigateTo({
					url: "/pages/shunfeng/confirm-book?id=" + this.id
				})
			},
			cancel() {
				if (this.info.status == 3) {
					// 原因
					uni.navigateTo({
						url: '/pages/home/dj-cancel?id=' + this.id + '&type=2'
					})
				} else {
					this.$http('/addons/ddrive/sforder/cancel', {
						order_id: this.id
					}).then(() => {
						uni.showToast({
							title: "取消成功"
						})
						setTimeout(() => {
							this.init()
						}, 800)
					})
				}
			},
			pay(){
				this.show=true
			},
			comment(value){
				this.$http('/addons/ddrive/sforder/comment', {
					order_id: this.id,
					score:value
				}).then(() => {
					uni.showToast({
						title: "评价成功"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	.list {
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	.img-siji {
		image {
			width: 130rpx;
			height: 134rpx;
		}
	}

	.img-tel {
		image {
			width: 86rpx;
			height: 86rpx;
		}
	}

	.img-tousu {
		image {
			width: 86rpx;
			height: 86rpx;
		}
	}
</style>
