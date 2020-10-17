import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
// import { getParamsAsync } from '../wechat-lib/pay'

import config from '../config/config'
import {  getOAuth,getWechat } from '../wechat' 

import { SUCCESS,FLAT } from '../lib/http-status'

const client = getWechat()

async function getSignatureAsync (url) {
    const data = await client.fetchAccessToken()
    const token = data.access_token
    const ticketData = await client.fetchTicket(token)
    const ticket = ticketData.ticket
  
    let params = client.sign(ticket, url)
    params.appId = client.appID
  
    return params
  }
  
  function getAuthorizeURL (...args) {
    const oauth = getOAuth()
  
    return oauth.getAuthorizeURL(...args)
  }

  export  async function  getWechatAuthUrl(ctx){
    const target = config.wechat.SITE_ROOT_URL + '/api/wechat/wechat-oauth'
    const scope = 'snsapi_userinfo'
    const { visit, id } = ctx.query
    const params = id ? `${visit}_${id}` : visit
    const url =  getAuthorizeURL(scope, target, 'oauth_code')

    await SUCCESS(ctx,url,'获取成功!')

  }
   
 async function getUserByCode (code) {
    const oauth = getOAuth()
    const data = await oauth.fetchAccessToken(code)
    const user = await oauth.getUserInfo(data.access_token, data.unionid)
    // const user = await oauth.getUserInfo(data.access_token, data.openid)
    //主导用户的openid
    console.log(user)
    return user
  }

  export async function signature (ctx,next){
    let url = ctx.query.url

    if (!url) ctx.throw(404)
  
    url = decodeURIComponent(url)
  
    const params = await api.wechat.getSignatureAsync(url)

  
    ctx.body = {
      success: true,
      data: params
    }
  }

  export async function redirect (ctx, next) {
    const target = config.wechat.SITE_ROOT_URL + '/api/wechat/wechat-oauth'
    const scope = 'snsapi_userinfo'
    const { visit, id } = ctx.query
    const params = id ? `${visit}_${id}` : visit
    const url =  getAuthorizeURL(scope, target, 'oauth_code')
    ctx.redirect(url)
  }

  export async function oauth(ctx,next) {
    let { code } = ctx.query


    //url = decodeURIComponent(url)
  
    // const urlObj = urlParse(url)
    // const params = queryParse(urlObj.query)
    // const code = params.code
    
    console.log(code)
    // const user = await getUserByCode(code)

    // await SUCCESS(ctx,user,'操作成功')

  }

  export async function paymentAsync(ctx,next){

  }