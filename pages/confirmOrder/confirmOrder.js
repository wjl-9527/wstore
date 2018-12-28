//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    curAddressData : '',
    goodsList : [],
    yunPrice: 0,
    allGoodsPrice: 0,
    orderId: 0,
    storePrice : 0
  },
  onShow: function () {

    this.getAffirmData();
  },

  onLoad: function (e) {
    this.setData({
      orderId: e.orderId
    });
  },
  getAffirmData: function (){
    var that = this;
    var url = getApp().data.url + 'wechatApplet/queryOrderDetailInWechatApplet.json'
    var para = {};
    para.orderId = that.data.orderId;
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        console.info(res);
        if (res.data.success) {
         that.setData({
           goodsList : res.data.data,
           yunPrice: res.data.data.postage,
           allGoodsPrice: res.data.data.payment,
           storePrice:res.data.data.productPayment,
           curAddressData: res.data.data.shippingVo
         })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  addAddress : function(){
    wx.navigateTo({
      url: "/pages/addressList/addressList"
    })
  },
  confirmAnOrder :function(){
    
    wx.request({
      url: getApp().data.url + '/wechat/unifiedAppleOrder',
      data: { "order": "214412321756286976", "openid": getApp().globalData.openid},
      method:"post",
      dataType:"text",
      header: {
        'content-type': 'application/json' 
      },
      success: res => {

        console.log(JSON.parse(res.data)) ;

        wx.requestPayment(
          {
            'timeStamp': ''+JSON.parse(res.data).timeStamp,
            'nonceStr': JSON.parse(res.data).nonceStr,
            'package': JSON.parse(res.data).prepayId,
            'signType': 'MD5',
            'paySign': JSON.parse(res.data).paySign,
            'success': function (res) { },
            'fail': function (res) { },
            'complete': function (res) { }
          })


      }
    })


  }
})
