<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      ref="singleTable"
      height="500px"
      :data="rightList"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column property="path" label="路径"></el-table-column>
      <el-table-column property="level" label="层级">
        <template v-slot="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { log } from "util";
export default {
  data() {
    return {
      rightList: []
    };
  },
  methods: {
    getRightList() {
      this.axios.get(`rights/list`).then(res => {
        console.log(res);
        this.rightList = res.data.data;
      });
    }
  },
  created() {
    this.getRightList();
  }
};
</script>

<style lang='less' scoped>
</style>
