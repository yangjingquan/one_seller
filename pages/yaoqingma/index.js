// pages/yaoqingma/index.js
var app = getApp()
Page({

  data: {
    yqm_text : ''
  },
  onShow: function (options) {
    var that = this
    var postdata = {
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.businessUrl + '/business/getYaoQingMa',
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        if(res.data.statuscode == 1){
          app.globalData.yaoqingma = res.data.result.yaoqingma
          that.setData({
            yqm_text: res.data.result.yaoqingma
          })
        }else{
          that.setData({
            yqm_text: ''
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    var that = this
    var yaoqingma = e.detail.value.yaoqingma
    var postdata = {
      bis_id: app.globalData.bis_id,
      yaoqingma: yaoqingma
    }
    wx.request({
      url: app.globalData.businessUrl + '/business/checkYaoQingMa',
      data: postdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        if(res.data.statuscode == 1){
          var pdata = {
            openid: app.globalData.openid,
            yaoqingma: yaoqingma
          }
          wx.request({
            url: app.globalData.businessUrl + '/business/addYaoQingMa',
            data: pdata,
            method: 'post',
            header: {
              'content-type': ''
            },
            success: function (res) {
              app.globalData.yaoqingma = res.data.result.yaoqingma
              that.setData({
                yqm_text: res.data.result
              })
            }
          })
        }else{
          wx.showToast({
            title: '邀请码不合法',
            image: '/pics/icons/tanhao.png',
            duration: 2000,
            mask: true
          })
        }
      }
    })
    
  }
})