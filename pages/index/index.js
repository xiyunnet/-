var app = getApp()
var fun = require('../fun.js');

Page({
  data: {
    nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'羲云智慧点餐',select_c:0,main_scroll:false,main_top:100,is_select_c:0
    
  },


  onLoad: function (op) {
var user_id=app.globalData.user_id;

if(!user_id){this.setData({login_show:'show'})}
var id=op.id;if(!id){id=2;}


if (op.scene) {
  //扫描小程序码进入 -- 解析携带参数
  var scene = decodeURIComponent(op.scene);
  console.log("scene is ", scene);
  var arrPara = scene.split("&");
  console.log(arrPara)
  var arr = [];
  for (var i in arrPara) {
    arr = arrPara[i].split("=");

    if (arr[0] == 'f') { app.globalData.from_id = arr[1]; }//from_id
    if (arr[0] == 'id') { id = arr[1]; app.globalData.from='scan';}//from_id
   
  }
}
if(id){this.setData({id:id})}

app.globalData.is_change=1;
  },

  onShow: function () {
    var is_change=app.globalData.is_change;
    if(is_change){this.load();}
    
  },


  login: function (e) {
    var c = e.currentTarget.dataset.c;
    if(c=='close'){this.setData({login_show:'hide'});return;}
    fun.go_login().then(res => {
      if (res == 'ok') {
        app.msg('登录成功');
        this.load();
        this.setData({ login_show: 'hide' });
      }
    });

  },


  load: function () {
var that=this;var id=this.data.id;if(!id){id='';}

wx.request({
  url: app.globalData.server,
  data:{ac:'get_list',user_id:app.globalData.user_id,session:app.globalData.session,id:id},success(res){

if(res.data.err!='ok'){
  if(res.data.err=='no_login'){
    that.setData({login_show:'show'});
  }else{
app.err(res,data.err);return;}
}

//获取订单
var shop=res.data;console.log(shop);
app.globalData.is_change=0;

var d = wx.getStorageSync('my_cart'+shop.ct.id);
if(d){
  var cart= JSON.parse(d);
  console.log('订单获取成功');
  console.log(cart);
  if(typeof cart!='object'){return;}
that.setData({cart:cart,shop:shop,menu_title:shop.ct.shot_name?shop.ct.shot_name:shop.ct.name},function(){
that.cart_edit('')

})

return;


}else{
that.setData({shop:shop});
app.globalData.shop=shop;

}



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

  onShareAppMessage: function () {
    wx.showShareMenu({ withShareTicket: true })
    var shop=this.data.shop;
    var user_id=app.globalData.user_id;if(!user_id){user_id='';}
    var url='/pages/index/index?id='+shop.ct.id+'&u='+user_id;

    return {
      title: shop.ct.name,
      path: url,
      imageUrl: shop.ct.img[0],

    }
  },win_close:function(e){
    var c=e.currentTarget.dataset.c;
    this.setData({[c]:'hide'})
  },
  show_select_win:function(){
    var select_win_show=this.data.select_win_show;
    if(select_win_show=='show'){select_win_show='hide'}else{select_win_show='show'}
    this.setData({select_win_show:select_win_show})
  },
  open_style:function(e){
    var shop=this.data.shop;
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    var inn=e.currentTarget.dataset.in;
console.log(index+' '+inn);
    var cy=shop.cc[[index]].val[inn];console.log(cy);
    var style_temp={};//缓存的
    var style_price=0;//价格
    if(cy.style && cy.style_list){
for(var i in cy.style_list){
for(var j in cy.style_list[i]){
if(j==0){
  console.log(cy.style_list[i][j].title);
  //选择最前几个
 var price=parseFloat(cy.style_list[i][j].price);
 style_price+=price;
 style_temp[[i]]=cy.style_list[i][j].title;
 if(!style_temp['info']){style_temp['info']=cy.style_list[i][j].title;}else{
  style_temp['info']+='/'+cy.style_list[i][j].title;
 }
}

}}
style_temp['num']=1;
//查找是否存在
var shop=this.data.shop;
var cart=shop.cc[index].val[[inn]]['style_cart'];
if(cart && cart[[style_temp['info']]]){
  style_temp['num']=parseInt(cart[[style_temp['info']]].num);

}
style_temp['add_price']=style_price;
style_temp['price']=parseFloat(cy.price)+style_price;
style_temp['total']=style_temp['price']*style_temp['num'];
console.log(style_temp);

this.setData({style_win_show:'show',cy:cy,cy_index:index,cy_inn:inn,style_temp:style_temp})
    }


  },
  style_select:function(e){
var index=e.currentTarget.dataset.index;
var c=e.currentTarget.dataset.c;

var cy_index=this.data.cy_index;
var cy_inn=this.data.cy_inn;
//console.log(c+' '+index+' '+cy_index+' '+cy_inn);
var cy=this.data.cy;
console.log(cy.style_list[[c]]);
var style_temp=this.data.style_temp;var price=0;
if(!style_temp){style_temp={}}else{
var cc=style_temp[[c]];
for(var i in cy.style_list[[c]]){
  if(cy.style_list[[c]][i].title==cc){
    price=price-parseFloat(cy.style_list[[c]][i].price);//价格差
  }
}

}

style_temp[[c]]=cy.style_list[[c]][index].title;
var info='';//console.log('info'+info)
for(var i in style_temp){//创建标题
if(i=='num' || i=='total' || i=='info' || i=='price' || i=='add_price'){}else{
if(!info){info=style_temp[i]}else{
  info+='/'+style_temp[i]
}
}

}

style_temp['info']=info;
console.log(info);

//需要对该菜肴已有订单进行分析数量
style_temp['num']=1;
var shop=this.data.shop;
var cart=shop.cc[cy_index].val[[cy_inn]]['style_cart'];
if(cart && cart[[style_temp['info']]]){
  style_temp['num']=parseInt(cart[[style_temp['info']]].num);

}

style_temp['add_price']+=parseFloat(cy.style_list[[c]][index].price);
style_temp['price']=parseFloat(style_temp['price'])+price+parseFloat(cy.style_list[[c]][index].price);
style_temp['total']=style_temp['price']*style_temp['num'];

this.setData({style_temp:style_temp});

  },style_select_ok:function(e){
    var cy_index=this.data.cy_index;
    var cy_inn=this.data.cy_inn;
    console.log(cy_index+' '+cy_inn);
    var cy=this.data.cy;var shop=this.data.shop;
    var c_num=shop.cc[[cy_index]]['num'];if(!c_num){c_num=0;}//分类数量
var style_temp=this.data.style_temp;
if(!style_temp || !shop){app.err('数据错误');return;}
var cart_num=parseInt(this.data.cart_num);if(!cart_num){cart_num=0;}
var total_price=parseFloat(this.data.total_price);if(!total_price){total_price=0;}
//查找订单
var style_cart=shop.cc[cy_index].val[[cy_inn]].style_cart;
var is_buy=parseInt(shop.cc[cy_index].val[[cy_inn]].is_buy);if(!is_buy){is_buy=0;}//订单中的

if(!style_cart){style_cart={}
style_cart[[style_temp.info]]=style_temp;
cart_num+=style_temp.num;
total_price+=style_temp.total;
is_buy+=style_temp.num;
c_num+=style_temp.num;
//找到订单
}else{//如果有订单，则添加订单
if(style_cart[[style_temp.info]]){
console.log('找到一样的');
cart_num-=style_cart[[style_temp.info]].num;
is_buy-=style_cart[[style_temp.info]].num;
c_num-=style_cart[[style_temp.info]].num;
total_price-=parseFloat(style_cart[[style_temp.info]].total);
}
is_buy+=style_temp.num;c_num+=style_temp.num;
style_cart[[style_temp.info]]=style_temp;
cart_num+=style_temp.num;
total_price+=style_temp.total;
}

if(c_num<=0){c_num=0;}//分类数量
shop.cc[[cy_index]]['num']=c_num;

shop.cc[cy_index].val[[cy_inn]]['style_cart']=style_cart;
shop.cc[cy_index].val[[cy_inn]]['is_buy']=is_buy;
console.log(shop.cc[cy_index].val[[cy_inn]]['style_cart']);
total_price=total_price.toFixed(2);
this.setData({shop:shop,cart_num:cart_num,total_price:total_price,style_win_show:'hide'})
//订单处理和缓存
var my_cart=this.data.cart;if(!my_cart){my_cart={}}
my_cart[[cy.id]]={is_buy:is_buy,style_cart:style_cart}

console.log(JSON.stringify(my_cart));
this.setData({cart:my_cart})
try {
  wx.setStorageSync('my_cart'+shop.ct.id, JSON.stringify(my_cart))
} catch (e) { }
app.globalData.shop=shop;

},style_add:function(e){//增加，减少数量
var c=e.currentTarget.dataset.c;
var style_temp=this.data.style_temp;
if(!style_temp){return;}
if(c=='add'){
  style_temp['num']++;
  style_temp['total']=parseFloat(style_temp['price'])*parseInt(style_temp['num']);
}else{
  style_temp['num']--;
if(style_temp['num']<=0){//将删除该订单的
  var cy_index=this.data.cy_index;
  var cy_inn=this.data.cy_inn;
  var shop=this.data.shop;
  if(shop.cc[[cy_index]].val[cy_inn]['style_cart'][[style_temp.info]]){
var num=parseInt(shop.cc[[cy_index]].val[cy_inn]['style_cart'][[style_temp.info]].num);
var total=parseFloat(shop.cc[[cy_index]].val[cy_inn]['style_cart'][[style_temp.info]].total);
}else{
  var num=0;var total=0;
}
var cart_num=this.data.cart_num;
var total_price=this.data.total_price;
cart_num-=num;
total_price-=total;
delete shop.cc[[cy_index]].val[cy_inn]['style_cart'][[style_temp.info]];
shop.cc[[cy_index]].val[cy_inn]['is_buy']-=num;
total_price=total_price.toFixed(2);

//分类数量修改
var c_num=shop.cc[[cy_index]]['num'];if(!c_num){c_num=0;}
c_num-=num;if(c_num<=0){c_num=0;}
shop.cc[[cy_index]]['num']=c_num;

this.setData({shop:shop,cart_num:cart_num,total_price:total_price})
app.globalData.shop=shop;
//以上为如果选择为0 时，删除订单
  //console.log(shop.cc[[cy_index]].val[cy_inn]);
  //console.log(style_temp.info);
//缓存
var cart=this.data.cart;
delete cart[[shop.cc[[cy_index]].val[cy_inn].id]][style_temp.info];
cart[[shop.cc[[cy_index]].val[cy_inn].id]]['is_buy']-=num;
console.log(cart);
try {
  wx.setStorageSync('my_cart'+shop.ct.id, JSON.stringify(cart))
} catch (e) { }

this.setData({cart:cart})
  style_temp['num']=0;
}
style_temp['total']=parseFloat(style_temp['price'])*parseInt(style_temp['num']);
}

this.setData({style_temp:style_temp})
  },

  cart_edit:function(e){//修改订单中的数据
    if(e){
    var id=e.currentTarget.dataset.id;
    var c=e.currentTarget.dataset.c;
    var info=e.currentTarget.dataset.info;
    console.log(id+' '+c+' '+info);
  }else{
  var id='';var info='';var c='';
  }
var cart=this.data.cart;
console.log(cart);

if(id){
if(info){
if(c=='add'){
  cart[id]['style_cart'][info]['num']++;
  cart[id]['is_buy']++;
}else{
  cart[id]['style_cart'][info]['num']--;
  cart[id]['is_buy']--;
if(cart[id]['style_cart'][info]['num']<=0){cart[id]['style_cart'][info]['num']=0;}
if(cart[id]['is_buy']<=0){cart[id]['is_buy']=0;}
}

}else{
if(c=='add'){cart[id]['is_buy']++;}else{
  cart[id]['is_buy']--;
  if(cart[id]['is_buy']<=0){cart[id]['is_buy']=0;}
}

}}

//对数据进行处理和缓存
var shop=this.data.shop;
var num=0;var total=0;
for(var i in shop.cc){var c_num=0;
for(var j in shop.cc[i].val){
var id=shop.cc[i].val[j].id;
var cc=cart[[id]];
if(typeof cc=='object'){

if(cc.is_buy==0){//如果没有购买
delete cart[id];
shop.cc[i].val[j]['is_buy']=0;

}else{//已经购买的
  var n=0;
if(typeof cc.style_cart=='object'){//存在分类
for(var x in cc.style_cart){
  if(cc.style_cart[x].num==0){
  delete cart[id]['style_cart'][x];
  }else{
n+=cc.style_cart[x].num;
total+=parseFloat(cc.style_cart[x].price)*parseInt(cc.style_cart[x].num);}
}
shop.cc[i].val[j]['style_cart']=cc.style_cart;
num+=n;
shop.cc[i].val[j]['is_buy']=n;
cart[[id]]['is_buy']=n;
c_num+=n;
}else{
shop.cc[i].val[j]['is_buy']=cart[id].is_buy;
num+=cart[id].is_buy;
total+=parseFloat(shop.cc[i].val[j].price)*parseInt(cart[id].is_buy);
c_num+=cart[id].is_buy;
}


}

}else{
 console.log('没有');
  delete cart[id];
  shop.cc[i].val[j]['is_buy']=0;
  delete shop.cc[i].val[j]['style_cart'];
}


}
shop.cc[i]['num']=c_num;
}

//console.log(cart);

//保存
if(!total){total=0;}
total=fun.number_fromat(total,2);
this.setData({shop:shop,cart_num:num,total_price:total,cart:cart});
app.globalData.shop=shop;
try {
  wx.setStorageSync('my_cart'+shop.ct.id, JSON.stringify(cart))
} catch (e) { }


  },

clean_cart:function(e){
  var that=this;
 wx.showModal({
title: '提示',
content: '是否清除购物车？',
success (res) {
if (res.confirm) {
 
that.setData({cart:{},select_win_show:'hide'},function(){
  that.cart_edit(e);
})
  
}
}
})
},
  
  add_cart:function(e){
var shop=this.data.shop;
var id=e.currentTarget.dataset.id;
var index=e.currentTarget.dataset.index;
var inn=e.currentTarget.dataset.in;
//if(!index){index='其他菜肴'}
var c=e.currentTarget.dataset.c;if(!c){c='add'}
var cart_num=parseInt(this.data.cart_num);
if(!cart_num){cart_num=0;}

var total_price=parseFloat(this.data.total_price);
if(!total_price){total_price=0;}
//console.log(index+' '+inn);
var price=parseFloat(shop.cc[[index]].val[[inn]].price);

console.log(index+' '+inn+' '+price+' '+total_price)
var is_select=parseInt(shop.cc[[index]].val[[inn]].is_select);

var is_buy=parseInt(shop.cc[[index]].val[[inn]].is_buy);
if(!is_buy){is_buy=0;}
var c_num=shop.cc[[index]].num;if(!c_num){c_num=0;}

if(c=='add'){//增加数据
  is_buy++;
  cart_num++;c_num++;
  total_price=total_price+price;
}else{//减少
if(is_buy<1){is_buy=0;}else{is_buy--;cart_num--;
  total_price=total_price-price;
  c_num--;
  console.log('减少');
}
}
console.log(is_buy);
if(!c_num || c_num<=0){c_num=0;}
shop.cc[[index]]['num']=c_num;
shop.cc[[index]].val[[inn]].is_buy=is_buy;


if(cart_num<1){cart_num=0;total_price=0;}
if(total_price<0){total_price=0;}

total_price=fun.number_fromat(total_price,2);
console.log('金额'+total_price);

//total_price=total_price.toFixed(2);
this.setData({shop:shop,cart_num:cart_num,total_price:total_price})
//缓存到后台
var my_cart=this.data.cart;if(!my_cart){my_cart={}}
my_cart[[shop.cc[[index]].val[[inn]].id]]={is_buy:is_buy}
console.log(my_cart);
try {
  wx.setStorageSync('my_cart'+shop.ct.id, JSON.stringify(my_cart))
} catch (e) { }
app.globalData.shop=shop;
  },change_c:function(e){
  var c=e.currentTarget.dataset.c;
  this.setData({main_scroll:true});
  var scroll_top=this.data.scroll_top;
  var main_top=parseInt(this.data.main_top)
  if(scroll_top>=main_top || scroll_top==0){var main_scroll=true;}else{
  var main_scroll=false;
  }
  this.setData({select_c:c,main_scroll:main_scroll});
  //var that=this;
  //setTimeout(function(){that.setData({is_select_c:c})},600);
  },onPageScroll:function(e){
console.log(e);
var main_top=parseInt(this.data.main_top)
if(e.scrollTop>=main_top){
  console.log('开始滚动');
  this.setData({main_scroll:true,scroll_top:e.scrollTop});
  //wx.pageScrollTo({
    //scrollTop	: main_top,duration:0
  //})
}else{
  this.setData({main_scroll:false})
}

  },page_scroll:function(e){
 
//console.log(e.detail);
var s_top=e.detail.scrollTop;
var shop=this.data.shop;
var s=this.data.is_select_c;
for(var i in shop.cc){
  //console.log(shop.cc[i].top);
if(shop.cc[i].top>=s_top){

this.setData({is_select_c:i})
break;

}

}

  },go:function(e){
var url=e.currentTarget.dataset.url;
wx.navigateTo({
  url: url,
})

  }
})