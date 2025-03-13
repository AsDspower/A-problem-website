<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="loginForm.userName"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassWord">
          <el-input
            v-model="loginForm.userPassWord"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">登录</el-button>
          <el-button @click="goToRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      loginForm: {
        userName: '',
        userPassWord: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPassWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          
          axios.post('http://192.168.100.128:8088/login', {
            userName: this.loginForm.userName,
            userPassWord: this.loginForm.userPassWord
          })
          .then(response => {
        
            if (response.data.code === 200) {
              // console.log('登录成功', response.data);
              this.$message.success(response.data.message);
              localStorage.setItem('token', response.data.data.token);
              this.$router.push('/MainView');
            } else {
              // 处理其他非成功状态
              this.$message.error(response.data.message);
            }
          })
          .catch(error => {
            // 处理登录失败
            console.log(error);
            this.$message.error("登录失败");
          });
        } else {
          this.$message.error('表单验证失败');
        }
      });
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>