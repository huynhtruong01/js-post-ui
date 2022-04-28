export function initPagination({ elementId, defaultParameter, onChange }) {
  const ulPaginationElement = document.getElementById(elementId)
  if (!ulPaginationElement) return

  // set pagination for each page

  // btn prev
  const prevBtnElement = ulPaginationElement.firstElementChild?.firstElementChild
  if (prevBtnElement) {
    prevBtnElement.addEventListener('click', (e) => {
      e.preventDefault()

      const currentPage = Number.parseInt(ulPaginationElement.dataset.page) || 1
      if (currentPage >= 2) onChange?.(currentPage - 1)
    })
  }

  const nextBtnElement = ulPaginationElement.lastElementChild?.firstElementChild
  if (nextBtnElement) {
    nextBtnElement.addEventListener('click', (e) => {
      e.preventDefault()

      const currentPage = Number.parseInt(ulPaginationElement.dataset.page) || 1
      const numberPages = Number.parseInt(ulPaginationElement.dataset.totalPage)

      if (currentPage < numberPages) onChange?.(currentPage + 1)
    })
  }
}

export function renderPagination(pagination) {
  const paginationElement = document.getElementById('postsPagination')
  if (!pagination || !paginationElement) return

  const { _page, _limit, _totalRows } = pagination

  // calc total page
  const totalPage = Math.ceil(_totalRows / _limit)

  // set dataset page, totalPage for ul pagination
  paginationElement.dataset.page = _page
  paginationElement.dataset.totalPage = totalPage

  // disabled previous, next
  if (_page <= 1) {
    paginationElement.firstElementChild.classList.add('disabled')
  } else {
    paginationElement.firstElementChild.classList.remove('disabled')
  }

  if (_page >= totalPage) {
    paginationElement.lastElementChild.classList.add('disabled')
  } else {
    paginationElement.lastElementChild.classList.remove('disabled')
  }
}
