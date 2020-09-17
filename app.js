//app.js
App({
  onLaunch: function () {
    var that=this;
   
    wx.getSystemInfo({
      success: (res) => {
        //console.log('系统信息'+JSON.stringify(res));
        that.globalData.systm = JSON.stringify(res);
        that.globalData.nav_top = res.statusBarHeight
        that.globalData.nav_height = 44 + res.statusBarHeight
      }
    });
//登录信息
    var val = wx.getStorageSync('login_info');
    
    if (val) {
      var d = JSON.parse(val);
      that.globalData.user_id = d.user_id;
      that.globalData.logo = d.logo;
      that.globalData.nickname = d.nickname;
      that.globalData.session = d.session;
      that.globalData.user_info = d;
console.log('登录成功');

    }


  },
  globalData: {
  server:'https://www.zjhn.com/shop/dc_ac.php'
  },msg:function(t){wx.showToast({ title: t });},


  err: function (t) {
    wx.showModal({
      title: '提示',
      content: t,
    })
  },
})