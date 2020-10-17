import koaBody from 'koa-bodyparser'
import config from '../config/config'
import catchError from './errorHandler'

const koajwt = require('koa-jwt')
const koalogger =require('koa-logger')
const jsonwebtoken =require('jsonwebtoken')
const koaStatic = require('koa-static')

const { verify } =require('../lib/verify')

export const addBody =app=>{
    app.use(koaBody({
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
          text: ['text/xml', 'application/xml']
        }
      }))
}

export const jwt = app=>{
    app.use(koajwt({
        secret:'wechat_min_token'
    }).unless({
        path: [
            /^\/swagger-html/,
            /^\/swagger-json/,
            /^\/api\/token\/login/,
            /^\/api\/wechat\//,
            /^\/favicon.ico/,
            /^\/makeApi\//,
            /^\/static\//
            ]
    }));
}

export const  verifyToken = app =>{
    app.use(async(ctx,next)=>{
        const token =ctx.header.authorization
        if(token){
            const minjwt = token.split(' ')[1]
            console.log('jwt'+minjwt);
            let decoded = await verify(minjwt,'wechat_min_token');
            ctx.user = {
                openid:decoded.openid,
                session_key:decoded.session_key
            }
        }
        await next()

    })
}

export const logger =app=>{
    app.use(koalogger())
}

export const catchErrorMiddleware = app =>{
    app.use(catchError)
}




