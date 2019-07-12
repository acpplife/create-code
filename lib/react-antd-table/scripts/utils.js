const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const { rootPath } = require('../config')

// 文件路径和代码对应关系
function getFileMapper (namespace) {
  return {
    'index.js': 'indexCode',
    'detail/index.js': 'detailCode',
    [`models/${namespace}.js`]: 'modelsCode',
    [`services/${namespace}.js`]: 'servicesCode',
    'components/TableFilter/index.js': 'tableFilterCode',
    'components/TableForm/index.js': 'tableFormCode',
    'upsert/index.js': 'upsertCode',
  }
}

function recursiveMkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (recursiveMkdirSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
  return true;
}

function copyDir(src, dist) {
  childProcess.spawn('cp', ['-r', src, dist]);
}

function getEslintPath () {
  return path.resolve(rootPath, '../../node_modules/.bin/eslint')
}

function getPutoutPath() {
  return path.resolve(rootPath, '../../node_modules/putout/bin/putout')
}

module.exports = {
  getFileMapper,
  recursiveMkdirSync,
  copyDir,
  getEslintPath,
  getPutoutPath
}
