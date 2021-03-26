<template>
  <div class="app-container">

    <!-- 课程信息表单 TODO -->
    <el-form ref="courseForm" :model="courseFormData" :rules="rules" label-width="90px" >
      <el-form-item label="课程标题" prop="title">
        <el-input v-model="courseFormData.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <el-form-item label="课程讲师" prop="teacherId">
        <el-select v-model="courseFormData.teacherId">
          <el-option
            v-for="item in teacherData"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类别">
        <el-select v-model="courseFormData.subjectParentId" @change="subjectChange">
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <el-select v-model="courseFormData.subjectId">
          <el-option
            v-for="item in subjectTwoData"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时" prop="lessonNum">
        <el-input-number v-model="courseFormData.lessonNum" :min="1" :max="300" label="总课时" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseFormData.description"/>
      </el-form-item>
      <!-- 课程封面 -->
      <el-form-item label="课程封面" prop="cover">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API+'/admin/oss/file/upload?module=course'"
          name="file"
          class="cover-uploader">
          <img v-if="courseFormData.cover" :src="courseFormData.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <!-- 课程价格 -->
      <el-form-item label="课程价格" prop="price">
        <el-input-number v-model="courseFormData.price" :min="0" :step="10" :max="20000" controls-position="right" placeholder="免费课程请设置为0元" /> -元
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import subjectApi from '@/api/subject'
import teacherApi from '@/api/teacher'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      BASE_API: process.env.BASE_API,
      courseFormData: {
        lessonNum: 1,
        price: 0,
        // 以下解决表单数据不全时insert语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      teacherData: [], // 讲师列表
      subjectData: [], // 一级分类列表
      subjectTwoData: [], // 二级分类列表
      saveBtnDisabled: false, // 按钮是否禁用
      rules: {
        title: [
          { required: true, message: '请输入课程标题', trigger: 'blur' },
          { min: 10, max: 30, message: '长度在 10 到 30 个字符', trigger: 'blur' }
        ],
        teacherId: [
          { required: true, message: '请选择课程讲师', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.$parent.courseId) {
      this.getCourseFormInfo(this.$parent.courseId)
    } else {
      // 初始化课程分类列表
      this.initSubjectData()
    }
    // 初始化讲师列表
    this.initTeacherData()
  },
  methods: {
    // 课程信息回显
    getCourseFormInfo(id) {
      courseApi.getCourseFormInfo(id).then(response => {
        if (response.success) {
          this.courseFormData = response.data.item
          subjectApi.getNestedTreeList().then(resp => {
            // console.log(resp)
            // 课程分类列表赋值
            this.subjectData = resp.data.items
            this.subjectData.forEach(items => {
              // console.log(items)
              if (items.id === this.courseFormData.subjectParentId) {
                this.subjectTwoData = items.children
              }
            })
          })
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 级联查询
    subjectChange(val) {
      // console.log(val)
      this.subjectData.forEach(items => {
        // console.log(items)
        if (items.id === val) {
          this.courseFormData.subjectId = ''
          this.subjectTwoData = items.children
        }
      })
    },
    // 课程分类列表
    initSubjectData() {
      subjectApi.getNestedTreeList().then(resp => {
        // console.log(resp)
        this.subjectData = resp.data.items
      })
    },
    // 讲师列表
    initTeacherData() {
      teacherApi.getTeacherList().then(resp => { this.teacherData = resp.data.items })
    },
    // 保存并下一步
    saveAndNext() {
      this.saveBtnDisabled = true
      // this的属性可以参考vueapi: https://cn.vuejs.org/v2/api/index.html
      if (!this.$parent.courseId) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存课程
    saveData() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          courseApi.saveCourseFormInfo(this.courseFormData).then(response => {
            // if (response.success) {
            //   this.$message.success(response.message)
            this.$parent.courseId = response.data.courseId
            this.$parent.active = 1
            // } else {
            //   this.$message.error(response.message)
            // }
          })
        }
      })
    },
    // 修改课程
    updateData() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          courseApi.updateCourseFormInfo2(this.$parent.courseId, this.courseFormData).then(response => {
            // this.$message.success(response.message)
            this.$parent.active = 1
          })
        }
      })
    },
    // 图片上传之后调用的函数
    handleCoverSuccess(res, file) {
      if (res.success) {
        this.courseFormData.cover = res.data.path
        this.$forceUpdate
      } else {
        this.$message.error('上传失败')
      }
    },
    // 图片上传之前调用的函数
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt1M
    },
    handleCoverError() {
      this.$message.error('上传失败')
    }
  }
}
</script>
<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}
  /* 其他css */

.cover-uploader .avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader .avatar-uploader-icon:hover {
  border-color: #409EFF;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
