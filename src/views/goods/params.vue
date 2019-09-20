<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="只允许为第三级分类设置参数" type="error"></el-alert>
    <el-row>
      <el-col>
        选择商品分类：
        <!-- 级联选择器 -->
        <el-cascader
          :show-all-levels="false"
          v-model="selectedOptions"
          :options="options"
          expand-trigger="hover"
          :props="defaultProp"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-col>
    </el-row>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick()">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" @click="setDyParams">设置动态参数</el-button>
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template v-slot="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" @click="setStaticParams()">设置静态参数</el-button>
        <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template v-slot="scope">
              <el-tag
                :key="i"
                v-for="(tag, i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope, i)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态属性'"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 级联选择器
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      activeName: "many",
      tableList: [],
      // 添加参数
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请添加参数名称", trigger: "blur" }
        ]
      },
      // 修改参数
      editDialogVisible: false,
      editForm: {
        attrId: "", // 要编辑的那个参数的Id
        attr_name: "" // 要修改的参数的名称
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请添加参数名称", trigger: "blur" }
        ]
      },
      arrDyparams: [],
      arrStaticparams: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    handleChange() {
      if (this.selectedOptions.length === 3) {
        this.axios
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          .then(res => {
            this.arrDyparams = res.data.data;
            this.arrDyparams.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
          });
      }
    },
    getGoodCate() {
      this.axios.get(`categories?type=3`).then(res => {
        this.options = res.data.data;
      });
    },
    handleClick() {
      if (this.activeName === "only") {
        if (this.selectedOptions.length === 3) {
          this.axios
            .get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
            .then(res => {
              this.arrStaticparams = res.data.data;
              // 由于 服务器返回的参数列表中，每一个参数项的 attr_vals 为普通字符串，我们需要使用 字符串的 split 操作，把 attr_vals 用 空格 分割为 数组
              res.data.data.forEach(item => {
                // 判断 item.attr_vals 是否为 空字符串，如果不为空，则 进行 分割；
                // 如果为空，则 不进行分割，直接返回一个空数据，表示没有可选项；
                item.attr_vals = item.attr_vals
                  ? item.attr_vals.split(" ")
                  : [];
                item.inputVisible = false;
                item.inputValue = "";
              });
              // 数据获取成功以后，应该 根据 activeName 进行判断，从而决定把数据交给哪个表格去渲染；
              if (this.activeName === "many") {
                this.arrDyparams = res.data.data;
              } else {
                this.arrStaticparams = res.data.data;
              }
            });
        }
      }
    },
    setDyParams() {
      this.addDialogVisible = true;
    },
    setStaticParams() {
      this.addDialogVisible = true;
    },
    addParams() {
      this.axios
        .post(`categories/${this.selectedOptions[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName // 控制添加的参数类型
        })
        .then(res => {
          console.log(res);
          if (res.data.meta.status !== 201)
            return this.$message.error("添加参数失败！");
          this.$message.success("添加参数成功！");
          // 重新获取参数列表中的数据
          this.getGoodCate();
          // 隐藏添加的对话框
          this.addDialogVisible = false;
        });
    },
    // 点击x按钮删除
    handleClose(scope, tag) {
      scope.attr_vals.splice(scope.attr_vals.indexOf(tag), 1);
      let putData = {
        attr_name: scope.attr_name,
        attr_sel: "many",
        attr_vals: scope.attr_vals.join(",")
      };
      this.axios
        .put(
          `categories/${this.selectedOptions[2]}/attributes/${scope.attr_id}`,
          putData
        )
        .then(res => {
          // console.log(res);
        });
    },
    // 点击newTag+按钮添加
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 回车键+失去焦点添加
    handleInputConfirm(scope) {
      let inputValue = this.inputValue;
      if (inputValue) {
        scope.attr_vals.push(inputValue);

        let putData = {
          attr_name: scope.attr_name,
          attr_sel: "many",
          attr_vals: scope.attr_vals.join(",")
        };
        this.axios
          .put(
            `categories/${this.selectedOptions[2]}/attributes/${scope.attr_id}`,
            putData
          )
          .then(res => {
            // console.log(res);
          });
      }

      this.inputVisible = false;
      this.inputValue = "";
    },
    showEditDialog(scope) {
      this.axios
        .get(
          `categories/${this.selectedOptions[2]}/attributes/${
            scope.row.attr_id
          }`
        )
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数信息失败！");
          // 获取参数信息成功后，为 data 中的 editForm 赋值
          this.editForm.attr_name = res.data.data.attr_name;
          this.editForm.attrId = res.data.data.attr_id;
          // 展示 编辑的对话框
          this.editDialogVisible = true;
        });
    },
    editParams() {
      this.axios
        .put(
          `categories/${this.selectedCate[2]}/attributes/${
            this.editForm.attrId
          }`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error("编辑参数信息失败！");
          this.$message.success("编辑参数信息成功！");
          this.getGoodCate();
          this.editDialogVisible = false;
        });
    },
    remove(scope) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.axios.delete(
          `categories/${this.selectedOptions[2]}/attributes/${
            scope.row.attr_id
          }`
        );
        if (res.data.meta.status === 200) {
          this.getGoodCate();
          this.$message({
            type: "success",
            message: "删除参数成功!"
          });
        } else {
          this.$message.error("删除参数失败");
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
// .alert {
//   margin-bottom: 20px;
// }
.el-row {
  margin: 20px 0;
  text-align: left;
}
.el-tabs {
  text-align: left;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
