<template>
  <div>
      <div class="story-board">
          <div class="dialog-field" :class="{'text-style-karin' : karinSpeaking, 'text-style-robot' : !karinSpeaking}">
                {{chapterData}}
            <div class="characters">
                <img class="karin" src="../assets/images/karin.png" alt="Karin">
                <img class="robot" src="../assets/images/robot-1.png" alt="Robot">
            </div>
          </div>
          <div class="lower-part">
            
            
          </div>
          <ButtonNavigation class="button-navigation"/>
          
      </div>
      
  </div>
</template>

<script>
import { computed, ref } from 'vue' 
import ButtonNavigation from '../components/ButtonNavigation.vue'
import getChapter from '../composables/getChapter.js'
export default {
    props: ['moduleName','chapterId'],
    name: "StoryBoard",
    components: { ButtonNavigation },
    setup(props) {
        const karinSpeaking = computed(() => {
            return true
        })
        console.log(props.moduleName, props.chapterId)
        const { chapterData, error, load } = getChapter(props.moduleName, props.chapterId)
        load()
  
       
        return { karinSpeaking, chapterData}
    }
}
</script>

<style scoped>
    .story-board {
        height: 90%;
        width: 87%; 
        margin: 0 auto;
    }
    
    .robot {
        padding-right: 25px;
        bottom: 2px;    
    }
    .karin {  
        bottom: -20px;    
    }

    .characters {
        display: flex;
        height: 100%;
        justify-content: space-between;
        width: 100%;
    }

    .karin, .robot {
        position: relative;
         height: 120%;   
    }

    .text-style-karin {

    }

    .text-style-robot {
        
    }

    .dialog-field {
        width: 100%;
        height: 400px;
        margin: 0 auto;
        font-size: 30px;
        color: #1A2530;
        background: #778899;
        margin-top: 60px;
        max-height: 700px;
        max-width: 1400px;
        border-radius: 12px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

    }

    .lower-part {
        width: 100%;
        height: 200px;
        margin: 0 auto;
        background: tan;
        max-height: 700px;
        max-width: 1400px;
        border-radius: 12px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .button-navigation {
        width: 100%;
        height: 100px;
        background: #D3D3D3;
        margin: 0 auto;
        max-width: 1400px;
        border-radius: 12px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>