const generator = require('../genCode')
const insert = require('../scripts')

const config = {
  Config: require('../schema/bus/config'),
  DataSchema: require('../schema/bus/dataSchema'),
  QuerySchema: require('../schema/bus/querySchema')
}

insert(generator(config), config.Config)