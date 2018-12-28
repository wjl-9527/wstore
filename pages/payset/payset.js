// pages/payset/payset.js
Page({
  data: {
    order_id: '',
    order_amount : 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.order_id);
    if (options.order_id == undefined){
      wx.showToast({
        title: '获取支付信息失败！请联系管理员',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    this.setData({
      order_id: options.order_id
    })
    this.getOrderMoney();
  },
  getOrderMoney(){
    var url = getApp().data.url + 'order/getOrderMoney';
    var body = {
      order_id: this.data.order_id
    };
    getApp().wxAjax(this.splitgetOrderMoney, url, body);
  },
  splitgetOrderMoney(res){
    var d = res.data.body;
    console.log(d);
    this.setData({
      order_amount: d.order_amount
    })
  },

  getPaySign(){
    var url = getApp().data.url + 'orderPay/getPaySign';
    var body = {
      shop_id: wx.getStorageSync('supermarket_id'),
      pay_type : 1,
      order_id: this.data.order_id
    };
    getApp().wxAjax(this.splitgetPaySign, url, body);
  },
  splitgetPaySign(res){
    var me = this;
    var d = res.data.body;
    wx.requestPayment({
      "timeStamp": d.cdoSign.timeStamp,
      "nonceStr": d.cdoSign.nonceStr,
      "package": d.cdoSign.package,
      "signType": d.cdoSign.signType,
      "paySign": d.cdoSign.sign,
      "success": function (res) {
        wx.redirectTo({
          url: '../paygo/paygo?order_amount=' + me.data.order_amount
        })
      },
      "fail": function (res) {
        console.log(res);
       
      }
    })
  }
})