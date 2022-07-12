<template>
  <div class="sorting">
    <div style="display: flex; justify-content: right; padding-right: 6rem">
      <h3 v-show="!challenge">{{ t("MOVES") + ": " + counters.moves }}</h3>
      <div style="minwidth: 40px; minheight: 45.52px"></div>
      <h3 v-show="!challenge">
        {{ t("COMPARISONS") + ": " + counters.comparisons }}
      </h3>
    </div>

    <div
      style="'display':'flex'"
      class="baskets"
      :class="{ 'double-basket': algorithm === 2 || algorithm === 3 }"
    >
      <div id="basket-outer">
        <img
          v-if="startNotEmpty"
          :class="'basket'"
          src="../assets/images/laundry-basket.png"
        />
        <img
          v-else
          :class="'basket'"
          src="../assets/images/laundry-basket-empty.png"
        />
        <div class="box start" ref="start">
          <Sock
            v-for="(sock, index) in socks"
            :key="sock"
            :color="sock.color"
            :lineAmount="sock.lineAmount"
            :pattern="sock.pattern"
            :patternColor="sock.patternColor"
            :id="'sock-' + index"
            class="start-box-sock"
          />
        </div>
      </div>
      <div v-if="algorithm === 2 || algorithm === 3" id="filler"></div>
      <div
        v-if="algorithm === 2 || algorithm === 3"
        id="basket-sorted-out-outer"
        class="sorted-out"
      >
        <img
          v-if="sortedOutNotEmpty"
          :class="'basket-sorted-out'"
          src="../assets/images/laundry-basket-green.png"
        />
        <img
          v-else
          :class="'basket-sorted-out'"
          src="../assets/images/laundry-basket-empty-green.png"
        />
      </div>
    </div>

    <div class="outer-outer">
      <div class="compare-boxes-outer">
        <div
          v-for="sock in algorithm !== 5 ? socks : algo3Classes.colors"
          :key="sock"
          class="box compare extras"
        ></div>
      </div>
      <div v-if="algorithm === 5" class="compare-boxes-outer hidden-outer">
        <div
          v-for="sock in algo3Classes.patterns"
          :key="sock"
          class="box compare compare-pattern extras"
        ></div>
      </div>

      <div v-if="algorithm === 5" class="compare-boxes-outer hidden-outer">
        <div
          v-for="sock in algo3Classes.patternColors"
          :key="sock"
          class="box compare compare-patternColor extras"
        ></div>
      </div>
      <div v-if="algorithm === 5" class="compare-boxes-outer hidden-outer">
        <div
          v-for="sock in algo3Classes.lineAmounts"
          :key="sock"
          class="box compare compare-lineAmount extras"
        ></div>
      </div>
    </div>

    <div class="box sorted"></div>
    <ButtonNavigation
      v-show="!challenge || (!finished && playing && !showQuestionModal)"
      :storySegment="isStory"
      ref="buttonnavi"
      :playing="playing"
      :gameStarted="gameStarted"
      :showContinue="showContinue"
      :finished="finished"
      @handleClickPlayPause="playPause()"
      @handleClickRestart="resetSimulation(true)"
      @handleClickContinueStory="$emit('handleClickContinueStory')"
    />
    <QuestionModal
      v-if="challenge"
      v-show="finished || showQuestionModal"
      :question="challenge.question"
      :choices="challenge.choices"
      :endMessage="challenge.endMessage"
      :animationFinished="finished"
      :correctAnswer="challenge.answer"
      :updateQuestions="updateQuestions"
      :isLastChallenge="isLastChallenge"
      :isSmaller="true"
      @retry="retryChallenge()"
      @answer="questionAnswered()"
      @continue="nextChallenge()"
    >
      <div class="question-socks">
        <Sock
          v-for="sock in orderedSocks"
          :key="sock"
          :color="sock.color"
          :lineAmount="sock.lineAmount"
          :pattern="sock.pattern"
          :patternColor="sock.patternColor"
          class="question-sock"
        />
      </div>
    </QuestionModal>
  </div>
