// filters.js
import Vue from 'vue'

// 时间戳——日期格式
Vue.filter("formatDate",(data,type=0)=>{
	if (!data) {
	    return '- -'
	}
	data = String(data).length <= 10 ? data * 1000 : data;
	const t = new Date(data);
	const Y = t.getFullYear().toString().padStart(2,0);
	const M = (t.getMonth()+1).toString().padStart(2,0);
	const D = t.getDate().toString().padStart(2,0);
	const h = t.getHours().toString().padStart(2,0);
	const m = t.getMinutes().toString().padStart(2,0);
	const s = t.getSeconds().toString().padStart(2,0);
	if(type==1){
		return Y+'年'+ M +'月'+ D+'日 '+h+':'+m
	}else{
		return M +'-'+ D+' '+h+':'+m
	}
})

// 手机号隐藏('13912345678' => '139****5678'),此处str必须为字符串
Vue.filter('telHide', function(str) {
    return str.replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
});

// 隐藏姓名(小明=>*明    李小明=>李*明)
Vue.filter('nameHide', function(name) {
    if (name.length === 2) {
        return new Array(name.length).join('*') + name.substr(-1)
    } else {
        return (name.substr(0, 1) + new Array(name.length - 1).join('*') + name.substr(-1))
    }
});

// 身份证号隐藏('331082199708094687' => '33108219********87')
Vue.filter('IDcardHide', function(name) {
    return name.replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
});

// 截取字符串,部分显示 默认截取前100个字符;
Vue.filter('subStr', function(str, num = 100) {
    return str.length > num ? (str.substr(0, num) + "...") : str.substr(0, num)
})

/*日期转换*/
Vue.filter('dateFilter', function(str) {
    return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6);
});

// 人气数字转换
Vue.filter('digitalConversion', function(str) {
    let num = Math.abs(str);
    if (String(num).length < 5) {
        return num;
    } else {
        return (num / 10000).toFixed(1) + 'W';
    }
})

// 多久以前
Vue.filter('timeAgo', function(time) {
    time = String(time).length <= 10 ? time * 1000 : time;
    var arr = [
            [],
            []
        ],
    stamp = new Date().getTime() - new Date(time).getTime();

    //返回具体日期
    if (stamp > 1000 * 60 * 60 * 24 * 8) {
        stamp = new Date(time);
        arr[0][0] = digit(stamp.getFullYear(), 4);
        arr[0][1] = digit(stamp.getMonth() + 1);
        arr[0][2] = digit(stamp.getDate());
        return arr[0].join('-') + ' ' + arr[1].join(':');
    }

    //30天以内，返回“多久前”
    if (stamp >= 1000 * 60 * 60 * 24) {
        return ((stamp / 1000 / 60 / 60 / 24) | 0) + '天前';
    } else if (stamp >= 1000 * 60 * 60) {
        return ((stamp / 1000 / 60 / 60) | 0) + '小时前';
    } else if (stamp >= 1000 * 60 * 2) { //2分钟以内为：刚刚
        return ((stamp / 1000 / 60) | 0) + '分钟前';
    } else {
        return '刚刚';
    }
})