const t = require('@babel/types')
const generate = require('@babel/generator').default
const genUtils = require('../genUtils')
const genFormItemUtil = require('../genUpsert/genFormItemUtil')

const { getInjectKey, getBlankLine, unescapeToChinese, renderInForm } = genUtils

const blankLine = getBlankLine()

module.exports = {
  getFormItem (DataSchema, Config) {
    const formArray = [blankLine]

    DataSchema.filter(item => renderInForm(item, 'edit')).forEach(item => {
      formArray.push(genFormItemUtil(item, false, true, Config), blankLine)
    })
    const ast = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('Form'), []),
      t.jsxClosingElement(t.jsxIdentifier('Form')),
      formArray
    )
    const result = unescapeToChinese(generate(ast).code)

    return result;
  },
  getFormDetailItem (DataSchema) {
    const formArray = [blankLine]

    DataSchema.filter(item => renderInForm(item, 'detail')).forEach(item => {
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
        const injectKey = getInjectKey(item.key)
        attrArray.push(t.jsxAttribute(t.jsxIdentifier('options'), t.jSXExpressionContainer(
          t.identifier(injectKey)
        )))
      }
      formArray.push(t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier('FormItem'), [
          t.jsxAttribute(t.jsxIdentifier('label'), t.stringLiteral(item.title)),
          t.jsxSpreadAttribute(t.identifier('formLayout'))
        ]),
        t.jsxClosingElement(t.jsxIdentifier('FormItem')),
        [
          blankLine,
          t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier('span'), [
              t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral('ant-form-text')),
            ]),
            t.jsxClosingElement(t.jsxIdentifier('span')),
            [
              blankLine,
              t.jSXElement(
                t.jSXOpeningElement(t.jsxIdentifier('TableColumnRender'), attrArray, true),
                null,
                [],
                true
              ),
              blankLine
            ]
          ),
          blankLine
        ]
      ), blankLine)
    })
    const ast = t.jsxElement(
      t.jsxOpeningElement(t.jsxIdentifier('Form'), []),
      t.jsxClosingElement(t.jsxIdentifier('Form')),
      formArray
    )
    const result = unescapeToChinese(generate(ast).code)

    return result;
  }
}
