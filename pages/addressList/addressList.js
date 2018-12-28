// pages/addressList/addressList.js
Page({
  data: {
    addressList:[],
    pageFrom:"",
    isShow: false
  },
  onLoad(e){
    this.setData({
      isShow: false
    })
    this.getAddressList();
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
        if (res.data.success) {
          that.spliceAddress(res.data.data);
        }
      }
    })
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
  spliceAddress(res) {
    console.info(res);
    var resObj = res;
    console.log(resObj)
    var addressList = [];
    if (typeof resObj == 'undefined') {
      addressList = [];
    } else {
      addressList = resObj;
    }
    this.setData({
      addressList: addressList,
      isShow: true
    })
  },
  deleAddress(e){
    var me = this;
    var index = e.currentTarget.dataset.index;
    var addressList = this.data.addressList;
    var addressid;
    for (let i = 0; i < addressList.length; i++) {
      if (index == i){
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
  dele:function(a_id){
    var url = getApp().data.url + 'userexpand/delAddress';
    var body = {
      address_id: a_id
    };
    getApp().wxAjax(this.splitList, url, body);
  },
  splitList(res){
    var resObj = res.data;
    var address_list = resObj.body.address_list;
    var selectLoction = wx.getStorageInfoSync("selectLoction");
    var selectloId = selectLoction.address_id;
    var delFlag = true;
    for (var i = 0; i < address_list.length;i++){
      if (address_list[i].address_id == selectloId){
        delFlag = false;
      }
    }
    if (delFlag){
      wx.removeStorageSync("selectLoction");
    }
    if (resObj.header.res_code == 0){
      this.setData({
        addressList: address_list
      })
    }else{
      wx.showToast({
        title: resObj.header.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
  toAddAddress(){
    wx.navigateTo({
      url: '../addAddress/addAddress?pageFrom=' + this.data.pageFrom
    })
  },
  selcetLocation(e){
    var me = this;
    var index = e.currentTarget.dataset.index;
    var addressList = this.data.addressList;
    var address_id;
    var consignee;
    var mobile;
    var add_detail;
    var position;
    var area;
    var through;
    var weft;
    var selectLoction = {};
    for (let i = 0; i < addressList.length; i++) {
      if (index == i) {
        selectLoction.address_id = addressList[i].address_id;
        selectLoction.consignee = addressList[i].consignee;
        selectLoction.mobile = addressList[i].mobile;
        selectLoction.add_detail = addressList[i].add_detail;
        selectLoction.position = addressList[i].position;
        selectLoction.area = addressList[i].area;
        selectLoction.through = addressList[i].through;
        selectLoction.weft = addressList[i].weft;
        break;
      }
    }
    wx.setStorageSync('selectLoction', selectLoction);
    var form = this.data.pageFrom;
    console.log(form)
    if (form == "index" || form == "corder"){
     wx.redirectTo({
       url: '../index/index',
     })
    }
  }
})