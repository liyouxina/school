<template>
	<view @click="toDetail(item.id)" class="ptb-30 plr-30 radius-10 bg-white">
		<view class="flex">
			<view class="">
				{{item.createtime|formatDate(1)}}
				<text v-if="item.status != '-2' && item.status != '-1' && item.status != '99'" class="white size-26 ptb-5 plr-15 mlr-15 change-green white">
					{{item.status_text}}
				</text>
				<text v-else class="gray-2 size-26 ptb-5 plr-15 mlr-15" style="background: #eee;">{{item.status_text}}</text>
			</view>
			<u-icon name="arrow-right" color="rgba(51,51,51,0.3)" size="40"></u-icon>
		</view>
		<view class="mt-30 flex1 flex-middle">
			<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
			<text class="ml-20">{{item.start}}</text>
		</view>
		<view class="mt-30 flex1 flex-middle">
			<view class="bg-orange" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
			<text class="ml-20">{{item.end}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		props:['item'],
		data(){
			return{
				
			}
		},
		methods:{
			toDetail(id){
				uni.navigateTo({
					url:'/pages/home/detail?id='+id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
