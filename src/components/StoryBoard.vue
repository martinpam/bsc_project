<template>

  <div v-if="chapterData">
      
    <div class="story-board">
        <div class="button-navigation top"><img @click="$router.go(-1)" src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/> </div>
      <div class="dialog-field">
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
          <div v-else class="code-box">
            <div v-for="(line, index) in chapterData.algorithm" :key="line"  class="code-line">
              <div class="line-number">{{index+1}}</div>  <div v-for="i in line['indent'] " :key="i" class='indent'></div> {{line["text"]}}
            </div>
          </div>
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
        @handleClickForward="goForward"
        @handleClickBack="goBack"
        class="button-navigation"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import getChapter from "../composables/getChapter.js";
export default {
  props: ["moduleName", "chapterId"],
  name: "StoryBoard",
  components: { ButtonNavigation },
  setup(props) {
    console.log(props.moduleName, props.chapterId);
    const { chapterData, error, load } = getChapter(
      props.moduleName,
      props.chapterId
    );
    load();

    const currentIndex = ref(0);

    const goForward = () => {
      if (currentIndex.value < chapterData.value.conversation.length - 1) {
        currentIndex.value++;
      }
    };

    const goBack = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };

    const isSpeaking = (name) => {
        return chapterData.value.conversation[currentIndex.value]['speaker'] === name
    }
    return { chapterData, currentIndex, goForward, goBack,isSpeaking };
  },
};
</script>

<style scoped>
.story-board {
  height: 100%;
  width: 87%;
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
  max-width: 1400px;
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
  max-width: 1400px;
  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.line-number {
    text-align: right;
    margin-right: 1rem;
    min-width: 2rem;
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

.code-box {
  width: 70%;
  background-color: #0e0e0e;
  margin-bottom: 45px;
  margin-left: 25px;
  border-radius: 12px;
  overflow: scroll;
  margin-right: 12px;
  
}

.code-line {
    display: flex;
    color: #f0f0f0;
    font-size: 1.5rem;
    text-align: left;
    padding-left: 12px;
    padding-top: 5px;
    font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
}

.indent {
    min-width: 1.3rem;
}

.smaller {
        width: 40px;
        margin-left: 0;
        margin-right: auto;
        display: block;
     
        
        
    }
</style>
