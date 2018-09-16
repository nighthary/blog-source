const router = require('koa-router')();

router.get('/MP_verify_2BavBYkYRLqiHEbr.txt', async ctx => {
  ctx.body = '2BavBYkYRLqiHEbr'
})

const weixinJsConfig = require('weixin-node-jssdk');
let options = {
  // appId: 'wx81da642e4049a163',
  appId: 'wx2f7a85c12bcc5a9a',
  // appSecret: '8c89c0120fd6ebcd985e432fd9b753be'
  appSecret: 'e5c151d54872d3abbb47b5d2967e839b'
};

router.get('/signature', ctx => {
  ctx.type = 'text/html'
  ctx.response.set()
  const {url} = ctx.query
  options.url = url

  weixinJsConfig(options, function (err, config) {
    console.log(JSON.stringify(config))
    ctx.body = config
  })
});


router.get('/share', ctx => {
  ctx.type = 'text/html';
  ctx.body = '<h1>我是分享出来的页面啊</h1>'
})

module.exports = router
