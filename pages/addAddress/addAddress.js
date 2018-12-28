Page({
  data: {
    cityData : {},
    fromFlage:"",
    //信息相关
    name: '',
    mob: '',
    detalis: '',
    textareaDis : false,
    pageFrom : "",
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    choosevent: 'changeArea',
    ispickfree : ''
  },
  onLoad: function (options) {
    this.setData({
      fromFlage: wx.getStorageSync('fromFlage'),
      pageFrom: options.pageFrom
    })
    wx.showLoading({
      title: '',
      mask:true,
      icon: 'loading'
    })
    this.areaData();
  },
  switch1Change : function(e){
    console.info(e.detail.value);
    if (e.detail.value){
      this.setData({
        province: '上海',
        city: '上海市',
        county: '奉贤区',
        detalis :'肖玻路128号',
        textareaDis : true,
        choosevent:'noevent',
        ispickfree : 'zt'
      })
    }else{
      this.setData({
        province: '北京',
        city: '北京市',
        county: '东城区',
        detalis: '',
        textareaDis :false,
        choosevent: 'changeArea',
        ispickfree : ''
      })
    }
  },
  areaData : function(){
    var that = this;
    var para = {};
    var url = getApp().data.url + 'wechatApplet/queryAddressInWechatApplet.json';
    wx.request({
      url: url,
      data: para,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        that.setData({
          cityData: res.data.data
        })
        // 初始化数据
        that.setAreaData()
      }
    })
    
  },
  setAreaData: function () {
    var that = this;
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    wx.hideLoading();
  },
  changeArea: function () {
    this.setData({
      showDistpicker: true,
      textareaDis:true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false,
      textareaDis: false
    })
  },
  getname(e) {
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  getMob(e) {
    var mob = e.detail.value;
    this.setData({
      mob: mob
    })
  },
  getDetalis(e) {
    var detalis = e.detail.value;
    this.setData({
      detalis: detalis
    })
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  saveAddress() {
    var consignee = this.data.name;
    var mobile = this.data.mob;
    var add_detail = this.data.detalis;
    var province = this.data.province;
    var county = this.data.county;
    var city = this.data.city;
    var ispickfree = this.data.ispickfree;
    if (consignee == "" || consignee == "undefined" || mobile == "" || mobile == "undefined" || add_detail == "" || add_detail == "undefined" || province == "" || province == "undefined") {
      wx.showToast({
        title: '请填入完整信息',
        icon: 'none'
      })
    } else {
      var telRule = /^1[3|4|5|7|8]\d{9}$/,
        nameRule = /^[\u2E80-\u9FFF]+$/;
      if (!telRule.test(mobile)) {
        wx.showToast({
          title: '手机号码格式不正确',
          icon: 'none'
        })
      } else {
        var body = {};
        var url = getApp().data.url + 'wechatApplet/saveOrUpdateAddressInWechatApplet.json';
        body.recipient = consignee;
        body.phoneNum = mobile;
        body.address = add_detail;
        body.province = province;
        body.county = county;
        body.city = city;
        body.unused1 = ispickfree;//自提
        body.unused = '';//是否默认
        console.log(body);
        wx.request({
          url: url,
          data: body,
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success(res) {
            if(res.data.success){
              wx.navigateTo({
                url: '../chaneadres/chaneadres',
              })
            }
          }
        })

      }
    }
  }
})