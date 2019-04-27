var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.request({
      url: app.globalData.requestUrl + '/zb/getUserinfo',
      header: {
        'content-type': ''
      },
      method: 'POST',
      data: {
        mem_id: app.globalData.openid,
      },
      success: function (res) {
        console.log(res, app.globalData.openid)
        that.setData({
          truename: res.data.result.truename,
          mobile: res.data.result.mobile,
          address: res.data.result.address,
          email: res.data.result.email,
        })
      }
    })

  },

  getTruename: function (e) {
    this.setData({
      truename: e.detail.value
    })
  },

  getMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  getEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  getAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  btn: function (imgs) {
    var that = this
    //提交数据
    if (!that.data.truename) {
      wx.showToast({
        title: '请输入姓名',
      });
    } else if (!that.data.mobile) {
      wx.showToast({
        title: '请输入电话',
      });
    } else {
      var that = this
      var data = {
        mem_id: app.globalData.openid,
        truename: that.data.truename,
        mobile: that.data.mobile,
        address: that.data.address,
        email: that.data.email,
      }
      console.log(data)

      wx.request({
        url: app.globalData.requestUrl + '/zb/editUserinfo',
        data: data,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          console.log(res)
          if (res.data.statuscode == 1) {
            // console.log('111')
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function () {
                // wx.reLaunch({
                //   url: '/pages/user/user',
                // })
              }
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'error',
              duration: 2000,
              mask: true,
              success: function () {
                // wx.reLaunch({
                //   url: '/pages/user/user',
                // })
              }
            })
          }
          
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})