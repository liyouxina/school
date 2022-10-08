<template>
	<view class="">
		<view class="img text-center">
			<image src="../../../static/my-phone.png" mode=""></image>
		</view>
		<view class="text-center u-m-t-30">
			当前手机号: {{userInfo.mobile}}
		</view>
		<view class="fixed-bottom plr-36 pb-80">
			<u-button type="primary" @click="gochange">更改手机号</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			// uni.setNavigationBarTitle({
			// 	title: '当前手机号'
			// });
		},
		methods: {
			gochange() {
				uni.navigateTo({
					url: '/pages/my/set/phone-change'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	.img {
		margin-top: 160rpx;

		image {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.bottom {
		position: fixed;
		bottom: 80rpx;
	}
</style>
