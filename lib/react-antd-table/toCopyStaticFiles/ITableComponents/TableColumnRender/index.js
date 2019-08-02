import React from 'react'
import moment from 'moment'
import find from 'lodash/find'
import ImageViewer from '../ImageViewer'
import utils from '../utils'

const { showTypeUtils } = utils

function getArrayValue (value, options) {
  return value.map((i) => {
    const _t = find(options, o => o.key.toString() === i.toString())
    return _t ? _t.value : ''
  }).join()
}

export default function renderLabelHandler(props) {
  const {
    value,
    index,
    showType = 'input',
    format,
    options,
    mode,
    pagination = {}
  } = props
  if (!value) {
    return null
  }

  // 某些状态值可能为数字0，此处额外加判断
  if (!value && value !== 0) {
    return null
  }

  // 是否是自增项
  if (showType === 'autoIncrement') {
    return ((Number(pagination.current) - 1) * Number(pagination.numPerPage)) + index + 1
  }

  if (showTypeUtils.isDate(showType)) {
    
    const dateFormat = format || 'YYYY-MM-DD'
    // rangePicker
    if (Array.isArray(value)) {
      return value.map(i => (moment(i).format(dateFormat))).join(' - ')
    }
    // datePicker
    return (<span>{moment(value).format(dateFormat)}</span>)
  }
    
  // 字典项
  if (showTypeUtils.isAssociate(showType)) {
    
    if (Array.isArray(value)) {
      return getArrayValue(value, options)
    }
    if (showType === 'inputSelect') {
      return value
    }
    if (value && value.toString().indexOf(',') !== -1) {
      return getArrayValue(value.toString().split(','), options)
    }
    const _t = find(options, o => o.key.toString() === value.toString())
    return _t ? _t.value : null
  }

  // 树状数据
  if (showTypeUtils.isCascader(showType)) {
    return utils.getLabelFromCascaderArr(value, options)
  }

  // 图片
  if (showTypeUtils.isImage(showType)) {
    return (<ImageViewer src={value} />)
  }

  // 文件
  if (showTypeUtils.isFile(showType)) {
    return (<a href={value} target="_blank" rel="noopener noreferrer">{value.substr(value.lastIndexOf('/') + 1)}</a>)
  }

  // 链接
  if (showTypeUtils.isLink(showType)) {
    return (<a href={value} target="_blank" rel="noopener noreferrer">{value}</a>)
  }

  // 富文本
  if (showTypeUtils.isEditor(showType)) {
    if (!value) return ''
    // 富文本区分在列表中展示和在详情中展示的情况:
    // 列表中提取标签部分内容展示
    // 详情中需要解析为html展示
    if (mode === 'detail') {
      // 展示需额外添加样式，否则img,audio,video等标签会超出容器宽度
      const extraStyle = `
        <style>
          img, audio, video{
            max-width: 100%;
            height: auto;
          }
            p{
            white-space: pre-wrap;
            min-height: 1em;
          }
          pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
          blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
        </style>
      `
      // eslint-disable-next-line react/no-danger
      return <span dangerouslySetInnerHTML={{ __html: `${extraStyle}${value}` }} />
    }
    return value.replace(/<[^>]+>/g, '').substr(0, 10)
  }

  return value
}