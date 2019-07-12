module.exports = function generator(config) {
  return {
    indexCode: require('./genIndex')(config),
    detailCode: require('./genDetail')(config),
    modelsCode: require('./genModels')(config),
    servicesCode: require('./genServices')(config),
    tableFilterCode: require('./genTableFilter')(config),
    tableFormCode: require('./genTableForm')(config),
    upsertCode: require('./genUpsert')(config),
  }
}