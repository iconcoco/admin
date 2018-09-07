<template>
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">
                <!-- 客户 ID -->
                <el-form-item label="客户 ID" name="customerNo">
                    <el-input name="customerNo" v-model="form.customerNo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-form-item label="店铺 ID" name="storeId">
                    <el-input name="storeId" v-model="form.storeId" placeholder="请输入店铺ID"></el-input>
                </el-form-item>

                <el-form-item label="子账号" name="entityAccountNo">
                    <el-input name="entityAccountNo" v-model="form.entityAccountNo" placeholder="海外银行的子账号"></el-input>
                </el-form-item>

                <el-form-item label="开始时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                 <el-form-item label="换汇批号" name="settlementOrderNo">
                    <el-input name="settlementOrderNo" v-model="form.settlementOrderNo" placeholder="请输入换汇批号"></el-input>
                </el-form-item>

                 <el-form-item label="平 台" name="platform">
                    <el-select v-model="form.platform" placeholder="请选择平台">
                        <el-option v-for="(item,index) in  platArr" :key="index"
                            :label="item.platformName"
                            :value="item.platformCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="渠 道" name="channelId">
                    <el-select v-model="form.channelId" placeholder="请选择渠道">
                       <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="当前币种" name="currency">
                    <el-select v-model="form.currency" placeholder="请选择当前币种">
                        <el-option v-for="(item,index) in  Currency" :key="index"
                            :label="item.currencyName"
                            :value="item.currencyCode"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="提现币种" name="targetCurrency">
                    <el-select v-model="form.targetCurrency" placeholder="请选择提现币种">
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
                    <!-- <label class="sort">
                                <span class="el-icon-caret-top"></span>
                                <span class="el-icon-caret-bottom"></span>
                           </label> -->
                    <tr>
                        <th>子账号</th>
                        <th>提现时间</th>
                        <th>平台</th>
                        <th>海外银行</th>
                        <th>渠道</th>
                        <th>换汇批号</th>
                        <th>原币种</th>
                        <th>提现币种</th>
                        <th>提现金额</th>
                        <th>费率</th>
                        <th>应得美金金额</th>
                        <th>实际换汇金额</th>
                        <th>汇率</th>
                        <th>应得人民币金额</th>
                        <th>实际换汇后金额</th>
                        <th>补美金</th>
                        <th>补人民币</th>
                        <th>净收入美金</th>
                        <th>渠道手续费</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!table.length">
                        <td colspan="19">暂无查询结果</td>
                    </tr>
                    <tr v-for="(item, index) in table" :key="index">
                        <td>{{item.entityAccountNo}}</td>
                        <td>{{formatT(item.arrivalDate)}}</td>
                        <td>{{item.platform}}</td>
                        <td>{{item.abroadBank}}</td>
                        <td>{{item.channelCode}}</td>
                        <td>{{item.settlementOrderNo}}</td>
                        <td>{{item.currency}}</td>
                        <td>{{item.targetCurrency}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.serviceRate}}</td>
                        <td>{{item.deservedDollar}}</td>
                        <td>{{item.actualExchangeAmount}}</td>
                        <td>{{item.exchangeRate}}</td>
                        <td>{{item.deservedRMB}}</td>
                        <td>{{item.afterActualExchangeAmount}}</td>
                        <td>{{item.compensatedDollar}}</td>
                        <td>{{item.compensatedRMB}}</td>
                        <td>{{item.netReceiptDollar}}</td>
                        <td>{{item.channelServiceCharge}}</td>
                    </tr>
                </tbody>
            </table>

              <Pagination 
                :page="form.pageNum"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>
    // 财务报表

    import {financeStatement} from '../../../utils/axios/api.js';
    import {formatTimer,getTimer} from '../../../utils/common.js';

    import {
        queryPlatform,
        queryChannel,
        queryCurrency,
    } from '../../../ext/localBase.js';

    export default{
        data(){
            return{
                form:{
                    customerNo:'',
                    storeId:'',
                    entityAccountNo:'',
                    settlementOrderNo:'',
                    platform:'',
                    channelId:'',
                    targetCurrency:'',
                    currency:'',
                    startTime:'',
                    endTime:'',
                    pageNum:'1',
                    pageSize:10,
                    totalPages:'1'
                },
                table:[],

                platArr:[],
                ChannelArr:[],
                Currency:[],
            }
        },
        created(){
            let m = this.$store.state.Memory.financeForm;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.form)
            );

            Promise.all([
                queryPlatform(),
                queryChannel(),
                queryCurrency(),
            ]).then(res=>{
                let [a,b,c] = res;
                this.platArr = a;
                this.ChannelArr = b;
                this.Currency = c;
            });

        },
        methods:{
            loadingQuery(params){

                 if(getTimer(params.startTime)>getTimer(params.endTime))return this.$message.error(`开始时间应该小于结束时间！`);

                financeStatement(params).then(res=>{
                   if(res.code==0){
                       this.table = res.data.content;
                       this.form.totalPages = res.data.totalPages;
                   }else{
                       this.$message.error(res.msg)
                   }
                });
            },
            bindFormSubmit(){
               this.loadingQuery(this.form);
            },
           pageChange(n){
               this.form.pageNum = n;
               this.loadingQuery(this.form);
           },
           formatT(n){
               return formatTimer(n);
           }
        },
         destroyed(){
             //当前活动的tab
           let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`financeForm`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'financeForm',
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

<style lang="scss">
    
</style>

