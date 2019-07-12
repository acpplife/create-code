const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const exists = require('fs').existsSync;
const tableInsert = require('../react-antd-table')
const utils = require('./utils')

const cwd = process.cwd();
const { exit } = utils
const { log } = console

module.exports = function doWithTable () {
  const tableQuestions = [
    {
      type: 'input',
      name: 'folderPath',
      message: 'input your table config folder path:'
    }
  ]
  inquirer.prompt(tableQuestions)
    .then((answers) => {
      const { folderPath } = answers
      const absolutePath = path.join(cwd, folderPath || './')
      // 判断输入的路径是否存在
      if (!exists(absolutePath)) {
        log(chalk.red(`folder path: ${absolutePath} not exists.`));
        exit()
      }
      // 判断路径下是否存在config.js
      const tableConfigFilePath = path.join(absolutePath, 'config.js')
      if (!exists(tableConfigFilePath)) {
        log(chalk.red(`file: ${tableConfigFilePath} not exists.`));
        exit()
      }
      // 执行插入脚本
	  tableInsert(absolutePath)
    })
}