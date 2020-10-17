import { ErrModel } from '../lib/http-errors'

const format = (err,ctx)=>{
    ctx.response.status =err.statusCode
    ctx.response.body = {
        code:err.statusCode,
        msg: err.message || err.msg,
        request:ctx.method + ' >> ' + ctx.url
    }
}

export default async function catchError(ctx,next){
    try {
        await next()
    }catch(err){
        console.log(err)
      if (err.flag === 'ErrorModel') {
        format(err, ctx)
      } else {
        console.log(err)
        format(new ErrModel(), ctx)
      }
    }
}