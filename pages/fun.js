function indexOf(str, v) {
  if (str.indexOf(v) < 0) { return false; } else { return true; }

}

function go_login() {

  var app = getApp()
  console.log('尝试登录');
  var code = '';
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        console.log(`login调用成功${res.code} 获取用户信息`);
        code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success(res) {
            console.log(res);
console.log(app.globalData);
            wx.request({
              url: app.globalData.server, // 目标服务器url
              data: {
                ac: 'wx_login',
                nickName: res.userInfo.nickName,
                logo: res.userInfo.avatarUrl,
                city: res.userInfo.city,
                province: res.userInfo.province,
                encryptedData: res.encryptedData,
                iv: res.iv,
                sign: res.signature, code: code,
                from_id: app.globalData.from_id ? app.globalData.from_id : 0,
                cp_id:app.globalData.cp_id?app.globalData.cp_id:0
              },
              success: (res) => {
                console.log('登录成功' + JSON.stringify(res.data));
                if (res.data.err == 'ok') {
                  app.globalData.user_id = res.data.id;
                  app.globalData.session = res.data.session;
                  app.globalData.logo = res.data.logo;
                  app.globalData.nickname = res.data.nickname;
                  app.globalData.user_info = res.data;
                  app.globalData.jifen = res.data.jifen;
                  //缓存
                  //var save_data = { user_id: res.data.id, session: res.data.session, logo: res.data.logo, nickname: res.data.nickname };
                  res.data.user_id = res.data.id;

                  console.log('保存登录状态' + JSON.stringify(res.data))
                  try {
                    wx.setStorageSync('login_info', JSON.stringify(res.data))
                  } catch (e) { }
                  //app.msg('登录成功');
                  //if (back) { wx.navigateBack({ delta: -1 }); }
                  resolve('ok')
                } else {
                  console.log(res.data.err);
                  // app.err(res.data.err);
                }


              }
            });



          },
          fail(res) {
            console.log(`getUserInfo调用失败`);
            wx.openSetting({
              success: function (res) {
                if (!res.authSetting["scope.userInfo"]) {
                  //app.login();
                }
              }
            });
          }
        });
      },
      fail(res) {
        console.log(`login调用失败`);
      }
    });
  });
}

function number_fromat(num, n) {
  var nn = parseFloat(num);
  return nn.toFixed(n);
}

module.exports = { indexOf: indexOf, number_fromat: number_fromat, go_login: go_login }