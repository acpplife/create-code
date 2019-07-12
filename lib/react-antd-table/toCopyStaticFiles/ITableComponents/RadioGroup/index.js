import React, { forwardRef } from 'react'
import { Radio } from 'antd'

const RadioGroup = (props, ref) => {
  const { source, value, onChange } = props
  
  return (
    <Radio.Group
      style={{ width: "100%" }}
      ref={ref}
      value={value}
      onChange={onChange}
    >
      {
        source && source.map(i => (
          <Radio key={i.key} value={i.key}>{i.value}</Radio>
        ))
      }
    </Radio.Group>
  )
}

export default forwardRef(RadioGroup)