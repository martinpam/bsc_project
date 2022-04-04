<template>
  <div class="navigation-board">
    <img src="../assets/icons/backward-solid.svg" class="navigation-button" @click="$emit('handleClickBack')"/>
    <div class="filler"></div>
    <img src="../assets/icons/forward-solid.svg"  class="navigation-button" @click="$emit('handleClickForward')"/>
  </div>
</template>

<script>
export default {
    name: 'ButtonNavigation',    
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

.filler {
  min-width: 40px;
}
</style>