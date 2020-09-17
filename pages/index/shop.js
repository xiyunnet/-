var app = getApp()
var fun = require('../fun.js');

Page({
  data: {
    nav:{top:app.globalData.nav_top,icon:'icon-home1',text:'首页',title:'海宁严选',ac:'go',url:'',is_select:1},nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'餐厅介绍'
  },


  onLoad: function (op) {
var user_id=app.globalData.user_id;
var session=app.globalData.session;
var id=op.id;
console.log(id);
if((!user_id || !session) && !id){this.setData({login_show:'show'});
console.log('登录'+id);
}else{
this.setData({user_id:user_id})
}


if(!id){
var shop=app.globalData.shop;
if(shop){id=shop.id;
  this.setData({shop_id:id})
}
}else{this.setData({shop_id:id})}

if(!id){this.setData({creat_shop:1})}

  },

  
  onReady: function () {
    this.load();
  },

 
  onShow: function () {
var request_data=app.globalData.request_data;
//console.log(request_data);
var request_c=app.globalData.request_c;
var shop=this.data.shop;
//if(!shop['img']){shop['img']=[]}
if(request_c && request_data){
  console.log(request_data)
switch(request_c){
case 'shop':
shop['img']=request_data.img;
break;
case 'shop_logo':
  shop['logo']=request_data.img;
break;


}
this.setData({shop:shop})
app.globalData.request_data='';
app.globalData.request_c='';
  }

  },
  go_edit:function(e){
var c=e.currentTarget.dataset.c;
var shop=this.data.shop;
if(!shop || !c){return;}

var msg_title='修改';
var msg_text=shop[[c]];
this.setData({val_show:'show',win_title:msg_title,win_msg:msg_text,edit_c:c})




  },win_close:function(e){
var c=e.currentTarget.dataset.c;
this.setData({[c]:'hide',win_msg:''})


  },val_change:function(e){
var val=e.detail.value;
console.log(val)
this.setData({win_msg:val});

  },go_submit:function(e){
  var shop=this.data.shop;
  var c=this.data.edit_c;
  var val=this.data.win_msg;
var that=this;
console.log(c+' xxxx '+val);
  wx.request({
    url: app.globalData.server,
    data:{ac:'shop_change',user_id:app.globalData.user_id,session:app.globalData.session,
  c:c,val:val,id:shop.id
  },success(res){
if(!res.data){return;}
console.log(res.data)
if(res.data.err!='ok'){
if(res.data.err=='用的登录失败'){this.setData({login_show:'show'});return;}
app.err(res.data.err);return;
}

shop[[c]]=val;
that.setData({shop:shop,val_show:'hide'})

  }
  })

  },

  login: function (e) {
    var c = e.currentTarget.dataset.c;
    if(c=='close'){this.setData({login_show:'hide'});return;}
    fun.go_login().then(res => {
      if (res == 'ok') {
        app.msg('登录成功');
        this.load();
        this.setData({ login_show: 'hide',creat_shop:0 });
      }
    });

  },


  load: function () {
var id=this.data.shop_id;
if(!id){id='';}var that=this;
var user_id=app.globalData.user_id;
if(!user_id || !id){return;}
console.log('数据'+id);
wx.request({
  url: app.globalData.server,
  data:{
    ac:'get_ct',id:id,user_id:app.globalData.user_id,session:app.globalData.session
  },success(res){
if(!res){return;} 
console.log(res.data);
if(!res.data){return;}
if(res.data.err!='ok'){
  if(res.data.err=='用户登录失败'){//that.setData({login_show:'show'});
}
  if(res.data.err=='没有找到餐厅' ){
    if(user_id){that.setData({creat_shop:1});}
    app.err(res.data.err);return;

  }
  
}

app.globalData.shop=res.data;
that.setData({shop:res.data});

  }
})



},


  menu: function (e) {
  

  },


  menu_close: function () {
this.setData({menu_show:''})
  },
  menu_show: function () {console.log('显示菜单');
    this.setData({menu_show:'show'})
      },

      back: function () {
wx.navigateBack({
  delta: 0,
})
  },creat_new:function(){
    console.log('创建餐厅');
var user_id=app.globalData.user_id;
var session=app.globalData.session;
var that=this;
if(user_id && session){
wx.request({
  url: app.globalData.server,
  data:{ac:'creat_ct',user_id:user_id,session:session},success(res){
  if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){
if(res.data.err=='用户登录失败'){that.setData({login_show:'show'});return;}
app.err(res.data.err);return;
}
app.msg('创建成功');
that.setData({shop:res.data.shop,creat_shop:0})

}
})

}else{
  this.setData({login_show:'show'});return;
}

  
  },go:function(e){
var url=e.currentTarget.dataset.url;
console.log(url);
wx.navigateTo({
  url: url,
})

  },review:function(e){
var c=e.currentTarget.dataset.c;
if(!c){c=1}else{c=0};
this.setData({review:c})

  }
})