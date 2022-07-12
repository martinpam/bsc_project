import {
    ref
} from 'vue'

const getShelfData = (size) => {

    const shelfData = ref(null)
    const error = ref(null)
    const load = async() => {
        try {

            let dataFile = require('../../data/data.json');

            shelfData.value = dataFile.modules.filter((module) => module.link === 'supermarket')[0].supermarketLayouts.filter((s) => s.name === size)[0].shelfs;

        } catch (err) {
            error.value = err.message
        }
    }

    return {
        shelfData,
        error,
        load
    }
}

export default getShelfData