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

const wechatPayApi = new WechatPay()

@controller('')
export  class WechatController {
  @get('/wechat-next')
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }

  @post('/wechat-next')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }
}

