const inquirer = require('inquirer')
const doWithTable = require('../lib/scripts/react-antd-table')
const doWithIceReactMaterial = require('../lib/scripts/ice-react-material')

module.exports = function main () {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'which type of block do you want to add ?',
      choices: [
        {
          name: 'react-antd-table (基于antd、umi的列表CRUD)',
          value: 'react-antd-table',
        },
        {
          name: 'ice-react-materials (飞冰react物料源，包含较多常用的组件)',
          value: 'ice-react-materials',
        },
        {
          name: 'more (more blocks is on the way!)',
          value: 'more',
          disabled: true
        },
      ]
    }
  ]

  inquirer.prompt(questions)
    .then((nt) => {
      const { type } = nt

      switch(type) {
      case 'react-antd-table':
        doWithTable()
        break
      case 'ice-react-materials':
        doWithIceReactMaterial()
        break
        
      default:
      }
    })
}