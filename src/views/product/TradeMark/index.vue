<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px;" @click="showDialog">添加</el-button>
    <!-- 表格组件
    data:表格展示的数据--数据类型
    border:表格添加边框
    column属性
    label：名字
    width：对应列的宽度
    aline：标题的对齐方式
    prop:
    注意1:elementui当中的他变了组件，展示的数据是一列一列进行展示数据
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{row, $index}">
                <img :src="row.logoUrl" style="width:80px;heigth:80px" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="{row, $index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delate" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    current-page当前第几页
    total数据总条数
    page-size每一页需要展示的条数
    page-sizes设置每一页展示多少条数据
    layout实现分页器布局
    pager-count按钮数量 如果9 连续页码是7个 前后两个小按钮页算进去的一共9个
     -->
    <el-pagination 
        style="margin-top:20px;textAlign:center;" 
        :total="total" 
        :current-page="page" 
        :page-size="limit" 
        :page-sizes="[3,5,10]" 
        :pager-count="7" 
        layout=" prev, pager, next ,jumper, ->, sizes, total"
        @current-change="getPageList"
        @size-change="handleSizeChange">
    </el-pagination>
    <!-- 对话框 
        :visible.sync控制对话框显示与隐藏用的

        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
        <!-- 展示表单元素 model属性：把表单数据收集到那个对象身上，将来表单验证也需要这个属性-->
        <el-form style="width:80%" :model="tmForm"  :rules="rules" ref="ruleForm">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <!-- 这样收集数据不能用v-model，因为不是表单元素
                    action：设置图片上传地址
                    :on-success检测上传成功
                    :before-upload上传之前
                -->
                <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'TradeMark',
    data() {
        //elementUI提供的自定义校验规则
        var validateTmName = (rule, value, callback) => {
            //自定义校验规则
            if(value.length < 2 || value.length > 10) {
                callback(new Error('品牌名称需要2-10位'))
            }else {
                callback()
            }
        };
        return{
            //代表的分页器第几页
            page: 1,
            //当前页数展示数据条数
            limit: 3,
            //总条数
            total: 0,
            //列表展示的数据
            list:[],
            //对话框显示与隐藏属性
            dialogFormVisible: false,
            //上传图片使用的属性
            //收集品牌的信息:对象身上的属性不能瞎写，需要看文档
            tmForm:{
                tmName: '',
                logoUrl: '',
            },
            //表单验证规则
            rules:{
                //品牌名称验证规则
                //required：必须校验的字段 message：提示的信息 tigger：用户行为的设置（blue：失焦 change：文本发生变化）
                //min品牌名称长度
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    //自定义校验规则
                    { validator: validateTmName, trigger: 'change' }
                    // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                //品牌logo验证规则
                logoUrl: [
                    { required: true, message: '请选择品牌图片' }
                ],
            }
        }
    },
    //组件挂在发请求
    mounted(){
        //获取列表函数方法
        console.log(this.$API);
    },
    //组件挂载完毕
    mounted() {
        // console.log(this.$API);
        //获取列表数据的方法
        this.getPageList()
    },
    methods: {
        //获取品牌列表的数据
        async getPageList(pager = 1) {
            this.page = pager
            //解构出参数
            const { page, limit } = this
            //获取品牌列表的接口
            //当你向服务器发请求的时候,这个需要带参数,所以我们在data中初始化两个字段,代表给服务器传递参数
            let result = await this.$API.trademark.reqTradeMarkList(page, limit)
            if(result.code == 200 ) {
                //分别是展示数据的总条数与列表展示的条数
                this.total = result.data.total
                this.list = result.data.records
            }
        },
        //当分页器某一页展示数据条数发生变化的时候发生触发
        handleSizeChange(limit) {
            //整理参数
            this.limit = limit;
            this.getPageList();
        },
        //点击添加品牌的按钮
        showDialog() {
            //显示对话框
            this.dialogFormVisible = true
            //清除数据
            this.tmForm = {tmName: '', logoUrl: ''}
        },
        //修改某个品牌
        updateTradeMark(row) {
            //row用户当前选择的信息
            //显示对话框
            this.dialogFormVisible = true
            //将已经有的品牌信息复制给tmForm
            //将度武器返回的信息之间赋值给tmForm
            //也就是说tmForm存储的即为服务器返回品牌信息
            this.tmForm = {...row}
        },
        //图片上传成功
        handleAvatarSuccess(res, file) {
            //res：上传成功后返回前端数据
            //file：上传成功后服务器返回给前端数据
            //手机品牌图片数据，将来带给服务器
            this.tmForm.logoUrl = res.data
        },
        //图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //添加按钮（添加品牌|修改品牌）
        addOrUpdateTradeMark () {
            //当所有验证字段通过，再去书写业务逻辑
            this.$refs.ruleForm.validate(async (success) => {
                //如果全部字段符合条件
                if(success) {
                    this.dialogFormVisible = false
                    //发请求
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
                    if (result.code == 200) {
                        //弹出信息:添加品牌成功、修改品牌成功
                        this.$message({
                            message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
                            type: 'success'
                        })
                        //添加品牌成功以后，需要再次获取品牌列表进行展示
                        //如果添加品牌：留在第一页 | 修改品牌：留在当前页
                        this.getPageList(this.tmForm.id ? this.page : 1)
                    }
                }else {
                    console.log('error submit!!');
                    return false;
                }
            })
            
        },
        //删除品牌的操作
        deleteTradeMark(row) {
            //弹框
            this.$confirm(`你确定删除${row.tmName}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                //当用户点击确定按钮的时候触发
                //向服务器发请求
                let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
                //如果删除成功
                if(result.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //再次获取品牌列表数据
                    this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
                }
            }).catch(() => {
                //当用户点击取消按钮的时候触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>