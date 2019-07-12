const program = require('commander')

// 需要生成的配置json路径
const Config = require('../schema/questionnaire/config')
const DataSchema = require('../schema/questionnaire/dataSchema')
const QuerySchema = require('../schema/questionnaire/querySchema')

const genIndex = require('../genCode/genIndex')
const genDetail = require('../genCode/genDetail')
const genModels = require('../genCode/genModels')
const genServices = require('../genCode/genServices')
const genTableFilter = require('../genCode/genTableFilter')
const genTableForm = require('../genCode/genTableForm')
const genUpsert = require('../genCode/genUpsert')

const insert = require('../scripts')

const config = { Config, DataSchema, QuerySchema }

const resultCode = {
  indexCode: genIndex(config),
  detailCode: genDetail(config),
  modelsCode: genModels(config),
  servicesCode: genServices(config),
  tableFilterCode: genTableFilter(config),
  tableFormCode: genTableForm(config),
  upsertCode: genUpsert(config),
}

program
  .option('-i, --ignore <type>', '忽视某些模块的生成，值包含model、service。\n多个以逗号分隔，无空格。', (value) => value.split(','), [])
  .parse(process.argv);

let ignore = []

if (program.ignore) {
  ({ ignore } = program)
}

insert(resultCode, Config, ignore)

module.exports = resultCode