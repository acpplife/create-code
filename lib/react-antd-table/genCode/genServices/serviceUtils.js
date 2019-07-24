const t = require('@babel/types')
const generate = require('@babel/generator').default
const genUtils = require('../genUtils')

const {
  getInjectVariableKey,
  unescapeToChinese,
} = genUtils

function getAsyncFunctionDeclaration(item) {
  const { key, url } = item;
  const variableKey = getInjectVariableKey(key)

  const ast = t.exportNamedDeclaration(
    t.functionDeclaration(
      t.identifier(variableKey),
      [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.identifier('request'),
            [
              t.objectExpression([
                t.objectProperty(
                  t.identifier('url'),
                  t.stringLiteral(url)
                ),
                t.objectProperty(
                  t.identifier('method'),
                  t.stringLiteral('get')
                ),
                t.objectProperty(
                  t.identifier('baseUrlType'),
                  t.stringLiteral('authCenter')
                )
              ])
            ]
          )
        )
      ])
    ),
    []
  )

  return unescapeToChinese(generate(ast).code)
}

module.exports = {
  dynamicAsyncFunction (dicArray) {
    if (!(dicArray && dicArray.length)) {
      return ''
    }
    const result = []
    dicArray.forEach(item => {
      const { key, url } = item;
      if (!key) throw new Error('字典项key值不能为空!')
      if (!url) throw new Error('字典项url值不能为空!')

      const functionCode = getAsyncFunctionDeclaration(item)
      result.push(`${functionCode.replace(/export.*function/, "export async function")}`)
    })

    return result.join('\n\n')
  },
}
