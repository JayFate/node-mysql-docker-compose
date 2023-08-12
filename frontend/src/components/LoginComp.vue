<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="logo">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <!-- 17 登录用户名小图标 icon，涉及导入字体 -->
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        const token = res.data.token
        window.sessionStorage.setItem('token', token)
        this.$router.push('home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .logo {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
