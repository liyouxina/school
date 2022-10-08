
let url = ''
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境')
	url = 'https://ddcar.brt999.com'
} else {
	console.log('生产环境')
	url = "https://ddcar.brt999.com"
}

export const baseUrl = url;
let whiteArr = []
export function http(url, data, method = 'GET') {
	// console.log('请求地址', url);
	// console.log('请求参数', data);
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			data,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'token': uni.getStorageSync('token') || ''
			},
			method,
			success: (res) => {
				if (res.statusCode == 200) {
					// console.log(res)
					if (res.data.code == 1) {
						resolve(res.data.data)
					} else if (res.data.code == 0) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						reject(res.data.msg)
					} 
				}else if (res.data.code == 401) {
						let pages = getCurrentPages();
						var currPage = pages[pages.length - 1]; //当前页面
						let url = '/' + currPage.route;
						if (uni.getStorageSync('token')) {
							//登陆过期
							uni.showToast({
								title: "登录过期",
								icon: 'none'
							})
							uni.removeStorageSync('userInfo')
							uni.removeStorageSync('token')
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login?url=' + url
								})
							}, 800)
						} else {
							uni.navigateTo({
								url: '/pages/login/login?url=' + url
							})
						}
					} else {
					uni.showToast({
						title: "接口请求失败" + res.statusCode,
						icon: 'none'
					})
				}
			},
			fail: (res) => {
				uni.showToast({
					title: '服务器请求异常',
					icon: 'none'
				})
			},
			complete: () => {

			}
		});
	})
}
