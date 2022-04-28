import postApi from './api/postApi'
import { initPagination, initSearchPost, renderPagination, renderPostList } from './utils'

// handle filter change
async function handleFilterChange(filterName, filterValue) {
  if (!filterName) return

  try {
    const url = new URL(window.location)
    if (filterName === 'title_like') {
      url.searchParams.set('_page', 1)
    }

    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    // render post when page change
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination(pagination)
  } catch (error) {
    console.log('Fetch to failed error', error)
  }
}

;(async () => {
  try {
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)
    history.pushState({}, '', url)

    const queryParams = url.searchParams

    initPagination({
      elementId: 'postsPagination',
      defaultParameter: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearchPost({
      elementId: 'input-search',
      defaultParameter: queryParams,
      onChange: (value) => handleFilterChange('title_like', value.trim()),
    })

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPagination(pagination)
    renderPostList('postList', data)
  } catch (error) {
    console.log('Fetch to failed', error)
  }
})()
