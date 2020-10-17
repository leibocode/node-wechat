import { ParamterError,AuthError,NotFoundError,InternalService } from './http-errors'

class SuccessModel {
    constructor(code,msg,data,status){

        this.code = code || 200
        this.message = msg || "操作成功!"
        this.data = data?data:[]
        this.status = status || -1
    }
    
    success(ctx){
        ctx.body = this
    }
}

//200
const SUCCESS = async(ctx,data,msg)=>{
    new SuccessModel(200,msg,data,1).success(ctx)
}

//401

const TOKEN_ERROR = async(msg,ctx)=>{
    new AuthError(401,msg).throwError(ctx)
}

//500

const FLAT  = async(ctx,msg)=>{
    new InternalService(500,msg).throwError(ctx)
}

const  ParamterErrorFLAT  = async(ctx,msg)=>{
    new ParamterError(400,msg).throwError(ctx)
}

export {
    SUCCESS,
    TOKEN_ERROR,
    FLAT,
    ParamterErrorFLAT
}

