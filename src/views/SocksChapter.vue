<template>
  <div>
    <div v-if="!started">
      <div class="header">
        <router-link class="container" to="/">
          <img
            src="../assets/icons/arrow-left-long-solid.svg"
            class="navigation-button smaller"
          />
        </router-link>

        <div class="header-text">
          <h1>{{ t("MODULE_SOCKS") }}</h1>
        </div>
      </div>
      <h2>{{ t("CHAPTER") + " " + chapterId }}</h2>
      <div class="filler"></div>
    </div>
    <div v-else class="story-board-outer">
      <StoryBoard moduleName="socks" :chapterId="chapterId" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import StoryBoard from "../components/StoryBoard.vue";
import { t } from "../helpers/helperFunctions.js";
export default {
  props: ["chapterId"],
  components: { StoryBoard },
  setup(props) {
    const chapterId = props.chapterId;
    const started = ref(true);
    return { chapterId, started, t };
  },
};
</script>

<style scoped>
.filler {
  height: 30px;
}
.story-board-outer {
  height: 100%;
  width: 100%;
  max-width: 2000px;
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
  position: relative;
  margin: 0 auto;
}
</style>