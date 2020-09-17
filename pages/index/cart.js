var app = getApp()
var fun = require('../fun.js');
Page({

  data: {
    nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'我的订单',tap_select:'l',submit:1
    
  },


  onLoad: function (op) {
    var user_id=app.globalData.user_id;
    if(!user_id){this.setData({login_show:'show'})}
var shop=app.globalData.shop;
if(!shop){app.err('数据错误');return;}else{
  this.setData({shop:shop})
}

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

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.load();
    var shop=this.data.shop;
var select_order=app.globalData.select_order;
var buy_again=app.globalData.buy_again;
if(buy_again==1 && select_order){
  this.format_cart(select_order);
  app.globalData.buy_again=0;
  return;
}


    var d = wx.getStorageSync('my_cart'+shop.ct.id);
    if(d){
      var cart= JSON.parse(d);
      if(typeof cart!='object'){return;}
      this.format_cart(cart)
    }else{app.msg('抱歉，您没有订单，请先下单');}
  },


  select_tap: function (e) {
var c=e.currentTarget.dataset.c;
if(c!='r'){c='l';}
console.log(c);
this.setData({tap_select:c})
  },
back:function(){
  wx.navigateBack({
    delta: 0,
  })
},
  format_cart: function (cart) {
console.log(cart);

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
cc.style_cart[x].price=fun.number_fromat(cc.style_cart[x].price,2);
cc.style_cart[x].total=fun.number_fromat(cc.style_cart[x].total,2);
}
shop.cc[i].val[j]['style_cart']=cc.style_cart;
num+=n;
shop.cc[i].val[j]['is_buy']=n;
cart[[id]]['is_buy']=n;
c_num+=n;
}else{
shop.cc[i].val[j]['is_buy']=cart[id].is_buy;
shop.cc[i].val[j]['total']=fun.number_fromat(parseFloat(cart[id].is_buy*shop.cc[i].val[j]['price']),2);
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
console.log('保存');
this.setData({shop:shop,cart_num:num,total_price:total,cart:cart});



  },

 
  val_change: function (e) {
var c=e.currentTarget.dataset.c;
var val=e.detail.value;

console.log(c+' '+val);
this.setData({[c]:val})
  },


  load: function () {
var shop=this.data.shop;
if(shop.user){
this.setData({addr:shop.user.addr,name:shop.user.ture_name,phone:shop.user.phone})
}


  },
submit:function(e){
var phone=this.data.phone;var err=0;
if(!phone){app.msg('请输入您的手机号码');err++;}
var name=this.data.name;
if(!phone){app.msg('请输入您的姓名');err++;}
var tap_select=this.data.tap_select;
var type='tangsi';
var addr=this.data.addr;if(!addr){addr='';}
if(tap_select=='l'){var addr='';
}else{
type='waimai';
if(!addr){app.msg('请输入您的送餐地址');err++;}
}
var s=this.data.submit;if(s!=1){err++;}
var user_id=app.globalData.user_id;
if(!user_id){this.setData({login_show:'show'});return;}

if(err>0){return;}
var info=this.data.info;if(!info){info='';}
var cart=this.data.cart;if(typeof cart!='object'){app.err('订单数据错误');return;}
var shop=this.data.shop;
//提交数据
this.setData({submit:0});
var that=this;

setTimeout(function(){that.setData({submit:1});},3000);//定时打开
wx.request({
  url: app.globalData.server+'?ac=submit_cart',
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
  },
  data:{
ac:'submit_cart',user_id:app.globalData.user_id,session:app.globalData.session,
addr:addr,name:name,phone:phone,info:info,type:type,cart:JSON.stringify(cart),shop:shop.ct.id

  },success(res){
that.setData({submit:1});
if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){
  if(res.data.err=='用户登录失败'){that.setData({login_show:'show'});return;}
  app.err(res.data.err);return;}



//支付
if(res.data.pay){
wx.requestPayment({
  timeStamp: res.data.pay.timeStamp,
  nonceStr: res.data.pay.nonceStr,
  package: res.data.pay.package,
  signType: 'MD5',
  paySign: res.data.pay.paySign,
  success(res) {
    if (res.errMsg == 'requestPayment:ok') {
      //支付成功
      app.msg('支付成功');
      
    }

  }

}
);}else{

  if(res.data.msg){app.err(res.data.msg);}
}



  }
})




},

  onShareAppMessage: function () {

  },getDistance: function (lat1, lng1, lat2, lng2) {
    //获取2地距离
        lat1 = lat1 || 0;
        lng1 = lng1 || 0;
        lat2 = lat2 || 0;
        lng2 = lng2 || 0;
        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var r = 6378137;
        var jili=r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
        var j=fun.number_fromat(jili/1000,2);
    this.setData({juli:j})
      }
    

})