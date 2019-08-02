const _ = require('lodash')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const utils = require('../genUtils')

const {
  getInjectKey,
  getPrimaryKey,
  unescapeToChinese,
  getItemFilterExpression,
  getBlankLine
} = utils

module.exports = function genIndexColumn (DataSchema, Config) {

  const array = []
  const {
    showDetail,
    showUpdate,
    showDelete,
    showAutoIncrementIndex
  } = Config
  const primaryKey = getPrimaryKey(DataSchema)
  const blankLine = getBlankLine()

  DataSchema
    .filter(item => item.showInTable !== false) // 筛选数据是否在table中显示
    .forEach((item) => {
      const exArray = [
        t.objectProperty(t.identifier('title'), t.stringLiteral(item.title)),
        t.objectProperty(t.identifier('dataIndex'), t.stringLiteral(item.key)),
      ]
      const funcArray = [
        t.jsxAttribute(t.jsxIdentifier('value'), t.jSXExpressionContainer(t.identifier('val'))),
      ]
      
      if (item.format) {
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('format'), t.stringLiteral(item.format)))
      }
      if (item.options) {
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('options'), t.jSXExpressionContainer(
          t.identifier(getInjectKey(item.key))
        )))
      }
      if (item.primary && showAutoIncrementIndex) {
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('showType'), t.stringLiteral('autoIncrement')))
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('index'), t.jSXExpressionContainer(t.identifier('index'))))
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('pagination'), t.jSXExpressionContainer(t.identifier('pagination'))))
      } else if (item.showType) {
        funcArray.push(t.jsxAttribute(t.jsxIdentifier('showType'), t.stringLiteral(item.showType)))
      }

      if (item.sorter) {
        exArray.push(t.objectProperty(t.identifier('sorter'), t.booleanLiteral(item.sorter)))
      }
      if (item.width) {
        exArray.push(t.objectProperty(t.identifier('width'), _.isNumber(item.width) ? t.numericLiteral(item.width) : t.stringLiteral(item.width)))
      }
      if (item.filters) {
        exArray.push(t.objectProperty(t.identifier('filters'), getItemFilterExpression(item.filters)))
      }
      // render actions
      if (item.actions) {
        const actionsExpressionArray = []
        item.actions.forEach((action, i) => {
          const attrArray = [
            t.jsxAttribute(t.jsxIdentifier('type'), t.stringLiteral(action.type)),
            t.jsxAttribute(t.jsxIdentifier('record'), t.jSXExpressionContainer(t.identifier('record'))),
          ]
          if (action.type === 'delete') {
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('visible'), t.jSXExpressionContainer(t.booleanLiteral(!!showDelete))))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(action.name)))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('primaryKey'), t.stringLiteral(primaryKey)))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('onClick'), t.jSXExpressionContainer(t.identifier('handleRemove'))))
          }
          if (action.type === 'detail') {
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('visible'), t.jSXExpressionContainer(t.booleanLiteral(!!showDetail))))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(action.name)))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('onClick'), t.jSXExpressionContainer(t.identifier('handleUpdateModalVisible'))))
          }
          if (action.type === 'update') {
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('visible'), t.jSXExpressionContainer(t.booleanLiteral(!!showUpdate))))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(action.name)))
            attrArray.push(t.jsxAttribute(t.jsxIdentifier('onClick'), t.jSXExpressionContainer(t.identifier('handleUpdateModalVisible'))))
          }
          // ColumnAction Divider
          actionsExpressionArray.push(blankLine, t.jSXElement(
            t.jSXOpeningElement(t.jsxIdentifier('ColumnAction'), attrArray, true),
            null,
            [],
            true
          ))

          const len = item.actions.length
          const next = item.actions[i + 1]
          if (!(i === len - 1 ||
            action.type === 'newLine' ||
            (next && next.type === 'newLine'))) {
            actionsExpressionArray.push(blankLine,
              t.jSXElement(
                t.jSXOpeningElement(t.jsxIdentifier('Divider'), [
                  t.jsxAttribute(t.jsxIdentifier('type'), t.stringLiteral('vertical'))
                ], true),
                null,
                [],
                true
              )
            )
          }
        })
        exArray.push(t.objectProperty(t.identifier('render'), t.arrowFunctionExpression([
          t.identifier('_'),
          t.identifier('record'),
        ], t.BlockStatement([
          t.returnStatement(
            t.jSXFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), [
              ...actionsExpressionArray,
              blankLine
            ])
          )
        ]))))
      } else {
        exArray.push(t.objectProperty(t.identifier('render'), t.arrowFunctionExpression([
          t.identifier('val'),
          t.identifier('record'),
          t.identifier('index'),
        ], t.BlockStatement([
          t.returnStatement(
            t.jSXElement(
              t.jSXOpeningElement(t.jsxIdentifier('TableColumnRender'), funcArray, true),
              null,
              [],
              true
            )
          )
        ]))))
      }

      const ast = t.objectExpression(exArray)
      array.push(ast)
    })

  const ast = t.arrayExpression(array)
  let { code } = generate(ast)
  // 解决返回<>不换行导致eslint不能自动修复的问题
  code = code.replace(/return <>([\s\S]*)<\/>/, 'return (\n<>$1</>)')

  return unescapeToChinese(code)
}