<template>
    <div class="kyc-form">
        <div class="kyc-status clearfix">
            <h3>审核总状态：</h3>
            <span v-if="totalStatus==1" class="ing">待审核</span>
            <span v-if="totalStatus==2" class="yes">审核通过</span>
            <span v-if="totalStatus==3" class="no">审核失败</span>

            <el-button class="fr" @click="bindSendTableData" type="success" plain>提交</el-button>
            <el-button style="margin-right:10px;" v-if="type==1" class="fr" @click="bindvalidIdCard" type="warning">身份验证</el-button>
        </div>
        <table>
            <thead>
                <tr>
                    <th class="per10">审核属性</th>
                    <th>属性值</th>
                    <th  class="per20">审核方式</th>
                    <th class="per30">审核状态</th>
                    <!-- <th  class="per10">备注</th>
                    <th  class="per10">审核人</th>
                    <th  class="per10">审核时间</th> -->
                </tr>
            </thead>
            <tbody>
                 <tr v-if="!form.length">
                    <td colspan="4">暂无查询结果</td>
                </tr>
                <tr v-for="(item,index) in form" :key="index">
                    <td>{{item.fieldName}}</td>
                    <td>
                        <!-- 图片 -->
                        <template v-if="item.fieldType==4">
                            <!--  v-if="!(item.isEdit==1)" -->
                            <a target="_blank" :href="'/file/download?fileId='+item.fieldValue">
                                <img :src="'/file/download?fileId='+item.fieldValue" alt="">
                            </a>
                            <!-- <el-upload
                                v-else
                                :show-file-list='false'
                                name='upFile'   
                                action="/general/upload"
                                :on-success="bindUploadSuccess"
                                :on-error="bindUploadError"
                                >
                                <img @click="bindUploadImg(index)" :src="'/file/download?fileId='+item.fieldValue" alt=""> 
                            </el-upload> -->
                        </template>
                         <!-- 日期 -->
                        <template v-else-if="item.fieldType==2">
                            <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                             <el-date-picker
                                v-else
                                value-format="yyyy-MM-dd"
                                v-model="item.fieldValue"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </template>
                         <!-- 链接 -->
                        <template v-else-if="item.fieldType==5" >
                            <a :href="item.fieldValue">item.fieldValue</a>
                        </template>
                         <!-- 其他 -->
                        <template  v-else>
                            <!-- 证件类型 -->
                            <template v-if="item.auditField=='identityType'">
                               <span v-if="!(item.isEdit==1)">{{idCard[item.fieldValue-1]}}</span>
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择证件类型">
                                    <el-option v-for="(idItem,idIndex) in idCard" 
                                        :key="idIndex"
                                        :label="idItem"   
                                        :value="`${idIndex+1}`"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 生效和失效日期 -->
                            <template v-else-if="(item.auditField=='certificateDate')||(item.auditField=='expiredDate')||(item.auditField=='dob')">
                                <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                                 <el-date-picker
                                    v-else
                                    value-format="yyyy-MM-dd"
                                    v-model="item.fieldValue"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </template>
                            <!-- 性别 -->
                            <template v-else-if="item.auditField=='sex'">
                                <span v-if="!(item.isEdit==1)">{{sexArr[item.fieldValue-1]}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择性别">
                                    <el-option v-for="(idItem,idIndex) in sexArr" 
                                        :key="idIndex"
                                        :label="idItem"   
                                        :value="`${idIndex+1}`"   
                                    ></el-option>
                                </el-select>
                            </template>
                            <!-- 国籍 -->
                            <template v-else-if="item.auditField=='nationality'">
                                <span v-if="!(item.isEdit==1)">{{nationObj[item.fieldValue]}}</span> 
                                <el-select v-else v-model="item.fieldValue" placeholder="请选择国籍">
                                    <el-option v-for="(v,key) in nationObj" 
                                        :key="key"
                                        :label="v"   
                                        :value="key"   
                                    ></el-option>
                                </el-select>
                            </template>

                            <!-- 其他输入框 -->
                            <template v-else>
                                <span v-if="!(item.isEdit==1)">{{item.fieldValue}}</span>
                                <el-input  v-else v-model="item.fieldValue"></el-input>
                            </template>

                        </template>
                    </td>
                    <td>
                        <span v-if="item.auditMode==1" class="yes">自动</span>
                        <span v-else class="ing">手动</span>
                    </td>
                    <td >
                        <el-radio v-if="item.auditMode!=1" v-model="item.auditStatus" label="1">待审核</el-radio>
                        <el-radio  v-model="item.auditStatus" label="2">审核通过</el-radio>
                        <el-radio v-if="item.auditMode!=1" v-model="item.auditStatus" label="3">审核失败</el-radio>
                    </td>
                    <!-- <td>
                        <el-input v-model="item.remark" placeholder=""></el-input>
                    </td>
                    <td>{{item.auditUser}}</td>
                    <td>{{item.auditTime}}</td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import {saveKycAuditInfo,validIdCard} from '../../../../utils/axios/api.js'

    export default{
        data(){
            return{
                form:[],
                totalStatus:'',

                switchUpload:'',
                idCard:[
                    "中华人民共和国居民身份证",
                    "香港永久性居民身份证",
                    "澳门特别行政区永久性居民身份证",
                    "中华民国国民身份证",
                    "港澳居民来往内地通行证",
                    "台湾居民来往大陆通行证",
                    ],
                sexArr:["男","女"],
                nationObj:{
                    CHN:"中国大陆"
                },
            }
        },
        props:['data','type'],
        created() {
            this.loadingQuery(this.data);
        },
        methods:{
            loadingQuery(n){
                this.form = [];
                this.totalStatus = n.totalStatus;
                n.auditInfoList && n.auditInfoList.length>0 && n.auditInfoList.forEach(item=>{
                    this.form.push({
                        id:item.id,
                        auditField:item.auditField,                 //审核字段
                        fieldValue:item.fieldValue,                 //审核值
                        bizType:item.bizType,                       //业务类型
                        foreignId:item.foreignId,                   //外键ID
                        auditUser:item.auditUser,                   //审核人
                        auditTime:item.auditTime,                   //审核时间
                        fieldName:item.fieldName,                   //审核属性
                        fieldType:item.fieldType,                   //字段类型 1:普通文本，2日期，3多图合并（逗号隔开）,4图片,5链接
                        auditMode:item.auditMode,                   //审核模式 1 自动 2 手动
                        auditStatus: item.auditMode==1? '2': `${item.auditStatus}`,  //审核状态 0 1 2
                        remark:item.remark,                         //审核备注
                        isEdit:item.isEdit,                         //是否可以编辑
                    });
                });
            },
            //提交审核
            bindSendTableData(){
                //保存修改
                let postData = this.form;//['']
                postData.forEach(item=>{
                   delete item.auditTime
                });
                let _this = this;


                saveKycAuditInfo({
                    "auditInfoReqVoList":postData
                }).then(res=>{
                   if(res.code==0){
                       _this.$message.success(res.msg);
                       this.totalStatus = res.data;
                   }else{
                       _this.$message.error(res.msg);
                   }
                })
            },
            bindvalidIdCard(){
                let ajax = {
                    name:'',
                    idNumber:''
                }
                 this.form.forEach(item=>{
                     if(item.auditField=='name'||item.auditField=='idNumber'){
                         ajax[item.auditField] = item.fieldValue;
                     }
                });

                let flag = Object.values(ajax).every(item=>item);
                if(!flag) return this.$message.error(`身份证号或名字不能为空！`);

                validIdCard(ajax).then(res=>{
                    if(res.code==0){
                        this.$message.success('验证通过！');
                    }else if(res.code==2){
                        //1. 提示失败
                        this.$message.error(`验证失败！`);
                        //2. 将目前手动审核变为失败
                         this.form.forEach(item=>{
                            if(item.auditMode==2){
                                item.auditStatus = '3';
                            }
                        });
                        //3. 提交保存当前的审核状态
                        this.bindSendTableData();

                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //上传图片点击
            bindUploadImg(index){
                this.switchUpload = index;
            },
            bindUploadSuccess(){
                // this.form[this.switchUpload].fieldValue = ``
            },
            bindUploadError(){
                this.$message.error(`上传失败，请重新上传！`);
            }
        },
        computed:{

        },
        watch:{
            data(n){
              this.loadingQuery(n) ;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .kyc-status{
        h3{
            display: inline-block;
            color: #333;
            margin-right: 10px;
        }
    }
    table{
        tr{
            td{
               img{
                    height: 45px;
                    vertical-align: middle;
               }
            }
        }
    }
</style>

