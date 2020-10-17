import Koa from 'koa'
const { resolve } =require('path')
const views = require('koa-views')
const path = require('path')
const cors = require('koa-cors')

const r =path=>resolve(__dirname,path)
const host =process.env.HOST || '127.0.0.1'
const port =process.env.PORT || 3000

// import { database } from './middleware/database'
import { router } from './middleware/router'
import catchError from './middleware/errorHandler'
import { addBody, jwt,logger, auth,verifyToken,catchErrorMiddleware } from './middleware/commcon'
import { request } from 'koa-swagger-decorator'
class Server {
    constructor(){
        this.app =new Koa()
        this.useMiddleWares(this.app)
    }
    useMiddleWares(app){
       
        //注册中间件
       catchErrorMiddleware(app)
       addBody(app)
       app.use(cors())

       app.use(views(path.join(__dirname, './views'), {
        extension: 'ejs'
      }))
       //verifyToken(app)
       logger(app)

       //jwt(app)
       router(app)
       
       
    }

    async start(){
        console.log(new Date())
        this.app.listen(port,host)
        console.log('Server listening on ' + host + ':' + port)
    }
}

const app =new Server()

app.start()