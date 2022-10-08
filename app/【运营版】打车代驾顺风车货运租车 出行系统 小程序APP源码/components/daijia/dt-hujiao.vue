<template>
	<view class="w100 bg-white pb-40" style="border-radius: 10rpx 10rpx 0 0;">
		<view class="ptb-40 text-center">
			确认路线
		</view>
		<view class="ptb-15 plr-36 flex img" style="background: rgba(0,194,142,.3);">
			<view class="size-26 green">
				社区版仅用作学习研究，商业版请联系作者。切不可篡改并用于商业用途，否则后果自负。
			</view>
			<image src="../../static/warning-icon.png" mode=""></image>
		</view>
		<view class="mt-40 text-center">
			预计<text class="red size-42">{{price}}</text>元
		</view>
		<!-- <view class="mt-20 text-center gray-2">
			券已抵扣<text>14</text>元
		</view> -->
		<view class="plr-36 mt-40 flex_l size-26">
			<u-radio-group v-model="value" active-color="#00C28E" @change="radioGroupChange">
				<u-radio name="1" :label-disabled="false"></u-radio>
			</u-radio-group>
			<view class="ml-20">
				遵守上述提示
				<text class="green" @click="goDetails(14,'代驾服务协议')">《代驾服务协议》</text>
				<text class="green" @click="goDetails(15,'计价规则')">《计价规则》</text>
			</view>
		</view>
		<view class="mlr-36 mt-30 change-green white text-center size-32" style="height: 96rpx;line-height: 96rpx;" @click="submit">
			呼叫代驾
		</view>
	</view>
</template>

<script>
	export default {
		props: ['price'],
		data() {
			return {
				value: '1'
			}
		},
		methods: {
			radioGroupChange(e) {
				console.log(e);
			},
			goDetails(id,title){
				uni.navigateTo({
					url:'/pages/my/details?id=' + id + '&title=' + title
				})
			},
			submit(){
				this.$emit('hujiao')
			}
		}
	}
</script>

<style lang="scss">
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	/deep/.u-radio {
		display: flex;
		flex-direction: row-reverse;
	}
	
	/deep/.u-radio__label {
		margin-left: 0;
		margin-right: 0;
	}

	.img {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
