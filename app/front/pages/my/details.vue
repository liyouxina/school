<template>
	<view>
		<view class="plr-36">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				content:''
			}
		},
		onLoad(option) {
			this.id = option.id
			uni.setNavigationBarTitle({
				title: option.title
			});
			this.init()
		},
		methods: {
			init(){
				this.$http('/addons/ddrive/message/notice_info',{
					id: this.id
				}).then(data=>{
					console.log(data);
					this.content = data.list_array.content
				})
			}
		}
	}
</script>

<style>

</style>
