<template>
	<view>
		<checkbox-group active-color="#00c28e" @change="radioGroupChange">
			<view class="w100 ptb-30 plr-36 flex flex-reverse" v-for="(item,i) in list" :key="i">
				<checkbox :value="item.value" :checked="item.checked">
					<text>{{item.name}}</text>
				</checkbox >
			</view>
		</checkbox-group>
		<view class="fixed-bottom pb-60 plr-36">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '搬运服务(和司机商议定价)',
					checked: false,
					value: '1'
				},
				{
					name: '返程(附加40%路费)',
					checked: false,
					value:'2'
				},
				{
					name: '电梯房(和司机商议定价)',
					checked: false,
					value:'3'
				},
				{
					name: '小推车(免费)',
					checked: false,
					value:'4'
				},
				{
					name: '拍照回单(免费)',
					checked: false,
					value:'5'
				},
				{
					name: '纸质回单(商议价格)',
					checked: false,
					value:'6'
				},
				{
					name: '代收货款(免费；贷款上限一万元)',
					checked: false,
					value:'7'
				}],
				demand:'',
				name:''
			};
		},
		methods: {
			radioGroupChange(e) {
				console.log(e.detail.value);
				let arr = []
				this.list.forEach(item=>{
					if(item.value == e.detail.value[0]){
						arr.push(item.name.split('(')[0])
					}
					if(item.value == e.detail.value[1]){
						arr.push(item.name.split('(')[0])
					}
				})
				this.name = arr.toString()
				this.demand = e.detail.value.toString()
			},
			submit(){
				uni.$emit('demand',{
					demand: this.demand,
					demand_name: this.name
				})
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	
	/deep/.u-btn--primary--disabled {
		background-color: $bg-1 !important;
	}
	.flex-reverse {
		flex-direction: row-reverse;
	}
	checkbox{
		width: 100%;
	}
	/deep/uni-checkbox .uni-checkbox-wrapper{
		width: 100%;
		justify-content: space-between;
		flex-direction: row-reverse;
	}
	
</style>
