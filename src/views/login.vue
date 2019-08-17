<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules">
      <div class="headerPic">
        <img src="../assets/img.gif" alt />
      </div>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账户"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-button style="width: 100%" type="primary" @click="login" plain>登录</el-button>
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
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.form.validate(v => {
        if (v) {
          this.axios.post("login", this.form).then(res => {
            console.log(res);
            if (res.data.message === 400) {
              this.$message.error("亲！" + res.data.meta.msg);
            } else {
              this.$message({
                message: "恭喜亲，您登录成功了",
                type: "success"
              });
            }
          });
        } else {
          console.log("表单校验失败");
        }
      });
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