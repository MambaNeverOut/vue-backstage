<template>
  <div class="home">
    <el-header style="height: 80px;">
      <img src="@/assets/logo.jpg" alt height="80px" width="200px" />
      <router-link to="/home" style="text-decoration: none;">
        <h2>后台管理系统</h2>
      </router-link>
      <el-button type="info" @click="signOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="yellowgreen"
          :router="true"
        >
          <el-submenu :index="i + ''" v-for="(item, i) in menusList" :key="item.id">
            <template slot="title">
              <i :class="['iconfont', iconlist[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="(item, index) in item.children"
              :key="index"
              :index="'/home/'+ item.path"
              class="childLevel"
            >
              <i class="el-icon-menu"></i>
              {{item.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { log } from "util";
export default {
  components: {},
  data() {
    return {
      menusList: [],
      iconlist: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ]
    };
  },
  methods: {
    getMenus() {
      this.axios.get("menus").then(res => {
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
}
.el-container {
  height: 100%;
  .el-aside {
    background: #545c64;
    .iconfont {
      margin-right: 8px;
    }
    .childLevel {
      margin-left: 20px;
    }
  }
}
.el-header {
  background: #545c64;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  color: #fff;
  h2 {
    color: #fff;
  }
  .el-button {
    margin-right: 20px;
  }
}
</style>
