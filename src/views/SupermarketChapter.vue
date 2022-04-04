<template>
  <div>
    <div v-if="!started">
      <div class="header">
        <img @click="$router.go(-1)" src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/>
        <div class="header-text">
          <h1>Supermarkt </h1>
        </div>
      </div>
      <h2>Kapitel {{chapterId}}</h2>
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
  height: 30px;
}
.story-board-outer {
  height: 100%;
  width: 100%;
  max-width: 1400px;
  display: block;
  margin: 0 auto;
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