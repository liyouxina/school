<template>
	<view class="w100 bg-white relative pb-40" style="border-radius: 10px 10px 0px 0px;">
		<view class="center ptb-30 bb bold">待支付金额</view>
		<u-icon @click="close" name="close" class="absolute size-32" style="left: 30rpx; top: 34rpx;"></u-icon>
		<view class="ml-40 pr-40 mt-30 pb-30 bb">
			<view class="flex">
				<view class="">
					{{info.sf_type?'总计费用':'里程费'}}
				</view>
				<view class="">
					{{info.sf_type?info.order_money:price1.toFixed(2)}}
				</view>
			</view> 
			<view class="flex mt-10" v-if="!info.sf_type">
				<view class="">
					等待费
				</view>
				<view class="">
					{{info.overtime_price}}
				</view>
			</view>
			<view class="flex size-26 mt-10">
				<view class="red">
					优惠券
				</view>
				<view class="" @click="toCoupon">
					<text class="gray-1" v-if="!coupon.id">{{userInfo.coupon_count}}张</text>
					<text class="red" v-else>-{{coupon.price}}</text>
					<u-icon name="arrow-right" class="gray-2 ml-10"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="plr-60 center mt-10">
			<view class="red" v-if="!coupon.id">
				￥<text class="size-42 bold">{{info.sf_type?info.order_money:info.price}}</text>
			</view>
			<view class="red" v-else>
				￥<text class="size-42 bold">{{price}}</text>
			</view>
			<!-- <view class="">
				<text>费用明细</text>
				<u-icon name="arrow-right" class="gray-2 ml-10"></u-icon>
			</view> -->
		</view>
		<view class="plr-36">
			<u-radio-group v-model="value" active-color="#00c28e" @change="radioGroupChange">
				<u-radio name="2" class="w100 ptb-30">
					<view class="w100 u-flex-1 flex1 flex-middle">
						<image src="../../static/vx.png" mode=""></image>
						<text class="ml-30">微信支付</text>
					</view>
				</u-radio>
				<!-- #ifndef MP-WEIXIN -->
				<u-radio name="1" class="w100">
					<view class="u-flex-1 flex1 flex-middle">
						<image src="../../static/zfb.png" mode=""></image>
						<text class="ml-30">支付宝支付</text>
					</view>
				</u-radio>
				<!-- #endif -->

			</u-radio-group>
		</view>
		<view class="plr-36 mt-40">
			<u-button type="primary" >社区版不含支付，如需测试支付请联系作者</u-button>
		</view>
	</view>

</template>

<script>
	import NP from 'number-precision'
	import {mapState} from 'vuex'
	export default {
		props: ['info'],
		data() {
			return {
				value: '2',
				coupon: {}
			}
		},
		computed:{
			...mapState(["userInfo"]),
			price(){
				return this.info.sf_type?NP.minus(this.info.order_money,this.coupon.price||0):NP.minus(this.info.price,this.coupon.price||0)
			},
			price1(){
				return this.info.sf_type?0:NP.minus(this.info.price,this.info.overtime_price||0)
			}
		},
		mounted() {
			console.log(this.info);
			uni.$on("coupon",(option)=>{
				console.log(option);
				this.coupon = option
			})
		},
		destroyed() {
			uni.$off("coupon")
		},
		methods: {
			close() {
				this.$emit('close')
			},
			radioGroupChange(e) {
				console.log(e);
				this.value = e
			},
			submit() {
				let _this = this
				//微信支付
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						_this.pay(loginRes.code)
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
					this.pay()
				// #endif
			},
			pay(code){

			},
			toCoupon(){
				uni.navigateTo({
					url:'/pages/my/coupon/list?sf_type='+this.info.sf_type+'&id='+this.info.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	/deep/.u-radio-group {
		width: 100% !important;
	}

	/deep/.u-radio {
		width: 100% !important;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}
</style>
