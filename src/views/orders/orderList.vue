<template>
  <div>
    <el-card>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="200"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'" size="small">未付款</el-tag>
            <el-tag type="success" v-else size="small">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="140">
          <template v-slot="scope">{{scope.row.create_time | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              title="修改订单地址"
              @click="showEditDia"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              circle
              title="物流信息"
              @click="showLogisticsDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules">
        <el-form-item label="省市区/县" prop="address1">
          <!-- 使用级联选择器，加载省市区县的数据 -->
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="cityData"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息的对话框 -->
    <!-- <el-dialog title="物流信息" :visible.sync="dialogLogisticsVisible" width="50%">
      <el-steps direction="vertical" :active="1">
        <el-step
          v-for="(item, i) in wuliuInfo"
          :key="i"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>-->
  </div>
</template>

<script>
import cityData from "@/assets/city_data.js";

export default {
  components: {},
  data() {
    return {
      orderList: [],
      // 分页
      pagenum: 1,
      pagesize: 10,
      total: 0,
      // 修改订单对话框数据
      dialogFormVisible: false,
      addressForm: {
        address: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请填写省市区", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData: [],
      selectedOptions: [],
      // 物流信息对话框
      dialogLogisticsVisible: false,
      logisticsInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.axios
        .get(`orders/?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        .then(res => {
          console.log(res);
          this.orderList = res.data.data.goods;
          this.total = res.data.data.total;
        });
    },
    showEditDia() {
      this.dialogFormVisible = true;
      this.cityData = cityData;
    },
    showLogisticsDialog() {
      this.axios.get("/kuaidi/619915933338").then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取物流信息失败！");
        }
        this.logisticsInfo = res.data;
        this.dialogLogisticsVisible = true;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrderList();
    }
  }
};
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin: 15px 0;
}
</style>
