<template>
  <div>
    <el-card style="margin:20px  0px">
    <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table style="width:100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column label="属性名列表" width="width">
            <template slot-scope="{row, $index}">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" style="margin:0 10px">
                {{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="from" label-width="80px" :model="attrInfo" >
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width:100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <!-- 这里结构需要用到input和span来回切换 -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1" >保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data () {
      return {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        //接受服务器属性的字段
        attrList: [],
        //这个属性控制table显示与隐藏
        isShowTable: true,
        //收集新增属性|修改属性
        attrInfo: {
          "attrName": "",     //属性名
          "attrValueList": [  //属性值，多个，所以数组，每一个属性值都是一个对象需要attrId，valueNme
          ],
          "categoryId": 0,  //三级分类的id
          "categoryLevel": 3, //因为服务器夜需要区别是几级id
        }
      }
    },
    methods: {
      //自定义事件的回调
      getCategoryId({categoryId, level}) {
        //区分三级分类相应的id，以及父组件进行存储
        if(level == 1) {
          this.category1Id = categoryId
          this.category2Id = ''
          this.category3Id = ''
        }else if(level == 2){
          this.category2Id = categoryId
          this.category3Id = ''
        }else {
          //代表三级分类的id有了
          this.category3Id = categoryId
          //发请求获取品牌属性数据
          this.getAttrList()
        }
      },
      //获取平台属性的数据
      //当用户确定三级分类数据的时候，可以向服务器发请求获取平台属性进行展示
      async getAttrList() {
        //获取分类的id
        const {category1Id, category2Id, category3Id} = this
        let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
        if(result.code == 200) {
          this.attrList = result.data
        }
      },
      //添加属性值的回调
      addAttrValue() {
        //向属性值的数组里面添加元素
        //attrId是添加相应属性的id，还没有相应属性的id，目前而言带给服务器的id为undefined
        //valueName相应属性值名称
        this.attrInfo.attrValueList.push({
          attrId: this.attrInfo.id,  //对于修改某一产品的属性的时候，可以在已有的属性值上新增新的属性值（需要把已有的属性id带上）
          valueName:'',
          flag: true,
        })
        //flag属性：给每一个属性值添加一个标记flag，用户切换查看与编辑模式
        //每一个属性值可以控制自己的模式切换，当前flag属性是响应式属性（数据变化视图跟着变化）
        this.$nextTick(() => {
          //获取相应表单元素实现聚焦
          this.$refs[this.attrInfo.attrValueList.length - 1].focus()
        })
      },
      //添加属性的回调
      addAttr() {
        //切换table显示与隐藏
        this.isShowTable = false
        //清除数据
        //收集三级分类的id
        this.attrInfo = {
          "attrName": "",     //属性名
          "attrValueList": [  //属性值，多个，所以数组，每一个属性值都是一个对象需要attrId，valueNme
          ],
          "categoryId": this.category3Id,  //三级分类的id
          "categoryLevel": 3, //因为服务器夜需要区别是几级id
        }
      },
      //修改某一个属性
      updateAttr(row) {
        //isShowTable为隐藏
        this.isShowTable = false
        //将选中的属性赋值给attrInfo
        //由于数据结构当中存在对象里面套着数组，数组里面又有对象的情况，因此浅拷贝{...row}不可以用了，得使用深拷贝（可以用lodash）解决这类问题
        //深拷贝、浅拷贝，面试的时候出现的频率很高，切记达到手写深拷贝与浅拷贝
        this.attrInfo = cloneDeep(row)
        //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
        this.attrInfo.attrValueList.forEach(item => {
          //这样书写也可以给属性值添加flag自动，但是会会发现试图不会跟着变化（（因为flag不是响应式数据））
          //vue无法探测普通新增的property，这样写的属性并非响应式属性（数据变化使徒跟着变）
          //第一个参数：对象
          //第二个参数：添加响应式属性
          //第三个参数：新的属性值
          this.$set(item, 'flag',false)
        })
      },
      //失去焦点的事件--切换查看模式，展示span
      toLook(row) {
        row.flag = false
      },
      //点击span回调，变为编辑模式
      toEdit(row, index) {
        row.flag = true
        //获取input结点，实现自动聚焦
        //需要注意，点击span的时候，切换为input变为编辑模式，对于浏览器而言，重绘或者重排耗费时间，不可嫩一点span立马获得index
        //用到$nextTick，当节渲染完毕，会执行一次
        this.$nextTick(() => {
          //获取相应表单元素实现聚焦
          this.$refs[index].focus()
        })
        
      },
      //气泡确认框确定按钮的回调
      //最新版本的elementui版本是2.15.10，模板是2.13.2，有版本问题confirm改成onConfirm就好了
      deleteAttrValue(index) {
        //当前删除属性值的操作不需要发请求的
        this.attrInfo.attrValueList.splice(index, 1)
      },
      //保存按钮：进行添加或者修改属性的此操作
      async addOrUpdateAttr() {
        //整理参数：1.如果用户添加了很多属性值且属性值为空的不应该给服务器
        //          2.提交的数据中不应该出现flag字段
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
          //filter过滤掉属性值不为空的
          if(item.valueName != '') {
            //删除掉flag属性
            delete item.flag
            return true
          }
        })
        try {
          //发请求
          await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
          //展示平台属性的信号量进行切换
          this.isShowTable = true,
          //提示消息
          this.$message({type:'success', message: '保存成功'})
          //保存成功以后需要再次获取平台属性进行展示
          this.getAttrList()
        } catch (error) {
          this.$message('保存失败')
        }
      }
    }
}
</script>

<style>

</style>