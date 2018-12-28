Page({
  data: {
    tapList : {},
    order_status : 0,
    page_index : 1,
    order_list : [],
    nodes : [],
    isShow : false,
    totalPage : 0,
    floorstatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTapList(options.order_status);
  },

  onShow: function (){
    var myDetailsUp = wx.getStorageSync("myDetailsUp");
    if (myDetailsUp == "y"){
      var index = wx.getStorageSync("myOrdersindex");
      var nodes = this.data.order_list;
      nodes.splice(index, 1);
      this.setData({
        order_list: nodes,
        isShow: false
      })
    }
  },

  //查询订单
  getMyOrders(){
    var that = this;
    var url = getApp().data.url + 'wechatApplet/queryOrderInWechatApplet.json';
    var status = "";
    if (this.data.order_status == 1){
      status = "";
    } else if (this.data.order_status == 2){
      status = "WAIT_BUYER_PAY";
    } else if (this.data.order_status == 3) {
      status = "WAIT_SELLER_SEND_GOODS";
    } else if (this.data.order_status == 4) {
      status = "WAIT_BUYER_CONFIRM_GOODS";
    }
    var body = {
      "status": status, "pageNum": this.data.page_index, openid: getApp().globalData.openid
    };
    wx.showLoading({
      title: '加载中..',
    })
    wx.request({
      url: url,
      data: body,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.success) {
          that.splicegetMyOrders(res);
        }
      }
    })
  },

  //查询回调
  splicegetMyOrders(res){
    var resObj = res.data.data.contents;
    console.log(resObj)
    var order_list_old = this.data.order_list;
    order_list_old.push.apply(order_list_old, resObj);
    this.setData({
      order_list: order_list_old,
      isShow: true,
      totalPage: res.data.data.totalPage
    })
    wx.hideLoading();
  },


  setTapList(order_status){
    var tapList = [
      { title: "全部", select: 0, order_status: "1" },
      { title: "待支付", select: 0, order_status: "2" },
      { title: "待发货", select: 0, order_status: "3" },
      { title: "待收货", select: 0, order_status: "4" }
    ];

    for (let i = 0; i < tapList.length; i++) {
      tapList[i].select = 0;
      if (order_status == tapList[i].order_status) {
        tapList[i].select = 1;
        this.setData({
          order_status: tapList[i].order_status,
          page_index: 1,
          order_list: [],
          tapList: tapList
        })
      }
    }
    this.getMyOrders();
  },

  //tab 切换查询
  toQuery(e){
    var index = e.currentTarget.dataset.index;
    var tapList = this.data.tapList;
    for (let i = 0; i < tapList.length; i++) {
      tapList[i].select = 0;
      if (index == i) {
        tapList[i].select = 1;
        this.setData({
          order_status: tapList[i].order_status,
          page_index : 1,
          order_list: [],
          isShow: false
        })
      }
    }
    this.setData({
      tapList: tapList
    })
    this.getMyOrders();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page_index = this.data.page_index;
    this.setData({
      page_index: page_index + 1
    })
    if (page_index <= this.data.totalPage) {
      this.getMyOrders();
    }else{
      wx.showToast({
        title: '没有啦，已经到底了',
        icon: 'none'
      })
    }
  },
  //取消订单
  cancelorder(e){
    var me = this;
    wx.showModal({
      content: '确定取消订单？',
      cancelText : "暂不取消",
      cancelColor: "#999999",
      confirmColor: "#FF4844",
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          var orderid = e.currentTarget.dataset.orderid;
          var nodes = me.data.order_list;
          nodes.splice(index, 1);
          var url = getApp().data.url + 'order/cancelorder';
          var body = {
            "order_id": orderid
          };
          wx.showLoading({
            title: '加载中..',
          })
          getApp().wxAjax(me.splicecancelorder, url, body);
          wx.hideLoading();
          me.setData({
            nodes : nodes
          })

          console.log('用户点击确定')
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //取消订单回调
  splicecancelorder(res){
    var me = this;
    var resObj = res.data.header;
    console.log(resObj)
    var res_code = resObj.res_code;
    if (res_code == 0){
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000,
        success:function(){
          me.setData({
            order_list: me.data.nodes
          })
        }
      })
    }else{
      wx.showToast({
        title: '取消失败！请联系管理员！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //确认收货
  confirmorder(e){
    var index = e.currentTarget.dataset.index;
    var orderid = e.currentTarget.dataset.orderid;
    var nodes = this.data.order_list;
    nodes.splice(index, 1);
    var url = getApp().data.url + 'order/confirmorder';
    var body = {
      "order_id": orderid
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().wxAjax(this.spliceconfirmorder, url, body);

    wx.hideLoading();
    this.setData({
      nodes: nodes
    })
  },
  //确认收货回调
  spliceconfirmorder(res){
    var me = this;
    var resObj = res.data.header;
    console.log(resObj)
    var res_code = resObj.res_code;
    if (res_code == 0) {
      wx.showToast({
        title: '确认收货成功',
        icon: 'success',
        duration: 1000,
        success:function(){
          me.setData({
            order_list: me.data.nodes
          })
        }
      })
    } else {
      wx.showToast({
        title: '确认收货失败！请联系管理员！',
        icon: 'none',
        duration: 1000
      })
    }
  },

  toOrderDetails(e){
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync("myOrdersindex", index);
    wx.setStorageSync("myDetailsUp", "n");
    var order_id = e.currentTarget.dataset.order_id;
    var supermarket_id = e.currentTarget.dataset.supermarket_id;
    var order_source = e.currentTarget.dataset.order_source;
    wx.navigateTo({
      url: '../oDetails/oDetails?order_id=' + order_id + '&supermarket_id=' + supermarket_id + '&order_source=' + order_source
    })
  },
  toPayset(e){
    console.info(e);
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "/pages/confirmOrder/confirmOrder?orderId=" + order_id
    })
  },
  //拨打电话
  contactUs: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.showActionSheet({
      itemList: [phone],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  goTop: function (e) {

    this.setData({

      scrollTop: 0

    })

  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})