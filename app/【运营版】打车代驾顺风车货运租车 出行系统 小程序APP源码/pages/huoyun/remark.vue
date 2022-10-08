<template>
	<view>
		<view class="bg-white mt-30 mlr-36 radius-10">
			<u-field type="textarea" v-model="remark" label-width="0" :border-bottom="false" :clearable="false" :auto-height="false" :trim="true" placeholder="输入备注(如货物类别、要下车库等)"></u-field>
		</view>
		<view class="fixed-bottom pb-60 plr-36">
			<u-button type="primary" :disabled="!remark" @click="submit">确认</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				remark:''
			};
		},
		methods:{
			submit(){
				uni.$emit('remark',{
					remark: this.remark
				})
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F8F8F8;
	}
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	
	/deep/.u-btn--primary--disabled {
		background-color: $bg-1 !important;
	}
</style>
