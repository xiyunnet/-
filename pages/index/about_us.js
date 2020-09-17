var app = getApp()
var fun = require('../fun.js');
Page({
  data: {
    menu_title:'关于我们',nav_top:app.globalData.nav_top,
  },


  onLoad: function (options) {

  },


  onReady: function () {

  },


  onShow: function () {
this.load()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  load: function () {
var that=this;
wx.request({
  url: app.globalData.server,data:{ac:'about_us'},success(res){

if(res.data.err!='ok'){app.err(res.data.err);}
console.log(res.data);
that.setData({list:res.data.list})
  }
})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  back: function () {
wx.navigateBack({
  delta: 0,
})
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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