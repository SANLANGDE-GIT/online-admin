<template>
  <div class="app_container">
    <!--查询表单-->
    <el-form :inline="true" style="padding-top:10px;padding-left:30px">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师"/> -->
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师"
          value-key="name"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchSub()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 工具按钮 -->
        <el-button type="danger" @click="batchRemove()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <!-- 讲师列表 -->
    <el-table :data="teacherList" border stripe style="padding-left:15px" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column type="index" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1+(pageNum-1)*pageSize }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column property="avatar" label="头像" align="center" width="90">
        <template slot-scope="scope">
          <img
            v-if="scope.row.avatar"
            :src="scope.row.avatar"
            style="width: 60px; height: 60px">
          <img
            v-else
            src="https://oss.aliyuncs.com/aliyun_id_photo_bucket/default_handsome.jpg?imageView2/1/w/80/h/80"
            style="width: 60px; height: 60px">
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[5, 25, 50, 100]"
      :page-size="pageSize"
      :total="total"
      style="text-align:center"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import teacher from '@/api/teacher'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      searchObj: {},
      teacherList: [],
      handleSelections: []
    }
  },
  created() {
    this.pageList()
  },
  methods: {
    // 讲师右关键字搜索
    querySearch(queryString, cb) {
      teacher.queryNames(queryString).then(resp => {
        cb(resp.data.nameList)
      })
    },
    // 批量删除讲师
    batchRemove() {
      if (this.handleSelections.length === 0 || this.handleSelections === null) {
        this.$message.warning('请选择要删除的讲师')
        return
      }
      this.$confirm(`此操作将永久删除讲师, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var idList = []
        // this.handleSelection.forEach(items => { idList.push(items.id) })
        teacher.batchRemoveTeacher(this.handleSelections)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 选择行
    handleSelectionChange(val) {
      // console.log(val)
      this.handleSelections = []
      val.forEach(items => {
        this.handleSelections.push(items.id)
      })
    },
    // 删除讲师
    removeById(row) {
      this.$confirm(`此操作将永久删除讲师《${row.name}》, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.removeTeacherById(row.id)
          .then(resp => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 筛选
    searchSub() {
      this.pageNum = 1
      this.pageList()
    },
    // 分页查询
    pageList() {
      teacher.getPageList(this.pageNum, this.pageSize, this.searchObj)
        .then(resp => {
          this.teacherList = resp.data.pages.records
          // console.log(resp.data.pages.records)
          this.total = resp.data.pages.total
        })
    },
    // 改变页码，page：回调参数，表示当前选中的“页码”
    handleCurrentChange(page) {
      this.pageNum = page
      this.pageList()
    },
    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    handleSizeChange(size) {
      this.pageSize = size
      this.pageList()
    },
    // 列表查询
    getList() {
      teacher.getTeacherList()
        .then(resp => {
          // console.log(resp)
          this.teacherList = resp.data.items
        })
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.pageList()
    }
  }
}
</script>
