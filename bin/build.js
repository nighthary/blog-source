
var process = require('child_process');



module.exports = function (callback) { 
  process.exec('npm run g', function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      console.log('编译成功')
      callback && callback()
    }
  });
}