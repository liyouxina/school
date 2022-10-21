import {
	store
} from '../store/index'

import {
	baseUrl
} from './http.js'

/**
 *  count-- 可选张数
 * 	arr-- 最终结果   [{img1:'全路径',img2:'半路径'},{img1:'全路径',img2:'半路径'}]
 */
export let upload = (count = 1) => {
	console.log(count);
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			success: function(res) {
				uni.showLoading({
					title: '上传中'
				})
				let imgarr = res.tempFilePaths
				let arr = []
				imgarr.forEach(item => {
					uni.uploadFile({
						url: baseUrl + '/api/common/upload', //仅为示例，非真实的接口地址
						filePath: item,
						name: 'file',
						success: (res) => {
							uni.hideLoading()
							let obj = {
								img1: JSON.parse(res.data).data.fullurl,
								img2: JSON.parse(res.data).data.url
							}
							arr.push(obj)
							if (arr.length == imgarr.length) {
								resolve(arr)
							}
						},
						fail: () => {
							uni.showToast({
								title: '上传失败',
								icon: 'none'
							})
						}
					});
				})

			}
		});

	})
}
/**
 * 	arr-- 最终结果   [{img1:'全路径',img2:'半路径'},{img1:'全路径',img2:'半路径'}]
 */
export let upvideo = () => {
	return new Promise((resolve, reject) => {
		uni.chooseVideo({
			count: 1,
			success: function(res) {
				uni.showLoading({
					title: '上传中'
				})
				let video = res.tempFilePath
				uni.uploadFile({
					url: baseUrl + '/api/common/uploadali', //仅为示例，非真实的接口地址
					filePath: video,
					name: 'file',
					success: (res) => {
						uni.hideLoading()
						console.log('ffffffffffff', res.data);
						if (JSON.parse(res.data).code == '4001') {
							uni.showToast({
								title: JSON.parse(res.data).msg,
								icon: 'none'
							})
						} else {
							let obj = {
								video1: JSON.parse(res.data).data.fullurl,
								video2: JSON.parse(res.data).data.url
							}
							resolve(obj)
						}
					},
					fail: () => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
					}
				});


			}
		});

	})
}

// 时间装时间戳 time 2012-12-11 12:01:00   兼容ios new Date(2012,12,12,12,12,12)  月份要减1
export let changeTime=(time)=>{
	let t = new Date(time.split(' ')[0].split('-')[0],time.split(' ')[0].split('-')[1]-1,time.split(' ')[0].split('-')[2],...(time.split(' ')[1].split(':')),"00");
	let a = parseInt(t.getTime()/1000)
	return a
}
