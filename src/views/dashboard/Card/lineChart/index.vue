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
                type: 'category',
            },
            yAxis: {
                show: false,
            },
            //系列
            series: [
                {
                    type: 'line',
                    data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
                    //拐点的样式的设置
                    itemStyle: {
                        opacity: 0,
                    },
                    //线条的样式
                    lineStyle: {
                        color: 'purple'
                    },
                    //填充颜色的样式
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'purple' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    },
                    //变为曲线
                    smooth: true,
                }
            ],
            //布局的调试
            grid: {
                left: 0,
                rigtt: 0,
                top: 0,
                buttom: 0,
            }
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