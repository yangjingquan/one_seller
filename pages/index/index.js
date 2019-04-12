//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hotList: [
      {
        pic: "/pics/imgs/nav_pintuan.png",
        title: "积分商城",
        redirect_url: "../jf_products/jf_products"
      },
      {
        pic: "/pics/other/acode.png",
        title: "我的身份",
        redirect_url: "../acode/acode"
      },
      {
        pic: "/pics/imgs/nav_tuijian.png",
        title: "大转盘",
        redirect_url: "../dzp/dzp"
      },
      {
        pic: "/pics/imgs/008.png",
        title: "我的积分",
        redirect_url: "../jifen/jifen"
      }
    ],
  },
  onLoad: function (options) { 
    var that = this
    var bis_id = app.globalData.bis_id
    that.getOpenid(options)
    
    //首页banner
    that.getBannerInfo(bis_id)
    //推荐商品列表
    that.getRecommendProInfo(bis_id)
    //新品列表
    that.getNewProInfo(bis_id)
  },
  //判断是否被授权
  onReady: function (options) {
    wx: wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.reLaunch({
            url: '/pages/first/first',
          })
        } else {
          app.getOpenId()
        }
      }
    })
  },
  //获取banner
  getBannerInfo: function (bis_id){
    var that = this
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
      }
    })
  },
  //获取推荐商品列表
  getRecommendProInfo: function (bis_id) {
    var that = this
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
    })
  },
  //获取新品列表
  getNewProInfo : function(bis_id){
    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/index/getNewProInfo',
      data: { bis_id: bis_id },
      header: {
        'content-type': ''
      },
      success: function (res) {
        console.log(res.data.result)
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
      title: '轻商小程序系统，更快！更流畅！',
      path: '/pages/index/index'
    }
  },
  redirectTo: function (e) {
    var url = e.currentTarget.dataset.redirecturl
    wx.navigateTo({
      url: url
    });
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