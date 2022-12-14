<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <svg t="1668931949603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3433"
                width="20" height="20">
                <path
                    d="M633.173333 763.605333h-85.162666V359.509333A35.968 35.968 0 0 0 512 323.498667H416a35.968 35.968 0 1 0 0 72.021333h59.989333v368.085333H390.826667a35.968 35.968 0 1 0 0 72.021334h242.432a35.968 35.968 0 1 0 0-72.021334zM476.032 224.512a36.010667 36.010667 0 1 0 72.021333 0 36.010667 36.010667 0 0 0-72.021333 0z"
                    fill="#2c2c2c" opacity=".65" p-id="3434"></path>
            </svg>
        </div>
        <div class="main">
            <span class="main-title">12351</span>
            <span class="main-content">17.1
                <svg t="1668936165840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4774"
                width="16" height="16">
                <path d="M768 384L512 128 256 384h192v512h128V384z" p-id="4775" fill="#d81e06"></path>
                </svg>&nbsp;
                <svg t="1668936293331" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7601"
                width="16" height="16">
                <path d="M768 640l-256 256-256-256h192V128h128v512z" p-id="7602" fill="#1afa29"></path>
                </svg>
            </span>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
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
.header{
    display: flex;
    align-items: center;
}
.search-header {
    margin-right: 20px;
}
.main {
    margin: 10px 0;
}
.main-title {
    margin-right: 30px;
}
.main-content {
    margin-right: 10px;
}
.charts {
    width: 100%;
    height: 150px;
}
</style>