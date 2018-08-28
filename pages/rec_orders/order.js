// order.js
var app = getApp()
Page({
  data: {
      
  },
  onLoad : function(){
    var that = this
    console.log(app.globalData.openid)
    wx.request({
      url: app.globalData.requestUrl + '/order/getRecOrders',
      data: { openid: app.globalData.openid },
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
        that.setData({
          rec_info: res.data.result ? res.data.result : '',
          count: res.data.count ? res.data.count : 0
        })
      }
    })
  }
 
})