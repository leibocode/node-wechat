'use strict'

module.exports={
	'button':[{
		'type':'click',
		'name':'点击事件',
		'key':'menu_click'
	},{
		'name':'扫码菜单',
		'sub_button':[{
			'name':'搜电影',
			'type':'view',
			'url':'http://183828tz49.iask.in/movie'
		},{
			'name':'扫码推送事件',
			'type':'scancode_push',
			'key':'scancode'
		},{
			'name':'扫码等待事件',
			'type':'scancode_waitmsg',
			'key':'scancode_wait'
		}]
	},{
		'name':"发图菜单",
		'sub_button':[{
			"type": "pic_sysphoto", 
            "name": "系统拍照发图", 
            "key": "rselfmenu_1_0"
		},{
			"type": "pic_photo_or_album", 
            "name": "拍照或者相册发图", 
            "key": "rselfmenu_1_1"
		},{
			 "type": "pic_weixin", 
            "name": "微信相册发图", 
            "key": "rselfmenu_1_2"
		},{
		 "name":"发送位置", 
        "type":"location_select", 
        "key":"rselfmenu_2_0"
    	}]
    	
	}]
}