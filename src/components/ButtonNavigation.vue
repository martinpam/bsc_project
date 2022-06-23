<template>
  <div>
    <div style="display:flex" v-if="story">
      <img src="../assets/icons/backward-solid.svg" class="navigation-button" @click="$emit('handleClickBack')"/>
      <div class="story-filler"></div>
      <img v-if="!last" src="../assets/icons/forward-solid.svg"  class="navigation-button" @click="$emit('handleClickForward')"/>
    </div>
    <div class="navigation-board" v-else>
      <div class="ends"></div>
      <div class="buttons">
        <img v-show="gameStarted || finished" src="../assets/icons/arrow-rotate-right-solid.svg" class="navigation-button rs" @click="$emit('handleClickRestart')"/>
        <div class="filler"></div>
        <img v-if="playing" src="../assets/icons/pause-solid.svg" id="pause-button"  class="navigation-button pt" @click="$emit('handleClickPlayPause')"/>
        <img v-else-if="!showContinue" src="../assets/icons/play-solid.svg"  class=" pt" id="pause-button-2" @click="disablePlayReal? $emit('nothing') : $emit('handleClickPlayPause')" :class="{'red' : disablePlayReal, 'navigation-button': !disablePlayReal }"/>
        <div class="filler"></div>
      </div>
    
      <div  class="ends" @click="$emit('handleClickContinueStory')"> <div v-show="showContinue&&storySegment" >{{t('CONTINUE')}}</div> </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import {t} from '../helpers/helperFunctions.js'
export default {
    name: 'ButtonNavigation',    
    props: ['story','playing','fastForwarding', 'showContinue', 'last', 'storySegment', 'gameStarted', 'finished'],
    emits: ["handleClickBack", "handleClickForward"],
    setup() {
      const disablePlayReal = ref(false);
      return {disablePlayReal, t}
    },
     methods: {
       updatePlay(play) {
         this.disablePlayReal = play
       }
     }
}

</script>

<style>


.navigation-button {
  height: 60px;
  
  cursor: pointer;
  filter: invert(9%) sepia(8%) saturate(3333%) hue-rotate(169deg) brightness(95%) contrast(86%);

}

.pause {
  min-width: 50px;
}

.ends {
  font-size: 3rem;
  color: black;
  padding-top: 0.1rem;
  min-width: 24%;
  cursor: pointer;
  text-align: right;
}
.buttons {
  display: flex;
  min-width: 52%;
  margin: 0 auto;
  justify-content: center;
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
  height: 60px;
  background: #d3d3d3;
  margin: 0 auto;

  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
}

@media (max-width: 1000px) {
 
.navigation-button, .back{
  max-height: 30px;
  max-width: 50px;

}
.ends {
  font-size: 2rem;

}



.pt {
  min-width: 30px;
  max-width: 30px;
}



};

@media (max-width: 1700px) {
 

.ends {
  font-size: 2.7rem;
}
};

@media (max-width: 1500px) {
 

.ends {
  font-size: 2.2rem;
}
};

@media (max-width: 1200px) {
 

.ends {
  font-size: 1.85rem;
}
.navigation-button {
  max-width: 30px;
  margin-top: -1rem
}
};

@media (max-width: 1100px) {
 

.ends {
  font-size: 1.65rem;
}
.navigation-button {
  max-width: 30px;
  margin-top: -1rem
}
};

@media (max-width: 1000px) {
 

.ends {
  font-size: 1.55rem;
  
}
.navigation-button {
  max-width: 30px;
  margin-top: -0.2rem
}

};


</style>