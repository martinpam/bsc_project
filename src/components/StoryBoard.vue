<template>

  <div v-if="mdl[0].chapters[chapterId-1] && !mdl[0].chapters[chapterId-1].conversation[currentIndex]['showSimulation']">
      
    <div class="story-board">
        <div class="button-navigation top"><img @click="$router.go(-1)" src="../assets/icons/arrow-left-long-solid.svg" class="navigation-button smaller"/> </div>
      <div class="dialog-field" @click="goForward">
        <div class="text">
          <div v-if="isSpeaking('Narrator')">
            {{ mdl[0].chapters[chapterId-1].conversation[currentIndex][store.language] }}
          </div>
        </div>

        <div class="characters">
          <img
            v-if="!mdl[0].chapters[chapterId-1].conversation[currentIndex]['showCode']"
            class="karin"
            src="../assets/images/karin.png"
            alt="Karin"
          />
          <div
            v-if="isSpeaking('Robot')"
            :class="{
              'filler-right': mdl[0].chapters[chapterId-1].conversation[currentIndex][store.language].length < 100,
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
            {{ mdl[0].chapters[chapterId-1].conversation[currentIndex][store.language] }}
          </div>
          <div
            v-if="isSpeaking('Karin')"
            :class="{
              'filler-right': mdl[0].chapters[chapterId-1].conversation[currentIndex][store.language].length < 150,
              'filler-right-small':
                mdl[0].chapters[chapterId-1].conversation[currentIndex][store.language].length < 250,
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
        :last="chapterId == mdl[0].chapters.length && mdl[0].chapters[mdl[0].chapters.length-1].conversation.length == (currentIndex+1)"
      />
    </div>
  </div>
  <div v-else> 
    <AlgorithmOverview 
    :moduleName="moduleName" 
    :isStory="true"
    :chapterId=" mdl[0].chapters[chapterId-1].conversation[currentIndex].showSimulation"
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
import {store} from '../store.js'
export default {
  props: ["moduleName", "chapterId"],
  name: "StoryBoard",
  components: { ButtonNavigation,CodeBox, AlgorithmOverview},
  setup(props) {
    console.log(props.moduleName, props.chapterId);
    const chapterIdInitial = ref(props.chapterId);
    const chapterId = chapterIdInitial;
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    console.log(mdl.value[0])
    const currentIndex = ref(0);

    const goForward = () => {
      if (currentIndex.value <  mdl.value[0].chapters[chapterId.value-1].conversation.length - 1) {
        currentIndex.value++;
        console.log(currentIndex, mdl.value[0].chapters[chapterId.value-1].conversation.length)
      } else {
        console.log('going to next chapter')
        chapterId.value++
        router.push('/'+mdl.value[0].link+'/chapters/' + chapterId.value)
        
       
      }
    };

    const goBack = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };

    const isSpeaking = (name) => {
        return mdl.value[0].chapters[chapterId.value-1].conversation[currentIndex.value]['speaker'] === name
    }
    return {  chapterId, currentIndex, goForward, goBack,isSpeaking ,mdl, store};
  },
  watch: {
    chapterId() {

      this.currentIndex = 0;
    }
  },
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

.code {
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
  max-width: 2000px;
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
  max-width: 2000px;
  border-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

@media (max-width: 1200px) {
  .dialog-field {
    height: 300px;
    font-size: 22px;
  }
  .lower-part {
    height: 100px;
  }
  .robot {
  bottom: 15px;
  height: 80%
}
.karin {
  bottom: 0px;
  height: 80%;
}
.text-style-karin {
  font-size: 22px;
}

.text-style-robot {
  font-size: 22px;
}
};
@media (max-width: 700px) {
  .dialog-field {
    height: 200px;
    font-size: 16px;
  }
  .lower-part {
    height: 67px;
  }
    .robot {
  bottom: -32px;
  height: 70%
}
.karin {
  bottom: -38px;
  height: 70%;
}
.text-style-karin {
  font-size: 16px;
  margin-bottom: 22rem;
}
.dialogText {
  margin-bottom: 22rem;
}

.text-style-robot {
  font-size: 16px;
}
.characters {
  margin-top: -5rem;
}
};



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
        margin-left: -2.4rem;
        margin-top: 0.5rem;

        margin-right: auto;
        display: block; 
    }
</style>
