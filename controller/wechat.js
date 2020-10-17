import {
    request,
    summary,
    body,
    tags,
    query,
    deprecated,
    middlewares
} from 'koa-swagger-decorator'

import fs from 'fs'

import { controller,get,post,required } from '../service/decorator'

import {  signature,redirect,oauth,getWechatAuthUrl } from '../service/wechat-oauth'




import wechatMiddle from '../wechat-lib/middleware'
import config from '../config/config'
import { resolve } from 'path'
import reply from '../wechat//reply'
import wechatPay from '../wechat-lib/pay'
import WechatPay from '../wechat-lib/pay'
import middleware from '../wechat-lib/middleware'
import { stringify } from 'querystring'

const wechatTags = tags(["wechat"])

const wechatPayApi = new WechatPay()


export default class WechatController {
  @request('get','/api/wechat/wechat-next')
  @wechatTags
  @summary('微信中间件--get')
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @request('post','/api/wechat/wechat-next')
  @wechatTags
  @summary('微信中间件--post')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }


  @request('get','/api/wechat/wechat-signature')
  @wechatTags
  @summary('获取微信签名')
  async wechatSignature (ctx, next) {
      await signature(ctx,next)
  }

  @request('get','/api/wechat/wechat-redirect')
  @wechatTags
  @summary('微信授权跳转地址--后端做一个302的转发')
  async wechatRedirect (ctx, next) {
    await redirect(ctx, next)
  }

  @request('get','/api/wechat/wechat-oauth')
  @wechatTags
  @summary('微信授权--需要传入一个code')
  async wechatOAuth (ctx, next) {
    await oauth(ctx, next)
  }

  
  @request('post','/api/wechat/wechat-notify')
  @wechatTags
  @middlewares([wechatPayApi.getApi().middleware()])
  @summary('接受微信支付回调')
  async wechatNotify(ctx,next) {
    await wechatPayApi.notify(ctx)
  }

  @request('get','/api/wechat/wechat-oauthUrl')
  @wechatTags
  @summary('获取一个微信网页授权地址')
  async getOAuthUrl(ctx,next){
    await getWechatAuthUrl(ctx)
  }


  @request('post','/api/wechat/wechat-pay')
  @wechatTags
  @summary('微信支付')
  // @body({
  //   openid:{ type:'string',required:true },
  //   total_fee:{ type:'number',required:true }, 
  //   wxActivityID:{  type:'string',required:true, }
  //   wxPatientID:{}
  // })
  async wechatPay(ctx,next){
    await wechatPayApi.getByParamter(ctx)
  }

  @request('get','/wechatPayTestTpl')
  @wechatTags
  @summary('微信支付测试页面')
  async wechatPayTpl(ctx,next){
    await ctx.render('1', {
      
    })
  }

  // @request('get','/MP_verify_dmnyPCPmlrDbU1y3.txt')
  // @wechatTags
  // @summary('微信返回文本')
  // async GetTxtFile(ctx,next){
  //   let data = fs.readFileSync('./MP_verify_dmnyPCPmlrDbU1y3.txt')
  //   console.log(data.toString('utf-8'))
  //   ctx.body = data
  // }
}

