;(function () {
  //====================================
  // Theme Base CSS ()
  //====================================

  const BASE_TOKEN_COLORS = `
  .mtk1 { color: #d5ced9; }
  .mtk2 { color: #23262e; }
  .mtk3 { color: #5f6167; }
  .mtk4 { color: #00e8c6; }
  .mtk5 { color: #f39c12; }
  .mtk6 { color: #ffe66d; }
  .mtk7 { color: #c6c0ff; }
  .mtk8 { color: #ff00aa; }
  .mtk9 { color: #f92672; }
  .mtk10 { color: #c74ded; }
  .mtk11 { color: #7cb7ff; }
  .mtk12 { color: #ee5d43; }
  .mtk13 { color: #96e072; }
  .mtk14 { color: #6796e6; }
  .mtk15 { color: #cd9731; }
  .mtk16 { color: #f44747; }
  .mtk17 { color: #b267e6; }
  .mtki { font-style: italic; }
  .mtkb { font-weight: bold; }
  .mtku { text-decoration: underline; text-underline-position: under; }
  .mtks { text-decoration: line-through; }
  .mtks.mtku { text-decoration: underline line-through; text-underline-position: under; }
  .monaco-editor .bracket-highlighting-0 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-1 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-2 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-3 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-4 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-5 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-6 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-7 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-8 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-9 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-10 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-11 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-12 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-13 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-14 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-15 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-16 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-17 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-18 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-19 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-20 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-21 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-22 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-23 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-24 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-25 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-26 { color: #179fff !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-27 { color: #ffd700 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-28 { color: #da70d6 !important;text-shadow:none; }
  .monaco-editor .bracket-highlighting-29 { color: #179fff !important;text-shadow:none; }
  `
  //====================================
  // Theme replacement CSS (Glow styles)
  //====================================
  const tokenReplacements = [TOKEN_COLORS]

  /**
   * @summary Search and replace colours within a CSS definition
   * @param {string} styles the text content of the style tag
   * @param {object} replacements key/value pairs of colour hex and the glow styles to replace them with
   * @returns
   */
  const replaceTokens = (styles, replacements) =>
    Object.keys(replacements).reduce((acc, color) => {
      const re = new RegExp(`color: #${color};`, 'gi')
      return acc.replace(re, replacements[color])
    }, styles)

  /**
   * @summary Attempts to bootstrap the theme
   * @param {boolean} disableGlow
   */
  const initNeonDreams = disableGlow => {
    if (disableGlow) return

    let updatedThemeStyles = replaceTokens(BASE_TOKEN_COLORS, tokenReplacements)

    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`
    const newStyleTag = document.createElement('style')
    newStyleTag.textContent = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '')
    document.body.appendChild(newStyleTag)
  }

  //=============================
  // Start bootstrapping!
  //=============================

  initNeonDreams([DISABLE_GLOW])

  // 动态css匹配规则
  const dynamicStyleRegExp = /^dyn-rule-(\d+)-(\d+)$/

  // 这里是针对行内提示样式做出修改

  let timer = setInterval(() => {
    const nodeList = document.querySelectorAll(
      '[class*="dyn-rule-"]:not(.colorpicker-color-decoration)'
    )

    if (!nodeList.length) return
    const firstNodeClassName = nodeList[0].className
    const secondNodeClassName = nodeList[1].className

    if (nodeList.length && firstNodeClassName !== secondNodeClassName) {
      let index = 0
      let className = secondNodeClassName.split(' ')[1]
      let key = className.replace(dynamicStyleRegExp, '$1')

      const dynRules = [
        `[class*="dyn-rule-${key}"] {
        background-color: var(--vscode-editorInlayHint-parameterBackground) !important;
        color: var(--vscode-editorInlayHint-parameterForeground) !important;
        text-shadow:none;
       }`,
      ]

      while (index++ < 10) {
        dynRules.push(
          `.${className} {background-color: transparent !important;}`
        )
        className = className.replace(
          dynamicStyleRegExp,
          (_, __, $2) => `dyn-rule-${key}-${+$2 + 2}`
        )
      }

      const newStyleTag = document.createElement('style')
      newStyleTag.textContent = dynRules.join(' ')
      document.body.appendChild(newStyleTag)
      clearInterval(timer)
    }
  }, 1000)
})()
