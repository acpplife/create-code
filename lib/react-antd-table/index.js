/* eslint-disable import/no-dynamic-require */
const path = require('path')
const generator = require('./genCode')
const insert = require('./scripts')

module.exports = function main (configFolderPath, generateFolderPath) {
  const config = {
    Config: require(path.join(configFolderPath, 'config')),
    DataSchema: require(path.join(configFolderPath, 'dataSchema')),
    QuerySchema: require(path.join(configFolderPath, 'querySchema'))
  }
  insert(generator(config), config.Config, {
    configFolderPath,
    generateFolderPath
  })
}