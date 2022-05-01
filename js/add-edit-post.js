import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handleSubmit(formValues) {
  try {
    // check mode add or update
    // call api
    const saveValues = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show toast message
    toast.success('Save values success!🎉🎉🎉')

    // redirect detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${saveValues.id}`)
    }, 3000)
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const url = new URLSearchParams(window.location.search)

    const postId = url.get('id')

    // check edit or add post
    const defaultValue = Boolean(postId)
      ? await postApi.get(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        }

    // handle submit

    initPostForm({
      formId: 'postForm',
      defaultValue,
      async onSubmit(values) {
        if (Object.keys(values).length === 0) return
        values.id = postId
        await handleSubmit(values)
      },
    })
  } catch (error) {
    console.log('Fetch to failed api, add-edit', error)
    toast.error(`Error: ${error.message}`)
  }
})()
