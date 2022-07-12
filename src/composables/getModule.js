import {
    ref
} from 'vue'

const getModule = (moduleName) => {

    const mdl = ref(null)
    const error = ref(null)

    const load = async() => {
        try {
            //remove comment to use for fetching data from db
            /*
            let data = await fetch('http://localhost:3000/modules?name_en=' + moduleName )
            if(!data.ok) {
              throw Error('no available data')
            }
            mdl.value = await data.json()
            */
            let dataFile = require('../../data/data.json');

            mdl.value = dataFile.modules.filter((module) => module.link === moduleName)
        } catch (err) {
            error.value = err.message
        }
    }

    return {
        mdl,
        error,
        load
    }
}

export default getModule