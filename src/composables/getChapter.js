import { ref } from 'vue'

const getChapters = (moduleName, chapterId) => {

  const chapter = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/modules/' + moduleName + '/' + chapterId)
      if(!data.ok) {
        throw Error('no available data')
      }
      chapter.value = await data.json()
    }
    catch(err) {
      error.value = err.message
    }
  }

  return { chapter, error, load }
}

export default getChapter