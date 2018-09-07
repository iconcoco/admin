<template>
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="客户编号" name="customerNo">
                    <el-input name="customerNo" v-model="form.customerNo" placeholder="请输入客户编号"></el-input>
                </el-form-item>

                <el-form-item label="店铺编号" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺编号"></el-input>
                </el-form-item>

                <el-form-item label="子账号" name="subAccountNo">
                    <el-input name="subAccountNo" v-model="form.subAccountNo" placeholder="请输入子账号"></el-input>
                </el-form-item>

                <el-form-item label="开始时间" name="startDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startDate"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endDate">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endDate"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="银 行" name="bankCode">
                    <el-select v-model="form.bankCode" placeholder="请选择银行">
                       <el-option v-for="(item,index) in  ForeigBank" :key="index"
                            :label="item.bankName"
                            :value="item.bankCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="提现币种" name="currency">
                    <el-select v-model="form.currency" placeholder="请选择提现币种">
                       <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="success">查询</el-button>

            </el-form>
            <!-- 查询结果 -->
            <table>
                <thead>
                    <tr>
                        <th>客户编号</th>
                        <th>客户名称</th>
                        <th>店铺编号</th>
                        <th>子账号</th>
                        <th>平台编码</th>
                        <th>银行编码</th>
                        <th>渠道编码</th>
                        <th>批次号</th>
                        <th>币种</th>
                        <th>金额</th>
                        <th>上传时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!table.length">
                        <td colspan="11">暂无查询结果</td>
                    </tr>
                    <tr v-else v-for="(item, index) in table" :key="index">
                        <td>{{item.customerNo}}</td>
                        <td>{{item.customerName}}</td>
                        <td>{{item.storeId}}</td>
                        <td>{{item.subAccountNo}}</td>
                        <td>{{item.platformCode}}</td>
                        <td>{{item.bankCode}}</td>
                        <td>{{item.channelCode}}</td>
                        <td>{{item.ibocTxnRefNo}}</td>
                        <td>{{item.currency}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.createTime}}</td>
                    </tr>
                </tbody>
            </table>

              <Pagination 
                :page="form.page"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>
    // 平台出账
    
    import {queryPlatformBilling} from '../../../utils/axios/api.js';
    import { getTimer } from '../../../utils/common.js';

    import {
        queryCurrency,
        queryForeignBank,
    } from '../../../ext/localBase.js';
    
    export default{
        data(){
            return{
                form:{
                    customerNo:'',
                    storeId:'',
                    subAccountNo:'',
                    startDate:'',
                    endDate:'',
                    platformCode:'',
                    bankCode:'',
                    currency:'',
                    page:'1',
                    totalPages:'1',
                    size:'10',
                },
                table:[],

                Currency:[],
                ForeigBank:[],
            }
        },
        created(){
            let m = this.$store.state.Memory.PlatformBilling;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.form)
            );

            Promise.all([
                queryCurrency(),
                queryForeignBank(),
            ]).then(res=>{
                let [a,b] = res;
                this.Currency = a;
                this.ForeigBank = b;
            });
        },
        methods:{
            loadingQuery(params){

                if(getTimer(params.startDate)>getTimer(params.endDate))return this.$message.error(`开始时间应该小于结束时间！`);

                queryPlatformBilling(params).then(res=>{
                    this.table = res.content;
                    this.form.totalPages = res.totalPages;
                });
            },
             //确认查询按钮
            bindFormSubmit(){
                this.form.page = 1;
                this.loadingQuery(this.form);
            },
            //页码选择的时候
           pageChange(n){
               this.form.page = n;
               this.loadingQuery(this.form);
           } 
        },
        destroyed(){
             //当前活动的tab
           let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`PlatformBilling`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'PlatformBilling',
                        data:{
                            form:this.form,
                            table:this.table 
                        }
                    });
               }
           });
        }
    }
</script>


