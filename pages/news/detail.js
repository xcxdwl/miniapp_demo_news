const $vm = getApp()

const {post} = $vm.utils

const WxParse = require('../../utils/wxParse/wxParse.js')

Page({
    data:{
        wxParseData:[],
        article:{},
        style:0
    },
    onLoad:function(options){
        if(options.tag.toLowerCase() === 'h5'){
            return wx.showModal({
                title:'无法打开H5',
                content:'小程序目前不能跳转外链，此H5页面无法打开！',
                confirmText:'确定',
                confirmColor:'#d81e06',
                showCancel:false,
                success(){
                    wx.navigateBack()
                }
            })
        }
        this.setData({style:options.style})
        this.getArticleDetail(options)
        this.options = options
    },

    onShareAppMessage() {
      let that = this
      return {
        title: 'News Reader',
        desc: that.data.article.title,
        path: '/pages/news/detail?id='+that.options.id+'&chid='+that.options.chid + '&style=' + that.options.style
      }
    },

    getArticleDetail(opt){
        post('v2/news/detail.html',{news_id:opt.id,chid:opt.chid}).then(res => {
            
            var data = res.newsDetail
            var {news_title:title,news_date:date,news_praise_count:praise,news_comment_count:comment,news_source:tag} = data
            // 专题页面
            if(data.news_blocks && data.news_blocks.length){
                 this.setData({
                    article:{ title,date,praise,comment,tag}
                })
                console.log(data)
                return wx.showToast({title:'目前不支持解析专题页面'})
            }

            // news_content data.res.newsDetail
            WxParse.wxParse('html',data.news_content,this)
            this.setData({
                article:{ title,date,praise,comment,tag}
            })
            
        }).catch(err => console.log(err))
    }
})