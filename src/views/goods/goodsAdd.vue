<template>
  <div class>
    <bread-crumb level1="商品管理" level2="商品列表"></bread-crumb>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center finish-status="success">
      <el-step title="步骤1" description="基本信息"></el-step>
      <el-step title="步骤2" description="商品参数"></el-step>
      <el-step title="步骤3" description="商品属性"></el-step>
      <el-step title="步骤4" description="商品图片"></el-step>
      <el-step title="步骤5" description="商品内容 "></el-step>
    </el-steps>
    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" tab-position="left">
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
              :props="{ expandTrigger: 'hover', defaultProp}"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数"></el-tab-pane>
        <el-tab-pane name="3" label="商品属性"></el-tab-pane>
        <el-tab-pane name="4" label="商品图片"></el-tab-pane>
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
      selectedOptions: [],
      defaultProp: {
        label: "",
        value: "",
        children: ""
      }
    };
  },
  methods: {
    handleChange() {}
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
