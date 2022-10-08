<template>
	<view>
		<u-cell-item :title="userInfo.mobile?'修改手机号':'绑定手机号'" class="green" :value="tel" @click="gophone"></u-cell-item>
		<u-cell-item title="修改登录密码" value="去修改" @click="gopwd" class="green"></u-cell-item>
		<u-cell-item title="微信授权" @click="wxLogin" :arrow="false">
			<view slot="right-icon" class="flex">
				<view class="green size-26">
					{{vx}}
				</view>
				<u-icon name="arrow-right" color="#969799" class="ml-10"></u-icon>
			</view>
		</u-cell-item>
		<!-- #ifdef APP-PLUS -->
		<view class="w100" style="height: 20rpx;background: #F8F8F8;"></view>
		<u-cell-item title="清除缓存" :value="fileSizeString" @click="clear"></u-cell-item>
		<!-- <u-cell-item title="检查版本更新" value="v1.0.0"></u-cell-item> -->
		<!-- #endif -->
		<view class="w100" style="height: 20rpx;background: #F8F8F8;"></view>
		<u-cell-item title="隐私协议" @click="goDetails(12,'隐私协议')"></u-cell-item>
		<u-cell-item title="用户协议" @click="goDetails(13,'用户协议')"></u-cell-item>
		<u-cell-item title="关于我们" @click="goDetails(17,'关于我们')"></u-cell-item>
		<view class="pd-36 mt-30">
			<u-button type="primary" @click="exit">退出登录</u-button>
		</view>
		<u-modal v-model="show" content="确定解除微信绑定？" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				show: false,
				fileSizeString: '0B', //缓存
			}
		},
		computed: {
			...mapState(['userInfo']),
			tel() {
				return this.userInfo.mobile ? this.userInfo.mobile : '未绑定'
			},
			vx() {
				let vx_name;
				// #ifdef MP-WEIXIN
				vx_name = this.userInfo.mini_openid ? '已绑定（' + this.userInfo.wx_name + '）' : '未绑定'
				// #endif
				// #ifdef APP-PLUS
				vx_name = this.userInfo.openid ? '已绑定（' + this.userInfo.wx_name + '）' : '未绑定'
				// #endif
				return vx_name
			}
		},
		onLoad() {
			this.$store.dispatch('updateUserInfo')
			// #ifdef APP-PLUS
			this.formatSize()
			// #endif
		},
		methods: {
			gophone() { //修改手机号
				if (this.userInfo.mobile) {
					uni.navigateTo({
						url: '/pages/my/set/phone-number'
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/phone?type=1'
					})
				}
			},
			gopwd() { //修改密码
				uni.navigateTo({
					url: '/pages/login/forget-pwd?type=2'
				})
			},
			goDetails(id,title){
				uni.navigateTo({
					url:'/pages/my/details?id=' + id + '&title=' + title
				})
			},
			exit() {
				this.$store.commit('exitLogin')
				uni.redirectTo({
					url:'/pages/home/index'
				})
				setTimeout(() => {
					uni.showToast({
						title: '退出成功'
					})
				}, 100)
			},
			wxLogin() {
				console.log(this.userInfo);
				console.log(this.userInfo.mobile);
				if (this.vx == '未绑定') {
					let _this = this;
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							console.log(loginRes.authResult);
							// 获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									console.log(infoRes.userInfo);
									_this.$http('/addons/ddrive/user/mobileOnAccount', {
										openid: infoRes.userInfo.openId,
										wx_name: infoRes.userInfo.nickName,
										unionId: infoRes.userInfo.unionId
									}, "POST").then(data => {
										console.log(data);
										_this.$store.dispatch('updateUserInfo')
										setTimeout(() => {
											uni.showToast({
												title: '绑定成功'
											})
										}, 100)
									})
								}
							});
						}
					});
				} else {
					// #ifdef APP-PLUS
					if (this.userInfo.mobile) {
						this.show = true
					}
					// #endif
				}
			},
			// 解除微信绑定
			confirm() {
				this.$http('/addons/ddrive/wx_login/untie', "POST").then(data => {
					this.$store.dispatch('updateUserInfo')
					uni.showToast({
						title: '解绑成功'
					})
				})
			},
			// #ifdef APP-PLUS
			//计算缓存
			formatSize() {
				let _this = this;
				plus.cache.calculate(function(size) {
					let sizeCache = parseInt(size);
					if (sizeCache == 0) {
						_this.fileSizeString = "0B";
					} else if (sizeCache < 1024) {
						_this.fileSizeString = sizeCache + "B";
					} else if (sizeCache < 1048576) {
						_this.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
					} else if (sizeCache < 1073741824) {
						_this.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
					} else {
						_this.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
					}
				});
			},
			//清楚缓存
			clear() {
				let _this = this;
				let os = plus.os.name;
				if (os == 'Android') {
					let main = plus.android.runtimeMainActivity();
					let sdRoot = main.getCacheDir();
					let files = plus.android.invoke(sdRoot, "listFiles");
					let len = files.length;
					for (let i = 0; i < len; i++) {
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
							if (entry.isDirectory) {
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({
										title: '缓存清理完成',
										duration: 2000
									});
									_this.formatSize(); // 重新计算缓存  
								}, function(e) {
									console.log(e.message)
								});
							} else {
								entry.remove();
							}
						}, function(e) {
							console.log('文件路径读取失败')
						});
					}
				} else { // ios  
					plus.cache.clear(function() {
						uni.showToast({
							title: '缓存清理完成',
							duration: 2000
						});
						_this.formatSize();
					});
				}
			},
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-btn {
		height: 96rpx !important;
	}

	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}

	/deep/.u-cell {
		padding: 30rpx 32rpx;
	}

	/deep/.u-cell_title {
		font-weight: 400 !important;
	}

	/deep/.green .u-cell__value {
		color: $green !important;
	}
</style>
