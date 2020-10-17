const { errorMonitor } = require("koa")

class ErrModel  {
    constructor(code=500,message='未知服务器错误',statusCode=500,status=-1){
        this.code = code
        this.message = message 
        this.statusCode = statusCode
        this.status = status
    }

    throwError(ctx){
        ctx.throw(this.statusCode,this.msg,{
             code:this.code,
             flag:"ErrorModel",
             status:this.status
        })
    }
}

class ParamterError extends ErrModel {
    constructor(code,message='请求错误'){
        super(code,message,400)
    }
}

class AuthError extends ErrModel {
    constructor(code,message='token认证失败'){
        super(code,message,401)
    }
}

class NotFoundError extends ErrModel {
    constructor(code,message='未找到该api'){
        super(code,message,404)
    }
}

class InternalService extends ErrModel {
    constructor(code, message = "服务器内部错误"){
        super(code,message,500)
    }
}


export {
    ErrModel,
    AuthError,
    ParamterError,
    InternalService,
    NotFoundError
}

