const genUpsertUtil = require('./genUpsertUtil')
const utils = require('../genUtils')

const { getDicArray, injectVariables, getPrimaryKey, getEditorKeys } = utils
const { getFieldLabels, getFormItemByGroup, injectEditorEffects } = genUpsertUtil

module.exports = (tableConfig) => {

  const {
    Config,
    Config: {
      namespace,
      dictionary,
      defaultDateFormat
    },
    DataSchema
  } = tableConfig
  const primaryKey = getPrimaryKey(DataSchema)
  const dicArray = getDicArray(dictionary)
  const injectValues = injectVariables(DataSchema)
  const editorKeys = getEditorKeys(DataSchema)

  return `
        import React, { useEffect } from 'react';
        import { Row, Col, Button, Form, Icon, Popover, DatePicker, InputNumber, Cascader, Card, Input } from 'antd';
        import { connect } from 'dva';
        import router from 'umi/router';
        import moment from 'moment';
        ${editorKeys && editorKeys.length ? `
        import BraftEditor from 'braft-editor'
        ` : ''}
        import Editor from '@/components/ITableComponents/Editor';
        import FooterToolbar from '@/components/ITableComponents/FooterToolbar';
        import RadioGroup from '@/components/ITableComponents/RadioGroup';
        import CheckboxGroup from '@/components/ITableComponents/CheckboxGroup';
        import SelectGroup from '@/components/ITableComponents/SelectGroup';
        import FileUpload from '@/components/ITableComponents/FileUpload';
        import utils from '../utils'
        import styles from './index.less';

        const { getFormatFormValues } = utils;
        const FormItem = Form.Item;
        const { RangePicker } = DatePicker;
        const { TextArea } = Input;

        // 获取提示信息对应的title
        const fieldLabels = ${getFieldLabels(DataSchema)};

        function UpsertForm(props) {
            const { 
                dispatch, match, loading,
                form: { 
                    validateFieldsAndScroll, 
                    getFieldDecorator
                },
            } = props;
            const { params } = match;
            const data = props.${namespace}
            const { current } = data
            const isEditMode = !!params.id

            ${injectValues}

            // Effect
            useEffect(() => {
                if (params.id) {
                    dispatch({
                        type: '${namespace}/findById',
                        payload: { ${primaryKey}: params.id }
                    });
                } else {
                    dispatch({
                        type: '${namespace}/resetCurrent',
                    });
                }
                ${dicArray && dicArray.length ?
                    dicArray.map(item => (`dispatch({ type: "${namespace}/__${item}" });`)).join('\n')
                    : ''}
            }, [dispatch, params.id])

            ${injectEditorEffects(editorKeys)}
            
            // 获取table内容
            const content = \n${getFormItemByGroup(DataSchema, Config)}
            // 返回
            function goBack () {
                router.goBack()
            }
            // 提交时获取校验信息
            function getErrorInfo () {
                const {
                    form: { getFieldsError },
                } = props;
                const errors = getFieldsError();
                const errorCount = Object.keys(errors).filter(key => errors[key]).length;
                if (!errors || errorCount === 0) {
                return null;
                }
                const scrollToField = fieldKey => {
                const labelNode = document.querySelector(\`label[for="\${fieldKey}"]\`);
                if (labelNode) {
                    labelNode.scrollIntoView(true);
                }
                };
                const errorList = Object.keys(errors).map(key => {
                if (!errors[key]) {
                    return null;
                }
                return (
                    <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                        <Icon type="cross-circle-o" className={styles.errorIcon} />
                        <div className={styles.errorMessage}>{errors[key][0]}</div>
                        <div className={styles.errorField}>{fieldLabels[key]}</div>
                    </li>
                );
                });
                return (
                <span className={styles.errorIcon}>
                    <Popover
                        title="表单校验信息"
                        content={errorList}
                        overlayClassName={styles.errorPopover}
                        trigger="click"
                        getPopupContainer={trigger => trigger.parentNode}
                        >
                        <Icon type="exclamation-circle" />
                    </Popover>
                    {errorCount}
                </span>
                );
            };
            // 提交
            function handleSubmit (values, type) {
                dispatch({
                    type: '${namespace}/submit',
                    payload: values,
                    actionType: type,
                });
            };
            // 校验
            function validate () {
                validateFieldsAndScroll((error, fieldsValue) => {
                if (!error) {
                    const values = getFormatFormValues(fieldsValue, '${defaultDateFormat}')
                    // 编辑模式下，若主键的showInForm 设为false，则无法从fieldsValue中获取主键的值，需将current中对应字段获取到并拼接到当前值中
                    if (isEditMode) {
                    values.${primaryKey} = current.${primaryKey}
                    }
                    handleSubmit(values, isEditMode ? 'edit' : 'create');
                }
                });
            };

            return (
                <div className={styles.updateForm}>
                <div className={styles.form}>
                    <Form layout="vertical">
                        {content}
                    </Form>
                </div>
                <FooterToolbar>
                    {getErrorInfo()}
                    <Button onClick={goBack} style={{ marginRight: 20 }}>
                        返回
                    </Button>
                    <Button type="primary" onClick={validate} loading={loading}>
                        提交
                    </Button>
                </FooterToolbar>
                </div>
            );
        }

        export default connect((state) => {
            const { loading } = state
            return {
                ${namespace}: state.${namespace},
                loading: loading.effects['${namespace}/submit'],
            }
        })(Form.create()(UpsertForm))
    `
}