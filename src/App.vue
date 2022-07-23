<template>

  <div>
    <div v-if="store" class="language-chooser">
      <div
        @click="store.language = 'en'"
        class="en"
        :class="{ choosen: store.language === 'en' }"
      >
        en
      </div>
      <div class="filler">|</div>
      <div
        @click="store.language = 'de'"
        class="de"
        :class="{ choosen: store.language === 'de' }"
      >
        de
      </div>
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script>
import { store } from "./store.js";
export default {
  data() {
    return {
      store,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.language-chooser {
  display: flex;
  position: absolute;
  text-align: right;
  right: 1.5rem;
  top: 1rem;
}

.en,
.de {
  cursor: pointer;
  font-size: 1.3rem;
  max-width: 18px;
  color: grey;
}
.filler {
  font-size: 1.3rem;

  padding-left: 0.5rem;
  padding-right: 0.3rem;
}

.choosen {
  color: black;
}
</style>
