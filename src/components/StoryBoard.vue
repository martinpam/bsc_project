<template>

  <div v-if="chapterData && !chapterData.conversation[currentIndex]['showSimulation']">
      
    <div class="story-board">
        <div class="button-navigation top"><img @click="$router.go(-1)" src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/> </div>
      <div class="dialog-field" @click="goForward">
        <div class="text">
          <div v-if="isSpeaking('Narrator')">
            {{ chapterData.conversation[currentIndex]["text"] }}
          </div>
        </div>

        <div class="characters">
          <img
            v-if="!chapterData.conversation[currentIndex]['showCode']"
            class="karin"
            src="../assets/images/karin.png"
            alt="Karin"
          />
          <div
            v-if="isSpeaking('Robot')"
            :class="{
              'filler-right': chapterData.conversation[currentIndex]['text'].length < 100,
            }"
          ></div>

          <div
            v-if="!isSpeaking('Narrator')"
            class="dialogText"
            :class="{
              'text-style-karin':
                isSpeaking('Karin'),
              'text-style-robot':
                isSpeaking('Robot'),
            }"
          >
            {{ chapterData.conversation[currentIndex]["text"] }}
          </div>
          <div
            v-if="isSpeaking('Karin')"
            :class="{
              'filler-right': chapterData.conversation[currentIndex]['text'].length < 150,
              'filler-right-small':
                chapterData.conversation[currentIndex]['text'].length < 250,
            }"
          ></div>
          <img class="robot" src="../assets/images/robot-2.png" alt="Robot" />
        </div>
      </div>
      <div class="lower-part"></div>
      <ButtonNavigation
        :story="true"
        @handleClickForward="goForward"
        @handleClickBack="goBack"
        class="button-navigation"
      />
    </div>
  </div>
  <div v-else> 
    <AlgorithmOverview 
    moduleName="supermarket" 
    :isStory="true" 
    :chapterId="chapterData.conversation[currentIndex].showSimulation"
    @handleClickContinueStory="currentIndex++"
    />
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import getModule from "../composables/getModule.js";
import CodeBox from "../components/CodeBox.vue";
import AlgorithmOverview from "../views/AlgorithmOverview.vue";
import router from "../router/index.js"
export default {
  props: ["moduleName", "chapterId"],
  name: "StoryBoard",
  components: { ButtonNavigation,CodeBox, AlgorithmOverview},
  setup(props) {
    console.log(props.moduleName, props.chapterId);
    const chapterId = ref(props.chapterId);
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    const chapterData = mdl.value[0].chapters[chapterId.value-1]
    const currentIndex = ref(0);

    const goForward = () => {
      if (currentIndex.value < chapterData.conversation.length - 1) {
        currentIndex.value++;
      } else {
        chapterId.value++
        router.push('/supermarket/chapters/' + chapterId.value)
        
       
      }
    };

    const goBack = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };

    const isSpeaking = (name) => {
        return chapterData.conversation[currentIndex.value]['speaker'] === name
    }
    return { chapterData, chapterId, currentIndex, goForward, goBack,isSpeaking ,mdl};
  },
  watch: {
    chapterId() {
      this.chapterData = this.mdl[0].chapters[this.chapterId-1]
      this.currentIndex = 0;
    }
  }
};
</script>

<style scoped>
.story-board {
  height: 100%;
  width: 95%;
  margin: 0 auto;
}

.text {
  height: 155px;
  padding: 10px;
  padding-left: 15px;
  text-align: initial;
}

.robot {
  padding-right: 25px;
  bottom: 22px;
}
.karin {
  bottom: -3px;
}

.characters {
  display: flex;
  height: 100%;
  justify-content: space-between;
  width: 100%;
}

.code-box {
  width: 70%;
}

.karin,
.robot {
  position: relative;
  height: 100%;
}

.text-style-karin {
  color: #d8c94e;
  font-size: 1.7rem;
}

.text-style-robot {
  color: #145a23;
  max-width: 20%;
  font-size: 1.7rem;
}

.dialog-field {
  width: 100%;
  height: 450px;
  margin: 0 auto;
  font-size: 30px;
  color: #1a2530;
  background: #778899;
  margin-top: 0px;
  max-height: 700px;
  max-width: 1600px;
  border-radius: 12px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.lower-part {
  width: 100%;
  height: 150px;
  margin: 0 auto;
  background: tan;
  max-height: 700px;
  max-width: 1600px;
  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}



.button-navigation {
  width: 150px;
  height: 100px;
  background: #d3d3d3;
  margin: 0 auto;

  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  display: flex;
}

.filler-left {
  width: 15rem;
}
.filler-right {
  width: 85rem;
}
.filler-right-small {
  width: 45rem;
}
.top {
    height: 50px;
    margin: 0 0;
}

.smaller {
        width: 40px;
        margin-left: 0;
        margin-right: auto;
        display: block; 
    }
</style>
