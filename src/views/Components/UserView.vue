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
          <!-- 下拉菜单 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>{{ username }}</span>
            </template>
            <el-menu-item index="3-1" @click="logout">退出</el-menu-item>
            <el-menu-item index="3-2" @click="showProfile">个人资料</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
  
      <!-- 主内容区域 -->
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <h1>欢迎，{{ username }}</h1>
          </div>
        </el-header>
        <el-main class="main-content">
          <div>
            <el-card class="profile-card">
              <div slot="header" class="clearfix">
                <span>个人中心</span>
              </div>
              <div>
                <p>用户ID: {{ userId }}</p>
                <p>用户名: {{ username }}</p>
                <el-button type="primary" @click="showChangeUsername">修改用户名</el-button>
                <el-button type="primary" @click="showChangePassword">修改密码</el-button>
              </div>
            </el-card>
  
            <!-- 修改用户名弹窗 -->
            <el-dialog title="修改用户名" :visible.sync="changeUsernameDialogVisible" width="30%">
              <el-form :model="changeUsernameForm" status-icon ref="changeUsernameForm" label-width="100px">
                <el-form-item label="新用户名">
                  <el-input v-model="changeUsernameForm.newUsername"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitChangeUsername">提交</el-button>
                  <el-button @click="changeUsernameDialogVisible = false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
  
            <!-- 修改密码弹窗 -->
            <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%">
              <el-form :model="changePasswordForm" status-icon ref="changePasswordForm" label-width="100px">
                <el-form-item label="旧密码">
                  <el-input type="password" v-model="changePasswordForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input type="password" v-model="changePasswordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                  <el-input type="password" v-model="changePasswordForm.confirmNewPassword"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitChangePassword">提交</el-button>
                  <el-button @click="changePasswordDialogVisible = false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
  
          <!-- 弹窗: 文件管理 -->
          <el-dialog title="文件管理" :visible.sync="dialogVisible" width="50%">
          </el-dialog>
  
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script>
import axios from '@/utils/request.js';

  export default {
    data() {
      return {
        activeMenu: '3-2', // 默认激活的菜单项
        dialogVisible: false, // 控制弹窗的显示与隐藏
        username: 'NOTHING', // 用户名
        userId: '12345', // 用户ID
        changeUsernameDialogVisible: false, 
        changePasswordDialogVisible: false, 
        changeUsernameForm: {
          newUsername: ''
        },
        changePasswordForm: {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }
      };
    },
    mounted() {
      axios.get('http://192.168.100.128:8088/whoisrealthis').then(response =>{
        this.username = response.data.data.userName;
        this.userId = response.data.data.id;

      }).catch(error => {
        console.log(error);
        this.$message.error('获取用户信息失败');
      });
    },
    methods: {
      goToProblem() {
        this.$router.push('/problem');
        this.activeMenu = '1';
      },
      goToHistory() {
        this.$router.push('/history');
        this.activeMenu = '2';
      },
      gobacktoMain() {
        this.$router.push('/MainView');
        this.activeMenu = '4';
      },
      logout() {
        localStorage.removeItem('token');
        this.$message.success('退出登录成功');
        this.$router.push('/login');
      },
      showProfile() {
        // 显示个人资料页面
        this.activeMenu = '3';
      },
      showChangeUsername() {
        this.changeUsernameDialogVisible = true;
      },
      showChangePassword() {
        this.changePasswordDialogVisible = true;
      },
      submitChangeUsername() {
        // 提交修改用户名逻辑
        console.log('提交修改用户名:', this.changeUsernameForm.newUsername);
        axios.post('http://192.168.100.128:8088/changename' ,null ,  {
          params:{
            name : this.changeUsernameForm.newUsername
          }

        }).then(response => {
          if (response.data.code === 200) {
            this.$message.success(response.data.message);
            this.username = this.changeUsernameForm.newUsername;
            this.changeUsernameDialogVisible = false;
          } else {
            this.$message.error(response.data.message);
          }
        }).catch(error => {
          console.log(error);
          this.$message.error('修改用户名失败');
        });
      },
      submitChangePassword() {
        // 提交修改密码逻辑
        axios.post('http://192.168.100.128:8088/changepassword', {
          oldpassword : this.changePasswordForm.oldPassword,
          newpassword : this.changePasswordForm.newPassword,
          confirmpassword : this.changePasswordForm.confirmNewPassword


        }).then(response => {
          if (response.data.code === 200) {
            this.$message.success(response.data.message);
            this.changePasswordDialogVisible = false;
          } else {
            this.$message.error(response.data.message);
          }
        }).catch(error => {
          console.log(error);
          this.$message.error('修改用户名失败');
        });
      },
      changesomething() {
        this.activeMenu = '3-2';
    },
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
  

  
  /* 弹窗样式 */
  .el-dialog {
    margin-top: 10vh !important;
  }
  
  .el-button--primary {
    background-color: #4CAF50;
    border-color: #4CAF50;
    color: #ffffff;
  }
  
  .el-button--primary:hover {
    background-color: #2ecc71; /* 浅蓝色背景 */
    border-color: #2ecc71;
  }
  
  .el-button--success {
    background-color: #4CAF50; /* 绿色背景 */
    border-color: #4CAF50;
    color: #ffffff;
  }
  
  .el-button--success:hover {
    background-color: #2ecc71; /* 浅绿色背景 */
    border-color: #2ecc71;
  }
  
  .el-dialog {
    background: #ffffff; /* 白色背景 */
    border-radius: 12px; /* 添加圆角 */
    margin-top: 10vh !important;
  }
  
  .el-dialog__header {
    background: #2c3e50; /* 深灰色背景 */
    color: #ffffff; /* 白色文字 */
    border-top-left-radius: 12px; /* 添加圆角 */
    border-top-right-radius: 12px; /* 添加圆角 */
  }
  
  .el-dialog__title {
    font-size: 18px;
    font-weight: bold;
  }
  
  /* 文件管理表格样式 */
  .el-table {
    background-color: #ffffff; /* 白色背景 */
    border-radius: 8px; /* 添加圆角 */
  }
  
  .el-table th,
  .el-table td {
    text-align: center;
  }
 

  </style>