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
  .mtks.mtku { text-decoration: underline line-through; text-underline-position: under; }`
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
   * @param {MutationObserver} obs
   */
  const initNeonDreams = disableGlow => {
    if (disableGlow) return

    let updatedThemeStyles = replaceTokens(BASE_TOKEN_COLORS, tokenReplacements)

    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`
    const newStyleTag = document.createElement('style')
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '')
    document.body.appendChild(newStyleTag)
  }

  //=============================
  // Start bootstrapping!
  //=============================

  initNeonDreams([DISABLE_GLOW])
})()
