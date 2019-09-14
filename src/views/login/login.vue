<template>
  <div class="login">
    <el-form ref="loginForm" :model="form" :rules="rules">
      <!-- 用户头像 -->
      <div class="headerPic">
        <img src="@/assets/img.gif" alt />
      </div>
      <!-- 用户名密码输入框 -->
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账号">
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码" type="password">
          <i slot="prefix" class="iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <!-- 登录按钮 重置按钮 -->
      <el-form-item>
        <el-button type="primary" @click="login" plain>登录</el-button>
        <el-button type="info" @click="resetForm" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { log } from "util";
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    var lett = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        lett.login();
      }
    };
  },
  methods: {
    login() {
      // 表单验证
      this.$refs.loginForm.validate(v => {
        if (v) {
          this.axios.post("login", this.form).then(res => {
            if (res.data.meta.status === 400) {
              this.$message.error("亲！" + res.data.meta.msg);
            } else {
              this.$message({
                message: "恭喜亲，您登录成功了",
                type: "success"
              });
              localStorage.setItem("token", res.data.data.token);
              this.$router.push("./home");
            }
          });
        } else {
          console.log("表单校验失败");
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: #2f4050;
  .el-form {
    width: 400px;
    padding: 70px 20px 20px 20px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    .headerPic {
      width: 100px;
      height: 100px;
      border-radius: 100%;
      box-shadow: 0px 3px 5px #ccc;
      position: absolute;
      top: -50px;
      left: 170px;
      img {
        width: 100px;
        height: 100px;
        border-radius: 100%;
      }
    }
  }
}
</style>