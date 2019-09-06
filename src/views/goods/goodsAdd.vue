<template>
  <div class>
    <bread-crumb level1="商品管理" level2="商品列表"></bread-crumb>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-step :active="1*active" align-center finish-status="success">
      <el-step description="基本信息"></el-step>
      <el-step description="商品参数"></el-step>
      <el-step description="商品属性"></el-step>
      <el-step description="商品图片"></el-step>
      <el-step description="商品内容 "></el-step>
    </el-step>
    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              expand-trigger="hover"
              :props="defaultProp"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item v-for="(item1, i) in this.arrDyparams" :key="i" :label="item1.attr_name">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2, i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="(item, i) in this.arrStaticparams" :key="i" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="名称">
            <el-upload
              action="http://api.xiaomadagege.cn:8808/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容"></el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template> 

<script>
export default {
  data() {
    return {
      active: "1",
      form: {
        //表单数据
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_introduce: "",
        pics: "",
        attrs: ""
      },
      // 级联选择器绑定的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数的数据
      arrDyparams: [],
      // 静态参数的数据
      arrStaticparams: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    // console.log(this.options);

    this.getCateList();
  },
  methods: {
    handleChange() {},
    getCateList() {
      this.axios.get("categories", { params: { type: 3 } }).then(res => {
        // console.log(res);
        this.options = res.data.data;
        // console.log(this.options);
      });
    },
    tabChange() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          console.log(this.selectedOptions.length);

          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        this.axios
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          .then(res => {
            console.log(res);
            this.arrDyparams = res.data.data;
            this.arrDyparams.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
          });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        this.axios
          .get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          .then(res => {
            console.log(res);
            this.arrStaticparams = res.data.data;
          });
      }
    },
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(file) {
      console.log(file);
    }
  }
};
</script>

<style lang='less' scoped>
.el-bread-crumb {
  margin-bottom: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.el-steps {
  margin-bottom: 15px;
}
.el-form {
  // height: 400px;
  // overflow: auto;
  text-align: left;
}
</style>
