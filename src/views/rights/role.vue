<template>
  <div>
    <bread-crumb level1="权限管理" level2="角色列表"></bread-crumb>
    <el-button class="addRoleBtn" type="success" plain>添加角色</el-button>
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand" width="150">
        <template v-slot="scope">
          <el-row v-for="(level1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                @close="deleRight(scope.row.id, level1.id)"
                closable
                type="success"
              >{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(level2, i) in level1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(scope.row.id, level1.id)"
                    closable
                    type
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(scope.row.id, level1.id)"
                    closable
                    type="warning"
                    v-for="(level3, i) in level2.children"
                    :key="i"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色姓名" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDelUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  methods: {
    getRoleList() {
      this.axios.get(`roles`).then(res => {
        console.log(res);
        this.roleList = res.data.data;
      });
    },
    deleRight(roleId, rightId) {
      this.axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => {
        console.log(res);
        this.getRoleList();
      });
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang='less' scoped>
.addRoleBtn {
  display: block;
  margin: 20px 0 20px 10px;
}
</style>
