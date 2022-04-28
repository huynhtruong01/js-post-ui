import postApi from './api/postApi'

async function getData() {
  try {
    const params = { _page: 3, _limit: 10 }
    const { data } = await postApi.getAll(params)

    console.log(data)
  } catch (err) {
    console.log('main', err)
  }
}

getData()
