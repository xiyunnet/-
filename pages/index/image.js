var app = getApp()
var fun = require('../fun.js');
Page({
  data: {
    nav_top:app.globalData.nav_top,
    menu_show:'',menu_title:'选择图片'
  },
back:function(){
  wx.navigateBack({
    delta: 0,
  })
},
  onLoad: function (op) {
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    if(!user_id || !session){this.setData({login_show:'show'})}else{
    this.setData({user_id:user_id})
    }
    var id=op.id;var c=op.c;var max=op.max;if(!max){max=1;}
if(id){
this.setData({id:id})
}

var ac=op.ac;
if(!ac){ac='replace';}
var method=op.method;

if(!method){method=''}console.log(method);
switch(c){
case 'shop':this.setData({c:c,data:app.globalData.shop?app.globalData.shop:[],max:max,ac:ac,method:method});break;
case 'shop_logo':this.setData({c:c,data:app.globalData.shop?app.globalData.shop:[],max:max,ac:ac,method:method});break;
default:this.setData({c:c,data:app.globalData.shop?app.globalData.shop:[],max:max,ac:ac,method:method});break;
case 'new_cy':this.setData({c:c,data:app.globalData.shop?app.globalData.shop:[],max:max,ac:ac,method:'ss'});break;
}

  },

  onReady: function () {
    this.load();
  },


  onShow: function () {

  },


  load: function () {
var user_id=app.globalData.user_id;
var session=app.globalData.session;
if(!user_id || !session){
  this.setData({login_show:'show'});return;
}
var that=this;
wx.request({
  url: app.globalData.server,
  data:{ac:'load_img',user_id:app.globalData.user_id,session:app.globalData.session},
  success(res){
if(!res.data){return;}
//console.log(res.data)
if(res.data.err!='ok'){
  if(res.data.err=='用户登录失败'){this.setData({login_show:'show'});return;}
}

that.setData({images:res.data.img});
console.log(res.data.img)

  }
})


  },

  img_up: function (e) {
    var user_id=app.globalData.user_id;
    var session=app.globalData.session;
    var c=this.data.c;
    if(!user_id || !session){
      this.setData({login_show:'show'});return;
    }
    var that = this; console.log('上传图片');
    var count = 5;

var images=this.data.images;
if(!images){images=[]}

    wx.chooseImage({
      count: count,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        //if (!pro.img) { pro.img = []; }

        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })

        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {

          console.log('正在上传图片' + tempFilePaths[i]);
          wx.uploadFile({
            url: app.globalData.server + '?ac=img_up',
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              user_id: app.globalData.user_id,c:c,session:app.globalData.session
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success(res) {
              console.log(res.data);

              if (!res.data) { return; } var dd = JSON.parse(res.data);
              if (dd.err != 'ok') { app.err(dd.err); return; }
              uploadImgCount++;

              var img = dd.img;
                          
images.push(dd);
that.setData({images:images});
console.log(images);

              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  img_show: function (e) {
    var index=e.currentTarget.dataset.index;
console.log(index);
var img=this.data.images;
if(!img){return;}
var im=img[index];

wx.previewImage({
  urls: [im.img_720],
})

  },


select: function (e) {
  var myDate = new Date().getTime();
  //console.log(myDate);
var index=e.currentTarget.dataset.index;
var acc=this.data.acc;
//console.log(index);
var select_num=this.data.select_num;if(!select_num){select_num=0;}

var max=this.data.max;if(!max){max=1;}
console.log(select_num+' '+max)

var img=this.data.images;

if(!img){return;}
//选择顺序
var method=this.data.method;console.log(method);
var select_order=this.data.select_order;
if(!select_order){select_order=[]}

var ac='add';
var is_select=img[index].is_select;
if(is_select==1){
img[index].is_select=0;select_num--;
ac='del';//删除
}else{
  if(select_num>=max){app.msg('您最多选择'+max+'张图片');return;}
  img[index].is_select=1;select_num++;
  select_order[myDate]={index:index,is_select:1};
}

console.log(select_order);
var order=0;
if(select_order){
for(var i in select_order){
var inn=select_order[i].index;
var is_s=select_order[i].is_select;
console.log(inn+' '+is_s);
if(inn==index && ac=='del'){
  select_order[i].is_select=0;
  img[inn].order=0;
}else{
//数据处理
if(select_order[i].is_select==1){
order++;
img[inn].order=order;
}

}

}

}



this.setData({images:img,select_num:select_num,select_order:select_order});

if(method=='select'){
  
this.img_submit()
}

  },


  onShareAppMessage: function () {

  },img_submit:function(e){
var img=this.data.images;
var order=this.data.select_order;
var ac=this.data.ac;console.log(ac);
var im='';var img_240=[];var img_720=[]
if(img && order){
for(var i in order){
var index=order[i].index;
if(img[index].is_select==1){
  console.log(index);
  im+=img[index].img+'||';
  img_240.push(img[index].img_240)
  img_720.push(img[index].img_720)
}
}


var c=this.data.c;var that=this;
var id=this.data.id;
console.log(im+' '+c+' '+id+' '+ac)
wx.request({
  url: app.globalData.server,
  data:{ac:'img_select',c:c,user_id:app.globalData.user_id,session:app.globalData.session,img:im,id:id,m:ac},success(res){
    
    if(!res.data){return;}
    console.log(res.data);
if(res.data.err!='ok'){
if(res.data.err=='用户登录失败'){
  that.setData({login_show:'show'});return;
  
}
app.err(res.data.err);return;
}

app.globalData.request_data=res.data;
app.globalData.request_c=c;
app.globalData.request_ac=ac;
//app.globalData.img_240=img_240;
//app.globalData.img_720=img_720;
wx.navigateBack({
  delta: 0,
})

  }
})

}


},go_back:function(){wx.navigateBack({
  delta: 0,
})}
})