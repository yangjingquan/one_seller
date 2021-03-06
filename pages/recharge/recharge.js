// pages/recharge/recharge.js
var app = getApp()
Page({
  data: {

  },
  //初始化
  onLoad: function () {

  },

  //点击微信支付按钮
  formSubmit: function (e) {
    var that = this
    var amount = e.detail.value.amount
    var openid = app.globalData.openid
    var bis_id = app.globalData.bis_id

    var postdata = {
      amount: amount,
      openid: openid,
      bis_id: bis_id
    }
    if (!amount || amount < 0.01) {
      wx.showToast({
        title: '请输入金额！',
        image: '/pics/icons/tanhao.png',
        duration: 2000,
        mask: false
      })
    } else {
      //后台生成充值订单
      wx.request({
        url: app.globalData.requestUrl + '/order/makeRechargeOrder',
        data: postdata,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.response.statuscode == 0) {
            var order_id = res.data.data
            //生成微信预订单
            that.makePreOrder(order_id)
          } else {
            console.log(res.data.response.message)
          }
        }
      })
    }
  },
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '充值',
      openid: app.globalData.openid,
      bis_id: app.globalData.bis_id
    }
    wx.request({
      url: app.globalData.rechargePayUrl,
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id)
      }
    })
  },
  //调起微信支付
  wxPay: function (preData, order_id) {
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }
    })
  }
}) 