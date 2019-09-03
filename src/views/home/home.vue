<template>
  <div class="home">
    <el-container>
      <!-- 左上角logo -->
      <el-aside width="200px">
        <div class="logo"></div>

        <!-- 侧边栏 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="yellowgreen"
          :router="true"
        >
          <el-submenu :index="index + ''" v-for="(item, index) in menusList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="(item, index) in item.children"
              :key="index"
              :index="'/home/'+ item.path"
            >
              <i class="el-icon-menu"></i>
              {{item.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header>
          <i class="el-icon-tickets"></i>
          <h3>后台管理系统</h3>
          <div>
            您好，客户
            <a @click="signOut">退出</a>
          </div>
        </el-header>
        <!-- 内容区 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { log } from "util";
export default {
  components: {},
  data() {
    return {
      menusList: []
    };
  },
  // beforeCreate() {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     this.$router.push("./login");
  //   }
  // },
  methods: {
    getMenus() {
      this.axios.get("menus").then(res => {
        // console.log(res);
        this.menusList = res.data.data;
      });
    },
    signOut() {
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    }
  },
  created() {
    this.getMenus();
  }
};
</script>

<style lang='less' scoped>
.el-menu {
  border-right: none !important;
}
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      background: #545c64;
      .logo {
        height: 60px;
        background: url(../../assets/logo.jpg);
        background-size: cover;
        background-color: #fff;
      }
    }
    .el-header {
      background: #545c64;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      i {
        cursor: pointer;
        font-size: 35px;
      }
      a {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
}
</style>
