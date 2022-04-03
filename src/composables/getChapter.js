import { ref } from 'vue'

const getChapter = (moduleName, chapterId) => {

  const chapterData = ref(null)
  const error = ref(null)
  console.log('trying to fetch chapter data', moduleName, chapterId)
  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/modules?name_en='+ moduleName)
      if(!data.ok) {
        throw Error('no available data')
      }
      chapterData.value = await data.json()
      chapterData.value = chapterData.value[0].chapters[chapterId].conversation

    }
    catch(err) {
      error.value = err.message
    }
  }
  return { chapterData, error, load }
}

export default getChapter