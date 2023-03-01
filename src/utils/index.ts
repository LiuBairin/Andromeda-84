const vscode = require('vscode')

/**
 * @summary 小数转换16进制
 * @param float
 * @returns
 */
export function convertHexadecimal(float: number) {
  let num = float >= 1 ? 1 : float

  num = num <= 0 ? 0 : num

  return Math.floor(num * 255)
    .toString(16)
    .toUpperCase()
}

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

  const base =
    process.cwd() +
    (isWin ? '\\resources\\app\\out\\vs\\code' : '/resources/app/out/vs/code')
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
