<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        ref="singleTable"
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
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
