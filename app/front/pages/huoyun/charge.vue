<template>
	<view>
		<view class="center ptb-10 bold size-34">{{info.car_name}}</view>
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" @change="change" :indicator-dots="true" indicator-active-color="#00C28E" indicator-color="#e8d4ff" :autoplay="false"
					 :current="tab" :circular="true">
						<swiper-item v-for="(item,i) in carList" :key="i">
							<view class="pd-36 center">
								<image :src="item.car_image" style="width: 260rpx;height: 180rpx;" mode=""></image>
								<view class="ml-30">
									<view>载重{{item.load}}</view>
									<view class="bold mtb-20">长宽高{{item.length}}*{{item.width}}*{{item.height}}米</view>
									<view class="gray-2">载货体积{{item.volume}}方</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<view class="bg" style="height: 20rpx;"></view>
		<view>
			<view class="bb pd-36 bold size-34">里程计费</view>
			<view class="bb pd-36 flex">
				<text>起步价（包含{{info.start_mileage}}公里）</text>
				<text>{{info.start_price}}元</text>
			</view>
			<view class="bb pd-36 flex">
				<text>{{info.section1_min_mileage}}-{{info.section1_max_mileage}}公里</text>
				<text>+{{info.section1_price}}元/公里</text>
			</view>
			<view class="bb pd-36 flex">
				<text>{{info.section2_mileage}}公里以上</text>
				<text>+{{info.section2_price}}元/公里</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab:0,
				carList:[]
			};
		},
		computed:{
			info(){
				return this.carList[this.tab]||{}
			}
		},
		onLoad(option) {
			this.tab = option.tab
			this.$http('/addons/ddrive/freight/carInfo').then(data=>{
				this.carList = data
			})
		},
		methods:{
			change(event){
				this.tab = event.detail.current
			}
		}
	}
</script>

<style lang="scss">

</style>
