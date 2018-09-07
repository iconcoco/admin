<template>
    <div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th class="per15">提现人名字</th>
                        <th class="per25">银行</th>
                        <th class="per15">银行卡号</th>
                        <th class="per15">客户编号</th>
                        <th>审核状态</th>
                        <th class="per20">审核操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!form.length">
                        <td colspan="6">暂无查询结果</td>
                    </tr>
                    <tr v-for="(item,index) in form" :key="index">
                        <td>{{item.accountName}}</td>
                        <td>{{item.bankName}}</td>
                        <td>{{item.bankNumber}}</td>
                        <td>{{item.customerNo}}</td>
                        <td>
                            <span v-if="item.status==1" class="ing">待审核</span>
                            <span v-if="item.status==2" class="yes">审核通过</span>
                            <span v-if="item.status==3" class="no">审核失败</span>
                        </td>
                        <td>
                            <el-button @click="bindChangeBankStatus(item.id,item.status,2)" type="success" plain>通过</el-button>
                            <el-button @click="bindChangeBankStatus(item.id,item.status,3)" type="danger" plain>拒绝</el-button>
                        </td>
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
    import { 
        queryHolderList,        //请求列表
        saveHolderAudit         //保存接口
    }  from '../../../utils/axios/api.js';


    export default {
        data(){
            return{
                form:[],
                page:{
                    pageNum:1,
                    totalSize:1,
                }
            }
        },
        created(){
            let m = this.$store.state.Memory.accountList;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.page.pageNum)
            );
        },
        methods:{
            loadingQuery(n){
                
                queryHolderList({  
                    pageNum:n, 
                    pageSize:10
                }).then(res=>{
                    if(res.code==0){
                        // res.data.length && res.data.forEach(item=>{
                        //     this.form.push({
                        //         id:item.id,                         //银行卡ID
                        //         accountName:item.accountName,       //提现人
                        //         bankName:item.bankName,             //银行名称
                        //         bankNumber:item.bankNumber,         //银行卡号
                        //         customerNo:item.customerNo,         //客户标号
                        //         status:item.status,                 //审核状态
                        //     })
                        // });
                        this.form = res.data;
                        
                         Object.assign(this.page,res.page);

                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            bindChangeBankStatus(id,f,status){
                if(f==status) return this.$message.warning(`与当前状态一致`);
                saveHolderAudit({
                    id,
                    status
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功`);
                        //修改对应数据
                        this.form.forEach(item=>{
                            (item.id == id) && (item.status = status)
                        });
                    }else{  
                         this.$message.error(res.msg);
                    }
                })
            },
            pageChange(n){
                this.loadingQuery(n);
            }
        },
        components:{
        },
        destroyed(){
            let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`accountList`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'accountList',
                        data:{
                            form:this.form,
                            page:this.page
                        }
                    });
               }
           });
        }
    }
</script>

<style lang="scss" scoped>
    table{
        margin-bottom: 20px;
    }
</style>
