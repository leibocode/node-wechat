import config from '../config/config'
import Wechat from '../wechat-lib'
import WecahtOAuth from '../wechat-lib/oauth'
import path from 'path'
import {  readFileAsync,writeFileAsync  } from '../wechat-lib/utils'
import WechatOAuth from '../wechat-lib/oauth'
let wechat_file = path.join(__dirname,'.././config/wechat.txt')
let wechat_ticket_file = path.join(__dirname,'.././config/wechat_ticket.txt')

const wechatConfig = {
    wechat:{
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: function(){
            return readFileAsync(wechat_file)
        },
        saveAccessToken:(data)=>{
            data =  JSON.stringify(data)
            return writeFileAsync(wechat_file,data)
        },
        getTicket:  () => {
            return readFileAsync(wechat_ticket_file)
        },
        saveTicket:  (data) => {
            data = JSON.stringify(data)
            return writeFileAsync(wechat_ticket_file,data)
        }
    }
}

export const getWechat = () => {
    const wechatClient = new Wechat(wechatConfig.wechat)
  
    return wechatClient
  }

export const getOAuth =()=>{
    const oauth = new WechatOAuth(wechatConfig.wechat)
    return oauth
}