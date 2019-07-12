import find from 'lodash/find'

const utils = {
  _getNodeLabelFromValue (value, array) {
    const _t = find(array, o => o.value === value)
    if (_t) return _t.label
    for(let i = 0;i < array.length; i+=1) {
      const { children } = array[i]
      if (children && children.length) {
        const label = this._getNodeLabelFromValue(value, children)
        if (label) return label
      }
    }
    return ''
  },
  getLabelFromCascaderArr (value, array) {
    if (!(value && value.length && array && array.length)) {
      return ''
    }
    return value.map((item) => this._getNodeLabelFromValue(item, array))
  },
  showTypeUtils: {
    isAssociate: (showType) => {
      // 字典项，值需映射
      const associatedArr = ['select', 'radio', 'checkbox', 'multiSelect', 'inputSelect']
      return associatedArr.indexOf(showType) !== -1
    },
    isDate: (showType) => {
      // 日期，格式化
      const dateArr = ['datePicker', 'rangePicker']
      return dateArr.indexOf(showType) !== -1
    },
    isCascader: (showType) => {
      // 树状数据
      const cascaderArr = ['cascader']
      return cascaderArr.indexOf(showType) !== -1
    },
    isImage: (showType) => {
      // 图片
      const imageArr = ['image']
      return imageArr.indexOf(showType) !== -1
    },
    isFile: (showType) => {
      // 文件
      const fileArr = ['file']
      return fileArr.indexOf(showType) !== -1
    },
    isLink: (showType) => {
      // 链接
      const linkArr = ['link']
      return linkArr.indexOf(showType) !== -1
    },
    isEditor: (showType) => {
      // 富文本
      const fileArr = ['editor']
      return fileArr.indexOf(showType) !== -1
    },
  }
}

export default utils