const genDetailItem = require('./genDetailItem')
const genUtils = require('../genUtils')

const { getDicArray, getPrimaryKey, injectVariables }  = genUtils

module.exports = (tableConfig) => {

  const {
    Config: {
      namespace,
      dictionary,
      singleDataMode,
      baseRouterPath
    },
    DataSchema
  } = tableConfig
  const primaryKey = getPrimaryKey(DataSchema)
  const dicArray = getDicArray(dictionary)
  const injectValues = injectVariables(DataSchema)

  return `
        import React, { useEffect, Fragment } from 'react';
        import { connect } from 'dva';
        import { Card, Button } from 'antd';
        import router from 'umi/router'
        import FooterToolbar from '@/components/ITableComponents/FooterToolbar';
        import DescriptionList from '@/components/ITableComponents/DescriptionList';
        import TableColumnRender from '@/components/ITableComponents/TableColumnRender'

        const { Description } = DescriptionList;

        function Detail(props) {
            const { dispatch, match, loading } = props;
            const { params } = match;
            const data = props.${namespace}
            const { current } = data

            ${injectValues}
            
            // Effect
            useEffect(() => {
                if (params.id) {
                    dispatch({
                        type: '${namespace}/findById',
                        payload: { ${primaryKey}: params.id }
                    });
                    ${dicArray && dicArray.length ?
                    dicArray.map(item => (`dispatch({ type: "${namespace}/__${item}" });`)).join('\n')
                    : ''}
                }
            }, [dispatch, params.id])

            // 获取详情内容
            const content = \n${genDetailItem(DataSchema)}

            function handleClick () {
                ${!singleDataMode ? 'router.goBack()' :
                `router.push(\`${baseRouterPath || ''}/${namespace}/upsert/\${params.id}\`)`}
            }

            return (
                <Fragment>
                <Card loading={loading} bordered={false}>
                    {content}
                </Card>
                <FooterToolbar>
                    <Button type="primary" onClick={handleClick}>
                        ${singleDataMode ? '编辑' : '返回'}
                    </Button>
                </FooterToolbar>
                </Fragment>
            );
        }

        export default connect((state) => {
            const { loading } = state
            return {
                ${namespace}: state.${namespace},
                loading: loading.effects['${namespace}/findById'],
            }
        })(Detail)
    `
}