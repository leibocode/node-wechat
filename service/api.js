import { Error } from 'mongoose'
/**
 *  project--接口
 */

import request from 'request-promise'
import config from '../config/config'

import { SUCCESS,FLAT } from '../lib/http-status'

const requestAsync = async(options)=>{
    options = Object.assign({},options,{json:true})
    try{
        const response = await request(options)
        return response
    }catch(error){
         console.log(error)
    }
}

const base = config.api



//处理token


// 设置状态
export async function setApply(ctx){
    console.log('命中setApply')
    let body = {
        tb_WxActivityApply_ID:ctx.request.weixin.out_trade_no
    }
    let url = `${base}/activity/setApply`
    let options = {
        method:'POST',
        url:url,
        body:body
    }
    let data 
    try{
        data = await requestAsync(options)
        await SUCCESS(ctx,data,'写入成功')
        return data
    }catch(err){
        //调用失败
        await FLAT(ctx,'修改支付状态失败')
    }
}

//写库
export async function createApply(ctx,body){
    let url = `${base}/activity/CreateApply`
    let options = {
        method:'post',
        url:url,
        body:body
    }
    let data 
    try {
        data = await requestAsync(options)
        if(data.message==='成功'){
            return {
                code:0
            }
        }else {
            return {
                code:-1
            }
        }
    }catch(err){
        return {
            code:-1
        }
        //await FLAT(ctx,'写库失败')
    }
}
