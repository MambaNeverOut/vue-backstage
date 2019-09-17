<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-card>
      <el-button class="addRoleBtn" type="success" plain @click="showAddRoleDia()">添加角色</el-button>
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
                    <el-tag
                      @close="deleRight(scope.row, level3.id)"
                      closable
                      type
                    >{{level2.authName}}</el-tag>
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
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditRoleDia(scope.row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeRole(scope.row)"></el-button>
            <el-button
              type="success"
              icon="el-icon-setting"
              circle
              @click="showSetRightDia(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的对话框 -->
      <el-dialog title="添加新角色" :visible.sync="diaFormVisibleAdd" width="50%">
        <!-- 添加角色的表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="diaFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色的对话框 -->
      <el-dialog title="编辑角色信息" :visible.sync="dialogVisibleEdit" width="50%">
        <!-- 编辑角色的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      diaFormVisibleAdd: false,
      // 添加角色的表单
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      // 添加角色的表单验证规则
      addFormRules: {
        // 角色名称校验规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 编辑角色的表单验证规则
      dialogVisibleEdit: false,
      // 编辑角色的表单
      editForm: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      // 编辑表单的校验规则
      editFormRules: {
        // 角色名称校验规则
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 树形结构数据
      dialogFormVisibleRight: false,
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
    // 添加角色
    showAddRoleDia() {
      this.diaFormVisibleAdd = true;
    },
    addRole() {
      this.diaFormVisibleAdd = false;
      this.axios.post("roles", this.addForm).then(res => {
        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg);
          this.getRoleList();
          this.form = {};
        } else {
          this.$message.error("添加用户失败");
        }
      });
    },
    // 编辑角色
    showEditRoleDia(role) {
      this.editForm = role;
      this.dialogVisibleEdit = true;
    },
    editRole() {
      this.axios.put(`roles/${this.editForm.id}`, this.editForm).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("编辑角色信息失败！");
        }
        this.$message.success("编辑角色信息成功！");
        this.getRoleList();
        this.dialogVisibleEdit = false;
      });
    },
    // 删除角色
    removeRole(roleId) {
      this.$confirm("此操作将永久删除角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.axios.delete(`roles/${roleId.id}`);
          if (res.data.meta.status === 200) {
            // this.pagenum = 1;
            this.getRoleList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改权限
    deleRight(role, rightId) {
      this.axios.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
        role.children = res.data.data;
      });
    },
    showSetRightDia(role) {
      this.currRoleId = role.id;
      this.axios.get(`rights/tree`).then(res => {
        console.log(res);

        this.treeList = res.data.data;
      });
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
