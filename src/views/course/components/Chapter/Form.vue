<template>
  <div>
    <el-form>
      <el-dialog :visible.sync="dialogFormVisible" :before-close="handleClose" title="添加章节">
        <el-form :model="chapterForm">
          <el-form-item :label-width="formLabelWidth" label="章节标题">
            <el-input v-model="chapterForm.title" />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="章节排序">
            <el-input-number v-model="chapterForm.sort" :min="0" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelButton">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateData">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>

import chapterApi from '@/api/chapter'

export default {
  data() {
    return {
      dialogFormVisible: false,
      chapterForm: {
        sort: 0
      },
      formLabelWidth: '120px'
    }
  },
  created() {},
  methods: {
    getChapterInfo(id) {
      chapterApi.getChapterInfoById(id).then(response => {
        //
        this.chapterForm.id = response.data.item.id
        this.chapterForm.title = response.data.item.title
        this.chapterForm.sort = response.data.item.sort
        // 修改渲染之后再显示表单
        this.dialogFormVisible = true
      })
    },
    open(chapterId) {
      this.chapterForm.courseId = this.$parent.$parent.courseId
      // console.log('章节ID：' + chapterId)
      if (chapterId) {
        this.getChapterInfo(chapterId)
      } else {
        // 添加直接显示
        this.dialogFormVisible = true
      }
    },
    close() {
      this.dialogFormVisible = false
    },
    saveOrUpdateData() {
      if (this.chapterForm.id) {
        this.updateData()
      } else {
        this.saveData()
      }
    },
    // 添加章节
    saveData() {
      chapterApi.saveChapter(this.chapterForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.resetData()
          this.$parent.getChapterList()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 修改章节
    updateData() {
      chapterApi.updateChapter(this.chapterForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.resetData()
          this.$parent.getChapterList()
          // this.$parent.chapterFormVisible = false
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 重置表单内容，并隐藏表单
    resetData() {
      this.chapterForm = { sort: 0 }
      this.dialogFormVisible = false
    },
    // 取消按钮函数
    cancelButton() {
      this.resetData()
    },
    // 点击错号前调用的函数
    handleClose(done) {
      this.resetData()
    }
  }
}
</script>
