const groupBy = require('lodash/groupBy')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const utils = require('../genUtils')

const { renderInForm, unescapeToChinese, getBlankLine, getInjectKey } = utils

const blankLine = getBlankLine()

module.exports = (DataSchema) => {
  // 若数据中包含富文本编辑器，则自动分组，每个富文本单独占一整行展示。
  const groupFilter = (item) => item.group || item.showType === 'editor'
  const hasGroup = DataSchema.some(item => groupFilter(item))

  const render = (rendererData, title, options = {}) => {
    const childArray = [blankLine]
    const { col } = options

    rendererData.filter(item => renderInForm(item, 'detail')).forEach((item) => {
      const injectKey = getInjectKey(item.key)

      const attrArray = [
        t.jsxAttribute(t.jsxIdentifier('value'), t.jSXExpressionContainer(t.memberExpression(t.identifier('current'), t.identifier(item.key)))),
        t.jsxAttribute(t.jsxIdentifier('mode'), t.stringLiteral('detail'))
      ]
      if (item.showType) {
        attrArray.push(t.jsxAttribute(t.jsxIdentifier('showType'), t.stringLiteral(item.showType)))
      }
      if (item.format) {
        attrArray.push(t.jsxAttribute(t.jsxIdentifier('format'), t.stringLiteral(item.format)))
      }
      if (item.options) {
        attrArray.push(t.jsxAttribute(t.jsxIdentifier('options'), t.jSXExpressionContainer(
          t.identifier(injectKey)
        )))
      }
      childArray.push(
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier('Description'), [
            t.jsxAttribute(t.jsxIdentifier('term'), t.stringLiteral(item.title)),
          ]),
          t.jsxClosingElement(t.jsxIdentifier('Description')),
          [
            blankLine,
            t.JSXElement(t.jsxOpeningElement(t.jsxIdentifier('TableColumnRender'), attrArray, true),
              null,
              [],
              true
            ),
            blankLine
          ]
        ),
        blankLine
      )
    })
 
    const ast = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('DescriptionList'), [
        t.jsxAttribute(t.jsxIdentifier('size'), t.stringLiteral('large')),
        t.jsxAttribute(t.jsxIdentifier('title'), t.stringLiteral(title && title !== 'undefined' ? title : '')),
        ...(col ? [
          t.jsxAttribute(t.jsxIdentifier('col'), t.jsxExpressionContainer(t.numericLiteral(col)))
        ] : [])
      ]),
      t.jsxClosingElement(t.jsxIdentifier('DescriptionList')),
      [
        blankLine,
        ...childArray,
        blankLine,
      ]
    )

    return ast
  }
  let ast;

  if (hasGroup) {
    /**
     * 展示顺序优先级为
     * 1. 普通未分组数据（非富文本编辑器）
     * 2. 分组数据（非富文本编辑器）
     * 3. 富文本编辑器（自成分组）
     */
    // 未分组普通数据
    const otherData = DataSchema.filter(item => !item.group && item.showType !== 'editor')
    // 分组数据
    const filteredData = DataSchema.filter(item => item.group && item.showType !== 'editor')
    // 未分组富文本数据
    const editorData = DataSchema.filter(item => item.showType === 'editor')

    const groupedData = groupBy(filteredData, 'group')
    const keys = Object.keys(groupedData)
    const jsxBodyArr = [blankLine]

    if (otherData && otherData.length) {
      jsxBodyArr.push(render(otherData), blankLine)
    }
    keys.forEach(item => {
      jsxBodyArr.push(render(groupedData[item], item), blankLine)
    })
    if (editorData && editorData.length) {
      jsxBodyArr.push(render(editorData, '', { col: 1 }))
    }
    jsxBodyArr.push(blankLine)

    ast = t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), jsxBodyArr)
  } else {
    ast = render(DataSchema)
  }

  const result = unescapeToChinese(generate(ast).code)

  return result
}