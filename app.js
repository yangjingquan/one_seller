//app.js
App({
  onLaunch: function() {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        if (!res.data || res.data == '') {
          //获取用户信息
          var loginStatus = true;
          that.getUserInfo(loginStatus)
        } else {
          that.globalData.openid = res.data
          wx.getStorage({
            key: 'userInfo',
            success: function (ress) {
              if (!ress.data || ress.data.length == 0) {
                //获取用户信息
                var loginStatus = true;
                that.getUserInfo(loginStatus)
              } else {
                that.globalData.userInfo = ress.data
              }
            },
            fail: function (ress) {
              //获取用户信息
              var loginStatus = true;
              that.getUserInfo(loginStatus)
            }
          })
        }

      },
      fail: function (res) {
        //获取用户信息
        var loginStatus = true;
        that.getUserInfo(loginStatus)
      }
    })
  },
  getUserInfo: function (loginStatus) {
    var that = this
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  that.globalData.userInfo = data.userInfo
                  //将userInfo存入缓存
                  wx.setStorage({
                    key: "userInfo",
                    data: data.userInfo
                  })
                  that.getOpenId()
                }
              });
            }
          }
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                //将userInfo存入缓存
                wx.setStorage({
                  key: "userInfo",
                  data: data.userInfo
                })
                that.globalData.userInfo = data.userInfo
                that.getOpenId()
              },
              fail: function () {
                loginStatus = false;
              }
            });
          }
        }
      })
    }
  },
  getOpenId: function() {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        var postdata = {
          appid: that.globalData.appid,
          secret: that.globalData.secret,
          code: res.code
        }

        wx.request({
          url: that.globalData.requestUrl + '/index/getOpenId',
          data: postdata,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
            that.globalData.openid = res.data.openid
            if (!res.data.openid) {
              that.getOpenId()
            } else {
              //将openid存入缓存
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
              that.addMembers()
            }
          }
        })
      }
    })
  },
  //添加会员
  addMembers: function () {
    var that = this
    var openid = that.globalData.openid
    var bis_id = that.globalData.bis_id
    var postdata = {
      openid: openid,
      avatarUrl: that.globalData.userInfo.avatarUrl,
      nickname: that.globalData.userInfo.nickName,
      city: that.globalData.userInfo.city,
      country: that.globalData.userInfo.country,
      sex: that.globalData.userInfo.gender,
      province: that.globalData.userInfo.province,
      bis_id: bis_id,
      username: openid
    }
    wx.request({
      url: that.globalData.extraRequestUrl + '/index/addMembers',
      data: postdata,
      header: {
        'content-type': ''
      },
      method: 'post',
      success: function (res) {

      }
    })
  },  
  globalData: {
    userInfo: null,
    bis_id: '50',
    appid: "wxad58d8a5bce016a9",
    secret: "bd1a1e37900b08f07d2914b8be1ee78a",
    openid: '',
    acode: '',
    rec_id: '',
    //腾讯云正式
    requestUrl: "https://julian.dxshuju.com/index",
    extraRequestUrl: "https://julian.dxshuju.com/business",
    acodeUrl: "https://julian.dxshuju.com/",
    oriPayUrl: "https://julian.dxshuju.com/pay/OriWxPay/pay",
    rechargePayUrl: "https://julian.dxshuju.com/pay/RechargeWxPay/pay"
  }
})
