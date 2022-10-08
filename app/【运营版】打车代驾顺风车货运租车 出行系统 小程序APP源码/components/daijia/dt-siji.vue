<template>
	<view class="bg-white w100 pb-40" style="border-radius: 40px 40px 0px 0px;">
		<!-- status 1=已接单,2=进行中,3=待支付,4=司机已到达,5=预约单待司机出发,99=已完成-->
		<view class="flex bb mlr-36 ptb-30" v-if="info.status==1||info.status==4||info.status==5">
			<view>
				<view class="size-40 bold">{{info.status==1||info.status==5?'司机已接单':'司机已到达'}}</view>
				<view class="size-26 mt-6">请准时前往出发地点</view>
			</view>
			<view class="gray-2 ptb-10 plr-30 center" style="border:1rpx solid #999;" @click="cancle(info.status)">取消订单</view>
		</view>
		<view class="plr-36 flex ptb-30 bb" v-if="info.status==99">
			<view>实际费用</view>
			<view class="">
				<view class="" v-if="huoyun">
					<text class="size-40 red" >{{info.discount_price}}</text>元
				</view>
				<view class="" v-else>
					<text class="size-40 red" >{{info.price}}</text>元
				</view>
				<!-- <view class="size-26 red">
					已优惠7元
				</view> -->
			</view>
			<!-- <view class="">
				费用明细
				<u-icon name="arrow-right" color="#999" size="35"></u-icon>
			</view> -->
		</view>
		<view class="flex plr-36 pt-40" v-if="info.driver">
			<view class="flex1 flex-middle">
				<view class="img">
					<image src="../../static/siji.png" mode=""></image>
				</view>
				<view class="ml-20">
					<view class="mb-10">
						{{info.driver.nickname}}
					</view>
					<view class="flex_l">
						<u-rate :count="5" v-model="info.driver.score" size="26" active-color="#EE8931" inactive-color="#999" :disabled="true"></u-rate>
						<view class="red size-26 ml-20">{{info.driver.score}}分</view>
					</view>
				</view>
			</view>
			<view class="img1">
				<image v-if="info.status==99" @click="tousu" src="../../static/tousu.png" mode=""></image>
				<image v-else @click="call(info.driver.mobile)" src="../../static/tel.png" mode=""></image>
			</view>
		</view>
		<view class="pd-36" v-if="info.status==2||(huoyun&&info.status==3)">
			<u-button type="primary" @click="call('110')">一键报警</u-button>
		</view>
		<view class="plr-36 flex img1 mt-20" v-if="info.status==99">
			<image class="mr-30" @click="call('110')" src="../../static/baojing.png" mode=""></image>
			<view class="u-flex-1 center ptb-23 bg-gray-2 white">订单已完成</view>
		</view>
		<view class="plr-36 pt-30 pb-60 flex" v-if="info.status==3 && !huoyun">
			<view class="u-flex-1 mr-30 center green bold ptb-20 radius-10" style="border:1rpx solid #00C28E" @click="call('110')">一键报警</view>
			<view class="u-flex-1 white center bg-green bold ptb-20 radius-10" style="border:1rpx solid #00C28E" @click="pay">立即支付</view>
		</view>
		<view class="plr-36 ptb-40" v-if="info.status=='99'">
			<view class="mb-40">
				<text class="bold">评价该服务</text>
				<text class="gray-2 size-26 plr-10 mlr-15" style="background: #eee;">匿名</text>
			</view>
			<view class="center">
				<u-rate @change="comment" :count="5" v-model="score" active-color="#EE8931" inactive-color="#999" :disabled="false" gutter="50" size="50"></u-rate>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['info','huoyun'], //1=已接单,2=进行中,3=待支付,4=司机已到达,5=预约单待司机出发,99=已完成
		data() {
			return {
			}
		},
		computed:{
			score(){
				return this.info.score||0
			}
		},
		methods: {
			change(e) {
				console.log(e);
			},
			// 1、5 司机已接单  4 司机已到达
			cancle(status) {
				if(this.huoyun){
					uni.navigateTo({
						url:'/pages/huoyun/cancle-order?id='+this.info.id
					})
				}else{
					if(status==1||status==5){
						uni.navigateTo({
							url:'/pages/home/dj-cancel?id=' + this.info.id + '&type=1'
						})
					}else if(status==4){
						uni.navigateTo({
							url:'/pages/home/cancel?tel=' + this.info.driver.mobile
						})
					}
				}
			},
			call(tel) {
				uni.makePhoneCall({
					phoneNumber: tel //仅为示例
				});
			},
			tousu(){
				let sf_type = this.huoyun?2:''
				uni.navigateTo({
					url:'../../pages/my/complaints/index?id='+this.info.id + '&sf_type=' + sf_type
				})
			},
			pay(){
				// this.$emit('pay')
				uni.navigateTo({
					url:'/pages/home/detailpay?id=' + this.info.id
				})
			},
			// 评分
			comment(value){
				this.$http(this.huoyun?'/addons/ddrive/hyorder/comment':'/addons/ddrive/order/comment', {
					order_id: this.info.id,
					score:value
				}, "POST").then(data => {
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img {
		image {
			width: 90rpx;
			height: 90rpx;
		}
	}

	.img1 {
		image {
			width: 86rpx;
			height: 86rpx;
		}
	}
</style>
