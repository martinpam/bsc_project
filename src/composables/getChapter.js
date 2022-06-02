import { ref } from 'vue'

const getChapter = (moduleName, chapterId) => {

    const chapterData = ref(null)
    const error = ref(null)
    console.log('trying to fetch chapter data', moduleName, chapterId)
    const load = async() => {
        try {
            //remove comment to use for fetching data from db
            /*let data = await fetch('http://localhost:3000/modules?name_en='+ moduleName)
            if(!data.ok || chapterId <= 0) {
              throw Error('no available data')
            }
      
            chapterData.value = await data.json()
            chapterData.value = chapterData.value[0].chapters[chapterId-1]*/

            let dataFile = require('../../data/data.json');

            chapterData.value = dataFile.modules.filter((module) => module.link === moduleName)[0].chapters[chapterId - 1]

        } catch (err) {
            error.value = err.message
        }
    }
    console.log(chapterData)
    return { chapterData, error, load }
}

export default getChapter