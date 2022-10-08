<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$store.commit('getCity', '')
			const res = wx.getSystemInfoSync()
			var statusbarH = res.statusBarHeight
			this.$store.commit('getHeight',statusbarH)
			let tabList =[]
			this.$http('/addons/ddrive/banner/market_setting').then(data=>{
				if(data.dj_status==1){
					tabList.push({
						name: '代驾',
						id:0
					})
				}
				if(data.sf_status==1){
					tabList.push({
						name: '顺风车',
						id:1
					})
				}
				if(data.dc_status==1){
					tabList.push({
						name: '货运',
						id:2
					})
				}
				this.$store.commit('getTab',tabList)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		color: $gray !important;
		font-size: 30rpx !important;
	}

	// 自定义头部，状态栏盒子样式
	/* #ifdef APP-PLUS */
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	/* #endif */
	

	// tab切换选中加下边框
	.active-bb {
		&::after {
			content: '';
			position: absolute;
			width: 90%;
			height: 5rpx;
			background-color: $blue;
			left: 5%;
			bottom: -25rpx;
		}
	}

	// filed
	.u-field {
		padding: 26rpx 34rpx !important;

		.u-label-text {
			font-weight: 700 !important;
		}
	}

	// 提交按钮
	.u-btn--primary {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
		border-radius: 0rpx !important;
		margin: 0rpx !important;
		width: 100% !important;
	}

	.u-size-default {
		height: 90rpx !important;
		font-weight: 700 !important;
	}

	// cell组件右边箭头对其文字
	.u-cell_title {
		// font-weight: 700 !important;
		color: #333 !important;
	}

	.u-cell__right-icon-wrap {
		height: 55rpx !important;
	}

	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import './common/common.scss'
</style>
