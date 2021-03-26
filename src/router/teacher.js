
import Layout from '../views/layout/Layout'

const teacher = [{
  path: '/teacher',
  redirect: '/teacher/list',
  name: 'Teacher',
  component: Layout,
  meta: { title: '讲师管理' },
  children: [
    {
      path: 'list',
      name: 'TeacherList',
      component: () => import('@/views/teacher/list'),
      meta: { title: '讲师列表', icon: '' }
    },
    {
      path: 'create',
      name: 'TeacherCreate',
      component: () => import('@/views/teacher/form'),
      meta: { title: '添加讲师' }
    },
    {
      path: 'edit',
      name: 'TeacherEdit',
      component: () => import('@/views/teacher/form'),
      meta: { title: '编辑讲师' },
      hidden: true
    }
  ]
}]

export default teacher
