<template>
	<view>
		<view class="mlr-36 blue size-26 pd-26 radius-10" style="background: #F3F0FF;">
			取消订单一经提交后不可撤销和修改，保险订单将一并退
			款。申请后平台将在2天内处理，订单钱款将会原路退回；
			已使用的优惠券不再退回。
		</view>
		<view class="plr-36 ptb-30" style="border-bottom: 1rpx solid #F8F8F8;">
			<view class="flex1 flex-middle">
				<view class="">
					<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				</view>
				<view class="ml-20 gray-2">
					{{info.start}}
				</view>
			</view>
			<view class="flex1 flex-middle mt-30" v-for="(item,i) in info.shaddress" :key="i" >
				<view class="">
					<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
				</view>
				<view class="ml-20 u-flex-1 flex">
					<view class="gray-2">
						{{item.end}}
					</view>
					<!-- <view class="">
						{{item.floor}}
					</view> -->
				</view>
			</view>
		</view>
		<view v-if="info.pay_method==1">
			<view class="plr-36 ptb-30 flex" style="border-bottom: 1rpx solid #F8F8F8;">
				<view class="gray-2">
					退款金额(实付金额)
				</view>
				<view class="">
					<text class="red size-26 bold">￥</text>
					<text class="red size-40 bold">{{info.discount_price}}</text>
				</view>
			</view>
			<view class="plr-36 ptb-30" style="border-bottom: 1rpx solid #F8F8F8;">
				<view class="flex gray-2">
					<view class="">
						退款账户
					</view>
					<view class="">
						<text class="red size-26 bold">￥</text>
						<text class="red size-40 bold">{{info.discount_price}}</text>
					</view>
				</view>
				<view class="gray-2 size-26 mt-10">
					(1-3个工作日到账，若原路退回失败，款项会尝试退还至您钱
					包的余额）
				</view>
			</view>
			
		</view>
	<view class="plr-36 pt-30" style="padding-bottom: 150rpx;">
			<view class="gray-2">
				退款原因（必选）
			</view>
			<u-radio-group v-model="value" @change="radioGroupChange" active-color="#00c28e" class="w100">
				<u-radio name="1" :disabled="false" class="w100 flex flex-reverse mt-20">
					联系不上司机
				</u-radio>
				<u-radio name="2" :disabled="false" class="w100 flex flex-reverse mt-20">
					司机要求取消订单
				</u-radio>
				<u-radio name="3" :disabled="false" class="w100 flex flex-reverse mt-20">
					司机要求加价或现金交易
				</u-radio>
				<u-radio name="4" :disabled="false" class="w100 flex flex-reverse mt-20">
					选择其他出行工具
				</u-radio>
				<u-radio name="5" :disabled="false" class="w100 flex flex-reverse mt-20">
					行程有变
				</u-radio>
				<u-radio name="6" :disabled="false" class="w100 flex flex-reverse mt-20">
					目的地有误
				</u-radio>
			</u-radio-group>
		</view>
		<view class="fixed-bottom pd-30">
			<u-button type="primary" :disabled="!value" @click="submit">确认取消订单</u-button>
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
				id:'',
				value:'',
				info:{}
			};
		},
		computed: {
			// ...mapState(['userInfo'])
		},
		onLoad(option) {
			this.id = option.id
			this.init()
		},
		methods: {
			init(){
				this.$http('/addons/ddrive/hyorder/info',{order_id:this.id},"POST").then(data=>{
					this.info=data
				})
			},
			radioGroupChange(e){
				console.log(e);
			},
			submit(){
				this.$http('/addons/ddrive/hyorder/cancel',{
					order_id: this.id,
					cancel_type: this.value
				},"POST").then(data=>{
					uni.showToast({
						title: '取消订单成功',
						icon:'none'
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/huoyun/order-detail?refund_id=' + data.refund_id + '&id=' + this.id
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-radio__label{
		margin-left: 0;
	}
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	
	/deep/.u-btn--primary--disabled {
		background-color: $bg-1 !important;
	}
	.flex-reverse{
		flex-direction: row-reverse;
	}
	/deep/.u-radio{
		width: 100% !important;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
</style>
