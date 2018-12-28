Page({

  data: {
    order_amount : 0
  },

  onLoad: function (options) {
    this.setData({
      order_amount: options.order_amount
    })
  },

  toMyorder(){
    wx.redirectTo({
      url: '../myOrders/myOrders?order_status=' + 3
    })
  },

  toMain(){
    wx.redirectTo({
      url: '../eIndex/eIndex'
    })
  }
  
})