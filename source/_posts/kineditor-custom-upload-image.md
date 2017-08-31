---
title: 自定义Kindeditor的图片上传组件（自定义图片上传逻辑）
date: 2017-08-31 21:39:35
toc: true
tags:
    - 前端组件
categories:
    - 技术杂谈
---

[TOC]

>说明：1.本文使用的是未压缩过的kindeditor.all.js
>
>​    2.版本为4.1.11

<!-- more -->

#### 1. 点击确定之后- 提交事件的位置

```
Line: 7334
```

```js
if (showLocal && showRemote && tabs && tabs.selectedIndex === 1 || !showRemote) {
  if (uploadbutton.fileBox.val() == '') {
    alert(self.lang('pleaseSelectFile'));
    return;
  }
  dialog.showLoading(self.lang('uploadLoading'));
  uploadbutton.submit();
  localUrlBox.val('');
  return;
}
```

> 下面是具体的响应代码

```
line: 4271
```

```js
submit : function() {
        var self = this,
            iframe = self.iframe;
        iframe.bind('load', function() {
            iframe.unbind();
            var tempForm = document.createElement('form');
            self.fileBox.before(tempForm);
            K(tempForm).append(self.fileBox);
            tempForm.reset();
            K(tempForm).remove(true);
            var doc = K.iframeDoc(iframe),
                pre = doc.getElementsByTagName('pre')[0],
                str = '', data;
            if (pre) {
                str = pre.innerHTML;
            } else {
                str = doc.body.innerHTML;
            }
            str = _unescape(str);
            iframe[0].src = 'javascript:false';
            try {
                data = K.json(str);
            } catch (e) {
                self.options.afterError.call(self, '<!doctype html><html>' + doc.body.parentNode.innerHTML + '</html>');
            }
            if (data) {
                self.options.afterUpload.call(self, data);
            }
        });
        self.form[0].submit();
        return self;
    }
```

 此处为kindeditor自带的上传图片的操作逻辑,主要是通过iframe来进行提交

#### 2.自定义提交事件

> 我们需要做的就从这里开始,自动一个新的函数，去处理图片上传事件

这是我的自己添加的处理事件的方法，主要通过jquery-form去提交表单，上传完成之后把值设置到editor中（**这里设置值参考了添加网络图片的逻辑，就在调用提交事件的位置**）

```Js
_custom_submit: function(uploadImgUrl, callback) {
        var self = this;
        var timeStamp = new Date().getTime();
        var nonceStr = randomString();
        var mdStr = hex_md5('timeStamp=' + timeStamp + '&nonceStr=' + nonceStr + '&key=L8VSMFU9Z76WS2P8DGDTH65P46DGBFI');
        $('#uploadLocalImg').find('#_timeStamp').val(timeStamp);
        $('#uploadLocalImg').find('#_nonceStr').val(nonceStr);
        $('#uploadLocalImg').find('#_sign').val(mdStr);
        $('#uploadLocalImg').submit(function() {
            var _success = function(res) {
                $('#uploadLocalImg input').val('');
                var _res = (typeof res === 'string') ? JSON.parse(res) : res;
                if (_res.code == 1) { // 1-成功 -1=失败
                    callback && callback(_res.url);
                    gsuiLoading.close();
                } else {
                    gsuiLoading.close();
                    var _msg = _res.message !== undefined ? _res.message + '！' : '';
                    gsuiDialog.open(gsuiDialog.type.warning, _msg);
                }
            }
            var _error = function() {}
            var _complete = function() {
                gsuiLoading.close();
            }
            var _beforeSend = function() {
            }
            var _options = {
                success: _success,
                error: _error,
                complete: _complete,
                beforeSend: _beforeSend,
                type: 'POST',
                url: uploadImgUrl
            }
            $(this).ajaxSubmit(_options);
            return false;
        });
        $('#uploadLocalImg').submit();
    }   
```

#### 3. 自定义方法的调用

>下面是此方法的调用
>
>Line: 7334
>
>uploadbutton.submit()  =>  uploadbutton._custom_submit(uploadImgUrl,callback)
>
>这里的回调函数是为了在图片上传完成之后把后台返回的图片添加到编辑器中

```js
uploadbutton._custom_submit(uploadImgUrl, function(url, width, height){
    clickFn.call(self, url, '', width, height, 0, '');
});
```

#### 4.表单其他参数的添加

#### 4.1 表单ID

细心的朋友注意到了，我提交的表单有一个叫做uploadLocalImg的ID，这个也是自己后面添加的

line:  7301

对此处的form添加对应的ID即可

#### 4.2 表单其他参数

需要添加的其他参数也在

Line: 7301 的form表单中添加即可

#### 4.3 上传文件对应的名字

上传文件的名字并不是在表单的位置添加，而是在初始化按钮的时候添加的的

>Line: 4256   fieldName就是上传文件对应的字段名字

最好通过外面初始化的时候传递对应的名字进来，通过跟踪代码可以发现，初始化的时候传递filePostName进入即可自定义文件名

>filePostName

#### 4.4 上传图片的URL

>图片路径肯定不能在这个里面写死，所以需要初始化的时候传递进来，就需要自己添加初始化的参数,我这里添加的参数叫做uploadImgUrl



>line: 237 添加默认参数

```js
uploadImgUrl: '',
```

>Line: 7245 获取传递的值

```js
uploadImgUrl = K.undef(self.uploadImgUrl, true)
```

>Line: 7345  传递到上传逻辑的函数中

```js
uploadbutton._custom_submit(uploadImgUrl, function(url, width, height){
  clickFn.call(self, url, '', width, height, 0, '');
});
```

#### 5.其他

>所有的修改差不多就是上面的内容
>
>下面是初始化时候的逻辑

```js
addEditCouponEditor = kindeditor.create('#ueditor', {
  uploadImgUrl: common.domain.toolurl + common.apis.commonUploadImage,
  width: 800,
  height: 500,
  minWidth: 100,
  resizeType: 0,
  filePostName: 'fileImg',
  allowPreviewEmoticons: false,
  allowImageUpload: true,
  items: [
    'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
    'insertunorderedlist', '|', 'emoticons', 'image', 'link'
  ]
});
```



>如果有问题欢迎联系我QQ 965548606
>
>或者下方评论留言


