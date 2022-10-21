<template>
	<view class="w100 flex ptb-25 plr-36 bg-white" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.14);">
		<view class="">
			<view class="">
				没有合适车辆？马上预约！
			</view>
			<view class="size-26 gray-2 mt-10">
				预约后系统将持续为您匹配车主
			</view>
		</view>
		<view class="change-green ptb-10 plr-20 white" @click="myBook">
			马上预约
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			myBook(){
				uni.navigateTo({
					url:'/pages/shunfeng/my-book'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
