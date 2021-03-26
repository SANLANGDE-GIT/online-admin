<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" style="padding-top:10px;padding-left:30px">
      <el-form-item>
        <el-form-item label="课程讲师" prop="teacherId">
          <el-select v-model="courseQueryData.teacherId" placeholder="请选择讲师">
            <el-option
              v-for="item in teacherData"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-select v-model="courseQueryData.subjectParentId" @change="subjectChange">
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <el-select v-model="courseQueryData.subjectId">
          <el-option
            v-for="item in subjectTwoData"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程标题">
        <el-input v-model="courseQueryData.title" placeholder="请输入课程标题"/>
        <!-- <el-autocomplete
          v-model="courseQueryData.title"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="课程标题"
          value-key="name"
        /> -->
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="courseQueryData.status" clearable placeholder="课程状态">
          <el-option value="Draft" label="未发布"/>
          <el-option value="Normal" label="已发布"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="courseQueryData.publishTimeBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="courseQueryData.publishTimeEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchSub()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
      <!-- 工具按钮 -->
      <!-- <el-form-item>
        <el-button type="danger" @click="batchRemove()">批量删除</el-button>
      </el-form-item> -->
    </el-form>
    <!-- 课程列表 -->
    <el-table :data="courseList" border stripe style="padding:0 15px" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <!-- <el-table-column type="index" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1+(pageNum-1)*pageSize }}
        </template>
      </el-table-column> -->
      <el-table-column property="cover" label="封面" align="center" width="200">
        <template slot-scope="scope">
          <img
            v-if="scope.row.cover"
            :src="scope.row.cover"
            width="100%">
          <img
            v-else
            width="100%"
            src="https://oss.aliyuncs.com/aliyun_id_photo_bucket/default_handsome.jpg?imageView2/1/w/80/h/80">
        </template>
      </el-table-column>
      <el-table-column label="课程信息">
        <template slot-scope="scope">
          <p>{{ scope.row.title }}</p>
          <p>分类：{{ scope.row.subjectParentTitle }}> {{ scope.row.subjectTitle }}</p>
          <p>课时：{{ scope.row.lessonNum }} / 浏览： {{ scope.row.viewCount }} / 付费学员： {{ scope.row.buyCount }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="讲师" align="center" width="120" />
      <el-table-column label="价格" width="90" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.price > 0" type="success" size="mini">{{ scope.row.price }}</el-tag>
          <el-tag v-else size="mini" type="success">免费</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="课程状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'Draft'" type="warning" size="mini">未发布</el-tag>
          <el-tag v-else size="mini" type="success">已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gmtModified" format="yyyy-MM-dd" label="创建时间" width="120" align="center" />
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[4, 25, 50, 100]"
      :page-size="pageSize"
      :total="total"
      style="text-align:center"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
import courseApi from '@/api/course'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 4,
      total: 0,
      courseList: [],
      courseQueryData: {},
      teacherData: [],
      subjectTwoData: [],
      subjectData: []
    }
  },
  created() {
    // this.getCourseList()
    this.getQueryCoursePageList()
    this.getTeacherList()
    this.getNestedTreeList()
  },
  methods: {
    // 课程分类列表
    getNestedTreeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectData = response.data.items
      })
    },
    // 讲师下拉选项
    getTeacherList() {
      teacherApi.getTeacherList().then(response => {
        this.teacherData = response.data.items
      })
    },
    // 课程列表分页查询
    getQueryCoursePageList() {
      courseApi.queryCoursePageList(this.pageNum, this.pageSize, this.courseQueryData).then(response => {
        this.total = response.data.pages.total
        this.courseList = response.data.pages.records
      })
    },
    // 课程列表查询
    getCourseList() {
      courseApi.selectCourseList().then(response => {
        // console.log(response.data)
        this.courseList = response.data.items
      })
    },
    // 查询
    searchSub() {
      this.pageNum = 1
      this.getQueryCoursePageList()
    },
    // 重置查询框
    resetData() {
      this.courseQueryData.subjectParentId = ''
      this.courseQueryData.subjectId = ''
      this.courseQueryData = {}
      this.subjectTwoData = []
    },
    // 删除课程
    removeById(row) {
      this.$confirm('您确定要删除《' + row.title + '》该课程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseApi.deleteCourseById(row.id).then(response => {
          if (response.success) {
            this.$message.success(response.message)
            this.getQueryCoursePageList()
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量选择
    handleSelectionChange() {},
    subjectChange(value) {
      this.subjectTwoData = []
      this.courseQueryData.subjectId = ''
      this.subjectData.forEach(items => {
        if (items.id === value) {
          this.subjectTwoData = items.children
        }
      })
    },
    // 修改每页显示的条数
    handleSizeChange(pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getQueryCoursePageList()
      this.resetData()
    },
    // 页码跳转
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getQueryCoursePageList()
    }
  }
}
</script>
