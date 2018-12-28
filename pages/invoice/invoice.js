// pages/invoice/invoice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTypeitems: [
      { name: '0', value: '不开发票', checked: 'true' },
      { name: '99', value: '开发票', checked: '' },
    ],
    inTop: [
      { name: '1', value: '个人', checked: 'true' },
      { name: '2', value: '公司', checked: '' },
    ],
    inCon: [
      { name: '明细', value: '明细', checked: 'true' },
      { name: '商品大类', value: '商品大类', checked: '' },
    ],
    inType: false,
    isCompany: false,
    invoice_type: 0,
    invoice_title: "个人",
    invoice_num: "",
    invoice_contect: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var invoice_type = options.invoice_type,
      invoice_title = options.invoice_title,
      invoice_num = options.invoice_num,
      invoice_contect = options.invoice_contect,
      inTypeitems = this.data.inTypeitems,
      inTop = this.data.inTop,
      inCon = this.data.inCon;
    this.setData({
      invoice_type: invoice_type,
      invoice_title: invoice_title,
      invoice_num: invoice_num,
      invoice_contect: invoice_contect
    })

    if (invoice_type != 0) {
      inTypeitems[0].checked = "";
      inTypeitems[1].checked = "true";
      this.setData({
        inType: true,
        inTypeitems: inTypeitems
      })
    }
    if (invoice_type == 1) {
      inTop[0].checked = "true";
      inTop[1].checked = "";
      this.setData({
        isCompany: false,
        invoice_title: "个人",
        invoice_num: "",
        inTop: inTop
      })
    }
    if (invoice_type == 2) {
      inTop[0].checked = "";
      inTop[1].checked = "true";
      this.setData({
        isCompany: true,
        invoice_title: invoice_title,
        invoice_num: invoice_num,
        inTop: inTop
      })
    }
    console.log(invoice_contect);
    if (invoice_contect == '明细' || invoice_contect == "") {
      inCon[0].checked = "true";
      inCon[1].checked = "";
      this.setData({
        inCon: inCon
      })
    } else {
      inCon[0].checked = "";
      inCon[1].checked = "true";
      this.setData({
        inCon: inCon
      })
    }
  },

  typeChange(e) {
    var inTy = e.detail.value;
    if (inTy == 99) {
      this.setData({
        inType: true,
        invoice_type: 1,
        invoice_contect: "明细",
      })
    } else {
      this.setData({
        inType: false,
        invoice_type: 0,
        invoice_contect: "",
      })
    }
  },
  topChange(e) {
    var inTy = e.detail.value;
    if (inTy == 2) {
      this.setData({
        isCompany: true,
        invoice_type: 2,
        invoice_title: "",
      })
    } else {
      this.setData({
        isCompany: false,
        invoice_type: 1,
        invoice_title: "个人",
        invoice_num: "",
      })
    }
  },
  conChange(e) {
    var inTy = e.detail.value;
    this.setData({
      invoice_contect: inTy,
    })
  },

  inpName: function (e) {
    var nameLen = e.detail.value.length;
    if (nameLen>=50){
      wx.showToast({
        title: '公司名称最多只能输入50个字符哦！',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      invoice_title: e.detail.value
    })
  },
  inpNum: function (e) {
    var numLen = e.detail.value.length;
    if (numLen >= 20) {
      wx.showToast({
        title: '请输入正确的纳税人识别号!',
        icon: 'none',
        duration: 1000
      })
    }
    this.setData({
      invoice_num: e.detail.value
    })
  },

  toConfirmOrder() {
    console.log(this.data);
    var myData = this.data;
    var invoice_type = myData.invoice_type;
    var invoice_title = myData.invoice_title;
    var invoice_num = myData.invoice_num;
    var invoice_contect = myData.invoice_contect;
    if (invoice_type == 2) {
      if (invoice_title == '') {
        wx.showToast({
          title: '请输入公司名称！',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      if (invoice_num == '') {
        wx.showToast({
          title: '请输入纳税人识别号！',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      var numLen = invoice_num.length;
      if (numLen < 15) {
        wx.showToast({
          title: '请输入正确的纳税人识别号!',
          icon: 'none',
          duration: 1000
        })
        return false;
      }

    }
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      invoice_type: invoice_type,
      invoice_title: invoice_title,
      invoice_num: invoice_num,
      invoice_contect: invoice_contect,
    });
    wx.navigateBack({//返回
      delta: 1
    })
  }
})