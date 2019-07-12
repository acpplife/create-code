const t = require('@babel/types')
const utils = require('../genUtils')

const {
  defaultDateFormat,
  getInjectKey,
  getBlankLine,
  getItemRulesExpression,
  getDefaultValueExpression,
  getFilterDefaultValueExpression,
  getUploadUrl
} = utils

const blankLine = getBlankLine()

function getInputJsxExpression (item) {
  const { placeholder = '' } = item
  const disabled = !!item.primary
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('disabled'), t.jsxExpressionContainer(t.booleanLiteral(disabled))),
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
  ]
  if (item.addonBefore) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('addonBefore'), t.stringLiteral(item.addonBefore)))
  }
  if (item.addonAfter) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('addonAfter'), t.stringLiteral(item.addonAfter)))
  }
  return [
    t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('Input'), attrArray, true), null, [])
  ]
}
function getInputNumberJsxExpression (item) {
  const { placeholder = '', min, max } = item
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(t.objectExpression([t.objectProperty(t.identifier('width'), t.stringLiteral('100%'))])))
  ]
  if (typeof min !== 'undefined') {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('min'), t.jsxExpressionContainer(t.numericLiteral(item.min))))
  }
  if (typeof max !== 'undefined') {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('max'), t.jsxExpressionContainer(t.numericLiteral(item.max))))
  }
  
  return [
    t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('InputNumber'), attrArray, true), null, [])
  ]
}
function getTextareaJsxExpression (item) {
  const { placeholder = '' } = item
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('rows'), t.jsxExpressionContainer(t.numericLiteral(4))),
  ]
  
  return [
    t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('TextArea'), attrArray, true), null, [])
  ]
}
function getRadioJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('source'), t.jsxExpressionContainer(t.identifier(injectKey)))
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('RadioGroup'), attrArray, true),
      null,
      []
    )
  ]
}
function getCheckboxJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('source'), t.jsxExpressionContainer(t.identifier(injectKey)))
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('CheckboxGroup'), attrArray, true),
      null,
      []
    )
  ]
}
function getDatePickerJsxExpression (item) {
  const { placeholder = '', format = defaultDateFormat } = item
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('format'), t.stringLiteral(format)),
    t.jsxAttribute(t.jsxIdentifier('showTime'), t.jsxExpressionContainer(t.booleanLiteral(true))),
    t.jsxAttribute(t.jsxIdentifier('style'), t.jsxExpressionContainer(t.objectExpression([t.objectProperty(t.identifier('width'), t.stringLiteral('100%'))]))),
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('DatePicker'), attrArray, true),
      null,
      []
    )
  ]
}
function getSelectJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('source'), t.jsxExpressionContainer(t.identifier(injectKey)))
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('SelectGroup'), attrArray, true),
      null,
      []
    )
  ]
}
function getInputSelectJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('mode'), t.stringLiteral('tags')),
    t.jsxAttribute(t.jsxIdentifier('source'), t.jsxExpressionContainer(t.identifier(injectKey)))
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('SelectGroup'), attrArray, true),
      null,
      []
    )
  ]
}
function getMultiSelectJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('multiple'), t.jsxExpressionContainer(t.booleanLiteral(true))),
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
    t.jsxAttribute(t.jsxIdentifier('source'), t.jsxExpressionContainer(t.identifier(injectKey)))
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('SelectGroup'), attrArray, true),
      null,
      []
    )
  ]
}

function getRangePickerJsxExpression (item) {
  const {
    format = defaultDateFormat,
    placeholderBegin = '开始日期',
    placeholderEnd = '结束日期',
  } = item
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('showTime'), t.jsxExpressionContainer(t.booleanLiteral(true))),
    t.jsxAttribute(t.jsxIdentifier('format'), t.stringLiteral(format)),
    t.jsxAttribute(
      t.jsxIdentifier('placeholder'),
      t.jsxExpressionContainer(
        t.arrayExpression([
          t.stringLiteral(placeholderBegin),
          t.stringLiteral(placeholderEnd),
        ])
      )
    )
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('RangePicker'), attrArray, true),
      null,
      []
    )
  ]
}

function getCascadertJsxExpression (item) {
  const { key, placeholder = '' } = item
  const injectKey = getInjectKey(key)
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('options'), t.jsxExpressionContainer(t.identifier(injectKey))),
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('Cascader'), attrArray, true),
      null,
      []
    )
  ]
}

