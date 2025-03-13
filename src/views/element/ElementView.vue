<template>
    <div class="problem-page-container">
      <el-card class="problem-card">
        <div slot="header" class="clearfix">
          <span>题目详情</span>
        </div>
        <div class="problem-content">
          <h1>{{ problem.title }}</h1>
          <h2>题目内容</h2>
          <div v-html="compiledContent"></div>
  
  
  
  
          <el-button type="primary" @click="goToSolution">查看题解</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import marked from 'marked';
  import 'highlight.js/styles/default.css'; // 引入highlight.js 的样式
  import hljs from 'highlight.js';
  
  
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
    mounted(){
      hljs.highlightAll();
    },
    computed: {
      compiledContent() {
        const rawContent = this.problem.content
        .replace(/\\\\/g , '\\')
        .replace(/\\n/g , '\n')
        .replace(/\\t/g , '\t');
        return marked( rawContent || '');
      }
    },
    created(){
      this.getProblemId();
    },
    methods: {
      getProblemId(){
        const problemId = this.$route.params.id;
        // 模板字符串需要使用反引号
        axios.post(`http://localhost:8088/problem/${problemId}`, {
          id : problemId
        })
        .then(response =>{
          if(response.data.code === 200){
            this.problem.id = problemId;
            this.problem.title = response.data.data.title;
            this.problem.content = response.data.data.content;
            console.log('请求成功' , this.problem);
          }
          else{
            this.$message.error(response.data.message);
          }
        })
        .catch(error =>{
          console.error('请求失败', error);
          this.$message.error('请求失败 , 请稍后再试');
        });
      },
      goToSolution() {
       this.$router.push(`/problem/${this.problem.id}/solution`);
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
  }
  
  .problem-card {
    width: 60%; /* 调整卡片宽度 */
    max-width: 800px; /* 设置最大宽度 */
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .problem-content {
    padding: 20px;
  }
  
  h1 {
    font-size: 24px; /* 增大标题字体 */
    margin-bottom: 10px;
  }
  
  p {
    font-size: 16px; /* 增大描述字体 */
    color: #ccc;
  }
  
  el-button {
    font-size: 14px; /* 增大按钮字体 */
    padding: 10px 20px; /* 增大按钮内边距 */
  }
  </style>