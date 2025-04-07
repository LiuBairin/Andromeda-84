const vscode = require('vscode')
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

export const getFilePath = function () {

  const appDir = path.dirname(vscode.env.appRoot)

  const base = path.join(appDir, 'app', 'out', 'vs', 'code')

  const electronBase = isVSCodeBelowVersion()
    ? 'electron-browser'
    : 'electron-sandbox'

  const workBenchFilename =
    vscode.version == '1.94.0' ? 'workbench.esm.html' : 'workbench.html'

  const htmlFile = path.join(base, electronBase, 'workbench', workBenchFilename)

  const templateFile = path.join(
    base,
    electronBase,
    'workbench',
    'neondreams.js'
  )

  return {
    htmlFile,
    templateFile,
  }
}

export const compressionCss = (css: string) => {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\/\*.*?\*\//g, '')
    .trim()
}
