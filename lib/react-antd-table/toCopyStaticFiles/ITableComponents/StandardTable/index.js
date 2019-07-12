import React, { Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

export default (props) => {
  const { selectedRows, onSelectRow, multiSelection, paginationConfig } = props

  function handleRowSelectChange (_, _selectedRows) {
    onSelectRow(_selectedRows)
  };

  function handleTableChange (pagination, filters, sorter) {
    const { onChange } = props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  function cleanSelectedKeys () {
    handleRowSelectChange([], []);
  };

  const { data = {}, rowKey, ...rest } = props;
  const { list = [], pagination } = data;

  const paginationProps = {
    showSizeChanger: paginationConfig.showSizeChanger,
    showQuickJumper: paginationConfig.showQuickJumper,
    pageSizeOptions: paginationConfig.pageSizeOptions,
    ...pagination,
  };
  if (paginationConfig.showTotal) paginationProps.showTotal = (total) => `共 ${total} 条`

  const rowSelection = {
    selectedRowKeys: selectedRows && selectedRows.map(item => item[rowKey]),
    onChange: handleRowSelectChange,
    getCheckboxProps: record => ({
      disabled: record.disabled,
    }),
  };

  return (
    <div className={styles.standardTable}>
      {
        multiSelection ? (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项&nbsp;&nbsp;
                  <a onClick={cleanSelectedKeys} style={{ marginLeft: 24 }}>
                清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        ) : null
      }
      <Table
        rowKey={rowKey}
        rowSelection={multiSelection ? rowSelection : null}
        dataSource={list}
        pagination={paginationProps}
        onChange={handleTableChange}
        {...rest}
      />
    </div>
  );
}

