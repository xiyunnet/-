var app = getApp()
var fun = require('../fun.js');
Page({

  data: {
    nav:{top:app.globalData.nav_top,icon:'icon-angle-left',title:'属性/规则',ac:'goback',url:'',is_select:1},nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'属性/规则'
  },
back:function(){
  app.err('aaa');
wx.navigateBack({
  
})

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session){this.setData({login_show:'show'})}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  del: function (e) {
var c=e.currentTarget.dataset.c;
if(!c){app.err('没有选择规则');return}
var that=this;
wx.showModal({
  title: '提示',
  content: '删除将无法恢复，是否继续',
  success (res) {
    if (res.confirm) {
     
wx.request({
  url: app.globalData.server,data:{
ac:'del_style_c',user_id:app.globalData.user_id,session:app.globalData.session,
c:c
  },success(res){
  if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){app.err(res.data.err);return;}
that.load();app.msg('删除成功');

  }
})

    } 
  }
})



  },login: function (e) {
    var c = e.currentTarget.dataset.c;
    if(c=='close'){this.setData({login_show:'hide'});return;}
    fun.go_login().then(res => {
      if (res == 'ok') {
        app.msg('登录成功');
        this.load();
        this.setData({ login_show: 'hide' });
      }
    });

  },menu: function (e) {
  

  },


  menu_close: function () {
this.setData({menu_show:''})
  },
  menu_show: function () {console.log('显示菜单');
    this.setData({menu_show:'show'})
      },go:function(e){
        var url=e.currentTarget.dataset.url;
        wx.navigateTo({
          url: url,
        })
        
                },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
this.load();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  load: function () {
    var that=this;
wx.request({
  url: app.globalData.server,
  data:{
ac:'get_style_list',user_id:app.globalData.user_id,session:app.globalData.session


  },success(res){
if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){app.err(res.data.err);return;}
that.setData({list:res.data.list})


  }
})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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