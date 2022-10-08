import { http } from './http'
import { store } from '../store/index'

/**
 * 时间格式化
 * @param {Date} date - 时间
 */
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 
 */
export const queryString = query => {
  let qry = []
  for (const key in query) {
    qry.push(`${key}=${query[key]}`)
  }
  return qry.join('&')
}

export const queryObject = url => {
  const u = decodeURIComponent(decodeURIComponent(url))
  let query = ''
  if (u.includes('?')) {
    query = u.split('?')[1].split('&')
  } else {
    query = u.split('?')[0].split('&')
  }
  const queryObject = {}
  query.map(item => {
    if (!item.includes('=')) return
    const obj = item.split('=')
    const key = obj[0]
    const val = obj[1]
    queryObject[key] = val
  })
  return queryObject
}

export const loginRedirect = () => {
  // wx.showToast({ title: '请先登录', icon: 'none' })
  const paths = getCurrentPages()
  const currentPage = paths[paths.length - 1]
  const uri = encodeURIComponent(
    `/${currentPage.route}?${queryString(currentPage.options)}`
  )
  wx.redirectTo({
    url: `/pages/login/login?uri=${uri}`,
  })
}

/**
 * html 实体符 map
 * 其他：替换rich-text不支持的字符，图片宽度限制 配合 css class raw-image
 * @type {Object}
 */
const unescapeHTMLMap = {
  '&': /&amp;/g,
  '<': /&lt;/g,
  '>': /&gt;/g,
  '"': /&quot;/g,
  '”': /&rdquo;/g,
  '“': /&ldquo;/g,
  "'": /&apos;/g,
  '/': /&#x2f;/g,
  ' ': /&(.{2,7});/g,
  '<div': /<section/g,
  '</div>': /<\/section>/g,
  '<img$1 class="raw-image" />': /<img+(.*?)\/>/g,
}
/**
 * 解码 html 实体符
 * @param {String} str html
 * @returns {String}
 */
export const unescapeHTML = str => {
  let htmlStr = str.replace(/&#(x)?([\w\d]{0,5});/gi, (full, hex, code) =>
    String.fromCharCode(parseInt(code, hex ? 16 : 10))
  )
  Object.keys(unescapeHTMLMap).map(src => {
    htmlStr = htmlStr.replace(unescapeHTMLMap[src], src)
    // htmlStr = htmlStr.replace(/<img/g, '<img width=100%')
    return htmlStr
  })
  return htmlStr
}

/**
 * 跳转直播间
 * @param {*} id -直播间id
 * @param {*} status -直播间状态
 */
export const goLive = (id, status) => {
  if (status == 101) {
    http.post('/live/live/roomAction', { room_id: id, type: 1 })
    wx.navigateTo({
      url: `${store.config.live_plugin}?room_id=${id}`,
    })
  } else {
    let title = ''
    switch (status * 1) {
      case 102:
        title = '未开始'
        break
      case 103:
        title = '已结束'
        break
      case 104:
        title = '已被禁播'
        break
      case 105:
        title = '暂停中'
        break
      case 106:
        title = '异常'
        break
      case 107:
        title = '已过期'
        break
    }
    wx.showToast({
      title: '直播' + title,
      icon: 'none',
    })
  }
}

/**
 * 新人专享活动 0 距离开始大于1天  1 未开始（24小时内）  2 进行中  3 已结束
 * @param start -开始时间戳
 * @param end -结束时间戳
 */
export const actStatus = (start, end) => {
  let now = new Date().getTime() / 1000
  start = start * 1
  end = end * 1
  // 未开始状态
  if (now < start) {
    if (start - now > 86400) {
      return 0
    } else {
      return 1
    }
  } else if (now >= end) {
    return 3
  } else {
    return 2
  }
}

