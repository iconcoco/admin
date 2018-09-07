<template>
    <div>
        <div class="table-container KYC-index">
             <el-form class="admin-form-inline" :inline="true" :model="form">

                 <el-form-item label="用户编号" name="userCode">
                    <el-input name="userCode" v-model="form.userCode" placeholder="请输入用户编号"></el-input>
                </el-form-item>

                 <el-form-item label="手机号码" name="phone">
                    <el-input name="phone" v-model="form.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                 <el-form-item label="邮箱地址" name="email">
                    <el-input name="email" v-model="form.email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="success">查询</el-button>

            </el-form>


            <el-button type="success" @click="bindAllotRole" plain>分配角色</el-button>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>用户名</th>
                        <th>账号名</th>
                        <th>手机号码</th>
                        <th>邮箱</th>
                        <th>状态</th>
                        <th>角色</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-if="!table.length" colspan="8">暂无查询结果</td>
                    </tr>
                    <tr v-for="(item, index) in table" :key="index">
                        <td>
                            <el-radio :label="item.id" v-model="tableForm.userId"></el-radio>
                        </td>
                        <td>{{item.userName}}</td>
                        <td>{{item.userCode}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.email}}</td>
                        <td>
                            <span v-if="item.status==1" class="ing" >未激活</span>
                            <span v-if="item.status==2" class="yes" >已激活</span>
                            <span v-if="item.status==3" class="no" >已锁定</span>
                        </td>
                        <td>{{item.roleName}}</td>
                        <td>
                            <el-button @click="bindChangeStatus(item.userCode,2,index)" v-if="item.status==1||item.status==3" type="success" plain>激活</el-button>
                            <el-button @click="bindChangeStatus(item.userCode,3,index)" v-if="item.status==2" type="danger" plain>锁定</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Pagination 
                :page="form.page"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>

            <AdminModel
                title="分配角色"
                confirmTxt="确认"
                v-model="tableForm.isShow" 
               :confirm="adminModalConfirm"
               class="userRight-adminModal"
            >
             <el-form :inline="true" :model="tableForm">
                <el-form-item label="分配角色">
                    <el-select v-model="tableForm.roleId" filterable placeholder="搜索选择角色">
                         <el-option
                             v-for="(item,index) in roleArr"
                             :key="index"
                             :label="item.roleName"
                             :value="item.id">
                         </el-option>
                     </el-select>
                </el-form-item>
            </el-form>
               
            </AdminModel>
        </div>
    </div>
</template>

<script>
    import { 
        queryUserList,
        updateStatus,
        queryRoleAll,
        setUserRole
     } from '../../../utils/axios/api.js';

    import AdminModel from '../../../components/adminModal.vue';

    export default{
        data(){
            return{
                form:{
                   userCode:'', 
                   phone:'', 
                   email:'', 
                   page:'1', 
                   size:'10', 
                   totalPages:'1'
                },
                table:[],

                tableForm:{
                    userId:'',
                    isShow:false,
                    roleId:''
                },
                roleArr:[]
            }
        },
        created(){
             let m = this.$store.state.Memory.UserRight;
            m?(
                Object.assign(this,m)
            ):(
                this.loadingQuery(this.form)
            );

            !this.roleArr.length && queryRoleAll().then(res=>{
                if(res.code==0){
                    this.roleArr = res.data
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        methods:{
            loadingQuery(params){
                queryUserList(params).then(res=>{
                    if(res.code){
                        this.table = res.data.content;
                        this.form.totalPages = res.data.totalPages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            //查询按钮
            bindFormSubmit(){
                
            },
            //改变用户的状态
            bindChangeStatus(userCode,status,index){
                updateStatus({
                    userCode,
                    status
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功`);
                        this.table[index].status = status;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            //分配觉得按钮弹出模态框
            bindAllotRole(){
                if(!this.tableForm.userId) return this.$message.warning(`请选择一名用户`);
                this.tableForm.isShow = true;
            },
            //确认分配角色
            adminModalConfirm(){
                if(!this.tableForm.roleId) return this.$message.warning(`请选择角色`);
                setUserRole(this.tableForm).then(res=>{
                    if(res.code==0){
                        this.$message.success(`分配成功`);
                        this.tableForm.isShow = false;
                        this.loadingQuery(this.form);
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //点击页码
            pageChange(n){

            }
        },
        destroyed(){
             //当前活动的tab
           let tabArr = this.$store.state.TabList;
           tabArr.forEach(item=>{
               if(item.name==`UserRight`){
                   return  this.$store.commit('setModelRecordData',{
                        key:'UserRight',
                        data:{
                            table:this.table,
                            form:this.form,
                            tableForm:this.tableForm,
                            roleArr:this.roleArr
                        }
                    });
               }
           });
        },
        components:{
            AdminModel
        }
    }
</script>


<style lang="scss">
    .userRight-adminModal{
        .content{
            text-align: center;
            margin: 30px 0;
        }
         .el-form-item{
            margin: 0;
        }
    }
    .KYC-index{
        table{
            .el-radio__label{
                display: none;
            }
        }
    }
</style>

