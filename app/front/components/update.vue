<template>
	<u-popup v-model="showModel" close-icon="close-circle-fill" :closeable="upinfo.enforce==0" close-icon-color="#fff"
	 close-icon-size="44" :mask-close-able="false" @close="close()" mode="center" width="617rpx" height="720rpx"
	 border-radius="14">
		<view class="update u-p-30">
			<view class=" u-p-l-50 u-p-r-50" style="margin-top:250rpx;">
				<view class="u-font-40 bold u-m-b-20">{{$t('update.text1')}} {{upinfo.version}} {{$t('update.text2')}}</view>
				<text class="gray-2 u-font-26" style="height:200rpx;display:block;overflow-y: scroll;">
					{{upinfo.content}}
				</text>
			</view>
			<view class="flex1" style="margin-top:30rpx;" v-if="upinfo.enforce==0">
				<view class="btn2 yellow center" @click="close()">{{$t('update.btn1')}}</view>
				<view class="btn1 white center" @click="update">{{$t('update.btn2')}}</view>
			</view>
			<view class="center" style="margin-top:30rpx;" v-if="upinfo.enforce==1">
				<view class="btn1 white center" @click="update">{{$t('update.btn2')}}</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			showModel: {
				type:Boolean
			},
			upinfo: Object
		},
		mounted() {},
		methods: {
			close() {
				//非强制关闭不在弹出
				if (this.upinfo.enforce == 0) {
					uni.setStorageSync('showUp', 1)
				}
				this.$emit('close')
				uni.showTabBar(); //显示tabbar
			},
			update() {
				this.close()
				if (uni.getStorageSync('phone') == 'ios') {

				} else {
					let _this = this
					console.log(_this.upinfo.url);
					uni.downloadFile({
						url: _this.upinfo.url,
						success: (res) => {
							if (res.statusCode === 200) {
								plus.runtime.install(res.tempFilePath); //下载成功安装apk
							}
						},
						fail: (err) => {
							console.log(err);
							uni.showToast({
								icon: 'none',
								mask: true,
								title: this.$t('update.error'),
							});
						},
					})

				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/.u-mode-center-box {
		background-color: transparent !important;
	}

	.update {
		width: 100%;
		height: 100%;
		background: url(../static/update.png) no-repeat center center;
		background-size: 100% 100%;

		.btn1,
		.btn2 {
			width: 260rpx;
			height: 68rpx;
			border-radius: 34rpx;
		}

		.btn1 {
			background: linear-gradient(360deg, #0064E0, #79B8FF);
		}

		.btn2 {
			border: 1px solid $blue;
		}
	}
</style>
