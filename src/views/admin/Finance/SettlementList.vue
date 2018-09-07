<template>
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="结汇单号" name="orderNo">
                    <el-input name="orderNo" v-model="form.orderNo" placeholder="请输入结汇单号"></el-input>
                </el-form-item>

                <el-form-item label="汇率差" name="exchangeRate">
                    <el-select name="exchangeRate" v-model="form.exchangeRate" placeholder="选择汇率差">
                      <el-option label="正" :value="1"></el-option>
                      <el-option label="负" :value="0"></el-option>
                    </el-select>
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

                <el-button @click="bindFormSubmit" type="success">查询</el-button>

            </el-form>
            <!-- 查询结果 -->
            <table>
                <thead>
                    <tr>
                        <th>结汇单号</th>
                        <th>最初结汇金额</th>
                        <th>服务费</th>
                        <th>净结汇金额</th>
                        <th>settlementAmount</th>
                        <th>交割时间</th>
                        <th>实际汇率</th>
                        <th>爬取汇率</th>
                        <th>汇率差</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!table.length">
                        <td colspan="9">暂无查询结果</td>
                    </tr>
                    <tr v-else v-for="(item,index) in table" :key="index">
                        <td>{{item.orderNo}}</td>
                        <td>{{item.outTxnAmount}}</td>
                        <td>{{item.serviceCharge}}</td>
                        <td>{{item.inTxnAmount}}</td>
                        <td>{{item.settlementAmount}}</td>
                        <td>{{item.updateTime}}</td>
                        <td>{{item.payRate}}</td>
                        <td>{{item.relativeRate}}</td>
                        <td>{{item.exchangeRate}}</td>
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
    // 结汇列表
    
    import {querySettlementList} from '../../../utils/axios/api.js'
    import { getTimer } from '../../../utils/common.js';
    
    export default{
        data(){
            return{
                form:{
                    orderNo:'',
                    exchangeRate:'',
                    startDate:'',
                    endDate:'',
                    page:'1',
                    totalPages:'1',
                    size:'10',
                },
                table:[]
            }
        },
        created(){
            let m = this.$store.state.Memory.SettlementList;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.form)
            );
        },
        methods:{
            loadingQuery(params){

                if(getTimer(params.startDate)>getTimer(params.endDate))return this.$message.error(`开始时间应该小于结束时间！`);

                querySettlementList(params).then(res=>{
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
               if(item.name==`SettlementList`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'SettlementList',
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


