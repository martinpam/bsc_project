<template>
  <div>
    <div v-if="mdl">
      <div class="header">
        <img
          @click="$router.push({ path: '/' + mdl[0].link })"
          src="../assets/icons/arrow-left-long-solid.svg"
          class="navigation-button smaller"
        />
        <div class="header-text">
          <h1>{{ t(mdl[0].name) }}</h1>
        </div>
      </div>

      <h2 v-if="type == 'chapters'">{{ t("CHAPTER_SELECTION") }}</h2>
      <h2 v-else>{{ t("CHALLENGE_SELECTION") }}</h2>
      <div
        v-if="type === 'chapters'"
        class="button-group-selection"
        :class="{ 'less-than-four': true }"
      >
        <BasicButton
          :finished="index < getProgress('chapter')"
          :disabled="index > getProgress('chapter')"
          class="basic-button"
          v-for="(ch, index) in mdl[0].chapters"
          :key="ch"
          :name="t('CHAPTER') + ' ' + ch.chapterId"
          :goTo="'/' + moduleName + '/chapters/' + ch.chapterId"
        />
      </div>
      <div
        v-else-if="type === 'challenges'"
        class="button-group-selection"
        :class="{ 'less-than-four': mdl[0].challenges.length < 4 }"
      >
        <BasicButton
          :finished="index < getProgress('challenges')"
          :disabled="index > getProgress('challenges')"
          class="basic-button"
          v-for="(ch, index) in mdl[0].challenges"
          :key="ch"
          :name="ch.name[store.language]"
          :goTo="'/' + moduleName + '/challenges/' + ch.challengeId"
        />
      </div>
      <div class="filler"></div>
    </div>
    <div v-else>
      <h1>{{ t("LOADING") }}</h1>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import BasicButton from "../components/BasicButton.vue";
import getModule from "../composables/getModule.js";
import { t, getCookie } from "../helpers/helperFunctions.js";
import { store } from "../store.js";

export default {
  props: ["moduleName", "type"],
  components: { BasicButton },
  setup(props) {
    const moduleName = props.moduleName;
    const { mdl, error, load } = getModule(moduleName);
    load();

    const append = computed((text, index) => {
      return text + "" + index;
    });
    return { mdl, error, append, t, store };
  },
  methods: {
    getProgress(type) {
      let res;
      if (type === "challenges") {
        res = getCookie(
          this.moduleName === "supermarket"
            ? "supermarket-challenges"
            : "socks-challenges"
        );
      } else {
        res = getCookie(
          this.moduleName === "supermarket"
            ? "supermarket-story"
            : "socks-story"
        );
      }
      return res;
    },
  },
};
</script>

<style scoped>
.filler {
  height: 200px;
}
.linebreak {
  width: 100%;
}


.header {
  display: flex;
}

.smaller {
  height: 40px;
  position: absolute;

  left: 0.5rem;
}

.header-text {
  position: relative;
  margin: 0 auto;
}

.button-group-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 30px;
  align-content: center;
  width: 100%;
  max-width: 1100px;
  margin: 50px auto;
}

.less-than-four {
  max-width: 850px;
}
</style>

