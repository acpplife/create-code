import React from 'react'
import { Button } from 'antd'
import styles from './index.less'

const TableAction = (props) => {
  const {
    selectedRows,
    handleMenuClick,
    showCreate,
    showExport,
    showBatchDelete,
    ...otherProps
  } = props
  
  return (
    <div
      className={styles.tableListOperator}
      {...otherProps}
    >
      {
        showCreate ? (
          <Button icon="plus" type="primary" onClick={() => handleMenuClick('create')}>
            新增
          </Button>
        ) : null
      }
      {
        showExport ? (
          <Button icon="export" type="primary" onClick={() => handleMenuClick('export')}>
            导出
          </Button>
        ) : null
      }
      {selectedRows && selectedRows.length > 0 && showBatchDelete && (
        <Button icon="delete" type="primary" onClick={() => handleMenuClick('remove')}>
          批量删除
        </Button>
      )}
    </div>
  )
}

export default TableAction