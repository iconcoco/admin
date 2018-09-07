<template>
    <el-popover :value="value" class="admin-modal-bg"  v-model="isShow">
        <div class="modal-container">
            <h2> {{title||"提示"}} <span @click="bindHideChargeModule" class="el-icon-close"></span></h2>
            <div class="content">
                <slot></slot>
            </div>
            <p>
                 <el-button @click="bindHideChargeModule" type="danger" plain>取消</el-button>
                 <el-button @click="bindSaveRecharge" type="primary">{{confirmTxt||"确认"}}</el-button>
            </p>
        </div>
     </el-popover>
</template>

<script>
    /**
     * 1. value   是否显示模态框
     * 2. confirm 模态框确认按钮执行的函数
     */
    export default{
        data(){
            return{
                isShow:false,
            }
        },
        props:{
            "title":{ required: false },
            "value":{
                required: true
            },
            "confirm":{
                 required: true
            },
            "confirmTxt":{ required: false  },
        },
        mounted(){
            this.isShow = this.value;
        },
        methods:{
            bindHideChargeModule(){
                this.isShow = false;
            },
            bindSaveRecharge(){
                this.confirm();
            }
        },
        watch:{
            value(val){
                this.isShow = val;
            },
            isShow(val){
                this.$emit('input', val);
            }
        }
    }
</script>

<style lang="scss" scoped>
   .modal-container{
        width: 400px;
        min-height: 100px;
        left: 50%;
        top: 50%;
        margin: -100px 0 0 -200px;
        h2{
            height: 32px;
            line-height: 24px;
            border-bottom: 1px solid #dbdbdb;
            font-weight: 500;
            font-size: 16px;
            span{
                float: right;
                margin-top: 3px;
                cursor: pointer;
                &:hover{
                    color: #409EFF;
                }
            }
        }
        p{
            text-align: right;
        }
    }
</style>
