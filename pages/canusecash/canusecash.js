// pages/canusecash/canusecash.js
Page({
  data: {
    cashList: [],
    isoto: "",
    selectCashid: ""
  },
  onLoad: function (options) {
    var isoto = options.isoto;
    var phone = options.phone;
    if (isoto == 'true') {
      this.setData({
        isoto: true,
        phone: phone
      })
    } else {
      this.setData({
        isoto: false,
        phone: phone
      })
    }
    console.log(phone)
  },
  onShow: function () {
    this.getCash();
  },
  //获得优惠券
  getCash() {
    var cashList = [];
    if (wx.getStorageSync('orderObj').useable_list == undefined) {
      cashList = [];
    } else {
      cashList = wx.getStorageSync('orderObj').useable_list;
    }

    var selectid;
    if (wx.getStorageSync('orderObj').coupons == undefined) {
      selectid = '';
    } else {
      selectid = wx.getStorageSync('orderObj').coupons.id;
    }
    var myCashList = [];
    for (let i = 0; i < cashList.length; i++) {
      var obj = {};
      obj = cashList[i];
      if (cashList[i].id == selectid) {
        obj.select = true;
      } else {
        obj.select = false;
      }
      myCashList.push(obj)
    }

    this.setData({
      cashList: cashList
    })

  },
  //设置订单
  setOrder(e) {
    var body = {};
    body.address_id = wx.getStorageSync('addressId');
    body.supermarket_id = wx.getStorageSync('supermarket_id');
    body.use_coupon = 0;
    body.is_o2o = this.data.isoto;
    body.coupon_id = e.currentTarget.dataset.couponid;
    console.log(body);
  },
  setOriderSug(res) {
    var resObj = res.data;
    if (resObj.header.res_code == 0 || resObj.header.res_code == 6001008 || resObj.header.res_code == 6001006) {
      wx.setStorageSync('orderObj', resObj.body);
      this.getCash();

      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        otoflage: this.data.isoto,
        phone: this.data.phone
      });
      wx.navigateBack({//返回
        delta: 1
      })
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none'
      })
    }
  },
})