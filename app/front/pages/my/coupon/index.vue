<template>
	<view class="box w100 min100">
		<u-tabs-swiper ref="tabs" :list="tabslist" :current="current" bg-color="#00C28E" inactive-color="#EEEEEE"
		 active-color="#fff" :is-scroll="false" @change="tabsChange"></u-tabs-swiper>
		<empty v-if="list.length==0" text="社区版暂未开放此功能,商用版请联系作者"></empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabslist: [{
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}],
				current: 0,
				list: [],
				img1:'../../../static/coupon-1.png',
				img2:'../../../static/coupon-2.png',
				img3:'../../../static/coupon-3.png'
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			tabsChange(e) {
				this.current = e
				this.init()
			},
			init() {
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		background: #F8F8F8;
		overflow: hidden;
	}

	.list {
		position: relative;
	}
	.img{
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.list::before {
		position: absolute;
		content: "";
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background: #f8f8f8;
		margin-top: -18rpx;
		top: 50%;
		left: -18rpx;
	}

	.list::after {
		position: absolute;
		content: "";
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background: #f8f8f8;
		margin-top: -18rpx;
		top: 50%;
		right: -18rpx;
	}
</style>
