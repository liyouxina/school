import Vue from 'vue'
import App from './App'

// 时间格式过滤器
import './common/filter.js';//过滤器配置
// <div class="time">{{item.createtime |timeFilter(第二个参数,第三个参数)}} 至 {{item.endtime |timeFilter}}</div>

//引入uView
import uView from "uview-ui";
Vue.use(uView);

// 全局组件
import empty from	'./components/empty.vue'
Vue.component('empty',empty)
//微信分享
import share from './mixins/share.js'
Vue.mixin(share)
//代驾
import indexAddress from	'./components/daijia/index-address.vue'
Vue.component('indexAddress',indexAddress)
import dtHujiao from './components/daijia/dt-hujiao.vue'
Vue.component('dtHujiao',dtHujiao)
import paidui from './components/daijia/dt-paidui.vue'
Vue.component('paidui',paidui)
import dtNopay from './components/daijia/dt-nopay.vue'
Vue.component('dtNopay',dtNopay)
import dtPay from './components/daijia/dt-pay.vue'
Vue.component('dtPay',dtPay)
import dtQuxiao from './components/daijia/dt-quxiao.vue'
Vue.component('dtQuxiao',dtQuxiao)
import dtSiji from './components/daijia/dt-siji.vue'
Vue.component('dtSiji',dtSiji)
import djOrder from './components/daijia/order-item.vue'
Vue.component('djOrder',djOrder)
// 顺风车
import sfindex from './components/shunfeng/sf-index.vue'
Vue.component('sfindex',sfindex)
import bookTip from './components/shunfeng/book-tip.vue'
Vue.component('bookTip',bookTip)
// 货运
import hyindex from './components/huoyun/index.vue'
Vue.component('hyindex',hyindex)
//引入vuex
import {store} from './store/index'
// Vue.prototype.$store=store

// 全局引入http
import {http} from './common/http.js'
Vue.prototype.$http=http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
		store,
})
app.$mount()
