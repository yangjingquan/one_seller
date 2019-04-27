// pages/user1/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    telephone: '',
    dd_state: true,
    vip_status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
   
    //获取会员信息
    wx.request({
      url: app.globalData.requestUrl + '/zb/getMemberInfo',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        mem_id: app.globalData.openid
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          huiyuan: res.data.result
        })
      }
    })
  },

  //会员卡点击
  vip_btn: function () {
    if (this.data.vip_status == false) {
      this.setData({
        vip_status: true
      })
    } else {
      this.setData({
        vip_status: false
      })
    }

  },
  //收藏
  collect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  //普通订单
  dd_putong: function () {
    this.setData({
      dd_state: true
    })
  },
  //拼团订单
  dd_pintuan: function () {
    this.setData({
      dd_state: false
    })
  },
  //跳转普通订单页
  get_xiangqing: function (o) {
    wx.navigateTo({
      url: '/pages/orders/myorder?status=' + o.currentTarget.dataset.status,
    })
  },
  //跳转拼团订单页
  get_xiangqing1: function (o) {
    console.log(o.currentTarget.dataset.status)
    wx.navigateTo({
      url: '/pages/orders1/myorder?status=' + o.currentTarget.dataset.status,
    })
  },
  renzheng: function () {

    wx: wx.navigateTo({
      url: '/pages/user/renzheng/renzheng',
    })
  },
  //优惠券
  myCoupon: function () {
    wx.navigateTo({
      url: '/pages/user/my_coupon/my_coupon',
    })
  },
  // 地址
  myAddressTap: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }
  },
  goMyBalancePage: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/balance/balance',
      })
    }
  },
  goMyJifen: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/jifen/jifen',
      })
    }
  },
  myziliao: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/ziliao/ziliao',
      })
    }
  },

  //二维码
  myAcode: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },
  //大转盘
  dzp: function () {
    wx.navigateTo({
      url: '/pages/dzp/dzp',
    })
  },
  //积分
  jifen: function () {
    wx.navigateTo({
      url: '/pages/jf_products/jf_products',
    })
  },


  getMyIncome: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: {openid : app.globalData.openid},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/income/income?ketixian=' + ketixian + '&tixianzhong=' + tixianzhong,
          })
        }
      })
    }  
  },
  getMyIncome: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      //获取可提现金额和提现中金额
      wx.request({
        url: app.globalData.requestUrl + '/index/getMyIncome',
        data: { openid: app.globalData.openid },
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var result = res.data.result
          var ketixian = result.ketixian
          var tixianzhong = result.tixianzhong
          wx.navigateTo({
            url: '/pages/income/income?ketixian=' + ketixian + '&tixianzhong=' + tixianzhong,
          })
        }
      })
    }
  },
  //推荐订单
  getRecOrders: function () {
    if (!app.globalData.userInfo) {
      app.getUserInfo(true)
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },
  //立即充值
  goRechargePage: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo,
      telephone: app.globalData.telephone
    })

    if (this.data.telephone) {
      // console.log('1', '用户登录后')
      this.setData({
        img_state1: true,
        img_state: false
      })
    } else {
      this.setData({
        img_state1: false,
        img_state: true
      })
    }
  },
  onPullDownRefresh: function () {
    var that = this
    //获取会员信息
    wx.request({
      url: app.globalData.requestUrl + '/zb/getMemberInfo',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        mem_id: app.globalData.openid
      },
      success: function (res) {
        console.log(res)
        that.setData({
          huiyuan: res.data.result
        })
        wx.stopPullDownRefresh()
      }
    })
  }
})