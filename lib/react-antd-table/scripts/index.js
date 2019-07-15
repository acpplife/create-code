const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const utils = require('./utils')
const generateCode = require('./generateCode')
const config = require('../config')

const { copyDir, getFileMapper, recursiveMkdirSync } = utils
const { rootPath } = config
const { log } = console

function insert (folderPath, code, tableConfig, ignore = []) {

  const {
    namespace,
    newRouterMode,
    singleDataMode
  } = tableConfig

  log(chalk.blue(`开始生成namespace为${namespace}模块代码：`))

  const srcPath = path.resolve(folderPath, '../../src')
  const baseFilePath = path.resolve(srcPath, `pages/${namespace}`)
  const componentsPath = path.resolve(srcPath, 'components/ITableComponents')

  const copyFilePath = path.resolve(rootPath, 'toCopyStaticFiles')
  const fileMapper = getFileMapper(namespace)

  // 先判断父级文件夹是否存在，若不存在则创建
  if (!fs.existsSync(baseFilePath)) {
    log(chalk.blue(`文件目录: (${baseFilePath})不存在，自动创建...`))
    recursiveMkdirSync(baseFilePath)
  }

  // 判断依赖组件`src/components/ITableComponents`是否存在
  if (!fs.existsSync(componentsPath)) {
    log(chalk.blue(`依赖组件路径: (${componentsPath})不存在，自动创建并拷贝文件...`))
    recursiveMkdirSync(componentsPath)
    copyDir(path.resolve(copyFilePath, 'ITableComponents'), path.resolve(srcPath, 'components'))
  }

  // 遍历模块生成代码
  const filenames = Object.keys(fileMapper)
  for (let i = 0;i < filenames.length; i += 1) {
    const filename = filenames[i]
    const fileCode = code[fileMapper[filename]]
    const filePath = `${baseFilePath}/${filename}`

    if (fileMapper[filename] === 'modelsCode') {
      if (ignore.indexOf('model') === -1) {
        generateCode(filePath, fileCode)
      }
    } else if (fileMapper[filename] === 'servicesCode') {
      if (ignore.indexOf('service') === -1) {
        generateCode(filePath, fileCode)
      }
    } else if (singleDataMode) {
      if (fileMapper[filename] !== 'indexCode' &&
        fileMapper[filename] !== 'tableFilterCode' &&
        fileMapper[filename] !== 'tableFormCode') {
        // 单数据页面仅生成upsert 及detail 文件夹
        generateCode(filePath, fileCode)
      }
    } else if (newRouterMode) {
      if (fileMapper[filename] !== 'tableFormCode') {
        generateCode(filePath, fileCode)
      }
    } else if (fileMapper[filename] !== 'detailCode' &&
        fileMapper[filename] !== 'upsertCode') {
      // 非新页面模式下不单独生成upsert 及detail 文件夹
      generateCode(filePath, fileCode)
    }
  }

  // 复制静态资源
  copyDir(path.resolve(copyFilePath, 'utils'), `${baseFilePath}`)
  // 单数据页面只存在detail、upsert
  if (singleDataMode) {
    copyDir(path.resolve(copyFilePath, 'upsert'), `${baseFilePath}`)
  } else {
    copyDir(path.resolve(copyFilePath, 'components/TableFilter'), `${baseFilePath}/components`)
    if (newRouterMode) {
      // 新页面模式添加upsert生成
      copyDir(path.resolve(copyFilePath, 'upsert'), `${baseFilePath}`)
    } else {
      // 非新页面生成TableForm组件代码
      copyDir(path.resolve(copyFilePath, 'components/TableForm'), `${baseFilePath}/components`)
    }
  }

  log(chalk.green(`代码生成成功!`))
  log(chalk.blue(`代码路径：${baseFilePath}`))
  log(chalk.green('正在进行eslint格式化代码...'))
}

module.exports = insert