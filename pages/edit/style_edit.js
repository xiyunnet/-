var app = getApp()
var fun = require('../fun.js');
Page({

  data: {
    nav:{top:app.globalData.nav_top,icon:'icon-angle-left',title:'属性/规则',ac:'goback',url:'',is_select:1},nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'属性/规则'
  },
  back:function(){
wx.navigateBack({
  delta: 0,
})

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session){this.setData({login_show:'show'})}
var c=op.c;
if(c){this.setData({c:c})}else{
  
  //this.setData({style_add_show:'show'});
}



  },
load:function(){
var c=this.data.c;
if(!c){c='';}
var that=this;
wx.request({
  url: app.globalData.server,
  data:{
ac:'get_style_edit',c:c,user_id:app.globalData.user_id,session:app.globalData.session
  },success(res){

    console.log(res.data);
    if(res.data.err=='ok'){
that.setData({gz:res.data.gz})
    }
  }
})




},win_close:function(e){
  var c=e.currentTarget.dataset.c;
  this.setData({[c]:'hide',win_msg:''})
  
  
    },
  
  onReady: function () {

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
  val_change: function (e) {
var c=e.currentTarget.dataset.c;
var val=e.detail.value;
var s=e.currentTarget.dataset.s;
if(s){this.setData({s:s})}
console.log(c+' '+val);
if(c && val){
this.setData({[c]:val})
}


  },value_change:function(e){
var c=e.currentTarget.dataset.c;
var id=e.currentTarget.dataset.id;
var val=e.detail.value;
if(c=='title' && !val){app.err('标题不能为空');return;}

wx.request({
  url: app.globalData.server,
  data:{
ac:'style_edit',c:c,id:id,v:val,user_id:app.globalData.user_id,session:app.globalData.session


  },success(res){
if(!res.data){return;}console.log(res.data);

if(res.data.err!='ok'){app.err(res.data.err);return;}
app.msg('修改成功');


  }

})

  },del:function(e){
var id=e.currentTarget.dataset.id;
if(!id){return;}
var that=this;
wx.showModal({
  title: '提示',
  content: '是否删除',
  success (res) {
    if (res.confirm) {
    
      wx.request({
        url: app.globalData.server,
        data:{
      ac:'style_del',id:id,user_id:app.globalData.user_id,session:app.globalData.session
      
      
        },success(res){
      if(!res.data){return;}console.log(res.data);
      
      if(res.data.err!='ok'){app.err(res.data.err);return;}
      app.msg('删除成功');
      that.load();
      
        }
      
      })

    } 
  }
})



  },


  add: function () {
var c=this.data.c;if(!c){app.err('请输入规则名称');return;}
var s=this.data.s;if(!s){app.err('请输入属性名称');return;}
var price=this.data.price;if(!price){price=0;}
var o=this.data.o;if(!o){o=1;}
var title=this.data.title;if(!title){app.err('请输入名称');return;}
var that=this;
wx.request({
  url: app.globalData.server,
  data:{
ac:'style_add',c:c,title:title,s:s,o:o,price:price,user_id:app.globalData.user_id,session:app.globalData.session


  },success(res){
if(!res.data){return;}console.log(res.data);

if(res.data.err!='ok'){app.err(res.data.err);return;}
that.setData({c:c});app.msg('添加成功');
that.load();

  }

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