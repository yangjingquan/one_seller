var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
      var that = this
      var order_id = options.order_id
      var status = options.status
      that.getOrderInfo(order_id)
      that.setData({
        order_id: order_id,
        pay_status: status
      })
  },
  
  //生成微信预订单
  makePreOrder: function (order_id) {
    var that = this
    var pdata = {
      order_id: order_id,
      body: '商品',
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.payUrl,
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
        //更改订单状态为已付款
        wx.request({
          url: app.globalData.requestUrl + '/order/updateOrderStatus',
          data: { order_id: order_id },
          method: 'post',
          header: {
            'content-type': ''
          },
          success: function (res) {

          }
        })
        if (!app.globalData.rec_id || app.globalData.rec_id == '') {
          wx.navigateTo({
            url: '/pages/orders/myorder'
          })
        } else {
          //设置主订单表推荐人及佣金信息
          wx.request({
            url: app.globalData.requestUrl + '/order/setMainRecInfo',
            data: { order_id: order_id, rec_id: app.globalData.rec_id },
            method: 'post',
            header: {
              'content-type': ''
            },
            success: function (res) {
              wx.navigateTo({
                url: '/pages/orders/myorder'
              })
            }
          })
        } 
      }
    })
  },
  //获取订单号和总价格
  getOrderInfo : function(order_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/order/getOrderInfoByOrderId',
        data: { order_id: order_id},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
            that.setData({
              'order_no': res.data.result.order_no,
              'total_amount': res.data.result.total_amount,
            })
        }
      })
  },
  //跳转到订单列表
  preview_orders : function(){
    wx.navigateTo({
      url: '/pages/orders/myorder',
    })
  },
  //重新支付
  repay : function(){
      var that = this
      var order_id = that.data.order_id
      that.makePreOrder(order_id)
  }
})
