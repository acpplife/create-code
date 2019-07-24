const genIndexColumn = require('./genIndexColumn')
const genUtils = require('../genUtils')

const { getDicArray, getPrimaryKey, injectVariables }  = genUtils

module.exports = (tableConfig) => {
  const { Config, DataSchema } = tableConfig
  const {
    namespace,
    newRouterMode,
    dictionary,
    multiSelection,
    showCreate,
    showExport,
    showBatchDelete,
    baseRouterPath
  } = Config
  const primaryKey = getPrimaryKey(DataSchema)
  const dicArray = getDicArray(dictionary)
  const injectValues = injectVariables(DataSchema)
  
  return `
        import React, { ${multiSelection || !newRouterMode ? 'useState,' : ''} useEffect, useCallback } from 'react';
        ${newRouterMode ? "import router from 'umi/router';" : ''}
        import { connect } from 'dva';
        import { Card, message, Modal, Divider } from 'antd';
        import { routerRedux } from 'dva/router'
        import StandardTable from '@/components/ITableComponents/StandardTable';
        ${!newRouterMode ? "import TableForm from './components/TableForm'" : ''}
        import TableFilter from './components/TableFilter'
        import TableAction from '@/components/ITableComponents/TableAction'
        import ColumnAction from '@/components/ITableComponents/ColumnAction'
        import TableColumnRender from '@/components/ITableComponents/TableColumnRender'
        import utils from './utils'

        const { getFormatParamsFromTable } = utils

        function Table (props) {
            ${multiSelection ? 'const [selectedRows, setSelectedRows] = useState([])' : ''}
            ${!newRouterMode ? `
            const [modalVisible, setModalVisible] = useState(false)
            const [current, setCurrent] = useState({})
            const [modalType, setModalType] = useState('create')` : ''}

            const {
                dispatch,
                loading,
                location,
                ${namespace},
            } = props;
            const data = props.${namespace};

            ${injectValues}

            const dispatchFetch = useCallback((params = {}) => {
                dispatch({
                type: "${namespace}/fetch",
                payload: {
                    ...location.query,
                    ...params
                }
                });
                ${dicArray && dicArray.length ?
                dicArray.map(item => (`dispatch({ type: "${namespace}/__${item}" });`)).join('\n')
                : ''}
            }, [dispatch, location.query])

            // 初始化请求数据'
            useEffect(() => {
                dispatchFetch()
            }, [dispatchFetch])

            function handleUpdateModalVisible(item, type) {
                ${ newRouterMode ?
                `router.push(\`${baseRouterPath || ''}/${namespace}/\${type === 'detail' ? 'detail' : 'upsert'}/\${item.${primaryKey}}\`)` :
                `setModalVisible(true)
                setModalType(type)
                setCurrent(item)`
                }
            }

            function handleRemove(keys, callback) {
                const isArray = Array.isArray(keys)
                Modal.confirm({
                title: \`确定要删除\${isArray ? \`所选的\${keys.length}条\` : '当前'}记录吗?\`,
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    dispatch({
                    type: "${namespace}/remove",
                    payload: {
                        ${primaryKey}: isArray ? keys.map(row => row.${primaryKey}).join() : keys,
                    },
                    callback: () => {
                        if (callback) callback()
                        message.success('删除成功')
                    },
                    });
                }
                })
            }

            function dispatchRouterChange (params = {}) {
                dispatch(routerRedux.push({
                pathname: location.pathname,
                query: params,
                }))
            }
            
            function handleStandardTableChange (pagination, filtersArg, sorter) {
                const params = getFormatParamsFromTable(pagination, filtersArg, sorter, location.query)
                dispatchRouterChange(params)
            };

            ${!newRouterMode ? `
            function handleModalVisible (flag) {
                setModalVisible(!!flag)
                setCurrent({})
                setModalType('create')
            };` : ''}
            

            function handleMenuClick (key) {
                switch (key) {
                case 'create': {
                ${newRouterMode ?
                `router.push("${baseRouterPath || ''}/${namespace}/upsert")` :
                'handleModalVisible(true)'
                }
                break;
                }
                ${showExport ? `
                case 'export':
                Modal.confirm({
                    title: '确定要导出所有数据吗?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk (){
                    message.success('导出成功!')
                    }
                })
                break;
                ` : ''}
                ${multiSelection ? `
                case 'remove':
                if (selectedRows.length === 0) return;
                handleRemove(selectedRows, () => {
                    setSelectedRows([])
                })
                break;
                ` : ''}
                default:
                break;
                }
            };

            function handleSearch (values) {
                dispatchRouterChange({
                ...values,
                pageNum:1,
                })
            };

            ${!newRouterMode ? `
            function handleSubmit (values, type, callback) {
                dispatch({
                type: "${namespace}/submit",
                payload: values,
                actionType: type,
                callback: () => {
                    handleModalVisible();
                    if (callback) callback();
                }
                });
            };
            ` : ''}

            const columns = ${genIndexColumn(DataSchema, Config)}

            return (
                <div>
                <Card bordered={false}>
                    <TableFilter
                        data={props.${namespace}}
                        handleSearch={handleSearch}
                        handleReset={dispatchRouterChange}
                    />
                    <TableAction
                        showCreate={${showCreate}}
                        showExport={${showExport}}
                        showBatchDelete={${showBatchDelete}}
                        handleMenuClick={handleMenuClick}
                        ${multiSelection ? '\nselectedRows={selectedRows}' : ''}
                    />
                    <StandardTable
                        rowKey='${primaryKey}'
                        multiSelection={${multiSelection}}
                        loading={loading}
                        data={${namespace}.data}
                        columns={columns}
                        onChange={handleStandardTableChange}
                        paginationConfig={${JSON.stringify(Config.pagination)}}
                        ${multiSelection ? `
                        selectedRows={selectedRows}
                        onSelectRow={setSelectedRows}` :
                        ''}
                    />
                </Card>
                ${!newRouterMode ?
                `<TableForm
                    modalType={modalType}
                    current={current}
                    modalVisible={modalVisible}
                    handleSubmit={handleSubmit}
                    handleModalVisible={handleModalVisible}
                />`
                 : ''
                }
                </div>
            );
        }

        export default connect((state) => {
        const { loading } = state
        return {
            ${namespace}: state.${namespace},
            loading: loading.models.${namespace},
        }
        })(Table);
    `
}