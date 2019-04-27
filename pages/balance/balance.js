var app = getApp()

Page({
  data: {
    hidden: true,
    scrollTop: 0
  },
  onLoad: function (options) {
    var that = this
    //余额列表
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBalanceDetail',
      data: { openid: app.globalData.openid, page: 1},
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          result: res.data.result,
          hasMore: res.data.has_more,
          page: 1,
          balance: res.data.balance
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/bis/getBalanceDetail',
      data: { openid: app.globalData.openid, page: 1},
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          result: res.data.result,
          hasMore: res.data.has_more,
          page: 1,
          balance: res.data.balance
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  onReachBottom: function () {
    var that = this
    that.setData({
      hidden: false
    });
    var page = that.data.page
    page++
    var url = app.globalData.requestUrl + '/bis/getBalanceDetail'
    var postData = {
      openid: app.globalData.openid,
      page: page
    }
    if (that.data.hasMore == true) {
      that.setData({
        hasMore: false
      })
      wx.request({
        url: url,
        data: postData,
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          var list = that.data.result;
          if (res.data.statuscode == 1) {
            for (var i = 0; i < res.data.result.length; i++) {
              list.push(res.data.result[i]);
            }
            that.setData({
              result: list,
              page: page,
              hidden: true,
              hasMore: res.data.has_more,
              balance: res.data.balance
            });
          } else {
            that.setData({
              result: list,
              hidden: false,
              hasMore: false,
              balance: res.data.balance
            });
          }
        }
      });
    } else {
      that.setData({
        hidden: true
      });
    }
  },

})