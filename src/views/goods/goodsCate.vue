<template>
  <el-card class>
    <bread-crumb level1="商品管理" level2="商品分类"></bread-crumb>
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="primary" @click="addGoodCate()">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="diaFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            v-model="selectedOptions"
            :options="casList"
            expand-trigger="hover"
            :props="defaultProp"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diaFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate() ">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableList" style="width: 100%">
      <!-- 
        treeKey 节点唯一标识 id
        parentKey 父节点的id
        levelKey 当前节点的级别
        childKey 子节点
      -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类信息" :visible.sync="dialogVisibleEdit" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
// 引入element-tree-grid
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      tableList: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      // 添加分类对话框数据
      diaFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      formLabelWidth: "140px",
      casList: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 编辑对话框数据
      dialogVisibleEdit: false,
      editForm: {
        id: "",
        cat_name: ""
      },
      // 编辑表单的校验规则
      editFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    getGoodsCate() {
      this.axios
        .get(
          `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then(res => {
          this.tableList = res.data.data.result;
          this.total = res.data.data.total;
        });
    },
    showEditDialog(scope) {
      this.axios.get(`categories/${scope.cat_id}`).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取分类信息失败！");
        this.editForm = res.data.data;
      });
      this.dialogVisibleEdit = true;
    },
    saveCate() {
      this.axios
        .put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        .then(res => {
          console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("更新失败！");
          this.$message.success("更新成功！");
          this.getGoodsCate();
          this.dialogVisibleEdit = false;
        });
    },
    remove(scope) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.axios.delete(`categories/${scope.cat_id}`);
          console.log(res);

          if (res.data.meta.status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getGoodsCate();
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
    addCate() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }
      this.axios.post(`categories`, this.form).then(res => {
        console.log(res);
      });
      this.getGoodsCate();
      this.diaFormVisibleAdd = false;
      this.form = {};
    },
    addGoodCate() {
      this.axios.get(`categories?type=2`).then(res => {
        this.casList = res.data.data;

        this.diaFormVisibleAdd = true;
      });
    },
    handleSizeChange(val) {
      this.pagesize = value;
      this.pagenum = 1;
      this.getGoodsCate();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsCate();
    }
  }
};
</script>

<style lang='less' scoped>
.el-row {
  text-align: left;
  margin-bottom: 15px;
}
</style>
