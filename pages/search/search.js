Page({
  data: {
    keyword:'',
    keywordlist:[],
    status:1,
    //搜索结果相关
    sortKind: "",
    paixu: true,
    goodsStart: 1,
    rows: 20,
    scrollTop: 1,
    endFlage: 1,
    addflage: 1,
    pageNum : 1,
    catId : '',
    //商品
    goodsList:[]
  },
  onLoad: function (options) {
    this.getHistory();
    this.setSorting();
  },
  onShow: function () {
  
  },
  //清空关键字
  clearKeyWord(){
    this.setData({
      keyword:'',
      status: 1
    })
    this.setData({
      goodsStart: 1,
      endFlage: 1,
      goodsList: []
    })
  },
  //清除历史记录
  clearhis(){
    var me = this;
    wx.showModal({
      title: '',
      cancelText:'再想想',
      confirmText:'删除',
      content: '是否清空搜索历史',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorageSync('keywordlist');
          wx.setStorageSync('keywordlist', [])
          me.setData({
            keywordlist: []
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获得历史搜索
  getHistory(){
    var keywordlist = wx.getStorageSync('keywordlist');
    console.log(keywordlist)
    this.setData({
      keywordlist: keywordlist
    })
  },
  //获得关键字
  getKeyWord(e){
    var keyword = e.detail.value;
    var status;
    if (keyword == ''){
      this.setData({
        goodsStart: 1,
        endFlage: 1,
        goodsList: []
      })
      status = 1;
    }else{
      status = 2;
    }
    this.setData({
      keyword: keyword,
      status: status
    })
    console.log(this.data.keyword)
  },
  serach(){
    var keyword = this.data.keyword;
    if (keyword != ''){
      //缓存搜索历史
      this.saveHistoryword(keyword);
    }
    //发起请求
    this.setData({
      keyword: keyword,
      status : 3
    })
   //获取列表
   this.getList();
  },
  saveHistoryword(keyword){
    var oldkeyWordlist = wx.getStorageSync('keywordlist');
    var newKeyWordList = []
    if (typeof oldkeyWordlist == 'undefined' || oldkeyWordlist == '') {
      console.log(222);
      newKeyWordList.unshift(keyword)
      wx.setStorageSync('keywordlist', newKeyWordList)
      this.setData({
        keywordlist: newKeyWordList
      })
    } else {
      //检查是否有已有
      for (let i = 0; i < oldkeyWordlist.length; i++) {
        console.log(oldkeyWordlist[i])
        var index = oldkeyWordlist.indexOf(keyword);
        if (index > -1) {
          oldkeyWordlist.splice(index, 1);
        }
      }

      if (oldkeyWordlist.length < 10) {
        oldkeyWordlist.unshift(keyword)
        wx.setStorageSync('keywordlist', oldkeyWordlist)
      } else {
        oldkeyWordlist.pop();
        oldkeyWordlist.unshift(keyword);
        wx.setStorageSync('keywordlist', oldkeyWordlist)
      }
      this.setData({
        keywordlist: oldkeyWordlist
      })
    }
  },
  //点击历史
  clickhisword(e) {
    var index = e.currentTarget.dataset.index;
    var hotlist = this.data.keywordlist;
    for (let i = 0; i < hotlist.length; i++) {
      if (index == i) {
        console.log(hotlist[i])
        var keyword = hotlist[i];
      }
    }
    this.setData({
      keyword: keyword,
      status: 3
    })
    this.getList();
  },
  // 搜索相关
  setSorting() {
    var sortList = [
      { title: "综合排序", select: 0, kind: "comprehensive" },
      { title: "按价格", select: 1, kind: "vipPrice" },
      { title: "按销量", select: 1, kind: "prodcutsellamount" }
    ];
    this.setData({
      sorting: sortList,
      sortKind: sortList[0].kind
    })
  },
  tapStor(e) {
    var index = e.currentTarget.dataset.index;
    var sorting = this.data.sorting;
    for (let i = 0; i < sorting.length; i++) {
      sorting[i].select = 1;
      if (index == i) {
        sorting[i].select = 0;
        this.setData({
          sortKind: sorting[i].kind
        })
      }
    }
    this.setData({
      goodsStart: 1,
      endFlage: 1,
      sorting: sorting
    })
    console.log(this.data.sortKind)
    if (this.data.sortKind == 'vipPrice') {
      if (this.data.paixu) {
        this.setData({
          paixu: false
        })
      } else {
        this.setData({
          paixu: true
        })
      }
    } else {
      this.setData({
        paixu: true
      })
    }
    console.log(this.data.sortKind, this.data.paixu)
    this.goTopFun();
    this.getList();
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop': _top
    });
  },
  onReachBottom: function () {
    //上拉加载
    wx.showLoading({
      title: '正在加载',
    })
    if (Page.total / 20 >= this.data.pageNum) {
      this.setData({ hiddenloading: true, pageNum: ++this.data.pageNum });
      this.getList();
    } else {
      wx.showToast({
        title: '亲，我也是有底线的',
        icon: 'none'
      })
    }
  },
  getList: function () {
    var para = {
      title: this.data.keyword,
      catId: this.data.catId,
      pageNum: this.data.pageNum
    }
    var that = this
    var url = getApp().data.url + 'item/queryproList.json';
    wx.request({
      url: url,
      data: para,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res) {
        console.info(res);
        if(res.data.success){
          Page.total = res.data.data.total;
          
          if (Page.tmpArr == null || Page.tmpArr == undefined) {
            Page.tmpArr = res.data.data.contents;
          } else {
            Page.tmpArr = Page.tmpArr.concat(res.data.data.contents)
          }
          that.setData({
            goodsList: Page.tmpArr
          })

          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }else{
          wx.showToast({
            title: '获取数据失败，请稍后重试',
            icon: 'none'
          });
        }
        
      }
    })
  },
  toGoodesDetails(e) {
    var productid = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../pDetails/pDetails?productid=' + productid
    })
  },
})