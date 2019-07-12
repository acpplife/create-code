const inquirer = require('inquirer')
const doWithTable = require('./scripts/react-antd-table')

module.exports = function main () {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'which type of block do you want to add ?',
      choices: [
        {
          name: 'react-antd-table (table list based on react antd)',
          value: 'react-antd-table',
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
        
      default:
      }
    })
}