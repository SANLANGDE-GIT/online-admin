import request from '@/utils/request'

export default {

  // 8、关键字右查询
  queryNames(key) {
    return request({
      url: `/admin/edu/teacher/query/name/${key}`,
      method: 'get'
    })
  },
  // 7、批量删除讲师
  batchRemoveTeacher(ids) {
    return request({
      url: `/admin/edu/teacher/batch/delete`,
      method: 'delete',
      data: ids
    })
  },
  // 6、更新讲师
  update(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'post',
      data: teacher
    })
  },
  // 5、讲师信息
  getTeacherById(id) {
    return request({
      url: `/admin/edu/teacher/query/${id}`,
      method: 'get'
    })
  },
  // 4、添加讲师
  save(teacher) {
    return request({
      url: '/admin/edu/teacher/add',
      method: 'post',
      data: teacher // data提交的json数据，
    })
  },
  // 3、删除讲师
  removeTeacherById(id) {
    return request({
      url: `/admin/edu/teacher/delete/${id}`,
      method: 'delete'
    })
  },
  // 2、分页列表查询
  getPageList(pageNum, pageSize, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${pageNum}/${pageSize}`,
      method: 'get',
      params: searchObj
    })
  },
  // 1、 列表查询
  getTeacherList() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  }
}

