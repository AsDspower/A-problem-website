<template>
  <div class="problem-page-container">
    <el-card class="problem-card">
      <div slot="header" class="header">
        <span>题目详情</span>
        <el-button type="primary" @click="goToSolution">查看解析</el-button>
        <el-button @click="gobacktoallproblem">返回</el-button>
      </div>
      <div class="content">
        <h1>{{ problem.title }}</h1>
        <h2>题目内容</h2>
        <div v-html="problem.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from '@/utils/request.js';

export default {
  data() {
    return {
      problem: {
        id: 1,
        title: '题目1',
        content: '这是题目1的描述'
      }
    };
  },
  created() {
    this.getProblemId();
  },
  mounted() {
    this.history();
  },
  methods: {
    history() {
      const problemid = this.$route.params.id;
      axios.post('http://192.168.100.128:8088/history', {
        problemid: problemid
      })
        .then(response => {
          if (response.data.code === 200) {
            console.log('请求成功', response.data.data);
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.error('请求失败', error);
          this.$message.error('历史记录请求失败 , 请稍后再试');
        });
    },
    getProblemId() {
      const problemId = this.$route.params.id;
      axios.post(`http://192.168.100.128:8088/problem/${problemId}`, {
        id: problemId
      })
        .then(response => {
          if (response.data.code === 200) {
            this.problem.id = problemId;
            this.problem.title = response.data.data.title;
            this.problem.content = response.data.data.content;
            console.log('请求成功', this.problem);
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.error('请求失败', error);
          this.$message.error('请求失败 , 请稍后再试');
        });
    },
    goToSolution() {
      this.$router.push(`/problem/${this.problem.id}/solution`);
    },
    gobacktoallproblem() {
      this.$router.push('/problem');
    }
  }
};
</script>

<style scoped>
.problem-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2d2d2d;
  padding-top: 80px; /* 与固定头部保持间距 */
}

.problem-card {
  width: 60%;
  max-width: 800px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 20px; /* 与页面顶部保持间距 */
}

/* 固定顶部按钮区域 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1000;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
}

/* 内容区域 */
.content {
  max-height: calc(100vh - 160px); /* 调整为适合页面的高度 */
  overflow-y: auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #ccc;
  line-height: 1.6;
}

/* 按钮样式 */
.el-button {
  font-size: 14px;
  padding: 10px 20px;
  margin-left: 10px;
}

/* 滚动条美化（可选） */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>