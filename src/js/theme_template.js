;(function () {
  //====================================
  // Theme replacement CSS (Glow styles)
  //====================================
  const tokenReplacements = [TOKEN_COLORS]

  //=============================
  // Helper functions
  //=============================

  /**
   * @summary 防抖函数
   * @param {Function} fn
   * @param {Number} delay
   * @returns
   */
  function debounce(fn, delay = 250) {
    let timer
    return function (...args) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }

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
   * @summary Checks if a theme is applied, and that the theme belongs to the Synthwave 84 family
   * @returns {boolean}
   */
  const usingSynthwave = () => {
    const appliedTheme = document.querySelector('[class*="theme-json"]')
    const synthWaveTheme = document.querySelector(
      '[class*="liubailin-andromeda84-vscode-themes"]'
    )
    return appliedTheme && synthWaveTheme
  }

  /**
   * @summary Attempts to bootstrap the theme
   * @param {boolean} disableGlow
   * @param {MutationObserver} obs
   */
  const initNeonDreams = obs => {
    const tokensEl = document.querySelector('.vscode-tokens-styles')

    const initialThemeStyles = tokensEl.innerText

    // Replace tokens with glow styles
    let updatedThemeStyles = replaceTokens(
      initialThemeStyles,
      tokenReplacements
    )

    /* append the remaining styles */
    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`
    const newStyleTag = document.createElement('style')
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '')
    document.body.appendChild(newStyleTag)
    if (obs) {
      obs.disconnect()
      obs = null
    }
    // disconnect the observer because we don't need it anymore
  }

  //=============================
  // Start bootstrapping!
  //=============================

  const targetNode = document.querySelector('body')

  const obConfig = { childList: true }

  const observer = new MutationObserver(debounce(obCallback, 2000))

  function obCallback() {
    // 节流配合观察者实现霓虹灯
    initNeonDreams(observer)
  }

  observer.observe(targetNode, obConfig)

  // Use a mutation observer to check when we can bootstrap the theme
})()
