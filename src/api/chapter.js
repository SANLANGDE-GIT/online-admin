import request from '@/utils/request'

export default{

  // 根据课程ID查询章节信息
  getChapterNestedList(courseId) {
    return request({
      url: `/admin/edu/chapter/chapter-nested-list/${courseId}`,
      method: 'GET'
    })
  },
  // 根据课程ID查询章节信息
  getChapterList(courseId) {
    return request({
      url: `/admin/edu/chapter/select/${courseId}`,
      method: 'GET'
    })
  },
  // 删除章节信息
  deleteChapter(id) {
    return request({
      url: `/admin/edu/chapter/delete/${id}`,
      method: 'DELETE'
    })
  },
  // 修改章节
  updateChapter(chapterInfo) {
    return request({
      url: '/admin/edu/chapter/update',
      method: 'PUT',
      data: chapterInfo
    })
  },
  // 根据ID查询章节信息
  getChapterInfoById(id) {
    return request({
      url: `/admin/edu/chapter/get/${id}`,
      method: 'get'
    })
  },
  // 新增章节
  saveChapter(chapterInfo) {
    return request({
      url: '/admin/edu/chapter/save',
      method: 'post',
      data: chapterInfo
    })
  }

}
