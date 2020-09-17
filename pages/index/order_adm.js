var app = getApp()
var fun = require('../fun.js');
Page({
  data: {
    menu_title:'订单管理',nav_top:app.globalData.nav_top,
  },


  onLoad: function (op) {
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session ){this.setData({login_show:'show'});return;}else{}

var id=op.id;
if(id){this.setData({id:id})}

  },

 
  onReady: function () {

  },


  onShow: function () {
this.load()
  },

 
  load: function () {
  var shop=app.globalData.shop;
  console.log(shop);
  var user_id=app.globalData.user_id;
  if(!user_id){this.setData({login_show:'show'});return;}
  var id=this.data.id;
var that=this;
wx.request({
  url: app.globalData.server,
  data:{
ac:'get_orders',user_id:app.globalData.user_id,session:app.globalData.session,shop_id:id


  },success(res){
if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){
if(res.data.err=='用户登录失败'){this.setData({login_show:'show'});return;}

app.err(res.data.err);return;

}

that.setData({list:res.data.list})
  }
})


  }, login: function (e) {
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

  /**
   * 生命周期函数--监听页面卸载
   */
  buy_again: function (e) {
var id=e.currentTarget.dataset.id;
var index=e.currentTarget.dataset.index;
var cart=this.data.list;
console.log(id+' '+index);

console.log(cart[index].cart);

app.globalData.buy_again=1;
app.globalData.select_order=cart[index].cart;
wx.navigateTo({
  url: '/pages/index/cart',
})

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  back: function () {
wx.navigateBack()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})