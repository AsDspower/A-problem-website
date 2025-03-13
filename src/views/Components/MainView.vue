<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" style="background-color: #555b63ff;" text-color="#ffffff">
        <el-menu-item index="4" @click="gobacktoMain">
          <i class="el-icon-menu" style="color: #ffffff;"></i>
          <span>主菜单</span>
        </el-menu-item>
        <el-menu-item index="1" @click="goToProblem">
          <i class="el-icon-document"></i>
          <span>题库</span>
        </el-menu-item>
        <el-menu-item index="2" @click="goToHistory">
          <i src = "">
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
          <el-menu-item index="3-2" @click="changesomething">个人资料</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h1>欢迎</h1>
        </div>
      </el-header>

      <!-- 轮播图区域 -->
      <el-carousel :interval="5000" type="card" height="300px" class="carousel">
        <el-carousel-item v-for="(site, index) in externalSites" :key="index">
          <div class="carousel-item" @click="jumpToSite(site.url)">
            <img :src="site.imageUrl" alt="轮播图" class="carousel-image">
          </div>
        </el-carousel-item>
      </el-carousel>

      <el-main class="main-content">
        <div style="display: flex; margin: 10px 0">
          <el-card style="width: 65%; margin-right: 10px">
            <div slot="header" class="clearfix">
              <span>图片上传与下载</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <!-- 添加行内样式让两个按钮在同一行 -->
              <div style="display: flex; gap: 10px; align-items: center">
                <el-upload
                  class="upload-demo"
                  action="http://192.168.100.128:8088/file/upload"
                  :headers="headers"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <el-button size="small" type="primary" @click="handleManageFile" style="margin-left: auto">文件管理</el-button>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件,且不超过500kb
              </div>
            </div>
          </el-card>
          <el-card style="width: 65%; margin-right: 10px">
            <div slot="header" class="clearfix">
              <span>随机跳题</span>
            </div>
            <div>
              <el-button type="success" @click="jumpToRandomProblem">随机跳题</el-button>
            </div>
          </el-card>
        </div>

        <!-- 弹窗: 文件管理 -->
        <el-dialog title="文件管理" :visible.sync="dialogVisible" width="50%">
          <el-table :data="fileList" style="width: 100%">
            <el-table-column prop="name" label="文件名称" width="300">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="downloadFile(scope.row)">预览</el-button>
                <el-button size="mini" type="danger" @click="deleteFile(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      activeMenu: '4', // 默认激活的菜单项
      fileList: [], // 文件列表
      dialogVisible: false, // 控制弹窗的显示与隐藏
      dialogVisibleprofile: false, // 控制资料弹窗的显示与隐藏
      username: 'NOTHING', // 用户名
      userid: 'NOTHING', // 用户id
      headers: {
        'token': localStorage.getItem('token'),
      },
      // 轮播图展示的外部网站列表
      externalSites: [
        { 
          url: 'https://www.luogu.com.cn/', 
          imageUrl: require('@/assets/luogu.png') 
        },
        { 
          url: 'https://www.acwing.com/', 
          imageUrl: require('@/assets/logo_9U4FkfC.png') 
        },
        { 
          url: 'https://vuejs.org', 
          imageUrl: require('@/assets/logo.png') 
        },
      ],
    };
  },
  mounted() {
    // 获取用户名
    axios.get('http://192.168.100.128:8088/whoisrealthis').then(response => {
      this.userid = response.data.data.id;
      this.username = response.data.data.userName;
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
      this.activeMenu = '4';
    },
    logout() {
      localStorage.removeItem('token');
      this.$message.success('退出登录成功');
      this.$router.push('/login');
    },
    upload() {},
    handleManageFile() {
      axios.get('http://192.168.100.128:8088/file/fileshow').then(response => {
        this.fileList = response.data.data;
      });
      this.dialogVisible = true;
    },
    downloadFile(row) {
      // 下载文件逻辑
      window.open(row.url);
    },
    deleteFile(row) {
      // 删除文件逻辑
      this.$confirm('确定删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 调用后端删除接口
        axios.delete('http://192.168.100.128:8088/file/delete', {
          params: { fileName: row.name },
        }).then(response => {
          this.$message.success('文件删除成功' + response.data.message);
          // 更新文件列表
          this.fileList = this.fileList.filter(file => file.name !== row.name);
        }).catch(error => {
          this.$message.error('文件删除失败: ' + error.message);
        });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
      this.handleManageFile();
    },
    // 新增方法：随机跳题
    jumpToRandomProblem() {
      axios.get('http://192.168.100.128:8088/random').then(response => {
        const problemid = response.data.data;
        this.$router.push(`/problem/${problemid}`);
      }).catch(error => {
        this.$message.error('跳题失败 ' + error.message);
      });
    },
    changesomething() {
      this.$router.push('/userview');
    },
    // 新增方法：跳转到外部网站
    jumpToSite(url) {
      window.open(url, '_blank');
    },
  },
};
</script>

<style scoped>
.sidebar {
  background: #545c64;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27ae60;
  padding: 0 20px;
  height: 60px;
  border-radius: 12px;
  margin-left: 10px;
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
  border-radius: 12px;
  margin-left: 10px;
}

.carousel {
  margin: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.carousel-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}
</style>