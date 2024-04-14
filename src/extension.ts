import * as vscode from 'vscode'
const fs = require('fs')
import { convertHexadecimal, basePath, compressionCss } from './utils'
import defaultTokenColors from './config/default_token_colors'

export const scriptRegExp =
  /^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js".*?><\/script><!-- NEON DREAMS -->).*\n?/gm

function replaceTokens(styles: string, replacements: Record<string, string>) {
  return Object.keys(replacements).reduce((acc, color) => {
    const re = new RegExp(`color: #${color};`, 'gi')
    return acc.replace(re, replacements[color])
  }, styles)
}

// 将js写入neondreams
function writeJsInTemplate(
  brightness: string,
  tokenColors: Record<string, string>
) {
  return new Promise(resovle => {
    const templateFile = basePath + 'neondreams.js'
    // 读取文件
    const workspaceStyles: string = fs.readFileSync(
      __dirname + '/workspace-style.css',
      'utf-8'
    )

    const vscodeTokensStyles: string = fs.readFileSync(
      __dirname + '/vscode-tokens-styles.css',
      'utf-8'
    )

    const core: string = fs.readFileSync(__dirname + '/core.js', 'utf-8')

    const replaceTheme = replaceTokens(vscodeTokensStyles, tokenColors).replace(
      /\[NEON_BRIGHTNESS\]/g,
      brightness
    )
    const finalTheme = compressionCss(`${replaceTheme}${workspaceStyles}`)
    // js文件进行替换
    const corejs = core.replace(/\[FINAL_STYLES\]/g, finalTheme)

    // neondreamsjs 写入最终样式js
    fs.writeFileSync(templateFile, corejs, 'utf-8')
    resovle(undefined)
  })
}

// html中写入script
function writeScriptInHtml(htmlFile: string, html: string) {
  return new Promise(resolve => {
    let output = html.replace(scriptRegExp, '')
    output = html.replace(
      /\<\/html\>/g,
      `	<!-- SYNTHWAVE 84 --><script src="neondreams.js"></script><!-- NEON DREAMS -->\n`
    )
    output += '</html>'

    fs.writeFileSync(htmlFile, output, 'utf-8')
    resolve(undefined)
  })
}

// 从html中删除script
function deleteScriptInHtml(htmlFile: string, html: string) {
  return new Promise(resolve => {
    let output = html.replace(scriptRegExp, '')
    fs.writeFileSync(htmlFile, output, 'utf-8')

    resolve(undefined)
  })
}

// 获取html的相关信息
function getHtmlInfo() {
  const htmlFile = basePath + 'workbench.html'
  const html = fs.readFileSync(htmlFile, 'utf-8')
  const isEnabled = html.includes('neondreams.js')
  return { isEnabled, htmlFile, html }
}

// 获取配置
function getCinfiguration() {
  let { brightness, tokenColors } =
    vscode.workspace.getConfiguration('Andromeda84')

  // 配置项
  brightness = convertHexadecimal(brightness)

  // 颜色
  tokenColors = Object.keys(tokenColors).length
    ? { ...defaultTokenColors, ...tokenColors }
    : defaultTokenColors

  return {
    brightness,
    tokenColors,
  }
}

export function activate(context: vscode.ExtensionContext) {
  const enableNeon = vscode.commands.registerCommand(
    'Andromeda84.enableNeon',
    async () => {
      const { brightness, tokenColors } = getCinfiguration()

      await writeJsInTemplate(brightness, tokenColors)

      const { isEnabled, htmlFile, html } = getHtmlInfo()

      if (!isEnabled) {
        try {
          await writeScriptInHtml(htmlFile, html)
        } catch (error: any) {
          if (/ENOENT|EACCES|EPERM/.test(error.code)) {
            vscode.window.showInformationMessage(
              '你必须以管理员权限运行vscode才能启用'
            )
            return
          }
        }
        vscode.window
          .showInformationMessage(
            '霓虹灯已开启。必须重新加载vscode才能使此更改生效。代码可能会显示已损坏的警告，这是正常的。您可以通过在通知上选择“不再显示此消息”来取消此消息。',
            { title: '请重启vscode' }
          )
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      } else {
        vscode.window
          .showInformationMessage('霓虹灯已经启用。重新加载以刷新设置。', {
            title: '请重启vscode',
          })
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      }
    }
  )

  const disableNeon = vscode.commands.registerCommand(
    'Andromeda84.disableNeon',
    async () => {
      const { isEnabled, htmlFile, html } = getHtmlInfo()

      if (isEnabled) {
        await deleteScriptInHtml(htmlFile, html)
        vscode.window
          .showInformationMessage(
            '霓虹灯已禁用。必须重新加载vscode才能使此更改生效',
            { title: '请重启vscode' }
          )
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      } else {
        vscode.window
          .showInformationMessage('霓虹灯已经禁用', { title: '请重启vscode' })
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      }
    }
  )

  context.subscriptions.push(enableNeon, disableNeon)
}

export function deactivate() {}
