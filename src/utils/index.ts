const vscode = require('vscode')
const moudle = require('module')
const path = require('path')

/**
 * @summary 比较版本
 * @param version
 * @returns
 */
export function isVSCodeBelowVersion(version: string = '1.70.0') {
  const vscodeVersion = vscode.version
  const vscodeVersionArray = vscodeVersion.split('.')
  const versionArray = version.split('.')

  for (let i = 0; i < versionArray.length; i++) {
    if (vscodeVersionArray[i] < versionArray[i]) {
      return true
    }
  }

  return false
}

export const basePath = (function () {
  const isWin = /^win/.test(process.platform)

  // 解决webpack打包require的问题
  const { createRequire } = moudle

  const require = createRequire('/')

  const filename = require.main?.filename || process.mainModule?.filename

  const base = path.dirname(filename) + (isWin ? '\\vs\\code' : '/vs/code')
  const electronBase = isVSCodeBelowVersion()
    ? 'electron-browser'
    : 'electron-sandbox'
  return (
    base +
    (isWin
      ? '\\' + electronBase + '\\workbench\\'
      : '/' + electronBase + '/workbench/')
  )
})()

export const compressionCss = (css: string) => {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\/\*.*?\*\//g, '')
    .trim()
}
