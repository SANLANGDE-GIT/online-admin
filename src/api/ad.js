import request from '@/utils/request'

export default{

  deleteAdById(id) {
    return request({
      // baseURL: 'http://localhost:8140',
      url: `/admin/cms/ad/delete/${id}`,
      method: 'delete'
    })
  },

  // 获取广告推荐类别信息
  getAdInfo(id) {
    return request({
      // baseURL: 'http://localhost:8140',
      url: `/admin/cms/ad/get/${id}`,
      method: 'get'
    })
  },

  // 修改广告推荐类别列表
  updateAd(adInfo) {
    return request({
      // baseURL: 'http://localhost:8140',
      url: '/admin/cms/ad/update',
      data: adInfo,
      method: 'put'
    })
  },

  // 添加广告推荐类别列表
  saveAd(adInfo) {
    return request({
      url: '/admin/cms/ad/save',
      data: adInfo,
      method: 'post'
    })
  },
  // 获取广告推荐类别分页列表
  getPageList(pageNum, pagSize) {
    return request({
      url: `/admin/cms/ad/list/${pageNum}/${pagSize}`,
      method: 'get'
    })
  }
  // 获取广告推荐类别列表
//   getListAll() {
//     return request({
//       baseURL: 'http://localhost:8140',
//       url: '/admin/cms/ad/list',
//       method: 'get'
//     })
//   }

}
