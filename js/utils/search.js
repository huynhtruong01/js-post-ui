import debounce from 'lodash.debounce'

export function initSearchPost({ elementId, defaultParameter, onChange }) {
  const inputSearchElement = document.getElementById(elementId)
  if (!inputSearchElement) return

  // set value default for input search
  if (defaultParameter.get('title_like')) {
    inputSearchElement.value = defaultParameter.get('title_like')
  }

  const debounceFunc = debounce((e) => onChange?.(e.target.value), 500)

  inputSearchElement.addEventListener('input', debounceFunc)
}
