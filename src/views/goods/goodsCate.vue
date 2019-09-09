<template>
  <el-card class>
    <bread-crumb level1="商品管理" level2="商品分类"></bread-crumb>
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            expand-trigger="hover"
            :props="defaultProp"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate() ">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="tableList" border style="width: 100%">
      <!-- <el-table-column type="index" width="50"></el-table-column> -->
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===2">二级</span>
          <span v-else-if="scope.row.cat_level===3">三级</span>
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
          <el-button type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDelUserMsgBox(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="[5, 10, 15, 20]"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tableList: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      disFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      formLabelWidth: "140px",
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
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
          console.log(res);

          this.tableList = res.data.data.result;
          this.total = res.data.data.total;
        });
    },
    showAddDialog() {},
    addCate() {}
  }
};
</script>

<style lang='less' scoped>
.el-row {
  text-align: left;
  margin-bottom: 15px;
}
</style>
