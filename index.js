onDocumentReady(() => {

  Array.from(document.querySelectorAll('td > a[href^=\'https://www.ici-japon.com/cours_japonais/kanji/\']'))
    .forEach(link => {

      const baseList = link.closest('table')

      const hasDisplayLinksArea =
           baseList.nextSibling
        && baseList.nextSibling.classList
        && baseList.nextSibling.classList.contains('kanji-list-toggler')

      const displayLinksArea = hasDisplayLinksArea
        ? baseList.nextSibling
        : makeElement('p', {class: 'kanji-list-toggler'}, element =>
            baseList.parentNode.insertBefore(element, baseList.nextSibling))

      if (!hasDisplayLinksArea) {

        const displayLink = makeElement('a', {href: '#'})
        displayLink.textContent = 'afficher les fiches complètes'
        displayLink.addEventListener('click', event => {
          event.preventDefault()
          unsoftHide(injectedList)
          softHide(displayLink)
          unsoftHide(hideLink)
        })

        const hideLink = makeElement('a', {href: '#'}, softHide)
        hideLink.textContent = 'masquer les fiches complètes'
        hideLink.addEventListener('click', event => {
          event.preventDefault()
          softHide(injectedList)
          softHide(hideLink)
          unsoftHide(displayLink)
        })

        displayLinksArea.appendChild(displayLink)
        displayLinksArea.appendChild(hideLink)
      }

      const injectedList =
           displayLinksArea.nextSibling
        && displayLinksArea.nextSibling.classList
        && displayLinksArea.nextSibling.classList.contains('kanji-list')
           ? displayLinksArea.nextSibling
           : makeElement('ul', {class: 'kanji-list'}, element =>
               displayLinksArea.parentNode.insertBefore(element, displayLinksArea.nextSibling))

      softHide(injectedList)

      if (!injectedList.lastChild) injectedList.appendChild(makeElement('br', {class: 'clear-fix'}))
      const clearFix = injectedList.lastChild

      const kanjiItem = document.createElement('li')
      softHide(kanjiItem)

      const kanjiBox = makeElement('object', {data: link.href})
      kanjiBox.addEventListener('load', () => {
        let isAwaitingResize = false
        const resizeBox = () => {
          !isAwaitingResize && window.requestAnimationFrame(() => {
            isAwaitingResize = false
            kanjiBox.height = kanjiBox.contentDocument.body.children[0].children[0].offsetHeight
          })
        }

        window.addEventListener('resize', resizeBox)
        resizeBox()
        unsoftHide(kanjiItem)
      })

      kanjiItem.appendChild(kanjiBox)
      injectedList.insertBefore(kanjiItem, clearFix)
    })
})

function makeElement(type, attributes = {}, configure = () => {}) {
  const element = document.createElement(type)
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
  configure(element)
  return element
}

function softHide(element) {
  element.style.opacity = 0
  element.style.position = 'absolute'
  element.style.pointerEvents = 'none'
}

function unsoftHide(element) {
  element.style.opacity = 100
  element.style.position = 'initial'
  element.style.pointerEvents = 'auto'
}

function onDocumentReady(callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(callback, 1)
  else document.addEventListener('DOMContentLoaded', callback)
}
