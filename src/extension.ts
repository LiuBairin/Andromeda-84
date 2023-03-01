import * as vscode from 'vscode'
const fs = require('fs')
import { convertHexadecimal, basePath } from './utils'
import defaultTokenColors from './data/default_token_colors'
// 将js写入neondreams
function writeJsInTemplate(brightness: string, tokenColors: any) {
  return new Promise((resovle, reject) => {
    const templateFile = `${basePath}neondreams.js`
    // 读取插件文件
    const chromeStyles = fs.readFileSync(
      __dirname + '/editor_chrome.css',
      'utf-8'
    )
    const jsTemplate = fs.readFileSync(
      __dirname + '/theme_template.js',
      'utf-8'
    )

    // js文件进行替换
    const finalTheme = jsTemplate
      .replace(/\[TOKEN_COLORS\]/g, JSON.stringify(tokenColors))
      .replace(/\[NEON_BRIGHTNESS\]/g, brightness)
      .replace(/\[CHROME_STYLES\]/g, chromeStyles)

    // neondreamsjs 写入最终样式js
    fs.writeFileSync(templateFile, finalTheme, 'utf-8')
    resovle(undefined)
  })
}

// html中写入script
function writeScriptInHtml(htmlFile: string, html: string) {
  return new Promise(resolve => {
    let output = html.replace(
      /^.*(<!-- Andromeda84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/gm,
      ''
    )
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
    let output = html.replace(
      /^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/gm,
      ''
    )
    fs.writeFileSync(htmlFile, output, 'utf-8')

    resolve(undefined)
  })
}

// 获取html的相关信息
function getHtmlInfo() {
  const htmlFile = `${basePath}workbench.html`
  const html = fs.readFileSync(htmlFile, 'utf-8')
  const isEnabled = html.includes('neondreams.js')
  return { isEnabled, htmlFile, html }
}

export function activate(context: vscode.ExtensionContext) {
  let { brightness, tokenColors } =
    vscode.workspace.getConfiguration('Andromeda84')

  // 配置项
  brightness = convertHexadecimal(brightness)

  // 颜色
  tokenColors = tokenColors.length
    ? { ...defaultTokenColors, ...tokenColors }
    : defaultTokenColors

  console.log(tokenColors)

  let enableNeon = vscode.commands.registerCommand(
    'Andromeda84.enableNeon',
    async () => {
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
            '开启霓虹灯。必须重新加载vscode才能使此更改生效。代码可能会显示已损坏的警告，这是正常的。您可以通过在通知上选择“不再显示此消息”来取消此消息。',
            { title: '请重启vscode' }
          )
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      } else {
        vscode.window
          .showInformationMessage('霓虹灯已经启用。重新加载以刷新JS设置。', {
            title: '请重启vscode',
          })
          .then(function (msg) {
            vscode.commands.executeCommand('workbench.action.reloadWindow')
          })
      }
    }
  )

  let disableNeon = vscode.commands.registerCommand(
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
        vscode.window.showInformationMessage('霓虹灯正在运行')
      }
    }
  )

  context.subscriptions.push(enableNeon)
  context.subscriptions.push(disableNeon)
}

export function deactivate() {}
