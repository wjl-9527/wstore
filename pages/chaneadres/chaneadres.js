// pages/addressList/addressList.js
Page({
  data: {
    addressList: [],
    pageFrom: "",
    isShow : false
  },
  onLoad() {
  },
  onShow: function () {
    this.setData({
      isShow: false
    })
    this.getAddressList();
  },
  //收货地址相关
  getAddressList() {
    var that = this;
    var url = getApp().data.url + 'wechatApplet/queryConsumerAddressInWechatApplet.json';
    wx.request({
      url: url,
      data: '',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        if(res.data.success){
          that.spliceAddress(res.data.data);
        }
      }
    })
  },
  spliceAddress(res) {
    console.info(res);
    var resObj = res;
    console.log(resObj)
    var addressList = [];
    if (typeof resObj == 'undefined'){
      addressList =[];
    }else{
      addressList=resObj;
    }
    this.setData({
      addressList: addressList,
      isShow: true
    })
  },
  deleAddress(e) {
    var me = this;
    var index = e.currentTarget.dataset.index;
    var addressList = this.data.addressList;
    var addressid;
    for (let i = 0; i < addressList.length; i++) {
      if (index == i) {
        addressid = addressList[i].address_id;

        break;
      }
    }
    wx.showModal({
      title: '',
      content: '确定删除该地址？',
      success: function (res) {
        if (res.confirm) {
          me.dele(addressid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  dele: function (a_id) {
    var url = getApp().data.url + 'userexpand/delAddress';
    var body = {
      address_id: a_id
    };
    getApp().wxAjax(this.splitList, url, body);
  },
  splitList(res) {
    var resObj = res.data;
    var addressList = [];
    if (resObj.address_list == undefined) {
      addressList = [];
    } else {
      addressList: resObj.address_list
    }
    var address_list = addressList;
    var selectLoction = wx.getStorageInfoSync("selectLoction");
    var selectloId = selectLoction.address_id;
    var delFlag = true;
    for (var i = 0; i < address_list.length; i++) {
      if (address_list[i].address_id == selectloId) {
        delFlag = false;
      }
    }
    if (delFlag) {
      wx.removeStorageSync("selectLoction");
    }
    if (resObj.header.res_code == 0) {
      this.setData({
        addressList: address_list
      })
    } else {
      wx.showToast({
        title: resObj.header.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
  toAddAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress?pageFrom=' + this.data.pageFrom
    })
  },
  toAddAddress2() {

    wx.redirectTo({
      url: '../addAddress/addAddress?pageFrom=index'
    })
  },
  selcetLocation(e) {
    var me = this;
    var index = e.currentTarget.dataset.index;
    var addressList = this.data.addressList;
    console.info(addressList);
    var id;
    var recipient;
    var phoneNum;
    var address;
    var city;
    var county;
    var unused1;
    var unused;
    var province;
    var selectLoction = {};
    for (let i = 0; i < addressList.length; i++) {
      if (index == i) {
        selectLoction.id = addressList[i].id;
        selectLoction.recipient = addressList[i].recipient;
        selectLoction.phoneNum = addressList[i].phoneNum;
        selectLoction.address = addressList[i].address;
        selectLoction.city = addressList[i].city;
        selectLoction.county = addressList[i].county;
        selectLoction.unused1 = addressList[i].unused1;
        selectLoction.unused = addressList[i].unused;
        selectLoction.province = addressList[i].province;
        break;
      }
    }
    wx.setStorageSync('changeLoction', selectLoction);
      wx.redirectTo({
        url: '../chaneMyaddress/chaneMyaddress',
      })
  }
})