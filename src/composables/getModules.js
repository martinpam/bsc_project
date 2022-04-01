import { ref } from 'vue'

const getModules = () => {

  const modules = ref([])
  const error = ref(null)

  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/modules')
      if(!data.ok) {
        throw Error('no available data')
      }
      modules.value = await data.json()
    }
    catch(err) {
      error.value = err.message
    }
  }

  return { modules, error, load }
}

export default getModules