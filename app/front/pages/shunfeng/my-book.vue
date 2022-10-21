<template>
	<view class="">
		<view class="mlr-36 flex mt-10 ptb-20 plr-30" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.14);">
			<view class="u-flex-1 ptb-30">
				<view class="flex1 flex-middle">
					<view class="bg-green" style="width: 16rpx;height: 16rpx;border-radius: 50%;"></view>
					<view :class="[start.city?'':'gray-2','ml-40']" @click="goSearch(1)">
						{{start.city?start.city+'--'+start.name:'请选择出发城市'}}
					</view>
				</view>
				<view class="ml-56 mtb-30" style="height: 1rpx;background: #eee;"></view>
				<view class="flex1 flex-middle">
					<view class="bg-orange" style="width:16rpx;height: 16rpx;border-radius: 50%;"></view>
					<view :class="[end.city?'':'gray-2','ml-40']" @click="goSearch(2)">
						{{end.city?end.city+'--'+end.name:'请选择终点城市'}}
					</view>
				</view>
			</view>
			<view class="img ml-20">
				<image src="../../static/switching-icon.png" mode=""></image>
			</view>
		</view>
		<view class="mlr-36 mt-30" style="box-shadow: 0px 0px 13px 0px rgba(0,194,142, 0.14);">
			<u-cell-item title="【出发时间】" :class="[time?'active':'']" :value="time?time:'请选择出发时间'" @click="showTime=true"></u-cell-item>
			<u-cell-item title="【预定座位】" :class="[seat?'active':'']" :value="seat?seat:'请选择预定座位'" @click="show=true"></u-cell-item>
			<u-cell-item title="【手机号码】">
				<view slot="right-icon" class="input">
					<input type="text" v-model="tel" maxlength="11" placeholder="请输入手机号"/>
				</view>
			</u-cell-item>
		</view>
		<view class="mlr-36 mt-50">
			<u-button @click="book" :disabled="!start.city||!end.city||!time||!seat||!tel" type="primary">预约</u-button>
		</view>
		<view class="plr-36 mt-50">
			温馨提示：
		</view>
		<view class="plr-36 size-26 mt-15">
			1.拼有提交成功后，系统会为您匹配与您出行时间相符的车主，并实时通知给您。
		</view>
		<view class="plr-36 size-26 mt-15">
			2.<text class="green">匹配成功，不是预约成功</text>。此功能仅仅是通知提醒功能，拼友还是要自己判断车主路线是否适合自己，并进行预订。
		</view>
		<!-- 选择时间 -->
		<u-popup v-model="showTime" mode="bottom" height="400">
			<longDate type="day" :openStatus="true" :getDayNum="7" :chooesMaxDay="7" @select="onSelectTime">
			</longDate>
		</u-popup>
		<!-- 选择座位 -->
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import longDate from '../../components/long-date/long-date.vue'
	import {changeTime} from "../../common/common.js"
	export default {
		data() {
			return {
				time:'',
				seat:'',
				tel:'',
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
				show:false,
				showTime:false
			};
		},
		components: {
			longDate
		},
		computed:{
			...mapState(['start','end','userInfo'])
		},
		mounted() {
			this.tel=this.userInfo.mobile
			if(!this.start.address){
				this.$store.commit('getStart', {})
				this.$store.commit('getEnd', {})
			}
		},
		methods:{
			goSearch(i){
				uni.navigateTo({
					url:'/pages/home/search?type=' + i
				})
			},
			// 确定时间
			onSelectTime(res) {
				console.log(res);
				if (res.tip) {
					uni.showToast({
						title: res.tip,
						icon: 'none'
					})
				} else {
					this.time = res.time
					this.showTime = false
				}
			},
			// 选择预定座位
			confirm(e){
				console.log(e);
				this.seat = e[0].label
			},
			//预约
			book(){
				this.$http('/addons/ddrive/sforder/ddriver_create',{
					start_address:this.start.address,
					start_city:this.start.city,
					start_name:this.start.name,
					start_latitude:this.start.latitude,
					start_longitude:this.start.longitude,
					end_city:this.end.city,
					end_address:this.end.address,
					end_name:this.end.name,
					end_latitude:this.end.latitude,
					end_longitude:this.end.longitude,
					order_type:1,
					start_time: changeTime(this.time),
					people_num:this.seat.substr(0,1)
				}).then((data)=>{
					uni.showToast({
						title:"预约成功"
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:"/pages/shunfeng/order-detail?id="+data.order_id
						})
					},1000)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-primary-hover {
		background: linear-gradient(to right,#00b6b4,#00d496) !important;
	}
	/deep/.uni-input-placeholder{
		color: #909399;
	}
	.active{
		/deep/.u-cell__value{
			color: #333;
		}
	}
	.img {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
	.input{
		input{
			font-size: 26rpx;
			text-align: right;
		}
	}
</style>
