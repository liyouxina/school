<template>
	<view>
		<u-cell-item title="手机号码" class="active">
			<view slot="right-icon" class="input">
				<input type="text" v-model="tel" maxlength="11" placeholder="请填写手机号"/>
			</view>
		</u-cell-item>
		<u-cell-item title="预订座位" :class="[seat?'active':'']" :value="seat?seat:'请选择预订座位'" @click="show=true"></u-cell-item>
		<u-cell-item title="上车点(留言)">
			<view slot="right-icon" class="input">
				<input type="text" v-model="message" placeholder="如:人民路与建设路交叉口"/>
			</view>
		</u-cell-item>
		<view style="margin-top: 580rpx;">
			<view class="mlr-36 mb-20 flex_l size-26">
				<u-radio-group active-color="#00C28E" @change="radioGroupChange">
					<u-radio name="1" :label-disabled="false"></u-radio>
				</u-radio-group>
				<view class="">
					<text class="gray-2">我已阅读并同意</text>
					<text class="blue" @click="goDetails(16,'合乘协议')">《合乘协议》</text>
				</view>
			</view>
			<view class="mlr-36">
				<u-button type="primary" :disabled="!tel || !seat " @click="submit">确认预订</u-button>
			</view>
			<bookTip class="fixed-bottom bg-white"></bookTip>
		</view>
		<!-- 选择座位 -->
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				id:'',
				tel:'',
				seat:'',
				message:'',
				radio:'',
				show:false,
				list:[{
					value:1,
					label:'1人'
				},
				{
					value:2,
					label:'2人'
				},
				{
					value:3,
					label:'3人'
				},
				{
					value:4,
					label:'4人'
				},
				{
					value:5,
					label:'5人'
				},
				{
					value:6,
					label:'6人'
				},
				{
					value:7,
					label:'7人'
				}],
			};
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(option) {
			this.id = option.id
			this.seat = option.seat
			this.tel = this.userInfo.mobile
		},
		methods:{
			radioGroupChange(e){
				this.radio = e
			},
			confirm(e){
				this.seat = e[0].label
			},
			goDetails(id,title){
				uni.navigateTo({
					url:'/pages/my/details?id='+id+'&title=' + title
				})
			},
			submit(){
				if(this.radio){
					this.$http('/addons/ddrive/sforder/reserve_order',{
						order_id: this.id,
						tel: this.tel,
						people_num: this.seat.substr(0,1),
						remark: this.message
					},"POST").then(data=>{
						console.log(data);
						uni.redirectTo({
							url:'/pages/shunfeng/order-detail?id='+data.order_id
						})
					})
				}else{
					uni.showToast({
						title:'请先同意合乘协议',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-radio__label{
		margin-right: 0;
	}
	.active{
		/deep/.u-cell__value{
			color: #333;
		}
	}
	.input{
		input{
			font-size: 26rpx;
			text-align: right;
		}
	}
</style>
