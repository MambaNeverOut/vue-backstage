<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <div class="search">
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUsers()"></el-button>
        </el-input>
        <el-button type="success" plain @click="showAddUserDia()">添加用户</el-button>
      </div>
      <!-- 用户列表 -->
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
            <el-switch
              @change="changeUserState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditUserDia(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="showDelUserMsgBox(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-setting"
              circle
              @click="showSetUserRoleDia(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 对话框 -->
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="addForm" :rules="addFormRules">
          <el-form-item label="用户名" label-width="formLabelWidth">
            <el-input v-model="addForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密 码" label-width="formLabelWidth">
            <el-input v-model="addForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮 箱" label-width="formLabelWidth">
            <el-input v-model="addForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电 话" label-width="formLabelWidth">
            <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser() ">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="editForm" :rules="editFormRules">
          <el-form-item label="用户名" label-width="formLabelWidth">
            <el-input disabled v-model="editForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮 箱" label-width="formLabelWidth">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电 话" label-width="formLabelWidth">
            <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
        <el-form :model="form">
          <el-form-item label="用户名" label-width="100px">{{currUserName}}</el-form-item>
          <el-form-item label="角色" label-width="100px">
            <el-select v-model="currRoleId" placeholder="请选择活动区域">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
          <el-button type="primary" @click="setRole()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { log } from "util";
export default {
  components: {},
  data() {
    // 在 data() 中，且 return 之前，自定义一些校验规则
    let checkEmail = (rule, value, callback) => {
      if (
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) ===
        false
      ) {
        return callback(new Error("邮箱地址不正确"));
      }
      // 校验通过
      callback();
    };

    // 校验手机号
    let checkMobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value) === false) {
        return callback(new Error("手机号不正确"));
      }
      callback();
    };
    return {
      tableData: [],
      query: "",
      dialogFormVisibleAdd: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      dialogFormVisibleEdit: false,
      editForm: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      // 编辑的表单验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          // 使用自定义的邮箱校验规则
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          // 使用自定义的手机号验证规则
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      dialogFormVisibleRole: false,
      form: {
        id: "", // 用户的Id
        role_name: "", // 用户当前的角色
        username: "", // 用户的名称
        rid: "" // 要为用户分配的新角色的Id
      },
      // 分页数据
      total: -1,
      pagenum: 1,
      pagesize: 5,
      // 分配角色
      currRoleId: -1,
      currUserId: -1,
      currUserName: "",
      // 保存角色数据
      roles: []
    };
  },
  methods: {
    getUsers() {
      this.axios
        .get("users", {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("请求用户列表失败！");
          }
          this.tableData = res.data.data.users;
          this.total = res.data.data.total;
        });
    },
    searchUsers() {
      this.getUsers();
    },
    addUser() {
      this.dialogFormVisibleAdd = false;
      this.axios.post("users", this.addForm).then(res => {
        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg);
          this.getUsers();
          this.form = {};
        } else {
          this.$message.error("添加用户失败");
        }
      });
    },
    editUser() {
      this.axios.put(`users/${this.editForm.id}`, this.editForm).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("编辑用户失败！");
        }
        this.$message.success("编辑用户成功！");
        this.dialogFormVisibleEdit = false;
        this.getUsers();
      });
    },
    setRole() {
      this.axios
        .put(`users/${this.currUserId}/role`, { rid: this.currRoleId })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("为用户分配新角色失败！");
          }
          this.$message.success("为用户分配新角色成功！");
          this.dialogFormVisibleRole = false;
          this.getUsers();
        });
    },
    changeUserState(user) {
      this.axios.put(`users/${user.id}/state/${user.mg_state}`).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("修改用户状态失败！");
        }
        this.$message.success("修改用户状态成功！");
      });
    },
    showAddUserDia() {
      this.addForm = {};
      this.dialogFormVisibleAdd = true;
    },
    showDelUserMsgBox(userId) {
      this.$confirm("此操作将永久删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.axios.delete(`users/${userId}`);
          if (res.data.meta.status === 200) {
            this.pagenum = 1;
            this.getUsers();
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
    showEditUserDia(user) {
      this.editForm = user;
      this.dialogFormVisibleEdit = true;
    },
    showSetUserRoleDia(user) {
      this.currUserName = user.username;
      this.currUserId = user.id;
      // 获取所有的角色
      this.axios.get(`roles`).then(res => {
        this.roles = res.data.data;
      });
      // 获取当前用户的角色id
      this.axios.get(`users/${user.id}`).then(res => {
        this.currRoleId = res.data.data.rid;
      });
      this.dialogFormVisibleRole = true;
    },
    loadUserList() {
      this.getUsers();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUsers();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
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
