<template>
  <el-card>
    <el-breadcrumb separator="/" style="margin-bottom: 15px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="main" style="width: 800px;height: 400px"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    useEchart() {
      let myEcharts = echarts.init(document.getElementById("main"));
      this.axios.get("reports/type/1").then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取报表数据失败！");
        }
        let option2 = res.data.data;
        let option1 = {
          title: {
            text: "用户来源"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#E9EEF3"
              }
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ]
        };

        let option = { ...option1, ...option2 };
        myEcharts.setOption(option);
      });
    }
  }
};
</script>

<style lang='less' scoped>
</style>
