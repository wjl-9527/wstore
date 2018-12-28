Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyItems: [],
    curNav: 1,
    curIndex: 0
  },

  //事件处理函数  
  switchRightTab: function (e) {
    console.info(e);
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.classifyShow();
  },
  classifyShow: function (success) {
    var that = this;
    var url = getApp().data.url + 'wechatApplet/findPrdCategoryInApplet.json';
    wx.request({
      url: url,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if(res.data.success){
          console.info(res.data.data);
          that.setData({
            classifyItems: res.data.data
          })
        }
      }
    })
  },
  bottomNav(e) {
    getApp(e).bottomNav(e);
  },
})