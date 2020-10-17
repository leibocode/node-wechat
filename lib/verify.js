const jsonwebtoken =require('jsonwebtoken')

export  const verify = (...args)=>{
    return new Promise((resolve,reject)=>{
        jsonwebtoken.verify(...args,(err,decoded)=>{
            err? reject(err):resolve(decoded)
        })
    })
}