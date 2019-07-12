import React from 'react'

const ColumnAction = (props) => {
  const {
    // 本期暂不支持以下字段配置
    // keys,
    // visible,
    // component,
    // render,
    primaryKey,
    name,
    type,
    record,
    visible,
    onClick
  } = props

  function getAction () {
    switch(type) {
    case 'detail':
      return visible ? <a onClick={() => onClick(record, 'detail')}>{name || '查看'}</a> : null
    case 'update':
      return visible ? <a onClick={() => onClick(record, 'edit')}>{name || '编辑'}</a> : null
    case 'delete':
      return visible ? <a onClick={() => onClick(record[primaryKey])}>{name || '删除'}</a> : null
    case 'newLine':
      return <br />
    default:
      return null
    }
  }
  
  return getAction();
}

export default ColumnAction