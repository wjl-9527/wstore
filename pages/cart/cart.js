Page({
  data: {
    cartCount: '',
    allowSellAmount: '',
    expemotFreight: "",
    totalMoner: "",
    allChecked : false,
    totalPrice : 0
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.getCartList();
  },
  bottomNav(e) {
    getApp(e).bottomNav(e);
  },
  //获得购物车数据
  getCartList() {
    var that = this;
    wx.showLoading({
      title: '',
      icon: 'loading'
    })
    var url = getApp().data.url + 'wechatApplet/findCartProductInApplet.json';
    wx.request({
      url: url,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.info(res);
        that.splitCartList(res);
      }
    })
    
  },
  splitCartList(res) {
    wx.hideLoading();
    var resObj = res.data.data;
    if (res.data.success) {
      //普通商品
      var nomalCartList = [];
      var failuregoodsList = [];
      var expemotFreight = 199;
      if (resObj.cartProductVoList[0] != undefined) {
        nomalCartList = resObj.cartProductVoList;
      }
      if (resObj.cartUnProductVoList[0] != undefined){
        failuregoodsList = resObj.cartUnProductVoList;
      }
      this.setData({
        expemotFreight: expemotFreight,
        normalCartList: nomalCartList,
        allChecked: res.data.data.allChecked,
        totalPrice: res.data.data.cartTotalPrice,
        failuregoodsList: failuregoodsList
      })
    } else {
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      })
    }
  },
  //增加商品
  addNum(e) {
    var that = this;
    var skuid = e.currentTarget.dataset.skuid;
    var productId = e.currentTarget.dataset.prdid;
    var count = 1;
    console.info(e);
    that.getRequestCart(skuid, productId, count);
  },
  getRequestCart: function (skuid, productId, count){
    var that = this;
    var url = getApp().data.url + 'wechatApplet/saveOrUpdateCartInApplet.json'
    var para = {};
    para.productId = productId;
    para.skuid = skuid;
    para.count = count;
    wx.request({
      url: url,
      data: para,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.success) {
          that.getCartList();
        }
      }
    })

  },
  // 减少商品
  cutNum(e) {
    var that = this;
    var quantity = e.currentTarget.dataset.quantity; 
    var skuid = e.currentTarget.dataset.skuid;
    var productId = e.currentTarget.dataset.prdid;
    var count = -1;
    if (quantity == 1) {
      wx.showToast({
        title: '受不了了，宝贝不能再减少了',
        icon: 'none'
      })
    } else {
      that.getRequestCart(skuid, productId, count);
    }
  },
  // 删除商品
  deleGoods(e) {
    var me = this;
    var skuid = e.currentTarget.dataset.skuid;
    var productId = e.currentTarget.dataset.prdid;
    wx.showModal({
      content: '确定删除该商品？',
      cancelText: '再想想',
      cancelColor: '#999999',
      success: function (res) {
        if (res.confirm) {
          me.toDeleGoods(skuid, productId);
        } else if (res.cancel) {

        }
      }
    })
  },
  toDeleGoods(skuid, productId) {
    var that = this;
    var url = getApp().data.url + 'item/deleteCartProduct.json';
    var para = {};
    para.productId = productId;
    para.skuid = skuid;
    wx.request({
      url: url,
      data: para,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.info(res)
        if (res.data.success) {
          that.getCartList();
        }
      }
    })
  },
  deleSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.getCartList();
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  //选中商品
  selectGoods(e) {
    var that = this;
    var catId = e.currentTarget.dataset.catid;
    var kind = e.currentTarget.dataset.kind;
    var flag = false;
    if (kind == "select") {
      flag = false;
    } else {
      flag = true;
    }
    var url = getApp().data.url + 'item/selectForOneInShopCart.json';
    wx.request({
      url: url,
      data: { "catId": catId, "flag": flag},
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.getCartList();
      }
    })

  },
  selsctSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.getCartList();
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  allSelect(e) {
    var that = this;
    var kind = e.currentTarget.dataset.kind;
    console.info(kind);
    var flag = false;
    if (kind == "select") {
      flag = false;
    } else {
      flag = true;
    }
    var url = getApp().data.url + 'wechatApplet/selectOrUnSelectForAllProduct.json';
    wx.request({
      url: url,
      data: {"flag": flag },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.info(res)
        that.getCartList();
      }
    })
  },
  allSelectSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.getCartList();
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  //去结算
  setOrder() {
    if (this.data.totalPrice == 0) {
      wx.showToast({
        title: '没有选择商品哦',
        icon: 'none'
      });
      return false;
    }
    var url = getApp().data.url + 'wechatApplet/pyOrderInApplet.json';
    var para = { openid : getApp().globalData.openid};
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        console.info(res);
        if (res.data.success) {
          console.info(res.data.message);
          wx.navigateTo({
            url: "/pages/confirmOrder/confirmOrder?orderId=" + res.data.message
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
  submitOriderSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0 || resObj.header.res_code == 6001008 || resObj.header.res_code == 6001006) {
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder',
      })
      wx.setStorageSync('orderObj', resObj.body)
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  gotosee() {
    wx.redirectTo({
      url: '..index/index',
    })
  }
})