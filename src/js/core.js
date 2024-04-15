;(function () {
  const initNeonDreams = () => {
    const styleTag = document.querySelector('.andromeda-84')
    styleTag && styleTag.remove()
    const newStyleTag = document.createElement('style')
    newStyleTag.classList.add('andromeda-84')
    newStyleTag.textContent = `[FINAL_STYLES]`
    document.body.appendChild(newStyleTag)
  }

  //=============================
  // Start bootstrapping!
  //=============================

  initNeonDreams()
})()
