<template>
  <div>
    <bread-crumb level1="权限管理" level2="权限列表"></bread-crumb>
  </div>
</template>

<script>
import { log } from "util";
export default {
  components: {},
  data() {
    return {
      rightList: {}
    };
  },
  methods: {
    getRightList() {
      this.axios.get(`rights/list`).then(res => {
        console.log(res);
        this.rightList = res.data.data;
      });
    }
  },
  created() {
    this.getRightList();
  }
};
</script>

<style lang='less' scoped>
</style>
