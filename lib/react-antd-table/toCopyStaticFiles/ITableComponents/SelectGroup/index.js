import React, { forwardRef } from 'react'
import { Select } from 'antd'

const SelectOption = (props, ref) => {
  const { source, placeholder, multiple, value, onChange, mode } = props
  const otherProps = {}
  if (mode) {
    otherProps.mode = mode
  } else if (multiple) {
    otherProps.mode = 'multiple'
  }
  
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
      {...otherProps}
      ref={ref}
    >
      {source && source.map(i => (
        <Select.Option key={i.key} value={i.key}>{i.value}</Select.Option>
      ))}
    </Select>
  )
}

export default forwardRef(SelectOption)