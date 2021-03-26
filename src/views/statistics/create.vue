<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="genarateData()">生成</el-button>
    </el-form>

  </div>
</template>

<script>

import statisticsApi from '@/api/statistics'
export default {

  data() {
    return {
      btnDisabled: false,
      day: ''
    }
  },
  methods: {
    genarateData() {
      statisticsApi.createStatisticsByDay(this.day).then(response => {
        this.btnDisabled = true
        this.$message.success('生成成功！')
      })
    }
  }

}
</script>
