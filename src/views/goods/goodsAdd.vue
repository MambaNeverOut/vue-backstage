<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="success" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-step :active="active - 0" align-center finish-status="success">
      <el-step description="基本信息"></el-step>
      <el-step description="商品参数"></el-step>
      <el-step description="商品属性"></el-step>
      <el-step description="商品图片"></el-step>
      <el-step description="商品内容 "></el-step>
    </el-step>
    <!-- 表单 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs :before-leave="beforeTabLeave" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="form.goods_cat"
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
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">点我-添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template> 

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        //表单数据
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_introduce: "",

        goods_cat: "",
        pics: [],
        attrs: []
      },
      // 级联选择器绑定的数据
      options: [],
      // selectedOptions: [1, 3, 6],
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
    this.getCateList();
  },
  methods: {
    handleChange() {},
    getCateList() {
      this.axios.get("categories", { params: { type: 3 } }).then(res => {
        this.options = res.data.data;
      });
    },
    beforeTabLeave() {
      if (this.form.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },
    handlePreview(file) {},
    handleRemove(file) {
      let Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
    },
    handleSuccess(file) {
      this.form.pics.push({
        pic: file.data.tmp_path
      });
    },
    addGoods() {
      this.form.goods_cat = this.form.goods_cat.join(",");
      // 动态参数数组
      let arr1 = this.arrDyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // 静态参数数组
      let arr2 = this.arrStaticparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      this.axios.post(`goods`, this.form).then(res => {
        this.$router.push("goods");
        if (res.data.meta.status !== 201) {
          return this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功！");
      });
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
  .quill-editor {
    height: 300px;
  }
}
</style>
