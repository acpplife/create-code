// 需要生成的配置json路径
const Config = require('../schema/tableList/config')
const DataSchema = require('../schema/tableList/dataSchema')
const QuerySchema = require('../schema/tableList/querySchema')

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

insert(resultCode, Config)

module.exports = resultCode