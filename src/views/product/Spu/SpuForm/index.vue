<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传地址 list-type文件列表的类型 on-preview图片预览的时候触发 on-remove删除图片触发
          file-list:照片墙需要展示的数据【数组：数组里面务必要有name，url属性】
          on-preview图片预览功能
          on-remove删除图片会触发 -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlerSuccess" :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unSelect.name" :value="`${unSelect.id} : ${unSelect.name}`" v-for="(unSelect, index) in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" el-icon-plus :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width:100%" border :data="spu.spuSaleAttrList">
          <el-table-column prop="prop" type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row, $index}">
              <!--  -->
              <!-- el-tag用于展示已有的属性值列表数据 -->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下的结构可以当作当年的span与input切换 -->
              <!-- @keyup.enter.native="handleInputConfirm" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"></el-input>
              <!--  @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      //spu初始化的时候是个空的对象，下修改spu的时候回想服务器发请求，返回spu信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //spu添加：如果是添加商铺的时候，并没有向服务器发请求，数据收集到哪里？，收集数据的时候要有哪些字段，看文档
      spu: {
        //三级分类的id
        "category3Id": 0,
        //描述
        "description": "",
        //spu名称
        "spuName": "",
        //品牌id
        "tmId": '',
        //收集spu图片的信息
        "spuImageList": [
          // {
          //   "id": 0,
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "spuId": 0
          // }
        ],
        //平台属性与属性值的收集
        "spuSaleAttrList": [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "string",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ],
        
      },
      tradeMarkList: [], //存储的品牌信息
      spuImageList: [], //存储spu图片的数据
      saleAttrList: [], //销售属性的数据
      attrIdAndAttrName: '',//收集未选择的销售属性的id---向个服务器发请求之前把数据整理成服务器要的格式就行
    };
  },
  methods: {
    //照片墙删除图片的时候会触发
    handleRemove(file, fileList) {
      //file参数代表的是删除的那张图
      //fileList照片墙删除某一张图片剩余的图片
      console.log(file, fileList);
      //收集照片墙图片的数据
      //对于已有的图片，【照片墙中显示的图片、有name、url字段的】，因为照片显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于已有的图片的数据在提交给服务器的时候需要处理
      this.spuImageList = fileList
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //初始化SpuForm数据
    async initSpuData(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code == 200) {
        //在修改spu的时候需要下个服务器发请求，把服务器返回的数据（对象）赋值给spu
        this.spu = spuResult.data
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImage(spu.id)
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        //把整理好的数据赋值给
        this.spuImageList = listArr
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //照片墙图片上传成功的图片
    handlerSuccess(response, file, fileList) {
      //收集图片的信息
      this.spuImageList = fileList
    },
    //添加新的销售属性
    addSaleAttr() {
      //已经收集到了需要添加的销售属性的信息
      //把收集到销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      //向spu对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {baseSaleAttrId, saleAttrName,spuSaleAttrValueList:[]}
      //添加新的售卖属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      //清空数组
      this.attrIdAndAttrName = ''
    },
    //添加按钮的回调
    addSaleAttrValue(row) {
      // console.log(row);
      //点击销售属性值当中添加按钮的时候，需要有button变为input，通过当前属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
    },
    //el-input失去焦点的事件
    handleInputConfirm(row) {
      //解构出销售属性中收集的数据
      const {baseSaleAttrId, inputValue} = row
      //新增的销售属性值不能为空
      if(inputValue.trim() == '') {
        this.$message('属性值不能为空')
        return
      }
      
      //属性值不能为空,这里也可以用some
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if(!result) return
      //新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName:inputValue}
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      //修改inputVisible字段为false即可，就显示button了
      row.inputVisible = false
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数：需要整理照片墙的参数
      //携带参数：对于照片，需要携带imgName,imgUrl 字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code == 200) {
        //提示
        this.$message({type: 'success', message:'保存成功'})
        //通知父组件回到场景0
        this.$emit('changeScene', {sence: 0, flag: this.spu.id ? "修改" : "添加"})
      }
      //清除数据
      Object.assign(this._data, this.$options.data())
    },
    //点击添加SPU按钮时候，发请求
    async addSpuData(category3Id) {
      //添加SPU的时候收集三级分类的id，收集到spu中category3Id中
      this.spu.category3Id = category3Id
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //取消按钮
    cancel() {
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit('changeScene', { sence: 0, flag: '' })
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data:可以操作data中的响应式数据
      //this.$options:可以获取配置对象，配置对象data一执行，返回的响应式数组为空的
      Object.assign(this._data, this.$options.data())
      console.log(this._data);
    }
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台销售属性三个：颜色，尺寸，版本---saleAttrList  （用过滤filter）
      //当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList ---颜色
      //数组的过滤的方法，可以从已有的数组当中过滤出用户需要的元素，并且返回一个新的数组
      let result = this.saleAttrList.filter((item) => {
        //every数组方法，会返回一个布尔值。要么真要么假
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
}
</script>

<style>
.el-tag+.el-tag {
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