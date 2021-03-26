
<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" :before-close="handleClose" title="添加推荐位">
    <el-form :model="adTypeForm">
      <el-form-item :label-width="formLabelWidth" label="推荐位名称">
        <el-input v-model="adTypeForm.title" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelButton">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import adTypeApi from '@/api/type'

export default {
  data() {
    return {
      dialogFormVisible: false,
      adTypeForm: {},
      formLabelWidth: '120px'
    }
  },
  methods: {
    open(adTypeId) {
      // this.adTypeForm.id = this.$parent.adTypeId
      if (adTypeId) {
        adTypeApi.getAdTypeInfo(adTypeId).then(response => {
          this.adTypeForm = response.data.item
          // 修改渲染之后再显示表单
          this.dialogFormVisible = true
        })
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
    // 添加推荐位
    saveData() {
      adTypeApi.addAdType(this.adTypeForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.resetData()
          this.$parent.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 修改推荐位
    adTypeApi() {
      adTypeApi.updateAdType(this.adTypeForm).then(response => {
        if (response.success) {
          this.$message.success(response.message)
          this.resetData()
          this.$parent.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 重置表单内容，并隐藏表单
    resetData() {
      this.adTypeForm = { }
      this.dialogFormVisible = false
    },
    // 取消按钮函数
    cancelButton() {
      this.resetData()
    },
    // 点击错号前调用的函数
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.resetData()
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
