<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo">
        <el-menu-item index="4" @click="gobacktoMain">
          <i class="el-icon-menu"></i>
          <span>主菜单</span>
        </el-menu-item>
        <el-menu-item index="1" @click="goToProblem">
          <i class="el-icon-document"></i>
          <span>题库</span>
        </el-menu-item>
        <el-menu-item index="2" @click="goToHistory">
          <i>
            <img src = "@/assets/history.png" style="width: 20px; height: 20px; margin-right: 10px">
          </i>
          <span>历史记录</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>{{ username }}</span>
          </template>
          <el-menu-item index="3-1" @click="logout">退出</el-menu-item>
          <el-menu-item index="3-2" @click="changesomething">个人资料</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <el-header class="header">
      </el-header>
      <el-main class="main-content">
        <div class="question-bank-container">
          <el-card class="question-bank-card">
            <div slot="header" class="clearfix">
              <span>题库</span>
              <!-- 新增题目按钮 -->
              <el-button type="primary" style="float: right; margin-top: -10px;" @click="HandleAdd">
                新增题目
              </el-button>
            </div>

            <!-- 表单 -->
            <el-form :model="form" label-width="80px">
              <el-row :gutter="20">
                <!-- 搜索关键词输入框 -->
                <el-col :span="12">
                  <el-form-item label="关键词">
                    <el-input v-model="form.keyword" placeholder="请输入关键词"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 操作按钮 -->
                <el-col :span="12" style="text-align: right;">
                  <el-button type="primary" @click="searchQuestions">搜索</el-button>
                  <el-button @click="clearQuestions" style="margin-left: 10px;">清空结果</el-button>
                </el-col>
              </el-row>
            </el-form>

            <!-- 题目列表 -->
            <el-table :data="questions" style="width: 100%">
              <!-- <el-table-column prop="id" label="题目编号" width="100"></el-table-column> -->
              <el-table-column prop="title" label="题目标题"></el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <router-link :to="`/problem/${scope.row.id}`">进入</router-link>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- 新增题目弹窗 -->
        <el-dialog title="新增题目" :visible.sync="dialogVisible" width="60%" @close="resetForm">
          <el-form :model="newProblem" label-width="80px">
            <el-form-item label="题目标题">
              <el-input v-model="newProblem.title" placeholder="请输入题目标题"></el-input>
            </el-form-item>
            <el-form-item label="题目内容">
              <div id="contentEditor" style="text-align:left;"></div>
            </el-form-item>
            <el-form-item label="题目解析">
              <div id="solutionEditor" style="text-align:left;"></div>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProblem">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from '@/utils/request.js';
import WangEditor from "wangeditor";
import hljs from "highlight.js";

export default {
  data() {
    return {
      token : localStorage.getItem('token'),
      activeMenu: "1", // 默认激活的菜单项
      form: {
        keyword: "",
      },
      questions: [],
      dialogVisible: false,
      newProblem: {
        title: "",
        content: "",
        solution: "",
      },
      contentEditor: null,
      solutionEditor: null,
      userid: '',
      username: ''  
    };
  },
  methods: {
    HandleAdd(){
      this.form = {}
      this.dialogVisible = true;

      this.$nextTick(() => {
        this.contentEditor = new WangEditor("#contentEditor");
        this.contentEditor.highlight = hljs;
        this.contentEditor.config.showLinkImg = false;
        this.contentEditor.config.uploadImgServer = 'http://192.168.100.128:8088/file/uploadfu';

        this.contentEditor.config.uploadFileName = 'file'
        this.contentEditor.config.uploadImgHeaders = {
          token: localStorage.getItem('token')
        }



        this.contentEditor.create();

        this.solutionEditor = new WangEditor("#solutionEditor");
        this.solutionEditor.config.showLinkImg = false;
        this.solutionEditor.highlight = hljs;
        this.solutionEditor.config.uploadImgServer = 'http://192.168.100.128:8088/file/uploadfu';
        this.solutionEditor.config.uploadFileName = 'file'
        this.solutionEditor.config.uploadImgHeaders = {
          token: localStorage.getItem('token')
        }

        this.solutionEditor.create();
      })

    },
    goToHistory() {
      this.$router.push("/history");
      this.activeMenu = "2";
    },
    logout() {
      localStorage.removeItem("token");
      this.$message.success("退出登录成功");
      this.$router.push("/login");
    },
    searchQuestions() {
      this.questions = this.questions.filter((question) =>
        question.title.includes(this.form.keyword)
      );
    },
    clearQuestions() {
      axios.get("http://192.168.100.128:8088/AllProblem").then((response) => {
        this.questions = response.data.data;
      });
    },
    goBack() {
      this.$router.push("/MainView");
    },
    gobacktoMain(){
      this.activeMenu = '4';
      this.$router.push('/MainView');
    },
    // 初始化富文本编辑器
    addProblem() {
      const title = this.newProblem.title;
      const content = this.contentEditor.txt.html();
      const solution = this.solutionEditor.txt.html();


      

      if (!this.newProblem.title) {
        this.$message.error("请输入题目标题");
        return;
      }
      if (!content) {
        this.$message.error("请输入题目内容");
        return;
      }
      if (!solution) {
        this.$message.error("请输入题目解析");
        return;
      }

      axios.post('http://192.168.100.128:8088/add' , {
        title : title,
        content : content,
        solution: solution
      }).then(response => {
        this.$message.success(response.data.message);
        this.dialogVisible = false;
        this.resetForm();
      })
      .catch(error => {
        console.error('Error adding problem:', error);
        this.$message.error('题目新增失败');
      });

      // 这里可以将题目数据发送到后端接口
      // 示例：
      // axios.post('http://localhost:8088/problem', { title: this.newProblem.title, content, solution })
      //   .then(response => {
      //     this.$message.success('题目新增成功');
      //     this.dialogVisible = false;
      //     this.resetForm();
      //   })
      //   .catch(error => {
      //     console.error('Error adding problem:', error);
      //     this.$message.error('题目新增失败');
      //   });

    },
    resetForm() {
      this.newProblem.title = "";
      this.contentEditor.txt.html("");
      this.solutionEditor.txt.html("");
    },
    changesomething() {
      this.$router.push('/userview');
    },
  },
  mounted() {
    axios.get("http://192.168.100.128:8088/AllProblem").then((response) => {
      this.questions = response.data.data;
    });
    axios.get('http://192.168.100.128:8088/whoisrealthis').then(response => {
      this.userid = response.data.data.id;
      this.username = response.data.data.userName;
    });
  },
};
</script>

<style scoped>
.sidebar {
    background: #545c64;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px; /* 添加圆角 */
    overflow: hidden; /* 确保内容不会超出圆角 */
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #27ae60;
    padding: 0 20px;
    height: 60px;
    border-radius: 12px; /* 添加圆角 */
    margin-left: 10px; /* 添加间距 */
  }
  
  .header-content {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
  }
  
  .main-content {
    padding: 20px;
    background: #e8f5e9;
    min-height: calc(100vh - 60px);
    border-radius: 12px; /* 添加圆角 */
    margin-left: 10px; /* 添加间距 */
  }

.question-bank-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f0f2f5;
}

.question-bank-card {
  width: 800px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 弹窗样式 */
.el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

#contentEditor,
#solutionEditor {
  min-height: 200px;
}

/* 按钮位置调整 */
.el-card__header {
  position: relative;
}

.el-button--text {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  margin-top: 0;
}

</style>