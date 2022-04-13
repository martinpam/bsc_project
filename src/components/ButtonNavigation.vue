<template>
  <div v-if="story">
    <img src="../assets/icons/backward-solid.svg" class="navigation-button" @click="$emit('handleClickBack')"/>
    <div class="filler"></div>
    <img src="../assets/icons/forward-solid.svg"  class="navigation-button" @click="$emit('handleClickForward')"/>
  </div>
  <div class="navigation-board" v-else> 
    <img src="../assets/icons/arrow-rotate-right-solid.svg" class="navigation-button pt" @click="$emit('handleClickRestart')"/>
    <div class="filler"></div>
    <img v-if="playing" src="../assets/icons/pause-solid.svg"  class="navigation-button pause" @click="$emit('handleClickPlayPause')"/>
    <img v-else src="../assets/icons/play-solid.svg"  class="navigation-button pt" @click="$emit('handleClickPlayPause')"/>
    <div class="filler"></div>
    <img src="../assets/icons/forward-fast-solid.svg"  class="navigation-button" @click="$emit('handleClickFastForward')"/>

  </div>
</template>

<script>
export default {
    name: 'ButtonNavigation',    
    props: ['story','playing','fastForwarding'],
    emits: ["handleClickBack", "handleClickForward"],
}
</script>

<style>
.navigation-button {
  height: 60px;
  margin: 0 auto;
  cursor: pointer;
  filter: invert(9%) sepia(8%) saturate(3333%) hue-rotate(169deg) brightness(95%) contrast(86%);

}
.pause {
  min-width: 50px;
}

.filler {
  min-width: 40px;
}
.pt {
  padding-top: 5px;
  height: 55px;
}

.navigation-board {
  padding-top: 10px;
  width: 250px;
  height: 100px;
  background: #d3d3d3;
  margin: 0 auto;

  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
}
</style>