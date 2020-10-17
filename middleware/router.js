import Router from '../service/decorator' 
import { resolve } from 'path'


const r = path => resolve(__dirname,path)

export const router = app => {
    const apiPath = r('../controller')
    const routerNext = new Router(app,apiPath)

    routerNext.init()
}