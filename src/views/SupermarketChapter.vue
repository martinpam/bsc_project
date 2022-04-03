<template>
  <div>
    <div v-if="!started">
      <h1>Supermarkt Kapitel {{chapterId}}</h1>
      <div class="filler"></div>
      <div class="container" @click="handleClick">
        <div class="inner-text">Starten</div>
      </div>
    </div>
    <div v-else class="story-board-outer">
      <StoryBoard moduleName="supermarket" :chapterId="chapterId"/>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import  StoryBoard  from '../components/StoryBoard.vue'
export default {
  props: ['chapterId'],
  components: { StoryBoard },
  setup(props) {
    const chapterId = props.chapterId
    const handleClick = () => {
      console.log("starting story...")
      started.value = true;
    }
    const started = ref(false)
    return {chapterId, handleClick, started}
  }
}
</script>

<style scoped>
.filler {
  height: 50px;
}
.story-board-outer {
  height: 100%;
  width: 100%;
  display: block;
}
</style>