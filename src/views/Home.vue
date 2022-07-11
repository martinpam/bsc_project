<template>
    <div class="home-outer">
        <h1> {{t('HOME_HEADING')}} </h1>
        <div class="bg-big"
        >
            <ModuleButton 
                key="supermarket" 
                :name="t('MODULE_SUPERMARKET')" 
                goTo="supermarket"
                :subText="t('MODULE_SUPERMARKET_SUBTEXT')" 
            >
                <img  class="module-icon" src="../assets/icons/cart.png" alt="" srcset=""> 
                
            </ModuleButton>
            <ModuleButton 
                key="socks" 
                :name="t('MODULE_SOCKS')" 
                goTo="socks"
                :subText="t('MODULE_SOCKS_SUBTEXT')" 
            >
                <img  class="module-icon" src="../assets/icons/socks.png" alt="" srcset=""> 
            </ModuleButton>
        </div>
    </div>
</template>

<script>

import ModuleButton from '../components/ModuleButton.vue'
import getModules from '../composables/getModules.js'
import {t, getCookie, setCookie} from '../helpers/helperFunctions.js'
export default {
    name: 'Home',
    components : { ModuleButton },
    setup() {
        const { modules, error, load } = getModules()
        load()
        
        const dev = true;


        if (dev) {
            setCookie('supermarket-story',4);
            setCookie('socks-story',2);
            setCookie('supermarket-challenges',11);
            setCookie('socks-challenges',9);
        } else if (getCookie('supermarket-story') === "") {
            setCookie('supermarket-story',0);
            setCookie('socks-story',0);
            setCookie('supermarket-challenges',0);
            setCookie('socks-challenges',0);
        }
        let supermarketStoryProgress = getCookie('supermarket-story');
        let supermarketChallengesProgress = getCookie('supermarket-challenges');
        let socksStoryProgress = getCookie('socks-story');
        let socksChallengesProgress = getCookie('socks-challenges');

        console.log(supermarketStoryProgress,supermarketChallengesProgress, socksStoryProgress,socksChallengesProgress)
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
        max-width: 1000px;
        margin: 50px auto;  
    }
    .home-outer {
        margin: 0 auto;
        width: 700px;
        justify-content: center;
        align-items: center;
    }
    
    .bg-big {
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(230px, 1fr));
        gap: 80px;
     
       
        margin: 40px auto;  
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
    .module-icon {
        width: 70px;
        padding-top: 10px;
        filter: invert(0.7)
    }
</style>

