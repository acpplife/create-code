const modelUtils = require('./modelUtils')
const genUtils = require('../genUtils')

const { dynamicImport, dynamicYieldFunction, dynamicReducerFunction } = modelUtils
const { getDicArray } = genUtils

module.exports = (tableConfig) => {

  const {
    Config: {
      dictionary,
      namespace,
      newRouterMode
    },
  } = tableConfig
  const dicArray = getDicArray(dictionary)

  return `
        import { message } from 'antd';
        import { routerRedux } from 'dva/router'
        import { parse } from 'querystring'
        ${dynamicImport(dicArray, namespace)}

        function *responseHandler (response, { put }, callback, successMsg) {
            if (response && response.errorCode === 0) {
                if (successMsg) message.success(successMsg)
                yield put({ type: 'requery' })
                if (callback) callback();
            } else {
                message.error(response && response.errorMessage || '请求失败')
            }
        }

        export default {
            namespace: '${namespace}',

            state: {
                data: {
                    list: [],
                    pagination: {},
                },
                current: {}
            },

            effects: {
                *requery (_, { put }) {
                    yield put(routerRedux.push({
                        pathname: window.location.pathname,
                        query: parse(window.location.search.substr(1))
                    }))
                },
                *goBack (_, { put }) {
                    yield put(routerRedux.goBack())
                },
                *fetch({ payload }, { call, put }) {
                    const response = yield call(queryData, payload);
                    if (response && response.errorCode === 0) {
                        const { data } = response
                        yield put({
                            type: 'save',
                            payload: {
                                list: data.recordList,
                                pagination: {
                                current: data.currentPage,
                                numPerPage: data.numPerPage,
                                total: data.totalCount
                                }
                            },
                        });
                    } else {
                        message.error(response && response.errorMessage || '请求失败')
                    }
                },
                *findById({ payload }, { call, put }) {
                    const response = yield call(findById, payload);
                    if (response && response.errorCode === 0) {
                        yield put({
                            type: 'updateCurrent',
                            payload: response.data,
                        });
                    } else {
                        message.error(response && response.errorMessage || '请求失败')
                    }
                },
                *submit({ payload, actionType, callback }, { call, put }) {
                    const isCreateMode = actionType === 'create'
                    const successMsg = isCreateMode ? '添加成功' : '更新成功'

                    const response = yield call(isCreateMode ? addData : updateData, payload);
                    if (response && response.errorCode === 0) {
                        if (successMsg) message.success(successMsg)
                        yield put({ type: ${newRouterMode ? '\'goBack\'' : '\'requery\''} })
                        if (callback) callback();
                    } else {
                        message.error(response && response.errorMessage || '请求失败')
                    }
                },
                *remove({ payload, callback }, { call, put }) {
                    const response = yield call(removeData, payload);
                    yield responseHandler(response, { put }, callback)
                },
                ${dynamicYieldFunction(dicArray)}
            },

            reducers: {
                save(state, action) {
                    return {
                        ...state,
                        data: action.payload,
                    };
                },
                updateCurrent(state, action) {
                    return {
                        ...state,
                        current: action.payload,
                    };
                },
                resetCurrent(state) {
                    return {
                        ...state,
                        current: {},
                    };
                },
                ${dynamicReducerFunction(dicArray)}
            },
        };
    `
}