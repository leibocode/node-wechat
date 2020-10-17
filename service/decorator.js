/**
 * es7装饰器
 */
import Router from 'koa-router'
import { resolve } from 'path'
import glob from 'glob'
import { SwaggerRouter } from 'koa-swagger-decorator'
const _ = require('lodash')

export let routerMap = new Map()
export const symbolPrefix = Symbol('prefix')
export const isArray = v=>_.isArray(v)?v:[v]
export const normalizePath = path=>path.startsWith('/')?path:`/${path}`


export default class Route {
    constructor(app,apiPath){
        this.app = app,
        this.router = new SwaggerRouter()
        this.apiPath = apiPath
    }
    
    init(){
        glob.sync(resolve(this.apiPath,'./*.js')).forEach(require)

        for(let [conf,controller] of routerMap) {
            const controllers = isArray(controller)

            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
      
            const routerPath = prefixPath + conf.path
      
            this.router[conf.method](routerPath, ...controllers)
        }
    
      
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
        this.router.swagger({
            title:'API文档',
            description:'API DOC',
            version:'1.0.0',
            swaggerHtmlEndpoint: '/swagger-html',
            swaggerJsonEndpoint: '/swagger-json',

            swaggerOptions: {
                securityDefinitions: {
                    ApiKeyAuth: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'authorization'
                      }
                }
            }
        })
        this.router.mapDir(this.apiPath,{
           // doValidation: false,
        })
    }
}

export const router  = conf =>(target,key,desc)=>{
    conf.path = normalizePath(conf.path)

    routerMap.set({
        target:target,
        ...conf
    },target[key])
}

export const controller = path=>target=>target.prototype[symbolPrefix] = path

export const get = path=> router({
    method:'get',
    path:path
})

export const post = path=> router({
    method:'post',
    path:path
})

export const put = path => router({
    method:'put',
    path:path
})

export const del = path => router({
    method: 'del',
    path: path
})


const decorate = (args, middleware) => {
    let [ target, key, descriptor ] = args
  
    target[key] = isArray(target[key])
    target[key].unshift(middleware)
  
    return descriptor
}

export const convert = middleware => (...args) => decorate(args, middleware)
