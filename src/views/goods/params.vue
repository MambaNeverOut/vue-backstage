<template>
  <el-card>
    <bread-crumb level1="商品管理" level2="分类参数"></bread-crumb>
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
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 级联选择器
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      activeName: "1",
      tableList: [],
      arrDyparams: [],
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
            console.log(res);

            this.arrDyparams = res.data.data;
            this.arrDyparams.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
            console.log(this.arrDyparams);
          });
      }
    },
    getGoodCate() {
      this.axios.get(`categories?type=3`).then(res => {
        console.log(res);
        this.options = res.data.data;
      });
    },
    handleClick() {},
    // 点击x按钮删除
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 点击newTag+按钮添加
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 回车键+失去焦点添加
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
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
