<template>
  <!-- <div>如果存在多个form 则会提交失败
    <el-form> -->
  <el-dialog :visible.sync="dialogFormVisible" :before-close="handleClose" title="添加课时">
    <el-form :model="videoForm">
      <el-form-item :label-width="formLabelWidth" label="课时标题">
        <el-input v-model="videoForm.title" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="课时排序">
        <el-input-number v-model="videoForm.sort" :min="1" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="是否免费">
        <template>
          <el-radio v-model="videoForm.free" :label="1">免费</el-radio>
          <el-radio v-model="videoForm.free" :label="0">默认</el-radio>
        </template>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="上传视频">
        <el-upload
          ref="upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          :action="BASE_API+'/admin/aliyun/vod/upload'"
          class="upload-demo">
          <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
          <el-button :disabled = "uploadBtnDisabled" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button :disabled="saveOrUpdateDataButton" type="primary" @click="saveOrUpdateData">确 定</el-button>
    </div>
  </el-dialog>
  <!-- </el-form>
  </div> -->
</template>

<script>

import videoApi from '@/api/video'

export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      dialogFormVisible: false,
      uploadBtnDisabled: false,
      saveOrUpdateDataButton: false,
      fileList: [],
      videoForm: {
        sort: 0,
        free: 0
      },
      formLabelWidth: '120px'
    }
  },
  created() {},
  methods: {
    // 上传视频
    submitUpload() {
      this.$refs.upload.submit()
      this.uploadBtnDisabled = true
      this.saveOrUpdateDataButton = true
    },
    handleSuccess(res, file) {
      this.uploadBtnDisabled = false
      this.saveOrUpdateDataButton = false
      if (res.success) {
        this.$message.success(res.message)
        this.videoForm.videoSourceId = res.data.videoId
        this.videoForm.videoOriginalName = file.name
      } else {
        this.$message.error('上传失败！')
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除列表中的视频')
    },
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.saveOrUpdateDataButton = false
      this.$message.error('请求上传失败！')
    },
    //
    // 添加或修改课时
    saveOrUpdateData() {
      if (this.videoForm.id) {
        this.updateData()
      } else {
        this.saveData()
      }
      this.close()
    },
    updateData() {
      videoApi.updateVideo(this.videoForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.close()
          this.$parent.getChapterList()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 添加课时
    saveData() {
      // console.log('VideoForm:' + this.videoForm)
      videoApi.saveVideo(this.videoForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.close()
          this.$parent.getChapterList()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    getVideoById(videoId) {
      // 获取章节信息
      videoApi.getVideoById(videoId).then(response => {
        this.videoForm.id = response.data.item.id
        this.videoForm.title = response.data.item.title
        this.videoForm.sort = response.data.item.sort
        this.videoForm.free = response.data.item.free ? 1 : 0
        this.videoForm.chapterId = response.data.item.chapterId

        if (response.data.item.videoSourceId) {
          this.fileList = [{ name: response.data.item.videoOriginalName }]
        } else {
          this.fileList = []
        }
        this.dialogFormVisible = true // 等数据渲染完成后再显示表单
      })
    },
    // 修改弹出调用
    showVideoById(videoId) {
      if (videoId) {
        this.getVideoById(videoId)
      }
    },
    // 父窗口调用
    open(chapterId) {
      // 课程ID：
      this.videoForm.courseId = this.$parent.$parent.courseId
      // 章节ID
      this.videoForm.chapterId = chapterId
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
      this.videoForm = {
        sort: 0,
        free: 0
      }
      this.fileList = [] // 重置视频上传列表
    },
    handleClose(done) {
      this.close()
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //       this.dialogFormVisible = false
    //       this.$parent.videoFormVisible = false
    //     })
    //     .catch(_ => {})
    }
  }
}
</script>
