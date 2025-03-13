<template>
  <div class="problem-solution-container">
    <el-card class="problem-solution-card">
      <div slot="header" class="header">
        <span>解析</span>
        <el-button @click="gobacktosingleproblem">返回题目</el-button>
      </div>
      <div class="solution-content">
        <h1>{{ solution.title }}</h1>
        <div v-html="solution.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from '@/utils/request.js';

export default {
  data() {
    return {
      solution: {
        title: 'FOR THERE IS NO TITLE',
        content: 'NO CONTENT'
      }
    };
  },
  created() {
    this.fetchSolution();
  },
  methods: {
    fetchSolution() {
      const problemId = this.$route.params.id;
      axios.post(`http://192.168.100.128:8088/problem/${problemId}`, {
        id: problemId
      })
        .then(response => {
          if (response.data.code === 200) {
            this.solution.title = response.data.data.title;
            this.solution.content = response.data.data.solution;
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.error('请求失败', error);
          this.$message.error('请求失败 , 请稍后再试');
        });
    },
    gobacktosingleproblem() {
      this.$router.push(`/problem/${this.$route.params.id}`);
    }
  }
};
</script>

<style scoped>
.problem-solution-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  padding-top: 80px; /* 与固定头部保持间距 */
}

.problem-solution-card {
  width: 60%;
  max-width: 800px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
.solution-content {
  max-height: calc(100vh - 160px); /* 调整为适合页面的高度 */
  overflow-y: auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

/* 按钮样式 */
.el-button {
  font-size: 14px;
  padding: 10px 20px;
  margin-left: 10px;
}

/* 滚动条美化（可选） */
.solution-content::-webkit-scrollbar {
  width: 8px;
}

.solution-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.solution-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.solution-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>