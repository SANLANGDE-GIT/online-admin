<style scoped>
  .avatar-uploader .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar-uploader img {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<template>
  <div class="app_container">
    <!-- 输入表单 -->
    <el-form ref="teacherForm" :model="teacher" :rules="rules" label-width="90px" style="padding:10px">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间" prop="joinDate">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!--
          数据类型一定要和取出的json中的一致，否则没法回填
          因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像" prop="avatar">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/admin/oss/file/upload?module=avatar'"
          name="file"
          class="avatar-uploader">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      teacher: {
        sort: 0,
        level: 1
      },
      saveBtnDisabled: false, // 保存按钮是否禁用，防止表单重复提交
      rules: {
        name: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        joinDate: [
          { required: true, message: '请选择入驻时间', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ],
        career: [
          { required: true, message: '请输入讲师资历', trigger: 'blur' },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.$route 参考 vue-router Api 路由对象
    if (this.$route.params.id) {
      this.getTeacherInfo(this.$route.params.id)
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$message.success('上传成功')
      this.teacher.avatar = res.data.path
      this.$forceUpdate
      this.saveBtnDisabled = false
    },
    beforeAvatarUpload(file) {
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
    // 查询讲师信息
    getTeacherInfo(id) {
      teacherApi.getTeacherById(id)
        .then(resp => {
          this.teacher = resp.data.item
        })
    },
    saveOrUpdate() {
      // 禁用保存按钮
      this.saveBtnDisabled = true
      if (this.teacher.id) {
        this.udpateData()
      } else {
        this.saveData()
      }
    },
    saveData() {
      this.$refs['teacherForm'].validate(valid => {
        if (valid) {
          teacherApi.save(this.teacher)
            .then(resp => {
              this.$message({
                type: 'success',
                message: resp.message
              })
              // this.$router 参考 vue-router Api Router实例方法
              this.$router.push({ path: '/teacher' })
            })
        }
      })
    },
    udpateData() {
      this.$refs['teacherForm'].validate(valid => {
        if (valid) {
          teacherApi.update(this.teacher)
            .then(resp => {
              this.$message({
                type: 'success',
                message: resp.message
              })
              // this.$router 获取vuerouter对象（包含多个router映射）
              // this.$router.push 切换路由
              this.$router.push({ path: '/teacher' })
            })
        }
      })
    }
  }
}
</script>

