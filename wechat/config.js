'use strict'
var path =require("path");
var util =require(".././libs/util");
var wechat_file =path.join(__dirname,'.././config/wechat.txt');
var wechat_ticket_file =path.join(__dirname,'.././config/wechat_ticket.txt');
var config ={
       wechat:{
       	appID:"wx3a57f2507f0c2482",
       	appSecret:"58561e89ee8e914c502ee6ca1d8de2bd",
       	token:"ceshiwexin",
             getAccessToken:function(){
             	return util.readFileAsync(wechat_file)
             },
             saveAccessToken:function(data){
             	data = JSON.stringify(data)
	return util.writeFileAsync(wechat_file, data)
             },
             getTicket: function(){
		return util.readFileAsync(wechat_ticket_file)
	},
	saveTicket: function(data){
		data = JSON.stringify(data)
		return util.writeFileAsync(wechat_ticket_file, data)
	}
       }
}

module.exports =config