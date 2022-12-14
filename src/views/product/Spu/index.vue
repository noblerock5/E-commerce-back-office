<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三界联动已经是全局组件了 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="sence != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是由三部分来回切换的 -->
      <div v-show="sence == 0">
        <!-- 这里展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $inbdex}">
              <!-- 这里的按钮将来用封装的hintbutton来做 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="添查看当前spu全部sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination style="textAlign:center;" :total="23" :current-page="6" :page-size="3"
          :page-sizes="[3,5,10]" :pager-count="7" layout=" prev, pager, next ,jumper, ->, sizes, total"
          @current-change="getPageList" @size-change="handleSizeChange">
        </el-pagination> -->
        <el-pagination 
          style="text-align:center" 
          :total="total" 
          :current-page="page" 
          :page-size="limit" 
          :page-sizes="[3, 5, 10]" 
          layout=" prev, pager, next, jumper , ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange">
          
        </el-pagination>
      </div>
      <SpuForm v-show="sence == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="sence == 2" ref="sku" @changeSences="changeSences"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示列表 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" alt="" style="wifth:100px;height:100px"></img>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
    name: 'Spu',
    components: {SpuForm, SkuForm},
    data() {
      return {
        //分别是分类的id
        category1Id: '',
        category2Id: '',
        category3Id: '',
        //控制三级联动的可操控性
        page: 1,//分页器当前第几页
        limit: 3,//每一页多少条数据
        records: [],//spu列表的数据
        total: 0,//分页器展示的条数
        sence: 0, //0代表展示SPU列表数据  1代表添加spu|修改spu  2代表添加sku
        dialogTableVisible: false, //控制对话框的显示与隐藏
        spu: {},
        skuList: [], //sku列表的数据
        loading: true, //table加载属性值
      }
    },
    methods: {
      //三级联动的自定义事件，可以把自组建的id传递给父组件
      getCategoryId({categoryId, level}) {
        //categoryId可以获取到一二三级别的id level为了区分几级id
        if(level == 1) {
          this.category1Id = categoryId
          //清除二级三级分类的id
          this.category2Id = ''
          this.category3Id = ''
        } else if (level == 2) {
          this.category2Id = categoryId
          //清除三级分类的id
          this.category3Id = ''
        }else {
          this.category3Id = categoryId
          //获取SPU列表数据进行展示
          this.getSpuList()
        }
      },
      //获取SPU列表数据的方法
      async getSpuList(pages = 1) {
        this.page = pages
        //解构出数据
        const { page, limit,category3Id } = this
        //携带三个参数：page 第几页 limit每页展示多少id  category3Id三级分类
        let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
        if(result.code == 200) {
          this.total = result.data.total
          this.records = result.data.records
        }
        
      },
      // //点击分页器的第几页按钮的回调
      // handleCurrentChange(page) {
      //   this.page = page
      //   this.getSpuList()
      // },
      //当分页器某一页条数发生变化的回调
      handleSizeChange(limit) {
        //修改参数
        this.limit =limit
        //发请求
        this.getSpuList()
      },
      //添加按钮的图标
      addSpu() {
        //切换场景为1
        this.sence = 1
        //通知子组件spuForm发请求 ---两个请求
        this.$refs.spu.addSpuData(this.category3Id)
      },
      //修改某一个spu
      updateSpu(row) {
        this.sence = 1,
        //获取子组件SpuForm子组件的(用$ref获取子组件，在子组件里写个方法initSpuData，是每次点修改是发请求就搞定了)
        this.$refs.spu.initSpuData(row)
      },
      //自定义事件回调（spuForm）
      changeScene({sence, flag}) {
        //flag为了区分保存按钮是添加还是修改
        //切换场景
        this.sence = sence
        //子组件通知父组件切换场景，需要再次获取SPU列表进行展示
        if(flag =="修改") {
          this.getSpuList(this.page)
        }else {
          this.getSpuList()
        }
      },
      //删除按钮的回调
      async deleteSpu(row) {
        let result = await this.$API.spu.reqDeleteSpu(row.id)
        if(result.code == 200) {
          this.$message({type: 'success', message: '删除成功'})
          //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
        }
      },
      //添加sku按钮的回调
      addSku(row) {
        //切换场景为2
        this.sence = 2
        //父组件调用子组件方法，让子组件发请求 ---三个请求
        this.$refs.sku.getData(this.category1Id, this.category2Id, row)
      },
      //skuForm通知父组件修改场景
      changeSences(sence) {
        this.sence = sence
      },
      //查看skp的按钮回调
      async handler(spu) {
        //点击按钮的时候，对话框是可见的
        this.dialogTableVisible = true
        //保存spu
        this.spu = spu
        //获取sku列表数据进行展示
         let result = await this.$API.spu.reqSkuList(spu.id)
         if(result.code == 200) {
          this.skuList = result.data
          //loading隐藏
          this.loading = false
         }
      },
      //关闭对话框的回调
      close(done) {
        //loading属性再次变为真
        this.loading = true
        //清除sku列表的数据
        this.skuList = []
        //关闭对话框
        done()
      }
    },
}
</script>

<style>

</style>