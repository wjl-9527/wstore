Page({
  msgHandle: function (e) {

  },
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
  },
  data: {
    lmUrl: ""
  },
  onShow: function (options) {
    console.log(options)
    this.setData({
      lmUrl: wx.getStorageSync("lmUrl")
    })
  },

  onLoad: function (options) {
    console.log(options)

    // 获取网页传过来的值
    // TODO 用es6解构来获取值TODO


  },
})