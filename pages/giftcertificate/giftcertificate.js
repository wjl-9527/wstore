Page({

  data: {
    end : true,
    coupons_details : [],
    business_type : 0,
    page_index : 1,
    page_size : 5,
    couponType : "y",
    end2 : true,
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
      "page_size": this.data.page_size, "couponType": this.data.couponType
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().wxAjax(this.splicegetCouponsDetails, url, body);
  },

  splicegetCouponsDetails(res) {
    var resObj = res.data.body;
    console.log(resObj)
    var coupons_details_old = this.data.coupons_details;
    var count = resObj.count;
    coupons_details_old.push.apply(coupons_details_old, resObj.coupons_details);
    this.setData({
      coupons_details: coupons_details_old,
      end: resObj.end
    })
    var page_size = this.data.page_size;
    var business_type = this.data.business_type;
    if (business_type ==2){
      this.setData({
        end2: resObj.end,
        isShow: true
      })
    }

    if (business_type==0 && count < page_size){
      this.setData({
        business_type : 2,
        page_index:1
      })
      this.getCouponsDetails();
    }
    wx.hideLoading();
  },

  onReachBottom: function () {
    var end = this.data.end;
    var end2 = this.data.end2;
    var page_index = this.data.page_index;
    var business_type = this.data.business_type;
    this.setData({
      page_index: page_index + 1 
    })

    if (!end  ) {
      this.getCouponsDetails();
    }else{
      if (business_type == 0){
        this.setData({
          business_type: 2,
          page_index: 1
        })
        this.getCouponsDetails();
      }else{
        if (!end2)
        this.getCouponsDetails();
      }
    }
  },
  toPDetails(e){
    var skuid = e.currentTarget.dataset.sku_ctgy;
    wx.navigateTo({
      url: '../pDetails/pDetails?skuid=' + skuid
    })
  }
})