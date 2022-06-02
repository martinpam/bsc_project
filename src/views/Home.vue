<template>
    <div>
        <h1> {{t('HOME_HEADING')}} </h1>
        <div class="button-group"
        :class="{'less-than-three': modules.length < 3}"
        >
            <ModuleButton v-for="mdl in modules" :key="mdl" :name="t(mdl.name)" :goTo="mdl.link"/>
        </div>
    </div>
</template>

<script>

import ModuleButton from '../components/ModuleButton.vue'
import getModules from '../composables/getModules.js'
import {t} from '../helpers/helperFunctions.js'
export default {
    name: 'Home',
    components : { ModuleButton },
    setup() {
        const { modules, error, load } = getModules()
        load()
        return {modules, error, t}
    }
}
</script>

<style>
    .button-group {   
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(230px, 1fr));
        gap: 50px;
        align-content: center;
        width: 93%;
        max-width: 900px;
        margin: 50px auto;
        
    }
    .less-than-three{   
        max-width: 600px;   
    }
    h1 {
        font-size: 45px;
        margin-bottom: 2px;
    }
    h2 {
        font-size: 25px;
        margin-top: 5px;
    }

    body {
        background: 	#D3D3D3;
    }
</style>

