//app.js
App({
  data: {
    url: "https://ssl.wxmercury.cn/"
  },
  onLaunch : function(){
    var that = this;

    // 登录
    wx.login({
      success: res => {
        console.info(res);
         // 发送 res.code 到后台换取 openId, sessionKey, unionId
         wx.request({
           url: getApp().data.url +'wechat/userInfo',
           data: { code: res.code},
          success: res => {
            console.log("====>>>"+ JSON.stringify(res) );
            that.globalData.openid = res.data.message;
          }
        })
       
      }
    })
  },
  globalData: {
    userInfo: null,
    openid : 0
  },
  //获取购物车数量
  getCartNum(obj) {
    var url = getApp().data.url + 'shoppingcart/getCartCount';
    var body = {
      supermarket_id: wx.getStorageSync('supermarket_id'),
      is_check: '2'
    };
  },
  returnCartNum(res, obj) {
    obj.setData({
      num: res.data.body.num
    })
  },
  //增加商品
  addPro(obj){
    console.log(obj)
    var url = getApp().data.url + 'shoppingcart/addShoppingCart';
    var body = {
      quantity: '1',
      supermarket_id: wx.getStorageSync('supermarket_id'),
      sku: obj.data.sku
    };
    
    if (obj.data.addflage == 1) {
      obj.setData({
        addflage: 2
      })
    }
  },
  addProSug(res,obj) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      obj.setData({
        addflage: 1
      })
      wx.showToast({
        title: '添加成功',
      })
      getApp().getCartNum(obj);
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
      obj.setData({
        addflage: 1
      })
    }
  },
  //底部导航
  bottomNav(e) {
    var kind = e.currentTarget.dataset.kind;
    var isPgae = e.currentTarget.dataset.ispage;
    var url;
    if (kind == "index" && isPgae == "1") {
      wx.redirectTo({
        url: '../index/index'
      })
    } else if (kind == "calss" && isPgae == "1") {
      wx.redirectTo({
        url: '../classification/classification'
      })
    } else if (kind == "cart" && isPgae == "1") {
      wx.redirectTo({
        url: '../cart/cart'
      })
    } else if (kind == "my" && isPgae == "1") {
      wx.redirectTo({
        url: '../my/my'
      })
    }
  },
})