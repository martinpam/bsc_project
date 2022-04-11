<template>
    <div>
        
        <div v-if="mdl">
            <div class="header">
               <img @click="$router.go(-1)" src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/> 
                <div class="header-text">
                    <h1>{{mdl[0].name_de}}</h1>
                </div>
                </div>
            
            <h2> Kapitelauswahl </h2>
                <div  class="button-group"
                :class="{'less-than-three': mdl[0].chapters.length < 3}"
                >
                    <ModuleButton :name="'Story Mode'" :goTo="'/'+moduleName+'/chapters/1'"/>
                    <ModuleButton :name="'Algorithmen'" :goTo="'/'+moduleName+'/algorithms/'"/>
                    <ModuleButton :name="'Labor'" :goTo="'/'+moduleName+'/laboratory/'"/>
                </div>
                <div class="filler"></div>
        </div>
        <div v-else> <h1>Loading...</h1></div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { computed } from '@vue/runtime-core'
import ModuleButton from '../components/ModuleButton.vue'
import getModule from '../composables/getModule.js'

export default {
    props: ['moduleName'],
    components: { ModuleButton },
    setup(props) {
        const moduleName = props.moduleName
        const { mdl, error, load } = getModule(moduleName)
        load()

        const append = computed((text,index) => {
            return text +''+ index
        })
        return {mdl, error, append }
    }
}
</script>

<style scoped>
    .filler {
        height: 200px;
    }
    .linebreak {
        width: 100%;
    }

    .header {
        display: flex;
    }

    .smaller {
        height: 40px;
        position: absolute;
        top: 45px;
        left: 50px;
    }

    .header-text {
       position: relative ;
       margin: 0 auto;
    }
</style>

