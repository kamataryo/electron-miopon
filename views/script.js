const { shell } = require('electron')

const links = document.querySelectorAll('.external-link')

for (const element of links) {
  element.addEventListener('click', () =>
    shell.openExternal(element.dataset.href),
  )
}
