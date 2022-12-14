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
                // type: 'category',
                //最小值与最大值设置
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                //均分
                type: 'category',
            },
            //系列
            series: [
                {
                    //图表的形式
                    type: 'bar',
                    data: [78],
                    color: 'cyan',
                    //柱状图宽度
                    barWidth: 10,
                    color: "yellowgreen",
                    //背景颜色的设置
                    showBackground: true,
                    //设置背景颜色
                    backgroudStyle: {
                        color: '#eee'
                    },
                    //文本的设置
                    label: {
                        show: true,
                        //改变文本内容设置
                        formatter: '|',
                        //文本标签位置调试
                        position: 'right',
                    }
                }
            ],
            //布局的调试
            grid: {
                left: 0,
                rigtt: 0,
                top: 0,
                buttom: 0,
            },
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