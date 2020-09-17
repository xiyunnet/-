var app = getApp()
var fun = require('../fun.js'); 

Page({
  data: {
    nav:{top:app.globalData.nav_top,icon:'icon-home1',text:'首页',title:'海宁严选',ac:'go',url:'',is_select:1},nav_bottom_show:1,nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'菜肴列表'
  },


  onLoad: function (op) {
var user_id=app.globalData.user_id;
var session=app.globalData.session;
if(!user_id || !session){this.setData({login_show:'show'})}


  },

  
  onReady: function () {
this.load();
  },

 
  onShow: function () {
var is_creat=app.globalData.new_cy_creat;
if(is_creat==1){
this.load();app.globalData.new_cy_creat=0;
app.msg('快速创建菜肴成功');return;
}

    var choise_index=app.globalData.choise_img_index;
    var choise_id=app.globalData.choise_img_id;
  var request_data=app.globalData.request_data;
    if(choise_id && request_data){
    var shop=this.data.shop;
var cy=shop.cy[[choise_index]];
if(cy.id==choise_id){
  shop.cy[[choise_index]]['img']=request_data['img'];
  this.setData({shop:shop})
}
app.globalData.request_data='';
app.globalData.choise_img_id='';

    }



  },back:function(){
    wx.navigateBack({
      delta: 0,
    })
    
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
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session){this.setData({login_show:'show'});return;}
var that=this;
wx.request({
  url: app.globalData.server,
  data:{ac:'get_list',c:'all',user_id:app.globalData.user_id,session:app.globalData.session},success(res){
if(!res.data){return;}
console.log(res.data);
if(res.data.err!='ok'){
if(res.data.err=='用户登录失败' || !res.data.user){that.setData({login_show:'show'});return;}
app.err(res.data.err);return;
}

that.setData({shop:res.data})

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

  },new_cy:function(){
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session){this.setData({login_show:'show'});return;}
var that=this;

app.globalData.new_cy_creat=1;
var url='/pages/index/image?c=new_cy&max=10&method=select';
wx.navigateTo({
  url: url,
})
return;
//以下取消
wx.request({
  url: app.globalData.server,
  data:{ac:'new_cy',user_id:app.globalData.user_id,session:app.globalData.session},success(res){

    if(!res.data){return;}
    console.log(res.data);
    if(res.data.err!='ok'){
    if(res.data.err=='用户登录失败'){this.setData({login_show:'show'});return;}
    app.err(res.data.err);return;
    }
    wx.navigateTo({
      url: '/pages/edit/cy?id='+res.data.id,
    })

  }
})



  },style_select:function(e){
var c=e.currentTarget.dataset.c;if(!c){c='';}
var index=this.data.select_cy_index;
console.log(c+' '+index);
var shop=this.data.shop;
var cy=shop.cy[index];
console.log(cy);

var that=this;
wx.request({
  url: app.globalData.server,
  data:{
ac:'select_style',user_id:app.globalData.user_id,session:app.globalData.session,
id:cy.id,c:c

  },success(res){
if(!res.data){return;}console.log(res.data);
if(res.data.err!='ok'){app.err(res.data.err);return;}

shop.cy[index].style=c;
that.setData({shop:shop,show_select_s:'hide'})
app.msg('属性选择成功');

  }
})


  },
  get_s:function(e){var that=this;
    var index=e.currentTarget.dataset.index;
    var shop=this.data.shop;
    var s=shop.cy[index];

    wx.request({
      url: app.globalData.server,
      data:{ac:'get_style_list',user_id:app.globalData.user_id,session:app.globalData.session
    },success(res){
        console.log(res.data);
      if(res.data.err=='ok'){
      that.setData({style_list:res.data.list,show_select_s:'show',select_cy_index:index})
      }
    
      }
    })
    
    },
  
  get_c:function(e){var that=this;
    var index=e.currentTarget.dataset.index;
    var shop=this.data.shop;
    var s=shop.cy[index];

    wx.request({
      url: app.globalData.server,
      data:{ac:'get_cy_c',user_id:app.globalData.user_id},success(res){
        console.log(res.data);
      if(res.data.err=='ok'){
      that.setData({cy_c:res.data.c,show_select_c:'show',select_cy_index:index})
      }
    
      }
    })
    
    },win_close:function(e){
      var c=e.currentTarget.dataset.c;
      this.setData({[c]:'hide',win_msg:''})
      
      
        },c_select:function(e){
  
          var val=e.currentTarget.dataset.v;
          var c='c';
          var shop=this.data.shop;
          var index=this.data.select_cy_index;var that=this;
          var cy=shop.cy[[index]];
          var vv=shop.cy[[index]].c;
          if(val==vv){return;}
          wx.request({
            url: app.globalData.server,
            data:{ac:'cy_change',user_id:app.globalData.user_id,session:app.globalData.session,
          c:c,val:val,id:cy.id
          },success(res){
        if(!res.data){return;}
        console.log(res.data)
        if(res.data.err!='ok'){
        if(res.data.err=='用的登录失败'){this.setData({login_show:'show'});return;}
        app.err(res.data.err);return;
        }
        
        shop.cy[[index]][[c]]=val;
        that.setData({shop:shop,show_select_c:'hide'})
        app.msg('修改成功');
          }
          })
      
      
        },go_start:function(e){
          var index=e.currentTarget.dataset.index;
          
          console.log(val);
          var c='state';
          var shop=this.data.shop;var that=this;
          var cy=shop.cy[[index]];
          var id=e.currentTarget.dataset.id;
          var ids=cy.id;
          console.log(id+' '+ids);
          var val=cy.state;
          //if(val==vv){return;}
          if(val==1){val=0;}else{val=1;}
          wx.request({
            url: app.globalData.server,
            data:{ac:'cy_change',user_id:app.globalData.user_id,session:app.globalData.session,
          c:c,val:val,id:cy.id
          },success(res){
        if(!res.data){return;}
        console.log(res.data)
        if(res.data.err!='ok'){
        if(res.data.err=='用的登录失败'){this.setData({login_show:'show'});return;}
        app.err(res.data.err);return;
        }
        console.log(val);
        shop.cy[[index]].state=val;
        that.setData({shop:shop})
        //app.msg('修改成功');
          }
          })
      
      
        },go:function(e){
var url=e.currentTarget.dataset.url;
wx.navigateTo({
  url: url,
})

        },
        change_v:function(e){
          var index=e.currentTarget.dataset.index;
          var val=e.currentTarget.dataset.d;
          var c=e.currentTarget.dataset.c;
          var shop=this.data.shop;var that=this;
          var cy=shop.cy[[index]];
          var vv=cy[[c]];
          //if(val==vv){return;}
if(val==0){val=1;}else{val=0;}
          wx.request({
            url: app.globalData.server,
            data:{ac:'cy_change',user_id:app.globalData.user_id,session:app.globalData.session,
          c:c,val:val,id:cy.id
          },success(res){
        if(!res.data){return;}
        console.log(res.data)
        if(res.data.err!='ok'){
        if(res.data.err=='用的登录失败'){this.setData({login_show:'show'});return;}
        app.err(res.data.err);return;
        }
        
        shop.cy[[index]][[c]]=val;
        //that.load();
        that.setData({shop:shop})
        app.msg('修改成功');
          }
          })

        },
        
        
        change_val:function(e){
          var index=e.currentTarget.dataset.index;
          var val=e.detail.value;
          var c=e.currentTarget.dataset.c;
          var shop=this.data.shop;var that=this;
          var cy=shop.cy[[index]];
          var vv=cy[[c]];
          if(val==vv){return;}
          wx.request({
            url: app.globalData.server,
            data:{ac:'cy_change',user_id:app.globalData.user_id,session:app.globalData.session,
          c:c,val:val,id:cy.id
          },success(res){
        if(!res.data){return;}
        console.log(res.data)
        if(res.data.err!='ok'){
        if(res.data.err=='用的登录失败'){this.setData({login_show:'show'});return;}
        app.err(res.data.err);return;
        }
        
        shop.cy[[index]][[c]]=val;
        //that.load();
        //that.setData({shop:shop,val_show:'hide'})
        app.msg('修改成功');
          }
          })
        
          },get_img:function(e){
var shop=this.data.shop;
var index=e.currentTarget.dataset.index;
console.log(index);
var cy=shop.cy[[index]];
var id=cy.id;
app.globalData.choise_img_index=index;
app.globalData.choise_img_id=cy.id;
var url='/pages/index/image?c=cy&id='+id+'&max=1&method=select';
wx.navigateTo({
  url: url,
})

          },cy_del:function(e){
          
var shop=this.data.shop;
var index=e.currentTarget.dataset.index;
var cy=shop.cy[[index]];
var id=cy.id;
var that=this;
wx.showModal({
  title: '提示',
  content: '删除将无法恢复，是否继续？',
  success (res) {
    if (res.confirm) {
     wx.request({
       url: app.globalData.server,
       data:{ac:'cy_del',user_id:app.globalData.user_id,session:app.globalData.session,id:id},success(res){

if(res.data.err=='ok'){
that.load();

}

       }
     })

    } else if (res.cancel) {
      
    }
  }
})



          }
})