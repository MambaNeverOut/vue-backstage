<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="addRoleBtn" type="success" plain>添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand" width="150">
        <template v-slot="scope">
          <el-row v-for="(level1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                @close="deleRight(scope.row, level1.id)"
                closable
                type="success"
              >{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(level2, i) in level1.children" :key="i">
                <el-col :span="4">
                  <el-tag @close="deleRight(scope.row, level3.id)" closable type>{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(scope.row, level3.id)"
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
          <el-button type="primary" icon="el-icon-edit" circle @click="showRightDia(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle @click="showSetRightDia(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构
      show-checkbox -> 选择框
      node-key 每个节点的唯一标识
      default-expand-keys 默认展开 [要展开的节点的id]
      default-checked-keys 默认展开 [要选择的节点的id]
      props 配置项 {label, children}
      label节点的文字标题和children节点的子节点
      值都类源于data绑定的数据源中的该数据的key名 'label'和 'chldren'-->
      <!-- 
      -->
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="arrCheck"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogFormVisibleRight: false,
      // 树形结构数据
      treeList: [],
      defaultProps: {
        label: "authName",
        childrem: "children"
      },
      arrExpand: [],
      arrCheck: [],
      currRoleId: -1
    };
  },
  methods: {
    getRoleList() {
      this.axios.get(`roles`).then(res => {
        this.roleList = res.data.data;
      });
    },
    deleRight(role, rightId) {
      this.axios.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
        role.children = res.data.data;
      });
    },
    async showSetRightDia(role) {
      this.currRoleId = role.id;
      const res = await this.axios.get(`rights/tree`);
      this.treeList = res.data.data;
      // 选中角色拥有的权限
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        // arrtemp2.push(item1.id);
        item1.children.forEach(item2 => {
          // arrtemp2.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrCheck = arrtemp2;
      this.dialogFormVisibleRight = true;
    },
    setRoleRight() {
      let arr1 = this.$refs.tree.getCheckedKeys();
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...arr1, ...arr2];
      this.axios
        .post(`roles/${this.currRoleId}/rights`, { rids: arr.join(",") })
        .then(res => {
          console.log(res);
        });
      this.getRoleList();
      this.dialogFormVisibleRight = false;
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
  margin: 0 0 15px 15px;
}
</style>
