import request from '@/utils/request'

export default{

  showCharts(begin, end) {
    return request({
      url: `/admin/statistics/daily/show-charts/${begin}/${end}`,
      method: 'get'
    })
  },
  createStatisticsByDay(day) {
    return request({
      url: `/admin/statistics/daily/create/${day}`,
      method: 'post'
    })
  }

}
