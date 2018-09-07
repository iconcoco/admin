<template>
    <div class="main-container" :class="{miniContainer:isMin}">
        <div class="system-main-sidebar">
            <h1 class="system-logo">
                <span class="max"></span>
                <span @click="bindChangeMainContainer" class="min"></span>
            </h1>
            <nav>
                <!-- 菜单列表 -->
                <ul class="max admin-main-menu">
                    <li v-for="(item,index) in MainNav" :key="index">
                        <p>
                            <i v-if="item.name=='compliance'" class="fa fa-edit"></i> 
                            <i v-if="item.name=='finance'" class="fa fa-calculator"></i> 
                            <i v-if="item.name=='User'" class="fa fa-cog"></i> 
                            {{item.alias}} 
                            <span class="el-icon-arrow-down"></span> </p>
                        <ul class="inner-menu">
                            <li v-for="(innerItem,innerIndex) in item.children" @click="bindNavRoter(innerItem.name)" :class="{active: innerItem.name == currentName}" :key="innerIndex">{{innerItem.alias}}</li>
                        </ul>
                    </li>
                </ul>

                <!-- 小菜单 -->
                <ul @click="bindChangeMainContainer" class="min min-bar">
                    <li v-for="(item,index) in MainNav" :key="index" >
                        <i v-if="item.name=='compliance'" class="fa fa-edit"></i> 
                        <i v-if="item.name=='finance'" class="fa fa-calculator"></i>
                         <i v-if="item.name=='User'" class="fa fa-cog"></i>  
                    </li>
                </ul>

            </nav>
        </div>
        <!-- 顶部 -->
        <div class="system-main-view">
            <header class="system-main-header">
                
                <div class="fl tab-menu clearfix">
                    <span @click="bindChangeMainContainer"  class="menu-controler" :class="{active:isMin}"></span>
                    <ul class="clearfix" id="tab-container">
                        <li class="tab-first" :class="{active: 'index' == currentName }">
                            <router-link to="/admin/index">首页</router-link>
                        </li>
                        <li 
                        v-for="(item,index) in this.$store.state.TabList" 
                        :key="index"
                        :class="{active:item.name == currentName}"
                         >
                            <!-- <router-link :to="item.path">{{item.alias}}</router-link> -->
                            <a  @click="bindNavRoter(item.name)" href="javascript:;">{{item.alias}}</a>
                            <i  @click="bindCloseTabSelect(item.name)" class="el-icon-close"></i>
                        </li>
                    </ul>
                </div>
                <!-- 右侧个人信息 -->
               <ul class="fr person-menu">
                   <li @click="bindOpenMsgBox">
                       <i class="el-icon-bell"></i>
                   </li>
                   <li>**主管</li>
                   <li class="userName">
                       <span>{{loginInfo.userName}}</span>
                        <div class="inner-menu">
                            <!-- <p>个人中心</p> -->
                            <p @click="bindLogout">退出登录</p>
                        </div>
                   </li>
               </ul>
            </header>
            <!-- 路由视图 -->
            <div id="loading" class="system-main-content">
                <router-view></router-view>
            </div>
            <!-- 消息盒子 -->
            <div class="system-main-msgbox" :class="{active:isShowMsgbox}">
                消息列表
            </div>
        </div>

    </div>
</template>

