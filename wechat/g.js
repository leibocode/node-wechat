'user strict'

var sha1 = require('sha1');
var getRwaBody = require('raw-body');
var wx= require('./reply.js');
var Wechat =require("./wechat.js");
var util = require('./util');


module.exports = function(opts, handler){
  var wechat = new Wechat(opts)

  return function *(next){
    var that = this
    var token = opts.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)
    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + ''
      }
      else{
        this.body = 'wrong'
      }
    }
    else if(this.method === 'POST'){
      if (sha !== signature) {
        this.body = 'wrong'
        return false
      }
      var data = yield getRwaBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      })


      var content = yield util.parseXMLAsync(data);
     var message = util.formatMessage(content.xml);
      this.weixin = message
      yield   wx.reply.call(this,next)
       wechat.reply.call(this)
    }
  }
}
