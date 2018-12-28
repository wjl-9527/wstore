Page({
  data: {
    coupons_details: [],
    end: true,
    page_index: 1,
    page_size: 5,
    business_type: 0,
    couponType: "n",
    isShow: false
  },

  onLoad: function (options) {
    this.setData({
      isShow: false
    })
    this.getCouponsDetails();
  },

  getCouponsDetails() {
    var url = getApp().data.url + 'coupon/getCouponsDetails';
    var body = {
      "business_type": this.data.business_type, "page_index": this.data.page_index,
      "page_size": this.data.page_size, "couponType": this.data.couponType };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().wxAjax(this.splicegetCouponsDetails, url, body);
  },

  splicegetCouponsDetails(res) {
    var resObj = res.data.body;
    console.log(resObj)
    var coupons_details_old = this.data.coupons_details;
    coupons_details_old.push.apply(coupons_details_old, resObj.coupons_details);
    this.setData({
      coupons_details: coupons_details_old,
      end: resObj.end,
      isShow :true
    })
    wx.hideLoading();
  },

  toinvalidCoupon() {
    this.setData({
      page_index: 1,
      business_type: 2,
      coupons_details: [],
      isShow: false
    })
    this.getCouponsDetails();
  },
  toCoupon() {
    this.setData({
      page_index: 1,
      business_type: 0,
      coupons_details: [],
      isShow: false
    })
    this.getCouponsDetails();
  },

  onReachBottom: function () {
    var end = this.data.end;
    var page_index = this.data.page_index;
    this.setData({
      page_index: page_index + 1
    })
    if (!end) {
      this.getCouponsDetails();
    }
  },

  openRules(){
    wx.navigateTo({
      url: '../voucherRules/voucherRules'
    })
  }
})