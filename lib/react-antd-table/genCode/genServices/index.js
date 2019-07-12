const serviceUtils = require('./serviceUtils')
const genUtils = require('../genUtils')

const { dynamicAsyncFunction } = serviceUtils
const { getPrimaryKey } = genUtils

module.exports = (tableConfig) => {

  const {
    Config: {
      dictionary,
      namespace,
    },
    DataSchema,
  } = tableConfig
  const primaryKey = getPrimaryKey(DataSchema)

  return `
        import { stringify } from 'querystring';
        import request from '@/utils/request';

        export async function queryData(params) {
            return request({
                url: '/manage/${namespace}/list',
                method: 'post',
                baseUrlType: 'authCenter',
                data: params
            })
        }

        export async function findById(params) {
            return request({
                url: \`/manage/${namespace}/getbyid/\${params.${primaryKey}}\`,
                method: 'get',
                baseUrlType: 'authCenter',
            })
        }

        export async function removeData(params) {
            return request({
                url: \`/manage/${namespace}/delbatch?\${stringify(params)}\`,
                method: 'post',
                baseUrlType: 'authCenter',
            })
        }

        export async function addData(params) {
            return request({
                url: '/manage/${namespace}/add',
                method: 'post',
                baseUrlType: 'authCenter',
                data: params
            })
        }

        export async function updateData(params) {
            return request({
                url: '/manage/${namespace}/updatebyid',
                method: 'post',
                baseUrlType: 'authCenter',
                data: params
            })
        }

        ${dynamicAsyncFunction(dictionary)}
    `
}