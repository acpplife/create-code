import find from 'lodash/find'
import moment from 'moment'

const defaultDateFormat = 'YYYY-MM-DD'

const utils = {
  getValue: (obj) => (Object.keys(obj).map(key => obj[key]).join(',')),
  // 根据特定条件拆分数组
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
  getFormatParamsFromTable (pagination, filtersArg, sorter, formValues) {

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = utils.getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters,
      pageNum: pagination.current,
      numPerPage: pagination.numPerPage,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    return params
  },
  getFormatFormValues (fieldsValue, dateFormat = defaultDateFormat, mode) {
    const values = {
      ...fieldsValue
    }
    // 格式化处理其中的数组类型的值以及日期moment格式的值
    const keys = Object.keys(fieldsValue)
    for(let i=0; i < keys.length; i += 1) {
      const key = keys[i]
      const value = fieldsValue[key]
      if (!value) {
        delete values[key]
      } else if (Array.isArray(value)) { // 数组类型的value
        if (value.length) {
          const isMomentValue = value.some(item => moment.isMoment(item))
          if (isMomentValue) {
            // 日期格式的数组在tableFilter 模式下要根据字段拆分。
            // 比如createTime，拆分为createBeginTime和createEndTime，并删除createTime字段
            if (mode === 'tableFilter' && value.length === 2) {
              values[`${key}BeginTime`] = moment(value[0]).format(dateFormat)
              values[`${key}EndTime`] = moment(value[1]).format(dateFormat)
              delete values[key]
            } else {
              values[key] = value.map(item => moment(item).format(dateFormat)).join()
            }
          } else {
            values[key] = value.join()
          }
        } else {
          delete values[key]
        }
      } else if (value.convertOptions) { // braft-editor value
        values[key] = value.toHTML()
      } else if (moment.isMoment(value)) { // 普通日期格式
        values[key] = moment(value).format(dateFormat)
      }
    }
    return values
  }
}

export default utils