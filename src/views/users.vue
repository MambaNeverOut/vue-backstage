<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-input
        @clear="loadUserList()"
        clearable
        placeholder="请输入内容"
        v-model="search"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUsers()"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <!-- 在单元格内显示的内容不是字符串（文本），需要给被显示的内容外层包裹一个template -->
        <!-- template内部要用数据设置v-slot属性，该属性的值是要用数据create_time的数据源tableData -->
        <!-- tableData.row代表数组中的每个对象 -->
        <template v-slot="tableData">{{tableData.row.create_time | formatDate}}</template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
        <el-button type="success" icon="el-icon-check" circle></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tableData: [],
      search: ""
    };
  },
  methods: {
    getUsers() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      this.axios
        .get("users", {
          params: {
            query: "",
            pagenum: 1,
            pagesize: 2
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.tableData = res.data.data.users;
            this.total = res.data.data.total;
          }
        });
    },
    searchUsers() {
      this.getUsers();
    },
    loadUserList() {
      this.getUsers();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      // this.pagenum = 1;
      this.getUsers();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUsers();
    }
  },
  created() {
    this.getUsers();
  }
};
</script>

<style lang='less' scoped>
.search {
  margin: 10px 0;
  .el-input {
    width: 47%;
    margin-right: 5px;
  }
}
</style>
