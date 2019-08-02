const tableFilterUtils = require('./tableFilterUtils')
const genUtils = require('../genUtils')

const { hasModeSwitch, getSimpleFormData, getAdvancedFormData } = tableFilterUtils
const { injectVariables } = genUtils

module.exports = (tableConfig) => {

  const {
    Config: {
      namespace,
      defaultDateFormat
    },
    QuerySchema
  } = tableConfig
  const injectValues = injectVariables(QuerySchema)
  const switchMode = hasModeSwitch(QuerySchema)

  return `
        import React, { useState } from 'react'
        import { connect } from 'dva';
        import moment from 'moment';
        import { Row, Col, Form, Button, Input, InputNumber, ${switchMode ? 'Icon,': ''} DatePicker, Cascader } from 'antd'
        import RadioGroup from '@/components/ITableComponents/RadioGroup';
        import CheckboxGroup from '@/components/ITableComponents/CheckboxGroup';
        import SelectGroup from '@/components/ITableComponents/SelectGroup';
        import utils from '@/components/ITableComponents/utils'
        import styles from './index.less';

        const FormItem = Form.Item
        const { RangePicker } = DatePicker
        const { getFormatFormValues } = utils

        const TableFilter = (props) => {
            ${switchMode ? 'const [expandForm, setExpandForm] = useState(false)' : ''}
            
            const { 
                data,
                handleSearch, 
                handleReset, 
                form,
                form: { getFieldDecorator }
            } = props
            const { query } = props.location

            ${injectValues}

            ${switchMode ? `
            function toggleForm () {
                setExpandForm(!expandForm)
            };
            ` : ''}
            
            function onReset () {
                form.resetFields()
                handleReset()
            }
            function onSearch (e) {
                e.preventDefault();

                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const values = getFormatFormValues(fieldsValue, '${defaultDateFormat}', 'tableFilter')

                    handleSearch(values)
                });
            }
            function getFilterFromActions () {
                return (
                <div className={styles.button}>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={onReset}>
                        重置
                    </Button>
                    ${switchMode ?
                      `<a style={{ marginLeft: 8 }} onClick={toggleForm}>
                        { expandForm ? '收起' : '展开' } <Icon type={expandForm ? 'up': 'down'} />
                      </a>`
                         : ''}
                </div>
                )
            }
            function getFormData() {
                const simpleFormData = \n${getSimpleFormData(QuerySchema)}
                ${switchMode ? `const advancedFromData = \n${getAdvancedFormData(QuerySchema)}` : ''}
             
                ${switchMode ? 'return expandForm ? advancedFromData: simpleFormData'
                : 'return simpleFormData'}
            }

            function renderForm () {
                const formData =  getFormData()
                return (
                <Form onSubmit={onSearch} layout="inline">
                    {formData}
                    { getFilterFromActions() }
                </Form>
                );
            }

            return (<div className={styles.tableListForm}>{renderForm()}</div>);
        }

        export default connect((state) => {
            const { loading, routing } = state
            return {
                ${namespace}: state.${namespace},
                loading: loading.models.${namespace},
                location: routing.location
            }
        })(Form.create()(TableFilter));
    `
}