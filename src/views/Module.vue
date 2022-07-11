<template>
    <div>
        
        <div v-if="mdl">
            <div class="header">
 <router-link  class="" to="/"> 
        <img src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/>
      </router-link>                <div class="header-text">
                    <h1>{{t(mdl[0].name)}}</h1>
                </div>
                </div>
            
            <h2> {{t('SECTION_CHOOSE')}} </h2>
                <div  class="button-group module" >
                    <ModuleButton 
                        :name="t('SECTION_STORY')" 
                        :goTo="'/'+moduleName+'/chapters/'"
                        :subText="t('STORY_SUBTEXT')" 
                    >
                    <img class="module-icon" src="../assets/icons/dialog.png" alt="" srcset=""> 
                    </ModuleButton>
              
                        
                    <ModuleButton 
                        :name="t('SECTION_CHALLENGES')" 
                        :goTo="'/'+moduleName+'/challenges/'"
                        :subText="t('CHALLENGES_SUBTEXT')" 
                    >
                     <img class="module-icon" src="../assets/icons/challenge.png" alt="" srcset=""> 
                    </ModuleButton>
                    
                    <ModuleButton 
                        :name="t('SECTION_LABORATORY')" 
                        :goTo="'/'+moduleName+'/laboratory/'"
                        :subText="t('LAB_SUBTEXT')" 
                    >
                    <img  class="module-icon" src="../assets/icons/lab.png" alt="" srcset=""> 
                    </ModuleButton>

                </div>
                <div class="filler"></div>
        </div>
        <div v-else> <h1>{{t('LOADING')}}</h1></div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { computed } from '@vue/runtime-core'
import ModuleButton from '../components/ModuleButton.vue'
import getModule from '../composables/getModule.js'
import {t} from '../helpers/helperFunctions.js'

export default {
    props: ['moduleName'],
    components: { ModuleButton },
    setup(props) {
        const moduleName = props.moduleName
        console.log(moduleName.value)
        const { mdl, error, load } = getModule(moduleName)
        load()

        const append = computed((text,index) => {
            return text +''+ index
        })
        return {mdl, error, append,t }
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
       
        left: 0.5rem;
    }
    

    .header-text {
       position: relative ;
       margin: 0 auto;
    }
</style>

