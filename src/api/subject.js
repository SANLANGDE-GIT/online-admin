import request from '@/utils/request'

export default {
  getNestedTreeList2() {
    return request({
      url: '/admin/edu/subject/select-nested-list',
      method: 'get'
    })
  },
  getNestedTreeList() {
    return request({
      url: '/admin/edu/subject/nested-list',
      method: 'get'
    })
  }
}
