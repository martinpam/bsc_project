import { ref } from 'vue'

const getModules = () => {

  const modules = ref([])
  const error = ref(null)

  const load = async () => {
    
    try {
      //remove comment to use for fetching data from db
      /*
      let data = await fetch('http://localhost:3000/modules')
      if(!data.ok) {
        throw Error('no available data')
      }
      modules.value = await data.json()
      */
      let dataFile = require('../../data/data.json');
      
      modules.value = dataFile.modules
    }
    catch(err) {
      error.value = err.message
    }
  }

  return { modules, error, load }
}

export default getModules