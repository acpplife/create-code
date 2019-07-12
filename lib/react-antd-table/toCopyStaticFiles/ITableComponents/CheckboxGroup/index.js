import React, { forwardRef } from 'react'
import { Checkbox } from 'antd'

// antd form getFieldDecorator 包裹的组件必须有ref。RadioGroup SelectGroup相同

const CheckboxGroup = (props, ref) => {
  const { source, value, onChange } = props
  
  return (
    <Checkbox.Group
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      ref={ref}
    >
      {
        source && source.map(i => (
          <Checkbox key={i.key} value={i.key}>{i.value}</Checkbox>
        ))
      }
    </Checkbox.Group>
  )
}

export default forwardRef(CheckboxGroup)