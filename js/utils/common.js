export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return
  element.textContent = text
}

export function setPathImage(parent, selector, path) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return

  element.src = path
  element.addEventListener('error', () => {
    element.src = 'https://picsum.photos/id/1/5616/3744'
  })
}

export function setFieldValue(parent, selector, value) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return
  element.value = value
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (!element) return
  element.style.backgroundImage = `url("${imageUrl}")`
}

export function createTime(milliSeconds) {
  if (!milliSeconds) return

  const currentDate = new Date(milliSeconds)
  // get date (dd/MM/yyyy)
  const day = `0${currentDate.getDate() + 1}`.slice(-2)
  const month = `0${currentDate.getMonth() + 1}`.slice(-2)
  const year = currentDate.getFullYear()
  const date = `${day}/${month}/${year}`

  // get time (hh:mm)
  const hours = `0${currentDate.getHours()}`.slice(-2)
  const minutes = `0${currentDate.getMinutes()}`.slice(-2)
  const time = `${hours}:${minutes}`

  return `- ${time} ${date}`
}

export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength)}…`
}