<script>

    import $ from 'jquery';

    import { addClass,removeClass } from '../../utils/common.js';
    import { 
        logout,
        queryAuth,
     } from '../../utils/axios/api.js';


    let admin = {
        init:function(){
            this.event.menuSlider();
        },
        event:{
            menuSlider:function(){
                $('.admin-main-menu').on('click','li p',function(){
                    let par = $(this).parent('li'),
                        innerMenu = par.find('.inner-menu');
                    if(par.hasClass('active')){
                        par.removeClass('active') ;
                        innerMenu.slideUp(300);
                    }else{
                        par.addClass('active') ;
                        innerMenu.slideDown(300);
                    }
                });
            },
            
        }
    }

    export default{
        data(){
            return{
                isMin:false,
                MainNav:[
                    // {
                    //     alias:'合规模块',
                    //     children:[
                    //         {
                    //             alias:'kyc列表',
                    //             name:'kycList' 
                    //         }
                    //     ],  
                    // }
                ],         //左边的菜单
                isA:false,
                loginInfo:{
                    userName:'',
                },
                isShowMsgbox:false,
            }
        },
        created() {
            let info = sessionStorage.getItem('adminUserInfo');
            //判断是否已经有登陆的信息
            info ? 
            (this.loginInfo = JSON.parse(info)):
            (   
                //没有信息，相当于没有登陆，需要跳转到首页重新登录
                this.$router.push({name:'login'})
            )

            //请求权限目录
            queryAuth().then(res=>{
                if(res.code==0){
                    let auth = [];  //权限目录的数据结构
                           

                   res.data.childList = res.data.childList.concat([{
                        authDesc:"财务模块",
                        authName:'finance',
                        childList:[
                            {
                                authDesc:"财务报表",
                                authName:"financeForm"
                            },
                            {
                                authDesc:"提现记录",
                                authName:"withdrawRecord"
                            },
                            {
                                authDesc:"备用金管理",
                                authName:"SpareGold"
                            },
                            {
                                authDesc:"结汇列表",
                                authName:"SettlementList"
                            },
                            {
                                authDesc:"海外银行出账",
                                authName:"IbcBillList"
                            },
                            {
                                authDesc:"平台出账",
                                authName:"PlatformBilling"
                            },
                        ]
                    },{
                        authDesc:"权限配置",
                        authName:'User',
                        childList:[
                             {
                                authDesc:"用户管理",
                                authName:"UserRight"
                            },
                            {
                                authDesc:"角色管理",
                                authName:"Role"
                            },
                            {
                                authDesc:"资源管理",
                                authName:"Resource"
                            },
                        ]
                    }])
                    //1.遍历获取目录数据
                    res.data.childList.forEach(item=>{
                        let o = {
                            alias:'',
                            children:[],
                        };
                        //1.1 模块的名称
                        o.alias = item.authDesc;    
                        o.name = item.authName;    
                        item.childList.forEach(innerItem=>{
                            let d = {
                                alias:innerItem.authDesc,
                                name:innerItem.authName,
                            };
                            //1.2 模块子页面数据
                            o.children.push(d)
                            //1.3 保存目录权限
                            this.$store.state.Authority.push(d.name);
                            //1.4 保存tab切换的菜单
                            this.$store.commit('setTabData',d)
                        });
                        //添加
                        auth.push(o);
                    });
                    //2.设置目录
                    this.MainNav = auth;

                }else{
                    this.$message.error(res.msg);
                }
            });

        }, 
        mounted(){
            admin.init();
        },
        methods:{
            //退出登录
            bindLogout(){
                logout().then(res=>{
                    if(res.code==0){
                        sessionStorage.clear();
                        //清空当前打开的菜单
                        this.$store.state.TabList=[];
                        this.$router.push({name:'login'})
                    }else{
                        this.$message.error(res.msg)
                    }
                });
            },
            //展开消息盒子
            bindOpenMsgBox(){
                this.isShowMsgbox = !this.isShowMsgbox;
            },
            //大小菜单收缩
            bindChangeMainContainer(){
                this.isMin = !this.isMin;
            },
            //左侧菜单的tab跳转
            bindNavRoter(name){
                this.$router.push({name});
            },
            //右上tab的关闭按钮
            bindCloseTabSelect(name){   
                let tabArr = this.$store.state.TabList;
                
                tabArr.forEach((item,index)=>{
                    if(item.name == name){
                        //1. 删除tabList中的对应数据
                        tabArr.splice(index,1);
                        //2. 判断当前关闭的是当前的视图吗？
                        if(this.currentName == name){
                            //2.1 同时激活当前要显示的组件
                            index>0 ?
                            (this.$router.push({name:`${tabArr[index-1].name}`})):
                            (location.hash = `/admin/index`)
                        }
                        //3. 删除对应的组件数据状态保存
                        this.$store.commit('setModelRecordData',{
                            key:name,
                            data:null
                        });
                    }
                });
               
            }
        },
        computed:{
            currentName(){
                return this.$store.state.TabCurrentName;
            }
        },
        watch:{

        }
    }
</script>

