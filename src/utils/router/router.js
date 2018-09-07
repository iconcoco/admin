

/**
 * 1. 登录注册页面组件
 */
import login from '../../views/login/login.vue';
import forgot from '../../views/login/forgot.vue';
import regist from '../../views/login/regist.vue'



/**
 * 2. 后台系统页面
 */

import mainBox from '../../views/admin/admin.vue';
import adminIndex from '../../views/admin/other/index.vue';

//2.1 合规模块
import KYC from '../../views/admin/compliance/kyc.vue';
import KYCList from '../../views/admin/compliance/kycList.vue';
import AccountList from '../../views/admin/compliance/accountList.vue';


//2.2 客户管理模块
import customeInfo from '../../views/admin/customer/customerInfo.vue';
import customeConfig from '../../views/admin/customer/config.vue';

//2.3 财务模块
import financeForm from '../../views/admin/Finance/financeForm.vue'
import withdrawRecord from '../../views/admin/Finance/withdrawRecord.vue'
import SpareGold from '../../views/admin/Finance/SpareGold.vue'
import SettlementList from '../../views/admin/Finance/SettlementList.vue'
import IbcBillList from '../../views/admin/Finance/IbcBillList.vue'
import PlatformBilling from '../../views/admin/Finance/PlatformBilling.vue'

//2.4 权限管理
import UserRight from '../../views/admin/User/UserRight.vue';
import role from '../../views/admin/User/role.vue';
import Resource from '../../views/admin/User/Resource.vue';


/**
 * 3. 其他页面
 */
import p404 from '../../views/admin/other/404.vue';





//一、 登陆页面的相关路由
export const loginRoute = [
    {path:'/',redirect:'/login'},
    {path:'/login',name:'login',component:login,},              //登录
    {path:'/login/forgot',name:'forgot',component:forgot,},     //忘记密码
    {path:'/login/regist',name:'regist',component:regist},      //注册
    {path:'/404',name:'page404',component:p404,},               //网站404
];


//二、后台系统的路由
//2.1 在主视图显示且能tab切换关闭的路由
export const adminRoute = [
    {
        path:'/admin',
        alias:'合规模块',
        name:'compliance',
        component:mainBox,
        children:[
            {path:'compliance/kyclist',name:'kycList',component:KYCList},                           //alias:'KYC审核列表',
            {path:'compliance/accountList',name:'accountList',component:AccountList},               //alias:'账号审核列表',
        ]
    },
    {
        path:'/admin',
        alias:'客户模块',
        name:'customer',
        component:mainBox,
        children:[
            {path:'customer/info',name:'customerInfo',component:customeInfo},                       //alias:'客户基本信息',
            {path:'customer/config',name:'config',component:customeConfig},                         //alias:'客户配置'
        ] 
    },
    {
        path:'/admin',
        alias:'财务模块',
        name:'Finance',
        component:mainBox,
        children:[
            {path:'Finance/financeForm',name:'financeForm',component:financeForm},                  //alias:'财务报表',
            {path:'Finance/withdrawRecord',name:'withdrawRecord',component:withdrawRecord},         //alias:'提现记录',
            {path:'Finance/SpareGold',name:'SpareGold',component:SpareGold},                        //alias:'备用金管理',
            {path:'Finance/SettlementList',name:'SettlementList',component:SettlementList},         //alias:'结汇列表',
            {path:'Finance/IbcBillList',name:'IbcBillList',component:IbcBillList},                  //alias:'海外出账列表',
            {path:'Finance/PlatformBilling',name:'PlatformBilling',component:PlatformBilling},      //alias:'平台出账',
        ] 
    },
    {
        path:'/admin',
        alias:'权限管理',
        name:'User',
        component:mainBox,
        children:[
            {path:'User/UserRight',name:'UserRight',component:UserRight},                   //alias:'用户管理',
            {path:'User/Role',name:'Role',component:role},                                  //alias:'角色管理'
            {path:'User/Resource',name:'Resource',component:Resource},                      //alias:'资源管理'
        ] 
    },
];
//2.1 在主视图显示,但是不能通过tab切换的路由
export const adminOther = [
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'404',name:'admin404',component:p404},                //后台404
            {path:'index',name:'index',component:adminIndex},           //后台首页
        ]
    },
    //合规模块
    {
        path:'/admin',
        component:mainBox,
        children:[
            {path:'compliance/KYCdetail',name:'KYCdetail',component:KYC},//kyc详情
        ]
    },
]


export const routes = [
    ...loginRoute,
    ...adminRoute,
    ...adminOther
]
