const app = getApp()
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    coupons_cc: 0,
    coupons_coupon: 0,
    to_pay_order_qty: 0,
    to_receipt_order_qty: 0,
    to_evaluate_order_qty: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户信息
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  spliceUserInfoIndex(res) {
    var resObj = res.data.body;
    this.setData({
      coupons_cc: resObj.coupons_cc,
      coupons_coupon: resObj.coupons_coupon,
      to_pay_order_qty: resObj.to_pay_order_qty > 99 ? '99+' : resObj.to_pay_order_qty,
      to_receipt_order_qty: resObj.to_receipt_order_qty > 99 ? '99+' : resObj.to_receipt_order_qty,
      to_evaluate_order_qty: resObj.to_evaluate_order_qty > 99 ? '99+' : resObj.to_evaluate_order_qty
    })
  },

  onShow: function () {
   
  },
  bottomNav(e) {
    getApp(e).bottomNav(e);
  },
  toaddressList() {
    wx.navigateTo({
      url: '../chaneadres/chaneadres'
    })
  },

  toMyOrders(e) {
    var order_status = e.currentTarget.dataset.order_status;
    wx.navigateTo({
      url: '../myOrders/myOrders?order_status=' + order_status
    })
  },

  tocoupon() {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  togiftcertificate() {
    wx.navigateTo({
      url: '../giftcertificate/giftcertificate'
    })
  }
})