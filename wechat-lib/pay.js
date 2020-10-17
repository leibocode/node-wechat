import config from '../config/config'
import tenpay from 'tenpay'
import fs from 'fs'
import moment from 'moment'
import uuid from 'uuid'

import { FLAT, SUCCESS,ParamterErrorFLAT } from '../lib/http-status'
import {  createApply,setApply } from '../service/api'
import { ErrModel, } from '../lib/http-errors'
import { flatMap } from 'lodash'



const wechatConfig = {
    appid:config.wechatPay.appid,
    mchid:config.wechatPay.mchId,
    partnerKey:config.wechatPay.key,
    notify_url:config.wechatPay.notify_url
}

console.log(wechatConfig)

const WechatAPI = new tenpay(wechatConfig,true)
 
export default class WechatPay {
    //H5 支付
    async unifedOrder(out_trade_no,body,tota_fee,ip){ 
        let fee = parseFloat(tota_fee)*1000
        let searchInfoObj = {
            h5_info:{
                type:"wap",
                wap_url: '',
                wap_name: ""
            }
        }

        let res =await WechatAPI.unifiedOrder({
            out_trade_no: out_trade_no, //商户内部订单号
            body:body,
            total_fee:fee , //订单金额(单位：分)
            trade_type: 'MWEB',
            spbill_create_ip: ip,
            scene_info: JSON.stringify(sceneInfoObj) //场景信息
        })
        let code = -1
        if(res.result_code ==='SUCCESS' || res.return_msg==='OK'){
            return resolve({code:0,url:res.mweb_url})
        }else {
            return resolve({code:-1})
        }
    }

    //微信回调
    async notify(ctx){
        //解析信息,
        //调用C#接
        console.log(ctx.request.body)
        console.log(ctx.request.weixin)
        await setApply(ctx)
    }

    async orderQuery(out_trade_no){
        let data = await WechatAPI.orderQuery({
            out_trade_no
        })
        
        let  { return_msg, trade_state_desc,trade_state} = data
        if(return_msg==='ok' && trade_state !=='NOTPAY'){
            return resolve({code:0,msg:'查询成功'})
        }else {
            return resolve({code:-1,msg:'订单未付款'})
        }
    }

    //公众号支付
    async getByParamter(ctx){
        let padLeft = p => {
            return new Array(3 - (p + '').length + 1).join('0') + p;
        }
        console.log(ctx.request.body)
        let paymentId = `KCCRM${moment().format('YYYYMMDDHHmmss')}${padLeft(moment().milliseconds())}`;
        //let paymentId = uuid.v1()
        
        let {
            openid,
            total_fee,
            wxActivityID,
            wxPatientID
        } = ctx.request.body
        if(!wxActivityID || !wxPatientID || !openid || !total_fee){
            await ParamterErrorFLAT(ctx,'wxActivityID,wxPatientID,openid,total_fee等参数为空')
        }
        

        let body = '报名支付'
        let fee = total_fee?parseFloat(total_fee)*100:1
        wxActivityID = wxActivityID?wxActivityID:'dcb8d929-fa8f-471a-ad4a-ff4b8fdbf90b'
        wxPatientID = wxPatientID?wxPatientID:'419E9D10-0FB5-44BF-8F21-825601578556'

        let order = {
            out_trade_no:paymentId,
            body:body,
            total_fee:fee,
            openid:openid
        }
        let result = await WechatAPI.getPayParams(order)
        console.log('开始支付')
        console.log(result)
        if(result.package){
            let body = {
                wxActivityID, 
                wxPatientID,
                EntryFee:total_fee,
                payId:paymentId
            }
            await SUCCESS(ctx,result,'支付成功!')
            // let data = await createApply(ctx,body)
            // if(data.code===0){
                
            // }else {
            //     await FLAT(ctx,'支付写入数据失败')
            // }
        }else {
            await FLAT(ctx,'支付错误')
        }
    
    }

    //扫码支付
    async payment(){
        throw new FLAT();
    }

    getApi(){
       return WechatAPI 
    }
}

