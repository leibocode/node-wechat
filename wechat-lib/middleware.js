import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './utils'

export default function(opts,reply){
    return async function wechatMiddle(ctx,next){
        const token = opts.token
        console.log(ctx.request.query)
        const {
            signature,
            nonce,
            timestamp,
            echostr
          } = ctx.request.query
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        if(ctx.method==='GET'){
            if(sha===signature){
                ctx.body = echostr
            }else {
                ctx.body = 'Failed'

            }
        }else if(ctx.method === 'POST'){
            if(sha !==signature){

                ctx.body = 'Failed'
                return false
            }
            // console.log(ctx.request)
            console.log(ctx.request.body)
            // const data = await getRawBody(ctx.req,{
            //     length: ctx.length,
            //     limit: '1mb',
            //     encoding: ctx.charset
            // })

            const content = await util.parseXML(ctx.request.body)
            const message = util.formatMessage(content.xml)

            
            ctx.weixin = message

            await reply.apply(ctx, [ctx, next])

            const replyBody = ctx.body
            const msg = ctx.weixin
            const xml = util.tpl(replyBody, msg)
      
            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    
    }
}