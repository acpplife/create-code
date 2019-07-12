const tableFormUtils = require('./tableFormUtils')
const genUpsertUtil = require('../genUpsert/genUpsertUtil')
const genUtils = require('../genUtils')

const { getFormItem, getFormDetailItem } = tableFormUtils
const { injectVariables, getPrimaryKey, getEditorKeys } = genUtils
const { injectEditorEffects } = genUpsertUtil

module.exports = (tableConfig) => {

  const {
    Config,
    Config: {
      namespace,
      defaultDateFormat
    },
    DataSchema
  } = tableConfig
  const primaryKey = getPrimaryKey(DataSchema)
  const injectValues = injectVariables(DataSchema)
  const editorKeys = getEditorKeys(DataSchema)

  return `
        import React, { useEffect } from 'react'
        import { connect } from 'dva';
        import moment from 'moment';
        ${editorKeys && editorKeys.length ? `
        import BraftEditor from 'braft-editor'
        ` : ''}
        import Editor from '@/components/ITableComponents/Editor';
        import { Modal, Form, Input, InputNumber, DatePicker, Cascader } from 'antd'
        import RadioGroup from '@/components/ITableComponents/RadioGroup';
        import CheckboxGroup from '@/components/ITableComponents/CheckboxGroup';
        import SelectGroup from '@/components/ITableComponents/SelectGroup';
        import FileUpload from '@/components/ITableComponents/FileUpload';
        import TableColumnRender from '@/components/ITableComponents/TableColumnRender';
        import utils from '../../utils'
        import styles from './index.less'

        const { getFormatFormValues } = utils;
        const FormItem = Form.Item;
        const { TextArea } = Input;
        const { RangePicker } = DatePicker;

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };

        const TableModal = (props) => {
            const {
                confirmLoading,
                current,
                modalType,
                modalVisible,
                form,
                form: { getFieldDecorator },
                handleSubmit,
                handleModalVisible
            } = props;
            const data = props.${namespace}
            const isEditMode = modalType === 'edit'
            const isDetailMode = modalType === 'detail'

            ${injectValues}
            ${injectEditorEffects(editorKeys, 'isEditMode')}

            const onSubmit = (e) => {
                e.preventDefault()
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const values = getFormatFormValues(fieldsValue, '${defaultDateFormat}')
                    // 编辑模式下，若主键的showInForm 设为false，则无法从fieldsValue中获取主键的值，需将current中对应字段获取到并拼接到当前值中
                    if (isEditMode) {
                        values.${primaryKey} = current.${primaryKey}
                    }
                    handleSubmit(values, modalType, () => {
                        form.resetFields();
                    });
                });
            };
            const getTile = () => {
                if (isDetailMode) return '查看详情'
                if (isEditMode) return '编辑'
                return '新增'
            }

            let modalContent;
            if (isDetailMode) {
                modalContent = \n${getFormDetailItem(DataSchema)}
            } else {
                modalContent = \n${getFormItem(DataSchema, Config)}
            }

            const modalProps = {
                title: getTile(),
                visible: modalVisible,
                onOk: onSubmit,
                confirmLoading,
                onCancel: () => handleModalVisible(),
                maskClosable: isDetailMode, // 只有查看详情时点击蒙层可以关闭
            }
            if (isDetailMode) modalProps.footer = null

            return (
                <Modal
                    className={styles.standardListForm}
                    width={640}
                    bodyStyle={{ padding: '28px 0 18px' }}
                    destroyOnClose
                    cancelText="取消"
                    okText='保存'
                    {...modalProps}
                >
                    {modalContent}
                </Modal>
            );
        }

        export default connect((params) => {
        const { loading } = params
        return {
            ${namespace}: params.${namespace},
            confirmLoading: loading.effects['${namespace}/submit']
        }
        })(Form.create()(TableModal));
    `
}