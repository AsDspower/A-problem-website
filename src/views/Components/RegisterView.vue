<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">注册</h2>
      <el-form ref="registerForm" :model="registerForm" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="registerForm.userName"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassWord">
          <el-input
            v-model="registerForm.userPassWord"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="goToLogin">返回登录</el-button>
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
      registerForm: {
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
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          axios.post('http://192.168.100.128:8088/register', {
            userName: this.registerForm.userName,
            userPassWord: this.registerForm.userPassWord
          })
          .then(response => {
            const { code, message, data } = response.data;
            if (code === 200 && data === null) {
              this.$message.success(message);
              this.$router.push('/login');
            } else {
              this.$message.error(message);
            }
          })
          .catch(error => {
            console.error('注册失败', error);
            this.$message.error('注册失败，请稍后再试');
          });
        } else {
          this.$message.error('表单验证失败');
        }
      });
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.register-card {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(35, 188, 117, 0.614);
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>