<template>
  <div class="app-container">

    <div>
      <el-button type="primary" @click="showAddChapterDialog">添加章节</el-button>
    </div>
    <!-- 章节列表 TODO -->
    <div>

      <!-- 章节列表 -->
      <ul class="chapterList">
        <li
          v-for="chapter in chapterList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}
            <span class="acts">
              <el-button type="text" @click="showAddVideoDialog(chapter.id)">添加课时</el-button>
              <el-button type="text" @click="showUpdateChapterDialog(chapter.id)">编辑</el-button>
              <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
          </p>
          <!-- 视频 -->
          <ul class="chapterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>
                {{ video.title }}
                <el-tag v-if="!video.videoSourceId" size="mini" type="danger">
                  {{ '尚未上传视频' }}
                </el-tag>
                <span class="acts">
                  <span v-if="video.free"><el-tag size="mini" type="success">免费观看</el-tag>|</span>
                  <span><el-button type="text" @click="showUpdateVideoDialog(video.id)">编辑</el-button>|</span>
                  <span><el-button type="text" @click="removeVideoById(video.id)">删除</el-button></span>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>

      <!-- <ul class="list">
        <li v-for="chapter in chapterList" :key="chapter.id" class="list-item">
          <el-row>
            <el-col :span="12"><div>
              <p style="left:10px">{{ chapter.title }}
            </p>            </div></el-col>
            <el-col :span="12">
              <div style="text-align:right;padding-right:10px">
                <el-button type="text" style="flot:right" @click="showAddVideoDialog(chapter.id)">添加课时</el-button>
                <el-button type="text" style="flot:right" @click="showUpdateChapterDialog(chapter.id)">修改</el-button>
                <el-button type="text" style="flot:right" @click="deleteChapter(chapter.id)">删除</el-button>
              </div>
            </el-col>
          </el-row>
          <ul class="list">
            <li v-for="video in chapter.children" :key="video.id">
              <p>{{ video.title }}</p>
            </li>
          </ul>
        </li>
      </ul> -->
    </div>
    <!-- 课时表单 -->
    <video-info ref="videoForm"/>
    <!-- 章节表单 需要项子组件传值，定义ref 属性使用Vue $refs 调用 -->
    <!-- <chapter-info v-if="chapterFormVisible"/> -->
    <chapter-info ref="chapterInfo"/>

    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">下一步</el-button>
    </div>
  </div>
</template>

<script>

import ChapterInfo from '@/views/course/components/Chapter/Form'
import VideoInfo from '@/views/course/components/Video/Form'

import chapterApi from '@/api/chapter'
import videoApi from '@/api/video'

export default {
  components: { ChapterInfo, VideoInfo },
  data() {
    return {
      // chapterFormVisible: false,
      chapterList: []
    }
  },
  created() {
    this.getChapterList()
  },
  methods: {
    // 章节、课时列表
    getChapterList() {
      chapterApi.getChapterNestedList(this.$parent.courseId).then(response => {
        // console.log(response)
        this.chapterList = response.data.items
      })
    },
    // 添加课时
    showAddVideoDialog(chapterId) {
      this.$refs.videoForm.open(chapterId)
    },
    // 编辑课时
    showUpdateVideoDialog(videoId) {
      this.$refs.videoForm.showVideoById(videoId)
    },
    // 删除课时
    removeVideoById(videoId) {
      this.$confirm('此操作将永久删除该课时小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        videoApi.deleteVideo(videoId).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getChapterList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 章节添加弹窗
    showAddChapterDialog() {
      this.$refs.chapterInfo.open() // 调用子对象的组件;调了半天，open方法又忘了加括号了
    },
    // 章节修改弹窗
    showUpdateChapterDialog(chapterId) {
      this.$refs.chapterInfo.open(chapterId)
    },
    // 删除章节
    deleteChapter(chapterId) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapterApi.deleteChapter(chapterId)
      }).then(response => {
        // console.log(response)
        this.getChapterList()
        this.$message({
          type: 'success',
          message: '删除成功!' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 上一步
    prev() {
      this.$parent.active = 0
    },

    // 下一步
    next() {
      this.$parent.active = 2
    }

  }
}
</script>
<style>
  /* .list{
    list-style-type:none;
    padding-left:0px
  }
  .list-item{
    border: darkgray 1px solid;
    padding-left:10px;
    height: 50px;
    margin-top: 2px;
  } */

.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}

</style>
