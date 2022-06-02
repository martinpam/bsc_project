import { ref } from 'vue'

const getChapters = (moduleName) => {

    const chapters = ref([])
    const error = ref(null)

    const load = async() => {
        try {
            //remove comment to use for fetching data from db
            /*
            let data = await fetch('http://localhost:3000/modules?name_en='+ moduleName)
            if(!data.ok) {
              throw Error('no available data')
            }
            chapters.value = await data.json()
            chapters.value = chapters.value[0].chapters
            */
            let dataFile = require('../../data/data.json');

            chapterData.value = dataFile.modules.filter((module) => module.link === moduleName)[0].chapters

        } catch (err) {
            error.value = err.message
        }
    }

    return { chapters, error, load }
}

export default getChapters