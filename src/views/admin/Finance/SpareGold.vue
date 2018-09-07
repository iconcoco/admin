<template>
    <div>
        <div class="table-container">
            <!-- 查询条件筛选 -->
            <el-form class="admin-form-inline" :inline="true" :model="form">
                 <!-- <el-form-item label="渠 道" name="username">
                    <el-select v-model="form.username" placeholder="请选择渠道">
                      <el-option label="亚马逊" value="11"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="交割批号" name="deliveryOrderNo">
                    <el-input name="deliveryOrderNo" v-model="form.deliveryOrderNo" placeholder="请输入交割批号"></el-input>
                </el-form-item>

                <el-form-item label="业务编号" name="bizCode">
                    <el-input name="bizCode" v-model="form.bizCode" placeholder="请输入业务编号"></el-input>
                </el-form-item>

                <el-form-item label="充值时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择充值时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="交割时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择交割时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="success">查询</el-button>

            </el-form>
            <!-- 查询结果 -->
            <table>
                <thead>
                    <tr>
                        <th>渠道</th>
                        <th>备用金账户</th>
                        <th>业务编号</th>
                        <th>备用金额</th>
                        <th>交割订单号</th>
                        <th>余额</th>
                        <th>创建时间</th>
                        <th>业务名称</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                     <tr v-if="!table.length">
                        <td colspan="9">暂无查询结果</td>
                    </tr>
                    <tr v-for="(item,index) in table" :key="index">
                        <td>{{item.channelName}}</td>
                        <td>{{item.spareFundAccountId}}</td>
                        <td>{{item.bizCode}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.deliveryOrderNo}}</td>
                        <td>{{item.currentBalance}}</td>
                        <td>{{formatDate(item.createdDate)}}</td>
                        <td>{{item.bizName}}</td>
                        <td>
                            <a class="ing" @click="bindRecharge(item.id)" href="javascript:;">充值</a>
                        </td>
                    </tr>
                </tbody>
            </table>

              <Pagination 
                :page="form.pageNum"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>

            <!-- 充值备用金弹框 -->
            <AdminModal class="sparecold-adminModal" 
            title="备用金充值"
            confirmTxt="添加"
            v-model="rechargeForm.show" 
            :confirm="bindSaveRecharge">
               <el-form :inline="true" :model="rechargeForm">
                   <el-form-item label="充值金额">
                       <el-input v-model="rechargeForm.amount" placeholder="请输入充值金额"></el-input>
                   </el-form-item>

                   <el-form-item class="channel">
                       <el-select v-model="rechargeForm.channelCode" placeholder="选择渠道">
                           <el-option label="富有" value="1"></el-option>
                       </el-select>
                   </el-form-item>
                </el-form>
            </AdminModal>
        </div>
    </div>
</template>

<style lang="scss">
    .sparecold-adminModal{
        .content{
                text-align: center;
                padding: 37px 0;
                .el-form-item{
                    margin: 0;
                }
                .channel{
                    width: 120px;
                }
            }
    }
       
</style>


<script>
    // 备用金
    import {querySpareGold,saveChargeSpare} from '../../../utils/axios/api.js'
    import {formatTimer} from '../../../utils/common.js'

    import AdminModal from '../../../components/adminModal.vue';

    export default{
        data(){
            return{
                form:{
                   deliveryOrderNo:'',
                   bizCode:'',
                   startTime:'',
                   endTime:'',
                   pageNum:'',
                   pageSize:'10',
                   totalSize:'1'
                },
                table:[],

                rechargeForm:{
                    show:false,
                    id:'',
                    amount:'',
                    channelCode:''
                }
            }
        },
        created(){
            let m = this.$store.state.Memory.SpareGold;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery()
            );
        },
        methods:{
            loadingQuery(params){
                querySpareGold(params).then(res=>{
                    if(res.code==0){
                        this.table = res.data.content;
                        this.form.totalSize = res.data.totalPages
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //查询按钮
            bindFormSubmit(){
                this.form.page = 1;
                this.loadingQuery(this.form);
            },
            //弹出充值备用金模态框
            bindRecharge(id){
                this.rechargeForm.show = true;
                this.rechargeForm.id = id;
            },
            //确认充值备用金
            bindSaveRecharge(){
                if(!this.rechargeForm.id) return this.$message.warning(`缺少ID`);
                if(!this.rechargeForm.amount) return this.$message.warning(`请输入充值金额`);
                if(!this.rechargeForm.channelCode) return this.$message.warning(`请选择渠道`);
                saveChargeSpare(this.rechargeForm).then(res=>{
                    if(res.code==0){
                        this.$message.success(`充值成功!`);
                        this.loadingQuery(this.form);
                    }else{  
                        this.$message.error(res.msg);
                    }
                });
            },
            //隐藏备用金模态框
            bindHideChargeModule(){
                this.rechargeForm.show = false;
            },
            //页码选择的时候
           pageChange(n){
               this.form.pageNum = n;
               this.loadingQuery(this.form);
           },
           formatDate(p){
               return formatTimer(p);
           }
        },
        components:{
            AdminModal
        },
        destroyed(){
             //当前活动的tab
           let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`SpareGold`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'SpareGold',
                        data:{
                            table:this.table,
                            form:this.form,
                            rechargeForm:this.rechargeForm
                        }
                    });
               }
           });
        }
    }
</script>


