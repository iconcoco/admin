<template>
    <div class="KYC-index">
        <div class="table-container">
            <el-button @click="bindJumpToKyc" type="success" plain>KYC审核</el-button>

            <table>
                <thead>
                    <tr>
                        <th class="radio"></th>
                        <th>客户ID</th>
                        <th>客户类型</th>
                        <th>客户名称</th>
                        <th>店铺ID</th>
                        <th>店铺名称</th>
                        <th>申请人KYC状态</th>
                        <th>企业KYC状态</th>
                        <th>店铺KYC状态</th>
                        <th>客户风险评级</th>
                        <th>店铺风险评级</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!keyList.length">
                        <td colspan="11">暂无查询结果</td>
                    </tr>
                    <tr v-for="(item,index) in keyList" :key="index">
                        <td>
                            <el-radio :label="item.storeId" name="kycId" v-model="form.kycId"></el-radio>
                        </td>
                        <td>{{item.customerNo}}</td>
                        <td>{{item.customerType=='1'?'个人':'公司'}}</td>
                        <td>{{item.customerName}}</td>
                        <td>{{item.storeId}}</td>
                        <td>{{item.storeName}}</td>
                        <td>
                            <span class="yes" v-if="item.personalStatus==2">审核通过</span>
                            <span class="no" v-if="item.personalStatus==3">审核失败</span>
                            <span class="ing" v-if="item.personalStatus<=1">待审核</span>
                        </td>
                        <td>
                            <span class="yes" v-if="item.companyStatus==2">审核通过</span>
                            <span class="no" v-if="item.companyStatus==3">审核失败</span>
                            <span class="ing" v-if="item.companyStatus<=1">待审核</span>
                        </td>
                        <td>
                            <span class="yes" v-if="item.storeStatus==2">审核通过</span>
                            <span class="no" v-if="item.storeStatus==3">审核失败</span>
                            <span class="ing" v-if="item.storeStatus<=1">待审核</span>
                        </td>
                        <td>待定</td>
                        <td>待定</td>
                    </tr>
                </tbody>
            </table>

            <Pagination 
            :page="page.pageNum"
            :count="page.totalSize"
            :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>
    import { queryKycIndexList } from '../../../utils/axios/api.js'


    export default{
        data(){
            return{
                keyList:[
                //     {
                //            companyName:'',
                //            companyStatus:'',
                //            companyUpdateTime:'',
                //            customerName:'',
                //            customerNo:'',
                //            customerRiskLevel:'',
                //            customerType:'',                 //1. 个人 2.企业
                //            enterpriseId:'',     //企业ID
                //            id:'',               //申请人ID
                //            personalStatus:'',               //0 待补录 1 审核中 2. 通过 3. 失败
                //            personalUpdateTime:'',
                //            storeId:'',          
                //            storeName:'',
                //            storeNo:'',          //店铺tabID
                //            storeRiskLevel:'',
                //            storeStatus:'',
                //            storeUpdateTime:'',
                // }
                ],
                form:{
                    kycId:''
                },
                page:{
                    pageNum:1,
                    totalSize:1,
                }
            }
        },
        created() {
            let m = this.$store.state.Memory.kycList;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.page.pageNum)
            );
           
        },
        methods:{
            loadingQuery(n){
                queryKycIndexList({
                    pageNum:n, 
                    pageSize:10
                }).then(res=>{
                    if(res.code==0){
                        this.keyList = res.data;
                        this.form.kycId = '';
                        Object.assign(this.page,res.page)
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            bindJumpToKyc(){
                let id = this.form.kycId;
                if(!id) return this.$message.error(`请选择需要审核的选项！`);
                this.keyList.forEach(item=>{
                    if(item.storeId == id){
                        //跳转到KYC审核的界面
                        this.$router.push({ 
                            name: 'KYCdetail',
                            params: { 
                                userId:item.id,
                                enterpriseId:item.enterpriseId,
                                storeNo:item.storeNo
                            }
                         });
                    }
                });
            },
            //页码变化
            pageChange(n){
                this.loadingQuery(n);
            }
        },
        destroyed(){
            //当前活动的tab
           let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`kycList`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'kycList',
                        data:{
                            keyList:this.keyList,
                            form:this.form,
                            page:this.page
                        }
                    });
               }
           });
           
        }
    }
</script>

<style lang="scss">
    .KYC-index{
        table{
            margin-bottom: 20px;
            .el-radio__label{
                display: none;
            }
        }
    }
</style>


<style lang="scss" scoped>
    .KYC-index{
        .radio{
            width:60px;
        }
    }
</style>

