import { setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValue(form, value) {
  if (!form || Object.keys(value).length === 0) return

  setFieldValue(form, '[name="title"]', value?.title)
  setFieldValue(form, '[name="author"]', value?.author)
  setFieldValue(form, '[name="description"]', value?.description)
  setFieldValue(form, '[name="imageUrl"]', value?.imageUrl)
  setBackgroundImage(document, '#postHeroImage', value?.imageUrl)
}

function getFieldValue(form) {
  const formValues = {}
  // way one
  // ;[
  //   'title',
  //   'author',
  //   'description',
  //   'imageUrl',
  // ].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (!field) return

  //   formValue[name] = field.value
  // })

  // way two
  const formData = new FormData(form)
  for (const [key, value] of formData) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test('at-least-two-words', 'Please enter author at least two words', (value) => {
        return value.split(' ').filter((x) => !!x && x.length > 3).length >= 2
      }),
    description: yup.string(),
  })
}

function setFieldMessage(form, name, message) {
  if (!form || !name) return

  const element = form.querySelector(`[name=${name}]`)
  if (element) {
    element.setCustomValidity(message)
    setTextContent(element.parentElement, '.invalid-feedback', message)
  }
}

async function validatePostForm(form, formValues) {
  if (!form || !formValues) return

  try {
    // reset error when submit
    ;['title', 'author'].forEach((name) => setFieldMessage(form, name, ''))

    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, {
      abortEarly: false,
    })
  } catch (error) {
    const errorName = {}
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validateError of error.inner) {
        const { path: name, message } = validateError
        if (errorName[name]) continue

        setFieldMessage(form, name, message)
        errorName[name] = true
      }
    }
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function showLoading(form) {
  if (!form) return
  const btnSubmit = form.querySelector('[name="submit"]')
  if (btnSubmit) {
    btnSubmit.disabled = true
    btnSubmit.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  if (!form) return
  const btnSubmit = form.querySelector('[name="submit"]')
  if (btnSubmit) {
    btnSubmit.disabled = false
    btnSubmit.innerHTML = '<i class="fas fa-save mr-1"></i> Save'
  }
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  if (Object.keys(defaultValue).length === 0 || !formId) return

  let submitting = false
  const postForm = document.getElementById(formId)
  if (!postForm) return

  // set form value
  setFormValue(postForm, defaultValue)

  // add events
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (submitting) return

    // show loading
    showLoading(postForm)
    submitting = true

    // get field value
    const formValues = getFieldValue(postForm)

    // validation data
    const isValid = await validatePostForm(postForm, formValues)
    if (!isValid) return

    // if it is right, send data
    await onSubmit?.(formValues)

    // hide loading
    hideLoading(postForm)
    submitting = false
  })
}
