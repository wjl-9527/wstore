var app = getApp();
Page({
  data: {
    marketname: '',
    sku:'',
    pageNum:1,
    banner: [
      'http://img.wxmercurysix.cn/group1/M00/00/F2/wKhkBVvg6DiAe9-NAAB4urSdsCY433.jpg',
      'http://img.wxmercurysix.cn/group1/M00/00/F2/wKhkBVvg6D2Ac1dTAAERmiTRK-0322.jpg',
      'http://img.wxmercurysix.cn/group1/M00/00/F2/wKhkBVvg6EeACYWYAADit6O2Xk8107.jpg'
    ],
    newImg : [
      '../image/banner1.jpg',
      '../image/banner2.jpg',
      '../image/banner3.jpg'
    ]
  },
  onLoad : function(){
    this.getList("", "", this.data.pageNum);
  },
  onShow: function () {
    getApp().getCartNum(this);

  },
  getList : function(title,catId,pageNum){
    var para = {
          title: title,
          catId : catId,
          pageNum: pageNum
    }
    var that = this
    var url = getApp().data.url + 'item/queryproList.json';
    wx.request({
      url: url,
      data: para,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        Page.total = res.data.data.total;
        if (Page.tmpArr == null || Page.tmpArr==undefined){
          Page.tmpArr = res.data.data.contents;
        }else{
            Page.tmpArr=Page.tmpArr.concat(res.data.data.contents)
        }
          that.setData({
            content: Page.tmpArr
          });
        
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
    }
    })
  },
  toDetailsTap : function(e){
    wx.navigateTo({
      url: "/pages/pDetails/pDetails?productid=" + e.currentTarget.dataset.productid
    })
  },
  onShareAppMessage : function(res){
    return {
      title: '水星家纺测试商城',
      path: '/item/index'
    }
  },
  bottomNav(e) {
    getApp(e).bottomNav(e);
  },
  addGoods(e){
    var skuid = e.currentTarget.dataset.skuid;
    this.setData({
      sku: skuid
    })
    getApp().addPro(this);
  },
  selsctMarket(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  toPdetails(e){
    var skuid = e.currentTarget.dataset.skuid;
    wx.navigateTo({
      url: '../pDetails/pDetails?skuid=' + skuid
    })
  },
  toclassification(e){
    var link = e.currentTarget.dataset.link;
    var categoryid = link.split(',')[0].split('&')[1].split('=')[1];
    if (categoryid == 1){
      categoryid = ""
    }
    wx.redirectTo({
      url: '../classification/classification?categoryid=' + categoryid,
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})