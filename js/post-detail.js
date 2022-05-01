import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import postApi from './api/postApi'
import { setTextContent } from './utils'
import { getPostDetailElement, getPostHeroImageElement } from './utils/selectors'

dayjs.extend(LocalizedFormat)

function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId))
  modal.show()
}

function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  if (!modalId || !imgSelector || !prevSelector || !nextSelector) return

  // query selector
  const modal = document.getElementById(modalId)
  if (!modal) return

  const imgModal = modal.querySelector(imgSelector)
  const prevBtn = modal.querySelector(prevSelector)
  const nextBtn = modal.querySelector(nextSelector)
  if (!imgModal || !prevBtn || !nextBtn) return

  // event delegation
  let imgList = []
  let currentIndex = -1

  function showImgLightbox(index) {
    imgModal.src = imgList[index].src
  }

  document.addEventListener('click', (e) => {
    const { target } = e
    // console.log(target)
    if (target.tagName !== 'IMG' || !target.dataset.album) return
    // query list img
    imgList = document.querySelectorAll('img[data-album="postImage"]')

    // find index when click
    currentIndex = [...imgList].findIndex((img) => img === target)

    // show image lightbox
    showImgLightbox(currentIndex)

    // show modal
    showModal(modalId)
  })

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImgLightbox(currentIndex)
  })

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImgLightbox(currentIndex)
  })
}

function renderPostDetail(post) {
  if (Object.keys(post).length === 0) return

  const postHeroImage = getPostHeroImageElement()
  if (!postHeroImage) return

  // set bgimg for section post hero image
  postHeroImage.style.backgroundImage = `url(${post.imageUrl})`
  postHeroImage.addEventListener('error', () => {
    console.log('error')
    postHeroImage.style.backgroundImage = 'url(https://picsum.photos/id/1/5616/3744)'
  })

  // set for section post detail
  const postDetail = getPostDetailElement()
  if (!postDetail) return

  setTextContent(postDetail, '.post-detail-title', post.title)
  setTextContent(postDetail, '.post-detail-author', post.author)
  setTextContent(
    postDetail,
    '.post-detail-time-span',
    dayjs(post.updatedAt).format('- hh:mm DD/MM/YYYY')
  )
  setTextContent(postDetail, '.post-detail-description', post.description)

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (!editPageLink) return
  editPageLink.href = `/add-edit-post.html?id=${post.id}`
  editPageLink.innerHTML = '<i class="fas fa-edit"></i><span>Edit post</span>'
}

;(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: '[data-image="lightboxImage"]',
    prevSelector: '[data-btn="lightboxPrev"]',
    nextSelector: '[data-btn="lightboxNext"]',
  })

  try {
    const url = new URL(window.location)
    const id = url.searchParams.get('id')

    // fetch data by id
    const post = await postApi.get(id)
    renderPostDetail(post)
  } catch (error) {
    console.log('Fetch to failed error, post-detail', error)
  }
})()
