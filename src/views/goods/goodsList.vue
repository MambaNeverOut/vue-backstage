<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" class="input-with-select" v-model="query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button plain type="success" @click="goodsAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <template v-slot="scope">{{scope.row.add_time | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeGoods(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      goodsList: [],
      query: "",
      total: -1,
      pagenum: 1,
      pagesize: 10
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      this.axios
        .get("goods", {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取商品列表失败！");
          }
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        });
    },
    goodsAdd() {
      this.$router.push({ name: "goodsAdd" });
    },
    async removeGoods(scope) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 用户取消了删除
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }

      // 用户确认了删除
      const { data: res } = await this.axios.delete(
        "goods/" + scope.row.goods_id
      );
      if (res.meta.status !== 200) return this.$message.error("删除商品失败！");
      this.$message.success("删除商品成功！");
      this.getGoodsList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
    }
  }
};
</script>

<style lang='less' scoped>
</style>
