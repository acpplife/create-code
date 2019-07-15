const fs = require('fs')
const chalk = require('chalk')
const { exec } = require('child_process')
const utils = require('./utils')

const { log } = console
const {
  recursiveMkdirSync,
  getEslintPath,
  getPutoutPath
} = utils

module.exports =  (filePath, basePath, fileCode) => {
  const eslintPath = getEslintPath(basePath)
  const putoutPath = getPutoutPath()
  const fileFolderPath = filePath.substr(0, filePath.lastIndexOf('/'))
  const fileName = filePath.substr(filePath.lastIndexOf('/') + 1)

  // if parent folder exists
  if (!fs.existsSync(fileFolderPath)) {
    recursiveMkdirSync(fileFolderPath)
  }
  // write file
  fs.writeFileSync(filePath, fileCode)
  // 首先通过output插件完成移除未使用的变量 https://github.com/coderaiser/putout
  exec(`cd ${fileFolderPath} && node ${putoutPath} ${fileName} --fix`, (error) => {
    if (error) {
      log(chalk.red(`移除未使用变量失败！(${filePath})`))
      log(chalk.red(error))
    }
    // 移除未使用变量之后 run eslint fix即可
    exec(`${eslintPath} ${filePath} --fix`, (err) => {
      if (err) {
        log(chalk.red(`格式化代码未完全修复，需要手动修复！(${filePath})`))
        return
      }
      log(chalk.green(`格式化代码完成！(${filePath})`))
    })
  })
}
