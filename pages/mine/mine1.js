//mine.js
var checkLogin = require('../../utils/util.js'); 
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    var that = this
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    }else{
      that.setData({
        userInfo:app.globalData.userInfo,
        rec_id: app.globalData.rec_id,
        openid: app.globalData.openid
      })
    }
    
  },
  myOrderTap : function(){
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../orders/myorder',
      })
    }
      
  },
  myAddressTap: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '../address/address?from=mine',
      })
    }  
  },
  myAcode : function(){
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/acode/acode',
      })
    }
  },
  getRecOrders : function() {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/rec_orders/order',
      })
    }
  },
  goRechargePage: function () {
    if (!app.globalData.userInfo && checkLogin.checkLogin()) {
      app.getUserInfo()
    } else {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
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
  replyTixian : function(){
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
            url: '/pages/tixian/tixian?ketixian=' + ketixian,
          })
        }
      })
    } 
  }
})
