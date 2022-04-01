import { ref } from 'vue'

const getModule = (moduleName) => {

  const mdl = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/modules?name_en=' + moduleName )
      if(!data.ok) {
        throw Error('no available data')
      }
      mdl.value = await data.json()
    }
    catch(err) {
      error.value = err.message
    }
  }
  console.log(mdl)
  return { mdl, error, load }
}

export default getModule