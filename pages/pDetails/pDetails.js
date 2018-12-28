var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    proObj: {},
    goodsDetail: {},
    num: 0,
    addflage: 1,
    indexName: "首页",
    banner: [],
    hideShopPopup : true,
    shopType: "addShopCar",
    pitchOn : false,
    selectSizePrice : 0,
    buyNumber : 0,
    buyNumMin: 1,
    buyNumMax: 0,
    skuId: 0,
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
  },
  onLoad: function (options) {
    var that = this;
    const pic = [];
    var url = getApp().data.url + 'wechatApplet/queryPrdDetailInWechatApplet.json'
    wx.request({
      url: url,
      data: {
        productId: options.productid
      },
      success: function (res) {
        console.info(res.data.data);
        if (res.data.data.mainPics){
          for (var i = 0; i < res.data.data.mainPics.length;i++){
            pic[i] = res.data.data.mainPics[i].picUrl;
          }
        }
        that.setData({
          banner: pic,
          goodsDetail: res.data.data,
          selectSizePrice: res.data.data.salePrice,
          buyNumMax: res.data.data.stockQuantity,
          buyNumber: (res.data.data.stockQuantity > 0) ? 1 : 0
        });
        WxParse.wxParse('article', 'html', res.data.data.mobileDetail.content, that, 5);
      }
    })
  },
  onShow: function () {
    
    getApp().getCartNum(this);
  },
  bindGuiGeTap : function(){
    this.setData({
      hideShopPopup : false
    })
  },//关闭选规格
  closePopupTap : function(){
    this.setData({
      hideShopPopup: true
    })  
  },//加入购物车
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },//立即购买
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
  },//返回首页
  goIndex : function(){
    wx.redirectTo({
      url: '../index/index'
    })
  },
  //购物车减
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
    //购物车加
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }else{
      wx.showToast({
        title: '没有多余的库存',
        icon: 'none'
      })
    }
  },
  //选择规格
  labelItemTap : function(e){
    var that = this;
    console.info(e);
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.skus;
    console.info(childs);
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.skus[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.skus[e.currentTarget.dataset.propertychildindex].active = true;
    var canSubmit = true;

    that.setData({
      goodsDetail: that.data.goodsDetail,
      selectSizePrice: that.data.goodsDetail.skus[e.currentTarget.dataset.propertychildindex].price,
      buyNumMax: that.data.goodsDetail.skus[e.currentTarget.dataset.propertychildindex].stockQuantity,
      canSubmit: canSubmit,
      skuId: that.data.goodsDetail.skus[e.currentTarget.dataset.propertychildindex].skuId
    })  
  },
  //加入购物车
  addShopCar: function (options){
    var that = this;
    if (this.data.goodsDetail.skus && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    var url = getApp().data.url + 'wechatApplet/saveOrUpdateCartInApplet.json'
    var para = {};
    para.productId = that.data.goodsDetail.productId;
    para.skuid = that.data.skuId;
    para.count = that.data.buyNumber;
    wx.request({
      url: url,
      data: para,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.success){
          that.closePopupTap();
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })

  },
  //立即购买
  buyNow: function (options){ 
    var that = this;
    if (this.data.goodsDetail.skus && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    var url = getApp().data.url + 'wechatApplet/pyOrderInApplet.json'
    var para = {};
    para.prodId = that.data.goodsDetail.productId;
    para.skuid = that.data.skuId;
    para.count = that.data.buyNumber;
    para.openid = getApp().globalData.openid;
    wx.request({
      url: url,
      data: para,
      success: function (res) {
        console.info(res);
        if (res.data.success) {
          wx.navigateTo({
            url: "/pages/confirmOrder/confirmOrder?orderId=" + res.data.message
          }) 
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    // 写入本地存储
    //wx.setStorage({
    //  key: "buyNowInfo",
    //  data: buyNowInfo
    //})
  },
  buliduBuyNowInfo: function(){

  },
  //跳转购物车
  goShopCar : function(){
    wx.redirectTo({
      url: '../cart/cart'
    })
  },
  getDetailsInfo() {
    var url = getApp().data.url + 'product/getProduct';
    var body = {
      supermarket_id: wx.getStorageSync('supermarket_id'),
      sku: this.data.productid
    };
    getApp().wxAjax(this.splitDetails, url, body);
  },
  splitDetails(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      var pDetailsObj = resObj.body;
      this.setData({
        proObj: pDetailsObj
      })
      if (pDetailsObj.is_focus) {
        this.setData({
          favoriteStatus: "已收藏"
        })
      } else {
        this.setData({
          favoriteStatus: "收藏商品"
        })
      }

      console.log(pDetailsObj)
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  tofollow() {
    if (this.data.favoriteStatus == '收藏商品')
      this.tofocus()
    else
      this.tounfocus()
  },
  tofocus() {
    var url = getApp().data.url + 'product/addAttention';
    var body = {
      supermarket_id: wx.getStorageSync('supermarket_id'),
      product_id: this.data.proObj.prod_id
    };
    getApp().wxAjax(this.echofocus, url, body);
  },
  echofocus(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.setData({
        favoriteStatus: "已收藏"
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  tounfocus() {
    var url = getApp().data.url + 'product/cancelAttention';
    var body = {
      supermarket_id: wx.getStorageSync('supermarket_id'),
      product_id: this.data.proObj.prod_id
    };
    getApp().wxAjax(this.echounfocus, url, body);
  },
  echounfocus(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.setData({
        favoriteStatus: "收藏商品"
      })
      wx.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  addPro() {
    var url = getApp().data.url + 'shoppingcart/addShoppingCart';
    var body = {
      quantity: '1',
      supermarket_id: wx.getStorageSync('supermarket_id'),
      sku: this.data.proObj.sku
    };
    if (this.data.addflage == 1) {
      this.setData({
        addflage: 2
      })
      getApp().wxAjax(this.addProSug, url, body);
    }

  },
  addProSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0) {
      this.setData({
        addflage: 1
      })
      wx.showToast({
        title: '添加成功',
      })
      getApp().getCartNum(this);
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
  tocart() {
    wx.navigateTo({
      url: '../cart/cart'
    })
  },

})