</template>

<script>
import Sock from "../components/Sock.vue";
import { shuffle } from "../helpers/helperFunctions.js";
import { copySockArray, t, setCookie } from "../helpers/helperFunctions.js";
import { ref } from "@vue/reactivity";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import runSimpleAlgo from "../helpers/SimpleAlgorithm.js";
import runSimpleDivideAndSweepAlgo from "../helpers/SimpleDivideAndSweepAlgorithm.js";
import runDivideAndSweepAlgo from "../helpers/DivideAndSweepAlgorithm.js";
import runSortOutAlgo from "../helpers/SortOutAlgorithm.js";
import runSortOutFixedAlgo from "../helpers/SortOutFixedAlgorithm.js";
import { getAnimations } from "../helpers/AnimationBuilder.js";
import QuestionModal from "./QuestionModal.vue";

export default {
  props: [
    "socksProp",
    "algorithm",
    "trigger",
    "isStory",
    "simulation",
    "challenge",
    "isLastChallenge",
  ],
  components: { Sock, ButtonNavigation, QuestionModal },
  setup(props) {
    //init sock array
    const fillAndShuffleSocks = () => {
      let socks = copySockArray(props.socksProp);
      socks = socks
        .slice()
        .map((s) => {
          return s.type === "single" ? s : [s, s];
        })
        .flat();
      for (let i = 0; i < socks.length; i++) {
        socks[i].type = "single";
      }
      socks = props.challenge ? socks : shuffle(socks);
      return socks;
    };
    const getOrderedSocks = () => {
      if (!props.challenge) return null;
      const res = [];
      for (let i = 0; i < props.challenge.sockOrder.length; i++) {
        res.push(socks[2 * props.challenge.sockOrder[i]]);
      }
      return res;
    };
    let socks = fillAndShuffleSocks();
    let orderedSocks = getOrderedSocks();

    const gameStarted = ref(false);
    const playing = ref(false);
    const finished = ref(false);
    const isStory = ref(props.isStory);
    const questionAnswered = ref(false);
    const showQuestionModal = ref(true);
    const start = ref(null);
    const updateQuestions = ref(false);
    const startNotEmpty = ref(null);
    const sortedOutNotEmpty = ref(null);
    const modalClosed = ref(false);
    const currentAnimations = ref(null);
    const animations = ref([]);
    const showContinue = ref(false);
    const counters = ref({ moves: 0, comparisons: 0 });
    const updates = ref({ basket: false });
    const algo3Classes = [
      {
        colors: 0,
        patterns: 0,
        patternColors: 0,
        lineAmounts: 0,
      },
    ];
    const order = props.challenge ? props.challenge.sockOrder : null;

    return {
      socks,
      finished,
      orderedSocks,
      getOrderedSocks,
      updateQuestions,
      showQuestionModal,
      order,
      start,
      updates,
      modalClosed,
      t,
      gameStarted,
      startNotEmpty,
      sortedOutNotEmpty,
      playing,
      questionAnswered,
      fillAndShuffleSocks,
      counters,
      animations,
      currentAnimations,
      algo3Classes,
      showContinue,
      isStory,
    };
  },

  watch: {
    algorithm() {
      this.resetSimulation(true);
    },
    socksProp() {
      this.resetSimulation(true);
    },
    challenge() {
      this.resetSimulation();
      if (this.challenge) {
        this.showQuestionModal = true;
      }
    },
    trigger() {
      this.resetSimulation(true);
    },
    updates: {
      handler(newValue, oldValue) {
        this.startNotEmpty = this.getStartNotEmpty();
        this.sortedOutNotEmpty = this.getSortedOutNotEmpty();
      },
      deep: true,
    },
  },

  methods: {
    getStartNotEmpty() {
      return (
        document.getElementsByClassName("start")[0] !== undefined &&
        document.getElementsByClassName("start")[0].children.length > 0
      );
    },
    getSortedOutNotEmpty() {
      return (
        document.getElementsByClassName("sorted-out")[0] !== undefined &&
        document.getElementsByClassName("sorted-out")[0].lastChild
          .classList[0] === "start-box-sock"
      );
    },
    playPause() {
      this.playing = !this.playing;
      if (!this.gameStarted) this.startSimulation(false);
      if (!this.playing && this.gameStarted) {
        this.currentAnimations = this.animations
          .filter((a) => a.animation.playState === "running")
          .map((a) => a.animation);
        this.currentAnimations.forEach((e, i) => e.pause());
      } else {
        this.currentAnimations.forEach((e, i) => e.play());
      }
    },
    questionAnswered() {
      this.playPause();
      this.showQuestionModal = false;
    },
    retryChallenge() {
      this.resetSimulation();
      this.startSimulation();
    },
    nextChallenge() {
      setCookie("socks-challenges", this.challenge.challengeId);
      this.$router.push({
        path: "/socks/challenges/" + (parseInt(this.challenge.challengeId) + 1),
      });
      this.resetSimulation(true);
      this.updateQuestions = !this.updateQuestions;
    },
    startSimulation(full) {
      this.resetSimulation(full);
      this.gameStarted = true;
      this.playing = true;

      this.fillAnimations();
      this.currentAnimations.push(this.animations[0].animation);
    },
    resetSimulation(full) {
      this.showContinue = false;

      this.finished = false;
      const copy = copySockArray(this.socksProp);
      this.$refs.buttonnavi.updatePlay(
        copy.find((s) => s.type === "single") !== undefined &&
          this.algorithm === 4
      );
      this.gameStarted = false;
      this.playing = false;
      this.counters.moves = 0;
      this.counters.comparisons = 0;
      this.currentAnimations = [];
      this.disablePlay = this.containsSingleSock && this.algorithm === 4;

      this.animations.forEach((element) => {
        element.animation.cancel();
      });
      let itemsToDelete = document.querySelectorAll(".fake-sock");

      for (let i = 0; i < itemsToDelete.length; i++) {
        itemsToDelete[i].parentNode.removeChild(itemsToDelete[i]);
      }

      this.animations = [];
      if (full) this.socks = this.fillAndShuffleSocks();
      document.getElementsByClassName("start")[0].style.height = "120px";
      document.getElementsByClassName("start")[0].style.width = "100px";
      document.getElementsByClassName("sorted")[0].style.height = "120px";
      this.startNotEmpty = this.getStartNotEmpty();
      this.sortedOutNotEmpty = this.getSortedOutNotEmpty();

      if (this.algorithm === 5) {
        this.algo3Classes.colors = this.getUniqueColors();
        this.algo3Classes.patterns =
          this.getUniquePatterns() * this.getUniqueColors();
        this.algo3Classes.patternColors =
          this.getUniquePatterns() *
          this.getUniqueColors() *
          this.getUniquePatternColors();
        this.algo3Classes.lineAmounts =
          this.getUniquePatterns() *
          this.getUniqueColors() *
          this.getUniquePatternColors() *
          this.getUniqueLineAmounts();
      }
    },
    getUniqueColors() {
      const allColors = this.socks.map((s) => s.color);
      const uniqueSet = new Set(allColors);
      return uniqueSet.size;
    },
    getUniquePatternColors() {
      const allPatternColors = this.socks.map((s) => s.patternColor);
      const uniqueSet = new Set(allPatternColors);
      return uniqueSet.size;
    },
    getUniquePatterns() {
      const allPatterns = this.socks.map((s) => s.pattern);
      const uniqueSet = new Set(allPatterns);
      return uniqueSet.size;
    },
    getUniqueLineAmounts() {
      const allLineAmounts = this.socks.map((s) => s.lineAmount);
      const uniqueSet = new Set(allLineAmounts);
      return uniqueSet.size;
    },

    fillAnimations() {
      let playBook = [];
      switch (this.algorithm) {
        case 1:
          playBook = runSimpleAlgo(this.socks, this.order);
          break;
        case 2:
          playBook = runSortOutAlgo(this.socks, this.order);
          break;
        case 3:
          playBook = runSortOutFixedAlgo(this.socks, this.order);
          break;
        case 4:
          playBook = runSimpleDivideAndSweepAlgo(this.socks, this.order);
          break;
        case 5:
          playBook = runDivideAndSweepAlgo(this.socks, this.order);
          break;
      }

      this.animations = getAnimations(playBook, this.counters, this.updates);

      for (let i = 0; i < this.animations.length; i++) {
        this.animations[i].animation.pause();

        if (this.animations[i].last) {
          this.animations[i].animation.onfinish = () => {
            if (this.animations.length !== i + 1) {
              this.animations[i + 1].animation.play();
              if (this.animations[i].select || this.animations[i].unselect) {
                this.socks[this.animations[i].index].highlighted =
                  this.animations[i].select;
              }
            } else {
              if (this.isStory) {
                this.showContinue = true;
              }
              this.finished = true;
            }
          };
        }
      }
      this.animations[0].animation.play();
    },
  },
  mounted() {
    if (this.algorithm === 5) {
      this.algo3Classes.colors = this.getUniqueColors();
      this.algo3Classes.patterns =
        this.getUniquePatterns() * this.getUniqueColors();
      this.algo3Classes.patternColors =
        this.getUniquePatterns() *
        this.getUniqueColors() *
        this.getUniquePatternColors();
      this.algo3Classes.lineAmounts =
        this.getUniquePatterns() *
        this.getUniqueColors() *
        this.getUniquePatternColors() *
        this.getUniqueLineAmounts();
    }
    if (this.challenge) {
      this.showQuestionModal = true;

      const scrollContainer = document.querySelector(".question-socks");

      scrollContainer.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
      });
    }
  },
};
</script>

