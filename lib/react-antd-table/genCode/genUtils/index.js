const t = require('@babel/types')
const _ = require('lodash')
const generate = require('@babel/generator').default

const defaultDateFormat = 'YYYY-MM-DD'

function getValueExpression (value) {
  if (_.isBoolean(value)) {
    return t.booleanLiteral(value)
  }
  return t.stringLiteral(value)
}

function getItemOptionsExpression(options = []) {
  if (Array.isArray(options)) {
    if (options.length) {
      return t.arrayExpression(options.map(item => (
        t.objectExpression([
          t.objectProperty(t.identifier('key'), t.stringLiteral(item.key)),
          t.objectProperty(t.identifier('value'), t.stringLiteral(item.value)),
        ])
      )))
      
    }
    return t.arrayExpression([])
  }
  return t.stringLiteral(options)
}

function unescapeToChinese (code ) {
  return unescape(code.replace(/\\u/g, '%u'))
}

function getInjectKey(key) {
  return `__${key}Options`
}

function getBlankLine() {
  return t.jsxText('\n')
}

function getInjectVariableKey (key) {
  return `__${key}`
}

const utils = {
  defaultDateFormat,
  getInjectKey,
  getInjectVariableKey,
  getUpdateHumpKey (key) {
    return `__update${key[0].toUpperCase()}${key.slice(1)}`
  },
  unescapeToChinese,
  renderInForm (item, mode) {
    // create 模式下筛选排除primary 为true的字段（新增时主键不能填写）
    if (mode === 'create') {
      return item.key !== '__actions' && !item.actions && item.showInForm !== false
      && item.primary !== true
    }
    return item.key !== '__actions' && !item.actions && item.showInForm !== false
  },
  getItemOptionsExpression,
  getItemFilterExpression(filters = []) {
    if (filters.length) {
      return t.arrayExpression(filters.map(item => (
        t.objectExpression([
          t.objectProperty(t.identifier('value'), t.stringLiteral(item.value.toString())),
          t.objectProperty(t.identifier('text'), t.stringLiteral(item.text)),
        ])
      )))
    }
    return t.arrayExpression([])
  },
  getBlankLine,
  getDicArray (dictionary) {
    if (dictionary && dictionary.length) {
      return dictionary.map(item => item.key)
    }
    return []
  },
  getItemRulesExpression(validator = []) {
    if (validator.length) {
      return t.arrayExpression(validator.map(item => {
        const array = []
        const keys = Object.keys(item)
        keys.forEach(key => {
          array.push(
            t.objectProperty(
              t.identifier(key),
              getValueExpression(item[key])
            )
          )
        })
        return t.objectExpression(array)
      }))
    }
    return t.arrayExpression([])
  },
  /**
   * 获取FormItem initialValue
   * @param {String} item
   */
  getDefaultValueExpression (item) {
    const { key, showType } = item;

    switch (showType) {
    case 'datePicker':
      return t.conditionalExpression(
        t.memberExpression(t.identifier('current'), t.identifier(key)),
        t.callExpression(
          t.identifier('moment'),
          [
            t.memberExpression(t.identifier('current'), t.identifier(key))
          ]
        ),
        t.nullLiteral()
      )
    case 'rangePicker':
      return t.conditionalExpression(
        t.logicalExpression(
          "&&",
          t.memberExpression(t.identifier('current'), t.identifier(key)),
          t.binaryExpression(
            "===",
            t.memberExpression(t.memberExpression(t.identifier('current'), t.identifier(key)), t.identifier('length')),
            t.numericLiteral(2)
          )
        ),
        t.arrayExpression([
          t.callExpression(
            t.identifier('moment'),
            [
              t.memberExpression(t.memberExpression(t.identifier('current'), t.identifier(key)), t.numericLiteral(0), true)
            ]
          ),
          t.callExpression(
            t.identifier('moment'),
            [
              t.memberExpression(t.memberExpression(t.identifier('current'), t.identifier(key)), t.numericLiteral(1), true)
            ]
          ),
        ]),
        t.arrayExpression([])
      )
    case 'select':
      return t.logicalExpression(
        "||",
        t.memberExpression(t.identifier('current'), t.identifier(key)),
        t.arrayExpression([])
      )
    case 'inputSelect':
      return t.logicalExpression(
        "||",
        t.logicalExpression(
          "&&",
          t.memberExpression(
            t.identifier('current'),
            t.identifier(key)
          ),
          t.callExpression(
            t.memberExpression(
              t.memberExpression(
                t.identifier('current'),
                t.identifier(key),
              ),
              t.identifier('split')
            ),
            [
              t.stringLiteral(',')
            ]
          )
        ),
        
        t.arrayExpression([])
      )
    case 'multiSelect':
      return t.logicalExpression(
        "||",
        t.memberExpression(t.identifier('current'), t.identifier(key)),
        t.arrayExpression([])
      )
    default:
      return t.logicalExpression(
        "||",
        t.memberExpression(t.identifier('current'), t.identifier(key)),
        t.nullLiteral()
      )
    }
  },
  // 获取筛选项默认值。需从query中取值，并且注意string转换
  getFilterDefaultValueExpression (item) {
    const { key, showType } = item;

    switch (showType) {
    case 'datePicker':
      return t.conditionalExpression(
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.callExpression(
          t.identifier('moment'),
          [
            t.memberExpression(t.identifier('query'), t.identifier(key))
          ]
        ),
        t.nullLiteral()
      )
    case 'rangePicker': {
      const _expression = t.callExpression(
        t.memberExpression(
          t.memberExpression(
            t.identifier('query'),
            t.identifier(key)
          ),
          t.identifier('split')
        ),
        [t.stringLiteral(',')]
      )
      return t.conditionalExpression(
        t.logicalExpression(
          "&&",
          t.memberExpression(t.identifier('query'), t.identifier(key)),
          t.binaryExpression(
            "===",
            t.memberExpression(
              _expression,
              t.identifier('length')
            ),
            t.numericLiteral(2)
          )
        ),
        t.arrayExpression([
          t.callExpression(
            t.identifier('moment'),
            [
              t.memberExpression(
                _expression
                , t.numericLiteral(0), true)
            ]
          ),
          t.callExpression(
            t.identifier('moment'),
            [
              t.memberExpression(
                _expression
                , t.numericLiteral(1), true)
            ]
          ),
        ]),
        t.arrayExpression([])
      )
    }
    case 'checkbox':
      return t.conditionalExpression(
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.callExpression(
          t.memberExpression(
            t.memberExpression(
              t.identifier('query'),
              t.identifier(key)
            ),
            t.identifier('split')
          ),
          [t.stringLiteral(',')]
        ),
        t.arrayExpression([])
      )
    case 'multiSelect':
      return t.conditionalExpression(
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.callExpression(
          t.memberExpression(
            t.memberExpression(
              t.identifier('query'),
              t.identifier(key)
            ),
            t.identifier('split')
          ),
          [t.stringLiteral(',')]
        ),
        t.arrayExpression([])
      )
    case 'cascader':
      return t.conditionalExpression(
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.callExpression(
          t.memberExpression(
            t.memberExpression(
              t.identifier('query'),
              t.identifier(key)
            ),
            t.identifier('split')
          ),
          [t.stringLiteral(',')]
        ),
        t.arrayExpression([])
      )
    case 'select':
      return t.logicalExpression(
        "||",
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.arrayExpression([])
      )
    default:
      return t.logicalExpression(
        "||",
        t.memberExpression(t.identifier('query'), t.identifier(key)),
        t.nullLiteral()
      )
    }
   
  },
  // 字典类型的值额外嵌入的变量
  injectVariables(data) {
    const result = []
    data.filter(item => item.options).forEach(item => {
      const { options, key } = item;
      if (options) {
        let value = null
        if (Array.isArray(options)) {
          value = getItemOptionsExpression(options)
        } else {
          value = t.memberExpression(t.identifier('data'), t.identifier(options))
        }
        
        const ast = t.variableDeclaration(
          "const",
          [
            t.variableDeclarator(
              t.identifier(getInjectKey(key)),
              value
            )
          ]
        )
        result.push(unescapeToChinese(generate(ast).code))
        result.push('\n')
      }
    })
    return result.join('')
  },
  getPrimaryKey (DataSchema) {
    const data = _.find(DataSchema, o => o.primary)
    if (data) {
      return data.key
    }
    throw new Error("当前数据未设置主键,请在dataSchema.js中选择一列配置 primary 为 true ")
  },
  getEditorKeys (DataSchema) {
    return DataSchema
      .filter(item => item.showType === 'editor')
      .map(item => item.key)
  },
  getUploadUrl (forImage, definedUrl, Config) {
    const {
      upload: {
        uploadUrl,
        imageApiUrl,
        fileApiUrl,
        image,
        file,
      }
    } = Config

    if (definedUrl) {
      if (definedUrl.startsWith('http')) {
        return definedUrl;
      }
      return `${(forImage ? imageApiUrl : fileApiUrl) || uploadUrl || ''}${definedUrl}`;
    }
    return `${(forImage ? imageApiUrl : fileApiUrl) || uploadUrl || ''}${forImage ? (image || '') : (file || '')}`;
  }
}

module.exports = utils