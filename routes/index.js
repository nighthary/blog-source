const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
});

router.get('/json', async (ctx, next) => {
  ctx.type = 'text/html'
  ctx.body = {
    title: 'koa2 json'
  }
});

router.get('/scan', async (ctx, next) => {
  await ctx.render('scan')
});

module.exports = router
