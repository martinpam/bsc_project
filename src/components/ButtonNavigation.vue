<template>
  <div>
    <div style="display:flex" v-if="story">
      <img src="../assets/icons/backward-solid.svg" class="navigation-button" @click="$emit('handleClickBack')"/>
      <div class="story-filler"></div>
      <img src="../assets/icons/forward-solid.svg"  class="navigation-button" @click="$emit('handleClickForward')"/>
    </div>
    <div class="navigation-board" v-else>
      <img src="../assets/icons/arrow-rotate-right-solid.svg" class="navigation-button rs" @click="$emit('handleClickRestart')"/>
      <div class="filler"></div>
      <img v-if="playing" src="../assets/icons/pause-solid.svg" id="pause-button"  class="navigation-button pt" @click="$emit('handleClickPlayPause')"/>
      <img v-else src="../assets/icons/play-solid.svg"  class=" pt" @click="disablePlayReal? $emit('nothing') : $emit('handleClickPlayPause')" :class="{'red' : disablePlayReal, 'navigation-button': !disablePlayReal }"/>
      <div class="filler"></div>
    
      <div v-if="showContinue"  class="continue" @click="$emit('handleClickContinueStory')"> {{t('CONTINUE')}} </div>
    </div>
    <div class="error-message" :style="{'color' : '#D63333', 'marginTop':'1rem'}" v-if="disablePlayReal">Dieser Algorithmus erlaubt nur Sockenpaare.</div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import {t} from '../helpers/helperFunctions.js'
export default {
    name: 'ButtonNavigation',    
    props: ['story','playing','fastForwarding', 'showContinue'],
    emits: ["handleClickBack", "handleClickForward"],
    setup() {
      const disablePlayReal = ref(false);
      return {disablePlayReal, t}
    },
     methods: {
       updatePlay(play) {
         console.log('updating to',play)
         this.disablePlayReal = play;
         console.log(this.disablePlayReal)
       }
     }
}

</script>

<style>


.navigation-button {
  height: 60px;
  margin: 0 auto;
  cursor: pointer;
  filter: invert(9%) sepia(8%) saturate(3333%) hue-rotate(169deg) brightness(95%) contrast(86%);

}

.red {
  filter: invert(32%) sepia(47%) saturate(2274%) hue-rotate(335deg) brightness(89%) contrast(97%);
  height: 60px;
  margin: 0 auto;
}
.pause {
  min-width: 50px;
}

.continue {
  font-size: 3rem;
  color: black;
  padding-left: 11rem;
  padding-top: 0.1rem;
  cursor: pointer;
}
.filler {
  min-width: 10px;
}
.story-filler {
  min-width: 50px;
}
.pt {
  padding-top: 5px;
  height: 55px;
}
.rs {
  padding-top: 5px;
  height: 55px;
}

.navigation-board {
  padding-top: 10px;
  width: 200px;
  height: 60px;
  background: #d3d3d3;
  margin: 0 auto;

  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
}

@media (max-width: 1000px) {
 
.navigation-button{
  max-height: 30px;
  max-width: 50px;

}
.navigation-board {
   max-width: 105px;
}


.pt {
  min-width: 30px;
  max-width: 30px;
}



};
</style>