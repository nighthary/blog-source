const wechatConfig = {
  //set your oauth redirect url, defaults to localhost
  "appId": "wx81da642e4049a163",
  "appSecret": "8c89c0120fd6ebcd985e432fd9b753be",
  card: false, //enable cards
  payment: false, //enable payment support
  merchantId: '', //
  paymentSandBox: false, //dev env
  paymentKey: '', //API key to gen payment sign
}

module.exports = wechatConfig