import { Message } from 'element-ui';

import {
    queryPlatformInfo,
    queryForeignBankList,
    queryCurrencyList,
    queryChannelInfo,
} from '../utils/axios/api';

// 1. 平台列表
export const queryPlatform = async ()=>{
    let data = sessionStorage.getItem('PlatformInfo');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryPlatformInfo()
       if(res.code==0){
           sessionStorage.setItem(`PlatformInfo`,JSON.stringify(res.data));
           return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}

// 2. 国外银行列表
export const queryForeignBank = async ()=>{
    let data = sessionStorage.getItem('ForeignBank');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryForeignBankList()
       if(res.code==0){
            sessionStorage.setItem(`ForeignBank`,JSON.stringify(res.data));
           return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}

// 3. 币种列表
export const queryCurrency = async ()=>{
    let data = sessionStorage.getItem('Currency');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryCurrencyList()
       if(res.code==0){
            sessionStorage.setItem(`Currency`,JSON.stringify(res.data));
           return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}

// 4. 渠道信息
export const queryChannel = async ()=>{
    let data = sessionStorage.getItem('Channel');
    if(data){
        return JSON.parse(data);
    }else{

       let res = await queryChannelInfo()
       if(res.code==0){
        sessionStorage.setItem(`Channel`,JSON.stringify(res.data));
           return res.data;
       }else{
           Message.error(res.msg)
       }
    }
}