<style>
.box {
  background-color: burlywood;
  width: 80%;
  height: 120px;
  display: flex;
  margin: 0 auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.two-rows {
  height: 230px;
}

@keyframes append-animate {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.compare {
  background-color: grey;
  width: 150px;
  margin: 0 0.3128rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
  animation: append-animate 0.5s linear;
}

.compare start-box-sock {
  margin-right: -3.3rem;
}

.sorting {
  margin-top: -0.8rem;
  width: 1000px;
}

.sorted {
  min-height: 120px;
}
.start-box-sock {
  padding-top: 0.6rem;
  margin-right: -2.3rem;
  display: none;
}
.compare-boxes-outer {
  display: flex;
  flex-wrap: wrap;
  width: max-content;
  max-width: 80%;
  margin: 0 auto;
  min-height: 0px;
  align-items: center;
  justify-content: center;
}

.basket,
.basket-sorted-out {
  height: 170px;
  position: absolute;
  top: 6rem;
  z-index: -1;
  margin-left: -6rem;
}

.double-basket {
  margin-left: -1rem;
}

.basket-outer,
.basket-sorted-out-outer {
  top: 2rem;
  min-width: 300px;
  min-height: 120px;
  margin: 0 auto;
}

.question-socks {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -0.8rem;
  margin-bottom: 0.8rem;
  overflow-x: hidden;
}

.question-sock {
  margin-right: -2.5rem;
}

.baskets {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  margin: 0 auto;
}

#filler {
  width: 150px;
}

.start,
.sorted-out {
  background-color: transparent;
  min-width: 169px;
  overflow: hidden;
  margin-top: 2rem;
  margin-bottom: 1.2rem;
}
.start .start-box-sock {
  margin-left: 1.7rem;
}
.sorted-out .start-box-sock {
  margin-right: 1.7rem;
  margin-top: 0.3rem;
}

.start-box-sock {
  margin-top: 0.3rem;
}

.outer-outer {
  min-height: 130px;
}

.hidden-outer {
  min-height: 0px;
}

.extras:empty {
  display: none;
}
</style>