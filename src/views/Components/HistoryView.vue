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
        <div class="history-container">
          <div style="float : left; margin-top: 10px; margin-left: 10px">
            <span style="font-family: 'KaiTi'; font-size: 20px;">历 史 记 录</span>
          </div>
          <el-button type="primary" style="float:right ; margin-top:10px; margin-right: 10px; margin-bottom: 10px"
            @click="gobacktoMain">返回</el-button>
          <el-button type="primary" style="float:right ; margin-top:10px; margin-right: 10px; margin-bottom: 10px"
            @click="clearall">清空历史记录</el-button>

          <el-table :data="historyList" class="history-table" border v-loading="loading" element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.9)">
            <el-table-column prop="title" label="题目标题" class-name="table-column">
            </el-table-column>
            <el-table-column label="操作" width="120" class-name="table-column">
              <template slot-scope="scope">
                <el-button type="text" class="action-button" @click="goToProblemid(scope.row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from '@/utils/request.js';

// function parseJwt(token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );
//   return JSON.parse(jsonPayload);
// }

export default {
  data() {
    return {
      activeMenu: '2', // 默认激活的菜单项
      historyList: [], // 历史记录数据
      loading: false, // 加载状态
      userid: 'NOTHING',
      username: 'NOTHING'
    };
  },
  mounted() {
    this.fetchHistory();
    axios.get('http://192.168.100.128:8088/whoisrealthis').then(response => {
      this.userid = response.data.data.id;
      this.username = response.data.data.userName;
    });
  },
  methods: {
    changesomething() {
      this.$router.push('/userview');
    },
    fetchHistory() {
      this.loading = true;
      try {

        axios
          .get('http://192.168.100.128:8088/Allhistory')
          .then((response) => {
            if (response.data.code === 200) {
              this.historyList = response.data.data; // 假设后端返回的 data 是历史记录数组
            } else {
              this.$message.error(response.data.message || '加载历史记录失败');
            }
          })
          .catch((error) => {
            console.error('Error fetching history:', error);
            this.$message.error('加载历史记录失败');
          })
          .finally(() => {
            this.loading = false;
          });
      } catch (error) {
        console.error('Error parsing token:', error);
        this.$message.error('解析 token 失败，请检查登录状态');
        this.$router.push('/login');
      }
    },
    goToProblemid(id) {
      // 跳转到题目详情页面
      this.$router.push(`/problem/${id}`);
      this.activeMenu = '1'; // 更新激活的菜单项
    },
    goToProblem() {
      this.$router.push('/problem');
      this.activeMenu = '1'; // 更新激活的菜单项
    },
    logout() {
      localStorage.removeItem('token');
      this.$message.success('退出登录成功');
      this.$router.push('/login');
    },
    gobacktoMain(){
      this.activeMenu = '4';
      this.$router.push('/MainView');
    },
    clearall() {
      axios.get('http://192.168.100.128:8088/deleteallhistory').then((response) => {
        if (response.data.code === 200) {
          this.$message.success(response.data.message);
          this.historyList = [];
        } else {
          this.$message.error(response.data.message);
        }
      });
    }
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

.history-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.back-button {
  text-align: right;
  padding-top: 4px;
}

.history-table {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}

.table-column {
  text-align: center;
}

.action-button {
  color: #409eff;
  font-size: 14px;
}

.action-button:hover {
  color: #66b1ff;
  cursor: pointer;
}
</style>