//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrl: app.globalData.imgUrl
  },
  onLoad: function (options) { 
    var that = this
    var bis_id = app.globalData.bis_id
    that.getOpenid(options)
    
    //首页banner
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
      data: {bis_id : bis_id},
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecommendProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result
        })
      }
    }),
    //新品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getNewProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          new_pro_info: res.data.result
        })
      }
    })
  },
  //获取详情
  getProDetail: function(event){
    var pro_id = event.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '/pages/index/pro_detail/pro_detail?pro_id=' + pro_id,
    })   
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var bis_id = app.globalData.bis_id
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.requestUrl + '/index/getBannersInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_pics: res.data.result
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    }),
    //推荐商品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getRecommendProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          recommend_info: res.data.result
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    }),
    //新品列表
    wx.request({
      url: app.globalData.requestUrl + '/index/getNewProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        that.setData({
          new_pro_info: res.data.result
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '900乐居家电小程序系统，期待你的光临！',
      path: '/pages/index/index'
    }
  },
  //获取openid
  getOpenid: function (options){
    var that = this
    //获取openid
    wx.login({
      success: function (res) {
        var postdata = {
          appid: app.globalData.appid,
          secret: app.globalData.secret,
          code: res.code
        }

        wx.request({
          url: app.globalData.requestUrl + '/index/getOpenIdOnly',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            var openid = res.data.openid
            that.checkRecStatus(options, openid)
          }
        })
      }
    })
  },
  //判断是否被推荐
  checkRecStatus: function (options, openid){
    var that = this
    var bis_id = app.globalData.bis_id
    
    //判断是否获取到推荐人参数
    if (!options.id || options.id == 'undefined') {
      var postdata = {
        openid: openid,
        bis_id: bis_id
      }
    } else {
      var userid = options.id
      var postdata = {
        rec_id: userid,
        openid: openid,
        bis_id: bis_id
      }
    }
    //检验本用户是否被别人推荐，如果已被推荐，不操作；无被推荐，把推荐用户id更新到会员表中
    wx.request({
      url: app.globalData.requestUrl + '/members/checkRecStatus',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {
        app.globalData.rec_id = res.data.result
      }
    })
  },
  //跳转搜索页面
  searchTab : function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})