<template>
	<view>
		<view class="ptb-18 plr-36 yellow" style="background: rgba(255, 153, 0, 0.22);">
			<text v-if="info.check_status==0">退款申请中</text>
			<text v-if="info.check_status==1">退款申请审核通过</text>
			<text v-if="info.check_status==2">退款成功</text>
			<text v-if="info.check_status==-1">退款已拒绝</text>
		</view>
		<view class="plr-36 ptb-40 flex bb">
			<view class="">
				退款金额
			</view>
			<view class="yellow">
				￥{{info.apply_money}}
			</view>
		</view>
		<view class="plr-36 ptb-40 flex bb">
			<view class="">
				退款方式
			</view>
			<view class="">
				{{info.account}}
			</view>
		</view>
		<view class="plr-36 ptb-40 flex bb">
			<view class="">
				退款金额
			</view>
			<view class="">
				{{info.status_text}}
			</view>
		</view>
		<view class="w100" style="height: 20rpx;background: #f8f8f8;"></view>
		<view class="size-34 bold pt-30 pb-20 plr-36 bb">
			退款进度
		</view>
		<view class="plr-36 ptb-20 bb">
			<view class="">
				退款申请已提交
			</view>
			<view class="size-26 gray-2 mt-10">
				您的退款申请已成功提交
			</view>
			<view class="size-26 gray-2 mt-10">
				{{info.apply_time}}
			</view>
		</view>
		<view class="plr-36 ptb-20 bb" v-if="info.check_status==1||info.check_status==2">
			<view class="">
				退款申请审核通过
			</view>
			<view class="size-26 gray-2 mt-10">
				您的退款处理完成，预计{{info.predict_time}}前，退回{{info.account}}账户
			</view>
			<view class="size-26 gray-2 mt-10">
				{{info.confirm_time}}
			</view>
		</view>
		<view class="plr-36 ptb-20 bb" v-if="info.check_status==2">
			<view class="">
				退款成功
			</view>
			<view class="size-26 gray-2 mt-10">
				已将￥{{info.money}}元入账您的{{info.account}}账户，如有问题请联系客服查询
			</view>
			<view class="size-26 gray-2 mt-10">
				{{info.success_time}}
			</view>
		</view>
		<view class="plr-36 ptb-20 bb" v-if="info.check_status==-1">
			<view class="">
				退款申请已拒绝
			</view>
			<view class="size-26 gray-2 mt-10">
				您的退款申请已被拒绝，可重新提交退款申请或联系客服查询
			</view>
			<view class="size-26 gray-2 mt-10">
				{{info.confirm_time}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refund_id:'',
				info:{},
			};
		},
		onLoad(option) {
			this.refund_id = option.id
			this.init()
		},
		methods:{
			init() {
				this.$http('/addons/ddrive/hyorder/refund_info', {
					id: this.refund_id
				},"POST").then(data => {
					this.info = data
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
