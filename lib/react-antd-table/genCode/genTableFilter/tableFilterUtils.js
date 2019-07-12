const t = require('@babel/types')
const generate = require('@babel/generator').default
const genUtils = require('../genUtils')
const genFormItemUtil = require('../genUpsert/genFormItemUtil')

const { getBlankLine, unescapeToChinese } = genUtils

const col16Array = ['rangePicker']
const blankLine = getBlankLine()

function getItemCol(item) {
  const { showType } = item
  const col16 = col16Array
  if (col16.indexOf(showType) !== -1) {
    return 16
  }
  return 8
}

function conditionChunk (array, size) {
  const length = array === null ? 0 : array.length;
  if (!length || size < 1) {
    return []
  }
  let index = 0;
  let resIndex = 0;
  const result = [];

  while(index < length) {
    const sliceArray = array.slice(index, index + size)
      
    const hasCol16Data = (item) => {
      const col16 = col16Array
      return col16.indexOf(item.showType) !== -1
    }
    // 针对size=3的情况，逐一判断三个元素中是否有需要多列展示的情况，并且同一行中不能包含多个多列展示的
    const [first, second, third] = sliceArray
    if (hasCol16Data(first)) {
      if (second) {
        result[resIndex] = array.slice(index, index += hasCol16Data(second) ? 1 : 2)
      } else {
        result[resIndex] = array.slice(index, index += 1)
      }
    } else if (second) {
      if (hasCol16Data(second)) {
        result[resIndex] = array.slice(index, index += 2)
      } else if (third) {
        result[resIndex] = array.slice(index, index += hasCol16Data(third) ? 2 : 3)
      } else {
        result[resIndex] = array.slice(index, index += 2)
      }
    } else {
      result[resIndex] = array.slice(index, index += 1)
    }

    resIndex += 1
  }
  return result;
}

function hasModeSwitch(QuerySchema) {return QuerySchema.some(item => item.showInSimpleMode)}

function getFilterItemCode (dataList) {
  const rowArray = []
  if (dataList && dataList.length) {
    conditionChunk(dataList, 3).forEach(rowItem => {
      const colArray = []
      rowItem.forEach(item => {
        colArray.push(
          t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('Col'), [
              t.jsxAttribute(t.jsxIdentifier('md'), t.jsxExpressionContainer(t.numericLiteral(getItemCol(item)))),
              t.jsxAttribute(t.jsxIdentifier('sm'), t.jsxExpressionContainer(t.numericLiteral(24))),
            ]),
            t.jsxClosingElement(t.jsxIdentifier('Col')),
            [
              blankLine,
              genFormItemUtil(item, true),
              blankLine
            ]
          ), blankLine
        )
      })
      rowArray.push(t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier('Row'), [
          t.jsxAttribute(t.jsxIdentifier('gutter'), t.jsxExpressionContainer(t.numericLiteral(24))),
        ]),
        t.jsxClosingElement(t.jsxIdentifier('Row')),
        [
          blankLine,
          ...colArray,
          blankLine
        ]
      ), blankLine)
    })
  }

  const ast = t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    [
      blankLine,
      ...rowArray,
      blankLine
    ]
  )
  
  return unescapeToChinese(generate(ast).code)
}

function getAdvancedFormData(QuerySchema) {return getFilterItemCode(QuerySchema)}

module.exports = {
  hasModeSwitch,
  getSimpleFormData (QuerySchema) {
    const switchMode = hasModeSwitch(QuerySchema)
    if (switchMode) {
      return getFilterItemCode(QuerySchema.filter(item => item.showInSimpleMode))
    }
    return getAdvancedFormData(QuerySchema)
  },
  getAdvancedFormData,
}
