
var copyJS = require('./copy');
var buildJS = require('./build');
var path = require('path');
/**
 * 拷贝resource/public目录到public
 */
buildJS(function () { 
  const fromPath = path.resolve(__dirname, '../resource/public');
  const toPath = path.resolve(__dirname, '../public');
  copyJS.copyFolder(fromPath, toPath);
})