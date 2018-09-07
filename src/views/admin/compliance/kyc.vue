<template>
    <div class="kycDetaile">
        <ul class="admin-tab clearfix">
            <!-- 1 -->
            <li :class="{active:activeLi==1}" @click="bindKYCtabChange(1)">申请人信息</li>
            <!-- 2 -->
            <li :class="{active:activeLi==2}" @click="bindKYCtabChange(2)">企业信息</li>
            <!-- 3 -->
            <li :class="{active:activeLi==3}" @click="bindKYCtabChange(3)">受益人信息</li>
            <!-- 4 -->
            <li :class="{active:activeLi==4}" @click="bindKYCtabChange(4)">店铺信息</li>

            <li :class="{active:activeLi==11}" @click="bindKYCtabChange(1,10)">申请人风险</li>

            <li :class="{active:activeLi==22}" @click="bindKYCtabChange(2,10)">企业风险</li>

            <li :class="{active:activeLi==33}" @click="bindKYCtabChange(3,10)">受益人风险</li>

            <li :class="{active:activeLi==44}" @click="bindKYCtabChange(4,10)">店铺风险</li>
        </ul>
        <!-- 申请人的信息 -->
        <div class="table-container">
            <holderTable v-if="activeLi==3 || activeLi==33" :type="activeLi" :risk="risk" :data="holderTabelData"></holderTable>
            <kycForm v-else :type="activeLi" :data="kycFormData"></kycForm>
        </div>
    </div>
</template>

<script>
    import { 
        queryKycAuditInfo,
        queryRiskInfo,
        queryShareholderList 
    } from '../../../utils/axios/api.js'

    import kycForm from './components/kycForm.vue';
    import holderTable from './components/holderTable.vue';

    export default{
        data(){
            return{
                kycFormData:{
                    auditInfoList:[],
                    totalStatus:1
                },
                holderTabelData:[],
                queryId:{},             ////{userId: 11, enterpriseId: null, storeNo: 1}
                activeLi:1,
                risk:false
            }
        },
        created() {
            //请求当前外键的审核字段和结果
            this.queryId = this.$route.params;
            // console.log(this.$route.params);
            if(!this.queryId.userId) return this.$router.push({name:'kycList'});
            this.loadingData({bizType:1,id:this.queryId.userId})
        },
        methods:{
            loadingData(params,isRisk){

                if(isRisk){
                    // 风险平级的请求
                    queryRiskInfo({
                        bizType:params.bizType,
                        foreignId:params.id 
                    }).then(res=>{
                        if(res.code==0){

                            let obj = {
                                auditInfoList:[],
                                totalStatus:'',
                            }

                            obj.auditInfoList = res.data.riskInfoList;
                            obj.totalStatus = res.data.totalStatus;

                            this.kycFormData = obj;
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }else{
                    //非风险评级的请求
                    queryKycAuditInfo({
                        bizType:params.bizType,
                        foreignId:params.id 
                    }).then(res=>{
                        if(res.code==0){
                            this.kycFormData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                    });  
                }

               
            },
            bindKYCtabChange(bizType,per){

                let id = null,
                    foreignId = this.queryId;

                    switch(bizType){
                        case 1:
                        case 3:
                        {  //申请人
                            id = foreignId.userId
                        }
                        break;
                        case 2:
                        {   //企业
                            id = foreignId.enterpriseId
                        }
                        break;
                        case 4:
                        {   //店铺
                            id = foreignId.storeNo
                        }
                        break;
                    }

                    if(!id) return this.$message.error(`缺少ID`);

                     //切换tab
                per ? (
                    this.activeLi = bizType*per+bizType,
                    this.risk = true
                    ) : ( 
                        this.activeLi = bizType,
                        this.risk = false
                    );

                 if(bizType==3){
                        //受益人信息
                        queryShareholderList({applicantId:id}).then(res=>{
                            res.code==0 ?
                            (this.holderTabelData = res.data):
                            (this.$message.error(res.msg));
                        });
                 }else{
                     per ?( this.loadingData({bizType:bizType,id},per) ):( this.loadingData({bizType:bizType,id}) )

                 }
                
            }
        },
        components:{
            kycForm,
            holderTable
        }
    }
</script>
