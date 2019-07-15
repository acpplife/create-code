/* eslint-disable import/no-dynamic-require */
const path = require('path')
const generator = require('./genCode')
const insert = require('./scripts')

module.exports = function main (folderPath) {
  const config = {
    Config: require(path.join(folderPath, 'config')),
    DataSchema: require(path.join(folderPath, 'dataSchema')),
    QuerySchema: require(path.join(folderPath, 'querySchema'))
  }
  insert(folderPath, generator(config), config.Config)
}