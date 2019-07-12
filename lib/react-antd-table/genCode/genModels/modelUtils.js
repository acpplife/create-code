
const t = require('@babel/types')
const generate = require('@babel/generator').default
const genUtils = require('../genUtils')

const {
  getInjectVariableKey,
  unescapeToChinese,
  getUpdateHumpKey
} = genUtils

// get function
function getYieldFunctionDeclaration (name) {
  const injectVariableKey = getInjectVariableKey(name)
  const updateFuncKey = getUpdateHumpKey(name)

  const ast = t.functionDeclaration(
    t.identifier(injectVariableKey), // id
    [ // params
      t.objectPattern([ // object property
        t.objectProperty(t.identifier('payload'), t.identifier('payload'))
      ]),
      t.objectPattern([ // object property
        t.objectProperty(t.identifier('call'), t.identifier('call')),
        t.objectProperty(t.identifier('put'), t.identifier('put'))
      ]),
    ],
    t.blockStatement(
      [ // body
        t.variableDeclaration("const", [ // declaration
          t.variableDeclarator(
            t.identifier('response'),
            t.yieldExpression(
              t.callExpression(
                t.identifier('call'),
                [
                  t.identifier(injectVariableKey),
                  t.identifier('payload')
                ]
              )
            )
          )
        ]),
        t.ifStatement( // IfStatement
          t.logicalExpression(
            "&&",
            t.identifier('response'),
            t.binaryExpression(
              "===",
              t.memberExpression(
                t.identifier('response'),
                t.identifier('errorCode')
              ),
              t.numericLiteral(0)
            )
          ),
          t.blockStatement( // consequent
            [
              t.expressionStatement(
                t.yieldExpression(
                  t.callExpression(
                    t.identifier('put'),
                    [
                      t.objectExpression(
                        [
                          t.objectProperty(
                            t.identifier('type'),
                            t.stringLiteral(updateFuncKey)
                          ),
                          t.objectProperty(
                            t.identifier('payload'),
                            t.memberExpression(
                              t.identifier('response'),
                              t.identifier('data')
                            )
                          ),
                        ]
                      )
                    ]
                  )
                )
              )
            ]
          ),
          t.blockStatement( // alternate
            [
              t.expressionStatement(
                t.callExpression(
                  t.memberExpression(
                    t.identifier('message'),
                    t.identifier('error')
                  ),
                  [
                    t.logicalExpression(
                      "||",
                      t.logicalExpression(
                        "&&",
                        t.identifier('response'),
                        t.memberExpression(
                          t.identifier('response'),
                          t.identifier('errorMessage')
                        )
                      ),
                      t.stringLiteral('请求失败')
                    )
                  ]
                )
              )
            ]
          )
        )
      ]
    )
  )

  const result = unescapeToChinese(generate(ast).code)
  return result
}

function getReducerFunctionDeclaration (name) {
  const updateFuncKey = getUpdateHumpKey(name)

  const ast = t.functionDeclaration(
    t.identifier(updateFuncKey),
    [
      t.identifier('state'),
      t.identifier('action')
    ],
    t.blockStatement([
      t.returnStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('Object'),
            t.identifier('assign')
          ),
          [
            t.objectExpression([]),
            t.identifier('state'),
            t.objectExpression([
              t.objectProperty(
                t.identifier(name),
                t.memberExpression(
                  t.identifier('action'),
                  t.identifier('payload')
                )
              )
            ])
          ]
        )
      )
    ])
  )

  const result = unescapeToChinese(generate(ast).code)
  return result
}

module.exports = {
  dynamicImport (dicArray, namespace) {
    let baseImport = [
      'queryData', 'removeData', 'addData', 'updateData', 'findById'
    ]
    if (dicArray && dicArray.length) {
      baseImport = baseImport.concat(dicArray.map(key => getInjectVariableKey(key)))
    }
    const _importDeclarationArray = []
  
    baseImport.forEach(specifier => {
      _importDeclarationArray.push(t.importSpecifier(t.identifier(specifier), t.identifier(specifier)))
    })
    const newImport = t.importDeclaration(
      _importDeclarationArray,
      t.stringLiteral(`../services/${namespace}`)
    )
    const { code } = generate(newImport)

    return code
  },
  dynamicYieldFunction (dicArray) {
    if (!(dicArray && dicArray.length)) {
      return ''
    }
    const result = []
    dicArray.forEach(name => {
      const functionCode = getYieldFunctionDeclaration(name)
      // 因未找到生成yield function中的*的方法，采用拼接+字符串替换的方式实现
      result.push(`${getInjectVariableKey(name)}:${functionCode.replace(/function.*\(/, "function* (")}`)
    })
    
    return result.join(',\n')
  },
  dynamicReducerFunction (dicArray) {
    if (!(dicArray && dicArray.length)) {
      return ''
    }
    const result = []
    dicArray.forEach(name => {
      const functionCode = getReducerFunctionDeclaration(name)
      result.push(`${getUpdateHumpKey(name)}:${functionCode.replace(/function.*\(/, "function (")}`)
    })

    return result.join(',\n')
  },
}
