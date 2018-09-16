const fs = require('fs')
const path = require('path')

/**
 * 删除文件夹（如果目标目录不存在切不需要删除根目录则自动创建目标目录）
 * @param {fileURL} fPath 需要删除的文件夹路径 
 * @param {boolean} containSelf 是否删除传入的根目录
 */
const deleteFolder = (fPath, containSelf = false)  => { 
  var files = [];
  if (fs.existsSync(fPath)) {
    files = fs.readdirSync(fPath);
    files.forEach((file, index) => {
      const curPath = path.resolve(fPath, file);
      const statInfo = fs.statSync(curPath);
      if (statInfo.isDirectory()) {
        deleteFolder(curPath, true);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    // 是否删除传入的根目录
    if (containSelf) { 
      fs.rmdirSync(fPath);
    }
  } else {
    // 如果传入目录不存在切不需要删除根目录则自动创建对应目录出来
    if (!containSelf) { 
      fs.mkdirSync(fPath)
    }
  }
}

/**
 * 拷贝文件夹及其下面的所有内容到目标目录
 * @param { filrURL} from 
 * @param {filrURL} to 
 */
const copyFolder = (from, to) => { 
  const existsFromSync = fs.existsSync(from);
  const existsToSync = fs.existsSync(to);

  if (!existsFromSync) { 
    console.log('源路径不存在，请检查后重试！')
    return
  }

  if (existsToSync) {

    deleteFolder(to, false);

    const files = fs.readdirSync(from);
    files.forEach((file, index) => { 
      const curPath = path.resolve(from, file);
      const statInfo = fs.statSync(curPath);
      const toPath = path.resolve(to, file);

      if (statInfo.isDirectory()) { 
        copyFolder(curPath, toPath);
      } else {
        copyFile(curPath, toPath);
      }
    })
  } else {
    fs.mkdirSync(to);
    copyFolder(from, to);
  }
}

const copyFile = (from, to) => { 
  fs.writeFileSync(to, fs.readFileSync(from));
}


// const fromPath = path.resolve(__dirname, '../resource/public');
// const toPath = path.resolve(__dirname, '../public');
// copyFolder(fromPath, toPath);

module.exports = {
  copyFile,
  copyFolder,
  deleteFolder
}