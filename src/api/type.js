import request from '@/utils/request'

export default{

  deleteAdTypeById(id) {
    return request({
      // baseURL: 'http://localhost:8140',
      url: `/admin/cms/ad-type/delete/${id}`,
      method: 'delete'
    })
  },

  // 获取广告推荐类别信息
  getAdTypeInfo(id) {
    return request({
      url: '/admin/cms/ad-type/get/' + id,
      method: 'get'
    })
  },

  // 修改广告推荐类别列表
  updateAdType(adTypeInfo) {
    return request({
      url: '/admin/cms/ad-type/update',
      data: adTypeInfo,
      method: 'put'
    })
  },

  // 添加广告推荐类别列表
  addAdType(adTypeInfo) {
    return request({
      url: '/admin/cms/ad-type/add',
      data: adTypeInfo,
      method: 'post'
    })
  },
  // 获取广告推荐类别分页列表
  getPageList(pageNum, pagSize) {
    return request({
      url: `/admin/cms/ad-type/list/${pageNum}/${pagSize}`,
      method: 'get'
    })
  },
  // 获取广告推荐类别列表
  getListAll() {
    return request({
      url: '/admin/cms/ad-type/list',
      method: 'get'
    })
  }

}
