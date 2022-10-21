<template>
	<view>
		<view class="img text-center mt-65">
			<image src="../../static/IDcard-success.png" mode=""></image>
		</view>
		<view class="mt-20 size-34 bold green text-center">
			您已经通过实名认证
		</view>
		<view class="mt-60">
			<u-cell-item title="姓名" :value="userInfo.truename" :arrow="false"></u-cell-item>
		</view>
		<u-cell-item title="手机号" :value="userInfo.mobile" :arrow="false"></u-cell-item>
		<u-cell-item title="证件号" :value="userInfo.idcard" :arrow="false"></u-cell-item>
		<view class="fixed-bottom size-26 gray-2 text-center" style="bottom: 156rpx;">
			身份证号只供平台确认信息使用
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-cell_title{
		font-weight: 400 !important;
	}
	.img{
		image{
			width: 102rpx;
			height: 102rpx;
		}
	}
</style>
