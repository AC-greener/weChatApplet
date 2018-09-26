//index.js
//获取应用实例
Page({
  data: {
    imgUrl: ['../img/02.png', '../img/test2.png', '../img/01.png', '../img/04.png',
      '../img/06.png', '../img/03.png', '../img/13.png', '../img/12.png', '../img/11.png'],
    backgroundImgSrc: '',     //从本地获取的背景图片的路径
    tplImgSrc: '',            //校徽模板对应的图片路径
    isShowChooseImg: false,
    isShowContainer: false,
    isShowCanvas: false,
    isShowSuccess: false,
    isShowCheerTime: true,
    cheerTime: '',
  },
    onShow: function () {
      var now = new Date();
      var year = new Date('2018/06/26');
      if (Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) == 0 ) {
        this.setData({
          isShowCheerTime: false,
        })
      }else {this.setData({
        cheerTime: Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        });
      }
  },
  //从本地图库选择图片的事件处理函数
  getLocalImg: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:  (res) => {   //防止this改变
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          isShowContainer: true,
          backgroundImgSrc: tempFilePaths,   //这是一个数组
        })
      }
    })
  },

  //点击校徽模板时调用的函数
  showChooseImg: function (e) {
    
    if (this.data.isShowChooseImg == false) {
      this.setData({
        isShowChooseImg: true,
      })
    }
    var temp = e.target.dataset;
    this.setData({
      tplImgSrc: temp.img,
    })
  },
  drawAfter:  ()=>  {
    wx.canvasToTempFilePath({
      width: 170,
      heght: 170,
      destWidth: 680,  //生成图片的大小设置成canvas大小的四倍即可让图片清晰
      destHeight: 680,
      canvasId: 'myCanvas',
      fileType: 'jpg',
      quality: 1,
      success: (res) => {
        console.log(1);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  // post: function test() {
  //   var value = document.getElementById('username').value;
  //   var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.onreadystatechange = function () {
  //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
  //       test.innerHTML = xmlHttp.responseText;
  //     }
  //   };

  //   xmlHttp.open('POST', 'http://127.0.0.1:3000/', true);
  //   xmlHttp.send(value);      //吧image发送过去
  // },
  //点击生成图片时用Canvas将两个图片绘制成Canvas然后保存
  saveImg: function () {
    
    this.setData({
      isShowCanvas: true,
    });
    setTimeout(() => {   //这里用异步来实现,不然会提示canvas为空
      var context = wx.createCanvasContext('myCanvas');

      context.save();
      
      context.arc(85, 85, 65, 0, 2 * Math.PI);     //画一个半径为R的圆
      // 从画布上裁剪出这个圆形
      context.clip();
      // context.drawImage(_this.data.backgroundImgSrc[0], 21, 21, 128, 132);
      context.drawImage(this.data.backgroundImgSrc[0], 21, 0, 128, 170);
      context.restore();
      context.drawImage(this.data.tplImgSrc, 0, 0, 170, 170);
      context.draw();
      setTimeout(() => {
        this.drawAfter();
      }, 200);
    }, 50)      //时间0ms，10ms不行，什么鬼？
  },

})