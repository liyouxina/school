<template>
	<view>
		<u-field @click="getAddress(3)" disabled label="收货地址" :placeholder="hyend.name?hyend.name:'请选择'">
			<u-icon name="arrow-right" slot="right"></u-icon>
		</u-field>
		<u-field v-model="floor" label="楼层" placeholder="请输入楼层（选填）">
			<u-icon name="arrow-right" slot="right"></u-icon>
		</u-field>
		<u-field v-model="code" label="门牌号" placeholder="请输入门牌号（选填）">
			<u-icon name="arrow-right" slot="right"></u-icon>
		</u-field>
		<u-field v-model="tel" type="tel" label="联系电话" placeholder="请输入手机号（选填）">
			<u-icon name="arrow-right" slot="right"></u-icon>
		</u-field>
		<view class="fixed-bottom pd-36">
			<u-button v-if="index" class="pb-20" type="" @click="delAddr">删除收货地信息</u-button>
			<view style="height: 20rpx;"></view>
			<u-button type="primary" @click="addAddr">确认收货地信息</u-button>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				floor: '',
				code: '',
				tel: '',
				index:'', //编辑地址索引
			};
		},
		computed:{
			...mapState(["start","hyend"])
		},
	
		methods:{
			getAddress(type) {
				uni.navigateTo({
					url: '/pages/home/search?type=' + type + '&location=' + location
				})
			},
			addAddr(){
				if(!this.hyend.name){
					uni.showToast({
						title:'请选择收货地址',
						icon:'none'
					})
				}else{
					let addr={
						address:this.hyend,
						floor: this.floor,
						code: this.code,
						tel: this.tel
					}
					console.log(addr);
					this.$store.commit('getHyAddress',addr)
					this.$store.commit('getHyEnd',{})
					uni.navigateBack({
						delta: 1
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
</style>
