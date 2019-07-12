const groupBy = require('lodash/groupBy')
const chunk = require('lodash/chunk')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const utils = require('../genUtils')
const genFormItemUtil = require('./genFormItemUtil')

const {
  renderInForm,
  unescapeToChinese,
  getBlankLine,
} = utils

const blankLine = getBlankLine()

const genUpsertUtils = {
  getFieldLabels (DataSchema) {
    const filterForm = DataSchema.filter(item => renderInForm(item))
    const array = filterForm.map(item => (
      t.objectProperty(t.identifier(item.key), t.stringLiteral(item.title))
    ))
    const ast = t.objectExpression(array)

    const result = unescapeToChinese(generate(ast).code)

    return result
  },
  getFormItemByGroup (DataSchema, Config) {
    const hasGroup = DataSchema.some(item => item.group || item.showType === 'editor')

    const render = (rendererData, title) => {
      const rowArray = [blankLine]
      chunk(rendererData.filter(item => renderInForm(item)), 3).forEach(pItem => {
        const colArray = [blankLine]
        pItem.forEach(item => {
          const formItemArray = []
          formItemArray.push(
            blankLine,
            genFormItemUtil(item, false, false, Config),
            blankLine
          )
          let colAttrs = [
            t.jsxAttribute(t.jsxIdentifier('lg'), t.jsxExpressionContainer(t.numericLiteral(8))),
            t.jsxAttribute(t.jsxIdentifier('md'), t.jsxExpressionContainer(t.numericLiteral(12))),
            t.jsxAttribute(t.jsxIdentifier('sm'), t.jsxExpressionContainer(t.numericLiteral(24))),
          ]
          // 富文本占整行
          if (item.showType === 'editor') {
            colAttrs = [
              t.jsxAttribute(t.jsxIdentifier('span'), t.jsxExpressionContainer(t.numericLiteral(24)))
            ]
          }
          colArray.push(
            t.jsxElement(
              t.jsxOpeningElement(t.jsxIdentifier('Col'), colAttrs),
              t.jsxClosingElement(t.jsxIdentifier('Col')),
              [
                blankLine,
                ...formItemArray,
                blankLine,
              ]
            ), blankLine
          )
        })

        rowArray.push(
          t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('Row'), [
              t.jsxAttribute(t.jsxIdentifier('gutter'), t.jsxExpressionContainer(t.numericLiteral(16))),
            ]),
            t.jsxClosingElement(t.jsxIdentifier('Row')),
            [
              ...colArray,
              blankLine,
            ]
          ), blankLine
        )
      })
  
      const ast = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier('Card'), [
          t.jsxAttribute(t.jsxIdentifier('bordered'), t.jsxExpressionContainer(t.booleanLiteral(false))),
          t.jsxAttribute(t.jsxIdentifier('title'), t.stringLiteral(title && title !== 'undefined' ? title : '')),
        ]),
        t.jsxClosingElement(t.jsxIdentifier('Card')),
        [
          ...rowArray,
          blankLine,
        ]
      )

      return ast
    }

    let ast;
    if (hasGroup) {
      // 分组数据
      const filteredData = DataSchema.filter(item => item.group && item.showType !== 'editor')
      // 未分组数据
      const otherData = DataSchema.filter(item => !item.group && item.showType !== 'editor')
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
        jsxBodyArr.push(render(editorData))
      }
      jsxBodyArr.push(blankLine)

      ast = t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(),
        jsxBodyArr
      )
    } else {
      ast = render(DataSchema)
    }

    const result = unescapeToChinese(generate(ast).code)

    return result
  },
  /**
   * keys：要赋值的key的集合
   * condition: 模态框查看详情和编辑复用的模态框，查看模式下不需要useEffect
   */
  injectEditorEffects(keys, condition) {
    if (!(keys && keys.length)) {
      return ''
    }
    // 对象属性集合
    const objectPropertyArray = keys.map(item => (
      t.objectProperty(
        t.identifier(item),
        t.callExpression(
          t.memberExpression(
            t.identifier('BraftEditor'),
            t.identifier('createEditorState')
          ),
          [
            t.memberExpression(
              t.identifier('current'),
              t.identifier(item)
            )
          ]
        )
      )
    ))
    // 对象依赖集合
    const dependenceArray = keys.map(item => (
      t.memberExpression(
        t.identifier('current'),
        t.identifier(item)
      )
    ))

    const statement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.memberExpression(
            t.identifier('props'),
            t.identifier('form')
          ),
          t.identifier('setFieldsValue')
        ),
        [
          t.objectExpression(objectPropertyArray)
        ]
      )
    )

    const ast = t.expressionStatement(
      t.callExpression(
        t.identifier('useEffect'),
        [
          t.arrowFunctionExpression(
            [],
            t.blockStatement(
              [
                condition ?
                  t.ifStatement(
                    t.identifier(condition),
                    t.blockStatement([statement])
                  )
                  : statement,
              ]
            )
          ),
          t.arrayExpression(dependenceArray)
        ]
      )
    )

    return unescapeToChinese(generate(ast).code)
  }
}

module.exports = genUpsertUtils