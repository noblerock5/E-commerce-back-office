<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <!-- 第一个card -->
                <el-card>
                    <Detail title="总销售额" count="￥126560">
                        <template slot="charts">
                            <span>周同比&nbsp;56.57%<svg t="1668936165840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4774"
                                width="16" height="16">
                                <path d="M768 384L512 128 256 384h192v512h128V384z" p-id="4775" fill="#d81e06"></path>
                            </svg></span>&nbsp; 
                            <span>日同比&nbsp;19.96%<svg t="1668936293331" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7601"
                                width="16" height="16">
                                <path d="M768 640l-256 256-256-256h192V128h128v512z" p-id="7602" fill="#1afa29"></path>
                            </svg></span>
                        </template>
                        <template slot="footer">
                            <span>日销售额￥12563</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <!-- 第二个card -->
                <el-card>
                    <Detail title="访问量" count="88460">
                        <template slot="charts">
                            <lineCharts></lineCharts>
                        </template>
                        <template slot="footer">
                            <span>日销售量1234</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <!-- 第三个card -->
                <el-card>
                    <Detail title="支付笔数" count="88460">
                        <template slot="charts">
                            <barCharts></barCharts>
                        </template>
                        <template slot="footer">
                            <span>转化率65%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <!-- 第四个card -->
                <el-card>
                    <Detail title="运营活动项目" count="78%">
                        <template slot="charts">
                            <progressCharts></progressCharts>
                        </template>
                        <template slot="footer">
                            <span>周同比&nbsp;12%<svg t="1668936165840" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="4774" width="16" height="16">
                                    <path d="M768 384L512 128 256 384h192v512h128V384z" p-id="4775" fill="#d81e06"></path>
                                </svg></span>&nbsp;
                            <span>日同比&nbsp;11%<svg t="1668936293331" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="7601" width="16" height="16">
                                    <path d="M768 640l-256 256-256-256h192V128h128v512z" p-id="7602" fill="#1afa29"></path>
                                </svg></span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Detail from './Detail'
import lineCharts from './lineChart'
import barCharts from './barCharts'
import progressCharts from './progressCharts'
export default {
    name: '',
    components: { Detail, lineCharts, barCharts, progressCharts }
}
</script>

<style scoped>

</style>