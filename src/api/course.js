import request from '@/utils/request'

export default {

  // 发布课程
  publishCourse(courseId) {
    return request({
      url: `/admin/edu/course-collect/publish-course/${courseId}`,
      method: 'put'
    })
  },
  // 获取课程发布信息
  getPublishInfo(courseId) {
    return request({
      url: `/admin/edu/course-collect/course-publish/${courseId}`,
      method: 'get'
    })
  },
  // 删除课程
  deleteCourseById(courseId) {
    return request({
      url: `/admin/edu/course-collect/delete-course/${courseId}`,
      method: 'DELETE'
    })
  },
  // 课程分页列表
  queryCoursePageList(limit, size, wrapper) {
    return request({
      url: `/admin/edu/course-collect/query-course-page-list/${limit}/${size}`,
      method: 'GET',
      params: wrapper
    })
  },
  selectCourseList() {
    return request({
      url: '/admin/edu/course-collect/select-course-list',
      method: 'GET'
    })
  },
  // 修改课程
  updateCourseFormInfo2(courseId, courseFromInfo) {
    return request({
      url: `/admin/edu/course-collect/update-course/${courseId}`,
      method: 'PUT',
      data: courseFromInfo
    })
  },
  updateCourseFormInfo(courseFromInfo) {
    return request({
      url: '/admin/edu/course-collect/update-course-info',
      method: 'POST',
      data: courseFromInfo
    })
  },
  // 获取课程的信息
  getCourseFormInfo(id) {
    return request({
      url: `/admin/edu/course-collect/course-info/${id}`,
      method: 'GET'
    })
  },
  // 添加课程
  saveCourseFormInfo(courseFromInfo) {
    return request({
      url: '/admin/edu/course-collect/save-course-info',
      method: 'POST',
      data: courseFromInfo
    })
  }
}
