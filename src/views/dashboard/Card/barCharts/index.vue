<template>
    <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from 'echarts'
export default {
    nameP: '',
    mounted() {
        //初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts)
        //配置数据
        lineCharts.setOption({
            xAxis: {
                show: false,
                //均分
                type: 'category',
            },
            yAxis: {
                show: false,
            },
            //系列
            series: [
                {
                    //图表的形式
                    type: 'bar',
                    data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
                    color: 'cyan'
                }
            ],
            //布局的调试
            grid: {
                left: 0,
                rigtt: 0,
                top: 0,
                buttom: 0,
            },
            tooltip: {},
        })
    }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
    /* width: 600px;
    height: 100px; */
}
</style>