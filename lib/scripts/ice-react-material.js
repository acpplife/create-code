const inquirer = require('inquirer')
const axios = require('axios')
const { exec } = require('child_process');
const chalk = require('chalk')
const path = require('path')
const utils = require('../utils')

const { log } = console

module.exports = function doWithReactMaterial () {
  const categories = []
  log(chalk.blue('正在获取服务器资源...'))
  axios.get('https://ice.alicdn.com/assets/materials/react-materials.json')
    .then(result => {
      if (!result) {
        log.error('数据获取异常')
        process.exit(1)
      }
      const { blocks } = result.data
      log(chalk.green(`成功获取服务器上react相关区块${blocks.length}个.`))
      blocks.forEach(item => {
        if (item && item.categories && item.categories.length) {
          item.categories.forEach(category => {
            if (!categories.includes(category)) {
              categories.push(category)
            }
          })
        }
      })
      if (!(categories && categories.length)) {
        return
      }

      inquirer.prompt([
        {
          type: 'rawlist',
          name: 'category',
          message: '请选择代码块类型?',
          choices: categories,
          pageSize: 10
        }
      ]).then(answers => {
        inquirer.prompt([
          {
            type: 'rawlist',
            name: 'blockName',
            message: '请选择代码块?',
            choices: blocks
              .filter(item => item.categories.includes(answers.category))
              .map(item => ({
                value: item.name,
                name: `${item.title}（${item.description || item.title}）`,
              })),
            pageSize: 10
          }
        ]).then(subAnswers => {
          const { blockName } = subAnswers
          const filterArray = blocks.filter(item => item.name === blockName)
          if (filterArray && filterArray.length) {
            const { name, source } = filterArray[0]
            if (source && source.npm) {
              const { npm } = source
              log(chalk.blue('正在下载中...'))
              exec(`node ${path.resolve(__dirname, '../../bin/create-code')} addBlock ${npm}`, (error) => {
                if (error) {
                  log(chalk.red(error))
                }
                log(chalk.green('下载成功!'))
                log(chalk.green(`文件路径: (${process.cwd()}/${utils.getDownloadPkgName(name)}/index.jsx)`))
              })
            }
          }
        })
      })
    })
}