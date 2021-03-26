import request from '@/utils/request'

export default{
// 查询课时
  getVideoById(id) {
    return request({
      url: `/admin/edu/video/select/${id}`,
      method: 'get'
    })
  },
  // 删除课时
  deleteVideo(id) {
    return request({
      url: `/admin/edu/video/delete/${id}`,
      method: 'delete'
    })
  },
  // 修改课时
  updateVideo(videoInfo) {
    return request({
      url: '/admin/edu/video/update',
      method: 'POST',
      data: videoInfo
    })
  },
  // 添加课时
  saveVideo(videoInfo) {
    return request({
      url: '/admin/edu/video/save',
      method: 'post',
      data: videoInfo
    })
  }

}