function getImageJsxExpression (item, Config) {
  const {
    placeholder = '', max, url, sizeLimit, accept
  } = item
  const uploadUrl = getUploadUrl(true, url, Config)
  const {
    imageSizeLimit,
  } = Config
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('type'), t.stringLiteral('image')),
    t.jsxAttribute(t.jsxIdentifier('url'), t.stringLiteral(uploadUrl)),
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
  ]
  if (max) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('max'), t.jsxExpressionContainer(t.numericLiteral(max))))
  }
    
  if (sizeLimit) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('sizeLimit'), t.jsxExpressionContainer(t.numericLiteral(sizeLimit))))
  } else if (imageSizeLimit) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('sizeLimit'), t.jsxExpressionContainer(t.numericLiteral(imageSizeLimit))))
  }
  if (accept) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('accept'), t.stringLiteral(accept)))
  }
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('FileUpload'), attrArray, true),
      null,
      []
    )
  ]
}
function getFileJsxExpression (item, Config) {
  const {
    placeholder = '', max, url, sizeLimit, accept
  } = item
  const uploadUrl = getUploadUrl(false, url, Config)
  const {
    fileSizeLimit
  } = Config
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('url'), t.stringLiteral(uploadUrl)),
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
  ]
  if (max) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('max'), t.jsxExpressionContainer(t.numericLiteral(max))))
  }
  if (sizeLimit) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('sizeLimit'), t.jsxExpressionContainer(t.numericLiteral(sizeLimit))))
  } else if (fileSizeLimit) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('sizeLimit'), t.jsxExpressionContainer(t.numericLiteral(fileSizeLimit))))
  }
  if (accept) {
    attrArray.push(t.jsxAttribute(t.jsxIdentifier('accept'), t.stringLiteral(accept)))
  }
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('FileUpload'), attrArray, true),
      null,
      []
    )
  ]
}

function getEditorJsxExpression (item) {
  const { placeholder = '' } = item
  
  const attrArray = [
    t.jsxAttribute(t.jsxIdentifier('placeholder'), t.stringLiteral(placeholder)),
  ]
  
  return [
    t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('Editor'), attrArray, true),
      null,
      []
    )
  ]
}

// 获取对应类型的Field
module.exports = (item, isTableFilter, hasLayout, Config) => {
  const { showType, title, key } = item

  const configArray = []
  
  if (item.validator && item.validator.length) {
    configArray.push(t.objectProperty(t.identifier('rules'), getItemRulesExpression(item.validator)))
  }
  if (showType === 'editor') {
    configArray.push(t.objectProperty(t.identifier('validateTrigger'), t.arrayExpression([t.stringLiteral('onBlur')])))
  } else if (isTableFilter) { // editor 不需要 initialValue。必须由form.setFieldsValue赋值
    configArray.push(t.objectProperty(t.identifier('initialValue'), getFilterDefaultValueExpression(item)))
  } else {
    configArray.push(t.objectProperty(t.identifier('initialValue'), getDefaultValueExpression(item)))
  }

  let itemExpression = []

  switch (showType) {
  case 'input':
    itemExpression = getInputJsxExpression(item)
    break;
  case 'inputNumber':
    itemExpression = getInputNumberJsxExpression(item)
    break;
  case 'textarea':
    itemExpression = getTextareaJsxExpression(item)
    break;
  case 'radio':
    itemExpression = getRadioJsxExpression(item)
    break;
  case 'checkbox':
    itemExpression = getCheckboxJsxExpression(item)
    break;
  case 'datePicker':
    itemExpression = getDatePickerJsxExpression(item)
    break;
  case 'select':
    itemExpression = getSelectJsxExpression(item)
    break;
  case 'inputSelect':
    itemExpression = getInputSelectJsxExpression(item)
    break;
  case 'multiSelect':
    itemExpression = getMultiSelectJsxExpression(item)
    break;
  case 'rangePicker':
    itemExpression = getRangePickerJsxExpression(item)
    break;
  case 'cascader':
    itemExpression = getCascadertJsxExpression(item)
    break;
  case 'image':
    itemExpression = getImageJsxExpression(item, Config)
    break;
  case 'file':
    itemExpression = getFileJsxExpression(item, Config)
    break;
  case 'editor':
    itemExpression = getEditorJsxExpression(item)
    break;
  default:
    itemExpression = getInputJsxExpression(item)
  }

  const expression = t.jsxExpressionContainer(
    t.callExpression(
      t.callExpression(t.identifier('getFieldDecorator'), [
        t.stringLiteral(key),
        t.objectExpression(configArray)
      ]),
      itemExpression
    )
  )

  const formItemAttrArray = [
    t.jsxAttribute(t.jsxIdentifier('label'), t.stringLiteral(title))
  ]
  if (hasLayout) {
    formItemAttrArray.push(
      t.jsxSpreadAttribute(t.identifier('formLayout'))
    )
  }
  const formItemExpression = t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier('FormItem'), formItemAttrArray),
    t.jsxClosingElement(t.jsxIdentifier('FormItem')),
    [
      blankLine,
      expression,
      blankLine,
    ]
  )
  return formItemExpression
  
}
