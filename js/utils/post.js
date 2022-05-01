import dayjs from 'dayjs'
import { setTextContent, setPathImage } from './'
import { truncate } from './common'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function createPostItem(postItem, templateId) {
  if (!postItem || !templateId) return

  const templateElement = document.getElementById(templateId)
  if (!templateElement) return

  const liElement = templateElement.content.querySelector('li').cloneNode(true)
  if (!liElement) return

  const cardElement = liElement.querySelector('.card')
  if (!cardElement) return

  setPathImage(cardElement, '[data-id="thumbnail"]', postItem.imageUrl)
  setTextContent(cardElement, '[data-id="title"]', postItem.title)
  setTextContent(cardElement, '[data-id="description"]', truncate(postItem.description, 100))
  setTextContent(cardElement, '[data-id="author"]', postItem.author)
  setTextContent(cardElement, '[data-id="timeSpan"]', `- ${dayjs(postItem.updatedAt).fromNow()}`)

  // handle click
  const divElement = liElement.firstElementChild
  if (!divElement) return
  divElement.addEventListener('click', (e) => {
    const menu = liElement.querySelector('[data-id="menu"]')
    if (menu && menu.contains(e.target)) return

    window.location.assign(`/post-detail.html?id=${postItem.id}`)
  })

  // handle click edit
  const btnEdit = liElement.querySelector('[data-id="edit"]')
  console.log(btnEdit)
  if (!btnEdit) return
  btnEdit.addEventListener('click', (e) => {
    window.location.assign(`/add-edit-post.html?id=${postItem.id}`)
  })

  return liElement
}

function handlePostClick(id) {
  if (!id) return
}

export function renderPostList(ulId, postList) {
  if (!Array.isArray(postList)) return
  if (!ulId) return

  const ulPostList = document.getElementById(ulId)
  if (!ulPostList) return

  // reset ul post list
  ulPostList.textContent = ''

  for (const postItem of postList) {
    const liElement = createPostItem(postItem, 'postItemTemplate')
    ulPostList.appendChild(liElement)
  }
}