<style lang="scss" scoped>

    .main-container{
        height:100%;
         .max{
            display: block;
        }
        .min{
            display: none;
        }
    }
    //左边菜单收起来的时候
    .miniContainer{
        .max{
            display: none;
        }
        .min{
            display: block;
        }
        .system-main-sidebar{
            width: 50px;
            .system-logo{
                .min{
                    display: inline-block;
                }
                .max{
                    display: none;
                }
            }
        }
        .system-main-view{
             margin-left: 50px;
        }
    }
    //左侧下拉菜单
    .system-main-sidebar{
        position: fixed;
        left: 0;
        top: 0;
        width: 200px;
        height: 100%;
        background-color: rgba(0, 21, 41, 1);
        z-index: 100;
        transition: width .5s;
        overflow-x: hidden;
        .system-logo{
            text-align: center;
            height: 50px;
            padding-top: 10px;
            background-color: #367fa9;
            margin-bottom: 20px;
            .max{
                display: inline-block;
                width: 179px;
                height: 31px;
                background: url('../../image/logo.png') no-repeat center center;
                background-size: 179px 31px;
            }
            .min{
                display: none;
                width: 50px;
                height: 31px;
                overflow: hidden;
                background: url('../../image/logo.png') no-repeat left center;
                background-size: 179px 31px;
            }
        }
        .min-bar{
            color: #aaa;
            text-align: center;
            li{
                height: 44px;
                line-height: 44px;
            }
            li:hover{
                color: #fff
            }
        }

           //左侧菜单
        .admin-main-menu{
            >li{
                >p{
                    height: 44px;
                    line-height: 44px;
                    color: #aaa;
                    padding-left: 15px;
                    cursor: pointer;
                    white-space:nowrap;
                    position: relative;
                    i{
                        margin-right: 5px;
                    }
                    span{
                        position: absolute;
                        top: 17px;
                        right: 20px;
                        transition: all .3s;
                    }
                }
                &.active{
                    >p{
                    color: #fff;
                    span{
                        transform: rotate(180deg);
                    }
                    }
                }
            }

            .inner-menu{
                display: none;
                li{
                    height: 36px;
                    line-height: 36px;
                    padding-left: 40px;
                    color: #aaa;
                    cursor: pointer;
                    position: relative;
                     white-space:nowrap;
                    &:hover{
                        color: #fff;
                    }
                    &.active{
                        color: #fff;
                        background-color: #3d3d3e4f;
                        &::after{
                            content: "";
                            position: absolute;
                            width: 2px;
                            height: 100%;
                            top: 0;
                            left: 0;
                            background-color: #337ab7;
                        }
                    }
                }
            }
        }

    }
    //右侧主要视图
    .system-main-view{
        position: relative;
        margin-left: 200px;
        height: 100%;
        transition: all .5s;
        .system-main-header{
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 50px;
            line-height: 50px;
            z-index: 99;
            background-color: #3c8dbc;
            transition: all .5s;
            // box-shadow:0 1px 4px 0px  #e0dede;
            //展开收起按钮
            .menu-controler{
                display: inline-block;
                width: 26px;
                height: 32px;
                background: url('../../image/shou.png') no-repeat center;
                background-size: 100%;
                cursor: pointer;
                vertical-align: middle;
                margin-left: -36px;
                // position: absolute;
                // left: 23px;
                // top: 14px;
                &.active{
                     background: url('../../image/zhan.png') no-repeat center;
                     background-size: 100%;
                }
            }
            //
            .tab-menu{
                width: 100%;
                height: 50px;
                padding-left: 56px;
                padding-right: 190px;
                position: relative;
                // overflow-y: hidden;
                >ul{
                    display:block;
                    vertical-align: top;
                    height: 54px;
                    // overflow-y: hidden;
                    // position: absolute;
                    // top: 0;
                    margin-top: -50px;
                    white-space: nowrap;
                    overflow-x: hidden;
                    &:hover{
                        overflow-x: auto;
                    }
                    li{
                        display: inline-block;
                        margin-right: 20px;
                        height: 50px;
                        color: #fff;
                        cursor: pointer;
                        a{
                            display: inline-block;
                            padding-left: 10px;
                            color: #fff;
                            height: 100%;
                        }
                       
                        &:hover{
                            color: #fbb03b;
                            a{
                                 color: #fbb03b;
                            }
                        }
                         &.active{
                             color: #fbb03b;
                             border-bottom:2px solid #fbb03b;
                            a{
                                 color: #fbb03b;
                            }
                         }
                    }
                    //首页
                    .tab-first{
                        &:hover,
                        &.active{
                            border-bottom: none;
                        }
                    }
                   
                }
            }
            //个人菜单
            .person-menu{
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                >li{
                    float: left;
                    color: #fff;
                    font-size: 14px;
                    margin: 0 10px;
                    position: relative;
                    cursor: pointer;
                    &:hover{
                        .inner-menu{
                            display: block;
                        }
                    }
                }
                .userName{
                    // min-width: 80px;
                    margin: 0px;
                    padding: 0 20px;
                }
                .inner-menu{
                    display: none;
                    position: absolute;
                    top: 50px;
                    right: 10px;
                    width: 80px;
                    background-color: #fff;
                    box-shadow: 0 1px 4px 0px #e0dede;
                    p{
                        height: 35px;
                        line-height: 35px;
                        font-size: 12px;
                        text-align: center;
                        cursor: pointer;
                        color: #666;
                        &:hover{
                            background-color: #f8f8f9;
                            color: #337ab7;
                        }
                    }
                }
            }
        }
        .system-main-content{
            height: 100%;
            padding-top: 50px;
            background-color: #f4f5f9;
            overflow-y: auto;

            >div{
                padding:10px;
            }
        }
        .system-main-msgbox{
            position: fixed;
            top: 0;
            right: 0;
            width: 0px;
            height: 100%;
            padding-top: 50px;
            background-color: #001529;
            color: white;
            transition: all .3s;
            z-index: 90;
            white-space: nowrap;
            &.active{
                width: 200px;
            }
        }
    }

</style>


<style lang="scss">
    body{
        background-color:#f4f5f9;
    }
</style>



