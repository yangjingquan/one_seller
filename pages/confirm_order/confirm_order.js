var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    transport_type: {},
    index : 0,
    showTransportFeeDetail : false,
    isChecked:false
  },
  
  onLoad: function (options) {
    var that = this
    var openid = options.openid
    var bis_id = app.globalData.bis_id
    //获取购物车内选中的信息
    that.getSelectedCartInfo(openid, bis_id)
  },
  //获取选中的购物车信息
  getSelectedCartInfo: function (openid, bis_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/shoppingcart/getSelectedCartInfo',
        data: { openid: openid, bis_id: bis_id},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          if (res.data.result.address_info.length == 0){
            that.setData({
              showAddress: false
            })
          }else{
            that.setData({
              showAddress: true
            })
          }
          var pro_amount = res.data.result.pro_amount
          //获取该店铺的运费模式
          wx.request({
            url: app.globalData.requestUrl + '/index/getTransportType',
            data: { bis_id: bis_id },
            method: 'post',
            header: {
              'content-type': ''
            },
            success: function (result) {
              var transportType = result.data.result.transport_type
              if (transportType == 1) {
                if (res.data.result.transportInfo.length == 0) {
                  wx.showToast({
                    title: '店家未设置快递方式',
                    image: '/pics/icons/tanhao.png',
                    duration: 1500,
                    mask: true,
                    success : function(){
                      that.setData({
                        transportType: transportType,
                        showFreightView: false,
                        total_amount: '0.00',
                        transport_fee: '0.00',
                        selected_transport_type: '',
                        buttonUsable : true
                      })
                    }
                  })     
                }else{
                  var first_heavy = res.data.result.transportInfo[0]['first_heavy']
                  var continue_heavy = res.data.result.transportInfo[0]['continue_heavy']
                  var continue_stage = res.data.result.transportInfo[0]['continue_stage']
                  var total_weight = res.data.result.total_weight
                  var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
                  var total_amount = (parseFloat(res.data.result.pro_amount) + parseFloat(transport_fee)).toFixed(2)
                  that.setData({
                    transportType: transportType,
                    showFreightView: true,
                    total_amount: total_amount,
                    need_pay_amount: total_amount,
                    transport_fee: transport_fee,
                    selected_transport_type: res.data.result.transportInfo[0]['mode_id'],
                    buttonUsable: false
                  })
                }  
              } else {
                var pro_amount = res.data.result.pro_amount
                var ykj_price = result.data.result.ykj_price
                var total_amount = parseFloat(pro_amount) + parseFloat(ykj_price)
                that.setData({
                  transportType: transportType,
                  showFreightView: false,
                  transport_fee: ykj_price,
                  total_amount: total_amount,
                  need_pay_amount: total_amount,
                  selected_transport_type: '',
                  buttonUsable: false
                })
              }
            }
          })
          that.setData({
            cart_info: res.data.result,
            transport_type: res.data.result.transportType,
            transport_info: res.data.result.transportInfo,
            pro_amount: pro_amount,
            total_weight: res.data.result.total_weight
          }) 
        }
      }) 
  },
  //支付按钮
  formSubmit : function(e){
    var that = this
    var formId = e.detail.formId
    var cart_info = that.data.cart_info
    var remark = e.detail.value.remark
    var pro_info_length = cart_info.pro_info.length
    if (cart_info.address_info.length == 0){
      wx.showToast({
        title: '请设置您的地址!',
        image: '/pics/icons/tanhao.png',
        duration: 2000,
        mask: true
      })
    }else{
      var postdata = {
        bis_id: app.globalData.bis_id,
        mem_id: app.globalData.openid,
        rec_name: cart_info.address_info.rec_name,
        mobile: cart_info.address_info.mobile,
        address: cart_info.address_info.address,
        id_no: cart_info.address_info.idno,
        total_amount: that.data.need_pay_amount,
        with_balance_amount: that.data.with_balance_amount,
        pro_amount: that.data.pro_amount,
        transport_fee: that.data.transport_fee,
        selected_transport_type: that.data.selected_transport_type,
        remark: remark,
        pro_info: cart_info.pro_info,
        appid: app.globalData.appid,
        secret: app.globalData.secret
      }
      
      //生成外部订单
      wx.request({
        url: app.globalData.requestUrl + '/order/makeOrder',
        data: postdata,
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var order_id = res.data.result
          if (parseFloat(that.data.need_pay_amount) < '0.01'){
            //减去消耗的余额
            wx.request({
              url: app.globalData.requestUrl + '/Members/subBalance',
              data: { bis_id: app.globalData.bis_id, openid: app.globalData.openid,with_balance_amount:that.data.with_balance_amount},
              method: 'post',
              header: {
                'content-type': ''
              },
              success: function (res) {
                if(res.data.response.statuscode == 0){
                  wx.navigateTo({
                    url: '/pages/after_pay/after_pay?order_id=' + order_id + '&status=success',
                  })
                }else{
                  console.log(res.data.response.messages)
                }
                  
              }
            })
          }else{
            //生成微信预订单
            that.makePreOrder(order_id, formId)
          }
        }
      })
    } 
  },
  //生成微信预订单
  makePreOrder: function (order_id, formId){
    var that = this
    var pdata = {
      order_id: order_id,
      body: '商品',
      openid: app.globalData.openid,
      bis_id: app.globalData.bis_id
    }
  
    wx.request({
      url: app.globalData.oriPayUrl,
      data: pdata,
      method: 'post',
      header: {
        'content-type': ''
      },
      success: function (res) {
        var preData = res.data.result
        //调起微信支付
        that.wxPay(preData, pdata.order_id, formId)
      }
    }) 
  },
  //调起微信支付
  wxPay: function (preData, order_id, formId){
    wx.requestPayment({
      timeStamp: (preData.timeStamp).toString(),
      nonceStr: preData.nonceStr,
      package: preData.package,
      signType: preData.signType,
      paySign: preData.sign,
      success: function (result) {
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
              url: '/pages/after_pay/after_pay?order_id=' + order_id + '&status=success',
            })
          }
        })
      },
      fail : function(res){
        var template_id = "SEX_cA2MxCtW5LTLdQQu6-YKSXIUQCIrk0TJ1q_jZKE"
        var openid = app.globalData.openid
        var appid = app.globalData.appid
        var secret = app.globalData.secret

        var postData = {
          form_id: formId,
          template_id: template_id,
          touser: openid,
          appid: appid,
          secret: secret,
          order_id: order_id
        }

        wx.request({
          url: app.globalData.requestUrl + '/index/setTemMessage',
          data: postData,
          header: {
            'content-type': ''
          },
          method: 'post',
          success: function (res) {
          }
        })
        wx.navigateTo({
          url: '/pages/after_pay/after_pay?order_id=' + order_id + '&status=fail',
        })
      }
    })
  },
  //选择地址
  choose_address : function(){
      wx.navigateTo({
        url: '/pages/address/address?from=order',
      })
  },
  //切换快递类型
  bindTypeChange: function (e) {
    var that = this
    var index = e.detail.value
    var total_weight = that.data.total_weight
    var first_heavy = that.data.transport_info[index]['first_heavy']
    var continue_heavy = that.data.transport_info[index]['continue_heavy']
    var continue_stage = that.data.transport_info[index]['continue_stage']
    var transport_fee = (parseFloat(first_heavy) + parseFloat(continue_heavy * (Math.ceil((total_weight - 1) / continue_stage)))).toFixed(2)
    var total_amount = (parseFloat(transport_fee) + parseFloat(that.data.pro_amount)).toFixed(2)
    //判断是否选择使用会员卡
    if(that.data.isChecked){
      if (parseFloat(that.data.balance) >= parseFloat(total_amount)) {
        var need_pay_amount = '0.00'
        var with_balance_amount = total_amount 
      } else {
        var need_pay_amount = (parseFloat(total_amount) - parseFloat(that.data.balance)).toFixed(2)
        var with_balance_amount = that.data.balance
      }
    }else{
      var need_pay_amount = total_amount
      var with_balance_amount = '0.00'
    }

    var selected_transport_type = that.data.transport_info[index]['mode_id']

    that.setData({
      index: index,
      transport_fee: transport_fee,
      total_amount: total_amount,
      need_pay_amount: need_pay_amount,
      with_balance_amount: with_balance_amount,
      selected_transport_type: selected_transport_type
    })
  },
  //获取该店铺的运费模式
  getTransportType : function(bis_id){
      var that = this
      wx.request({
        url: app.globalData.requestUrl + '/index/getTransportType',
        data: { bis_id: bis_id},
        method: 'post',
        header: {
          'content-type': ''
        },
        success: function (res) {
          var transportType = res.data.result.transport_type
          if (transportType == 1){
            that.setData({
              transportType: transportType,
              showFreightView: true
            })
          }else{
            var pro_amount = that.data.pro_amount
            var ykj_price = res.data.result.ykj_price
            var total_amount = parseFloat(pro_amount) + parseFloat(ykj_price)
            that.setData({
              transportType: transportType,
              showFreightView: false,
              transport_fee: ykj_price,
              total_amount: total_amount,
              selected_transport_type: ''
            })
          }
        }
      })
  },
  //获取运费
  getTransportFeeDetail : function(){
    var that = this
    var showTransportFeeDetail = !(that.data.showTransportFeeDetail)
    that.setData({
      showTransportFeeDetail: showTransportFeeDetail
    })
  },
  //切换选择使用会员卡radio
  switchVipButton : function(e){
    var that = this
    var checked = that.data.isChecked
    if(!checked){
      //获取订单总价格
      var total_amount = that.data.total_amount
      //获取会员卡余额
      wx.request({
        url: app.globalData.requestUrl + '/Members/getMemberInfo',
        data: {bis_id:app.globalData.bis_id,openid:app.globalData.openid},
        header: {
          'content-type': ''
        },
        method: 'post',
        success: function (res) {
          if (res.data.response.statuscode == 0){
            var balance = res.data.data.balance
            if (parseFloat(balance) >= parseFloat(total_amount) ){
              var need_pay_amount = '0.00'
              var with_balance_amount = total_amount
            }else{
              var need_pay_amount = (parseFloat(total_amount) - parseFloat(balance)).toFixed(2)
              var with_balance_amount = balance
            }
            that.setData({
              need_pay_amount: need_pay_amount,
              with_balance_amount: with_balance_amount,
              balance: balance
            })
          }else{
            wx.showToast({
              title: res.data.response.message,
              image: '/pics/icons/tanhao.png',
              duration: 2000,
              mask: true
            })
          }
        }
      })
    }else{
      that.setData({
        need_pay_amount: that.data.total_amount,
        with_balance_amount : '0.00'
      })
    }
    that.setData({
      isChecked: !checked
    })
  }
})
