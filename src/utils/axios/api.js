import Axios from './axios.js';

/**
 * 1. 登陆注册页面
 */

export const login = params=> Axios.post('/login',params);
export const logout = ()=> Axios.post('/logout');
export const register = params=> Axios.post('/register',params);

/**
 * 2. 后台系统
 */
//首页获取权限菜单
export const queryAuth = ()=> Axios.post('/user/loadAuthTree');

//基础接口
//0.1 国外银行列表
export const queryForeignBankList = ()=> Axios.post(`/general/selectBankList`);
//0.2 平台信息
export const queryPlatformInfo = ()=> Axios.post(`/general/platformInfo`);
//0.3 查询币种
export const queryCurrencyList = ()=> Axios.post(`/general/queryCurrencyList`);
//0.4 查询渠道
export const queryChannelInfo = ()=> Axios.post(`/general/queryChannelInfo`);


// 一、合规模块

//1.1 KYC审核获取对应外键ID的详情
export const queryKycAuditInfo = params=> Axios.post('/kyc/queryAuditInfo',params);
//1.2. KYC审核提交审核结果
export const saveKycAuditInfo = params=> Axios.post('/kyc/saveAuditInfo',params,{JSON:true});
//1.3 请求KYC主页列表
export const queryKycIndexList = params=> Axios.post('/kyc/index',params);
//1.3 请求KYC审核状态
export const queryKycAuditStatus = params=> Axios.post('/kyc/queryAuditStatus',params);
//1.4 请求受益人审核列表
export const queryShareholderList = params=> Axios.post('/kyc/queryShareholderList',params);
//1.5 风险评级
export const queryRiskInfo = params=> Axios.post('/kyc/queryRiskInfo',params);
//1.5 风险评级
export const validIdCard = params=> Axios.post('/kyc/validIdCard',params);

//2.1 账户审核列表
export const queryHolderList = params=> Axios.post('/holderInfo/index',params);
//2.2 账户审核结果保存
export const saveHolderAudit = params=> Axios.post('/holderInfo/audit',params);

//三、财务模块
//3.1 财务提现记录
export const withdrawRecord = params => Axios.post('/financial/query/withdraw',params);
//3.2 财务报表
export const financeStatement = params => Axios.post('/financial/query/financial/statement',params);
//3.3 备用金
export const querySpareGold = params => Axios.post('/financial/query/spare/fund/detail',params);
//3.4 结汇列表
export const querySettlementList = params => Axios.post('/financial/querySettlSettlementList',params);
//3.5 海外银行出账列表
export const queryIbcBillList = params => Axios.post('/financial/findIbcBillList',params);
//3.6 平台出账
export const queryPlatformBilling = params => Axios.post('/financial/queryPlatformBilling',params);
//3.7 充值备用金
export const saveChargeSpare = params => Axios.post('/financial/recharge/spare/fund',params);
//3.8 上传备用金接口
export const uploadFinancialAmount = '/financial/uploadFinancialAmount';


//四、 权限管理
//4.1 查询用户列表
export const queryUserList = params => Axios.post('user/queryUserList',params);
//4.2 修改用户状态
export const updateStatus = params => Axios.post('user/updateStatus',params);
//4.3 查询角色列表
export const queryRoleList = params => Axios.post('user/queryRoleList',params);
//4.3 查询所有角色
export const queryRoleAll = params => Axios.post('user/queryRoleAll',params);
//4.3 设置用户觉得
export const setUserRole = params => Axios.post('user/setRole',params);