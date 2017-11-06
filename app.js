'use strict'

var Koa = require('koa')
var path = require('path')
var wechat = require('./wechat/g')
var util = require('./libs/util')
var config = require('./wechat/config')
var reply = require('./wechat/reply')
var Wechat = require('./wechat/wechat')

var app =Koa();
var ejs =require("ejs");
var crypto =require("crypto");
var heredoc =require("heredoc");
var tpl =heredoc(function(){/*
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head> 
            <title>语音搜电影</title>
           <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">      
          <title>语音搜电影</title> 
            <style>
             .button{   text-align: center;
                height: 2em;
                line-height: 2em;
                color: white;
                border-radius: 10px;
            }

            .blue, .blue:visited {
                background-color: #2981e4;
            }

            .blue:hover {
                background-color: #2575cf;
            }
 
         </style>          
  </head>
  <body>
         <div class="button blue">点我开始录音，再次点击结束录音</div>
         <p id="title"></p>
          <div id="poster"></div>
          <p id="year"></p>
           <p id="director"></p>
         <script src="http://zeptojs.com/zepto.min.js"></script>
         <script src="http://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>
         <script>
                 wx.config({
                       debug:false,
                       appId:'wx3a57f2507f0c2482',
                       timestamp:'<%=timestamp%>',
                       nonceStr:'<%=noncestr%>',
                       signature:'<%=signature%>',
                       jsApiList:[
                      ' onMenuShareTimeline',
                      ' onMenuShareAppMessage',
                      ' onMenuShareQQ',
                     ' onMenuShareWeibo',
                      'onMenuShareQZone',
                      'startRecord',
                      'stopRecord',
                      'onVoiceRecordEnd',
                      'translateVoice'
                       ]//必填，需要使用的JS接口列表
                 });

                 wx.ready(function(){
                       //config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.checkJsApi({
                                      jsApiList:['onVoiceRecordEnd','translateVoice','startRecord','stopRecord'],
                                success:function(res){
                                         console.log(res);
                                }
                        });
                        var ShareContent ={
                          title:'搜电影' , // 分享标题
                         desc: '我搜出来来了....' ,// 分享描述
                         link: 'https://www.baidu.com', // 分享链接
                         imgUrl: 'http://image.so.com/v?q=斗图&cmsid=f3582393e8c0437a2206bc7880cfe8b2&cmran=0&cmras=0&i=0&cmg=f3c9c59bd0492e77f789994bd914cf0d&src=360pic_strong&z=1#q=%E6%96%97%E5%9B%BE&i=0&src=360pic_strong&z=1&lightboxindex=0&id=56407a8a06e73cab67292f6392629d7b&multiple=0&itemindex=0&dataindex=0&prevsn=0&currsn=0&jdx=0', // 分享图标
                          success: function () { 
                              window.alert('分享成功');
                         },
                         cancel: function () { 
                          winodw.alert('分享失败');
                          }
                        };
                        wx.onMenuShareQZone(ShareContent);
                        var isRecording =false;
                         $(".button").on("click", function() {
                        if (!isRecording) {
                            wx.startRecord({
                                cancel: () => {
                                    alert("你妹的，不就是录个音嘛，小气！");
                                }
                            });
                        } else {
                            wx.stopRecord({
                                success: function(res){
                                    var  localId = res.localId;
                                    wx.translateVoice({
                                        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                        isShowProgressTips: 1, // 默认为1，显示进度提示
                                        success: function (res) {
                                            $.ajax({
                                                type: "get",
                                                url: `https://api.douban.com/v2/movie/search?q=${res.translateResult}`,
                                                dataType: "jsonp",
                                                jsonp: "callback",
                                                success: function(data) {
                                                      var subject=data.subjects[0];
                                                      $('#title').html(subject.title);
                                                      $('#poster').html('<img src="'+subject.images.large +'"/>');
                                                      $('#year').html(subject.year);
                                                      $('#director').html(subject.directors[0].name)
                                                    //分享
                                                      ShareContent ={
                                                               title:subject.title,//分享标题
                                                               desc:'我搜出来了'+subject.title,//分享描述
                                                                link:'https://www.baidu.com',//分享链接
                                                                imgUrl:subject.images.large,//分享图标
                                                                success:function(){
                                                                     window.alert('分享成功');
                                                                },
                                                                cancel:function(){
                                                                    window.alert('分享失败');
                                                                }
                                                      };

                                                }
                                            });
                                        },
                                        fail: function(){
                                            alert("不好意思，您所说的我没有听懂，请您再试一次！");
                                        }
                                    });
                                },
                                fail: function() {
                                    alert("录制失败");
                                }
                        });
                    }
                    isRecording = !isRecording;
                   });
            });

         </script>
  </body>
  </html>
*/});
var createNonce =function(){
         return Math.random().toString(36).substr(2,15);
}
var createTimestamp =function(){
	return parseInt(new Date().getTime()/1000,10)+'';
}
  
function _sign(noncestr,ticket,timestamp,url){
	var params=[
		'noncestr='+noncestr,
		'jsapi_ticket='+ticket,
		'timestamp='+timestamp,
		'url='+url
	];
	var str=params.sort().join('&');
	var shasum=crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex')
}
function sign(ticket,url){
	var noncestr=createNonce();
	var timestamp=createTimestamp();
	var signature=_sign(noncestr,ticket,timestamp,url)
	console.log(url)
	return {
		noncestr:noncestr,
		timestamp:timestamp,
		signature:signature
	}
}

app.use(function* (next){
	if(this.url.indexOf('/movie')>-1){
		var wechatApi=new Wechat(config.wechat);
		var data=yield wechatApi.fetchAccessToken();
		var access_token=data.access_token;
		var ticketData=yield wechatApi.fetchTicket(access_token);
		var ticket=ticketData.ticket;
		var url=this.href;
		var params=sign(ticket,url); 
		this.body=ejs.render(tpl,params)
		return next
	}
	yield next
})

app.use(wechat(config.wechat))
app.listen(3000);
console.log("服务器启动的成功,端口号:3000");