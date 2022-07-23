<template>
  <div v-if="!isAnswered" class="modal" :class="{ 'smaller-modal': isSmaller }">
    <h3 class="question">{{ question[store.language] }}</h3>
    <slot></slot>
    <div class="choices">
      <div
        class="modal-button"
        @click="submitAnswer(choice)"
        v-for="choice in choices"
        :key="choice"
        style="display: float"
      >
        <div class="inner-text">{{ choice[store.language] }}</div>
      </div>
    </div>
  </div>
  <div v-else class="modal" :class="{ 'smaller-modal': isSmaller }">
    <div class="result-outer">
      <div class="answer-text result">
        {{ t("YOUR_ANSWER") }}
        <div
          class="answer-text"
          :class="{ correct: correct, incorrect: !correct }"
        >
          {{ answeredByUser[store.language] }}
        </div>
        <div v-if="correct">{{ t("IS_CORRECT") }}</div>
        <div v-else>{{ t("IS_WRONG") }}</div>
        !
      </div>
    </div>

    <div v-if="correct" class="endMessage">
      {{ endMessage.messageCorrect[store.language] }}
    </div>
    <div v-else class="endMessage">
      {{ endMessage.messageWrong[store.language] }}
    </div>
    <div class="action-outer">
      <div class="filler"></div>
      <div class="action">
        <div @click="$emit('continue')" v-if="correct && !isLastChallenge">
          {{ t("CONTINUE") }}
        </div>
        <div @click="retry()" v-else-if="!correct">{{ t("RETRY") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "../store.js";
import { ref } from "vue";
import { t, setCookie } from "../helpers/helperFunctions.js";
export default {
  props: [
    "question",
    "choices",
    "endMessage",
    "counters",
    "animationFinished",
    "correctAnswer",
    "updateQuestions",
    "isLastChallenge",
    "isSmaller",
  ],
  setup(props) {
    const answeredByUser = ref(null);
    const isAnswered = ref(false);
    const correct = ref(null);

    return { store, answeredByUser, correct, t, isAnswered };
  },
  watch: {
    animationFinished(newValue, oldValue) {
      if (newValue)
        this.correct = this.answeredByUser.en === this.correctAnswer;
        if (this.correct) {
          this.$emit("unlockNextChallenge");
        }
    },
    updateQuestions(newValue, oldValue) {
      this.isAnswered = false;
    },
  },
  methods: {
    retry() {
      this.$emit("retry");
      this.isAnswered = false;
    },
    submitAnswer(answer) {
      this.answeredByUser = answer;
      this.$emit("answer");
      this.isAnswered = true;
    },
    handleClick() {
      if (this.showContinue) {
        this.$emit("closeModal");
      }
    },
  },
};
</script>

<style  scoped>
.modal {
  width: 100%;
  background-color: lightyellow;

  margin: 0 auto;
  margin-top: 0.4rem;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 20px;
}

.smaller-modal {
  width: 800px;
}
.modal-button {
  width: 20%;
  height: 60px;
  background-color: red;
  margin: 0 auto;
  vertical-align: middle;
  background: #3f3f3f;
  box-shadow: 1px 2px 3px #3f3f3f;
  border-radius: 8px;
  position: relative;
  margin: 0 auto;
  text-decoration: none;
  cursor: pointer;
}
.inner-text {
  text-decoration: none;
  color: white;
  font-size: 20px;
  position: relative;
  top: 30%;
  text-align: center;
}
.choices {
  display: flex;
  margin-top: -0.7rem;
}
.question {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: center;
}

.clickable {
  cursor: pointer;
}
.answer-text {
  margin-left: 0.4rem;
  margin-right: 0.4rem;
  font-weight: 600;
  font-size: 1.6rem;
}
.result {
  margin-top: 0.4rem;
  display: inline-flex;
}
.result-outer {
  margin: 0 auto;
}
.endMessage {
  margin-top: 0.4rem;
  font-size: 1.2rem;
  min-height: 46px;
}

.correct {
  color: green;
}
.incorrect {
  color: red;
}
.action {
  font-size: 1.5rem;
  color: #3f3f3f;
  margin-top: 0.2rem;
  padding-right: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: right;
  width: 100%;
}

.action-outer {
  width: 100%;

  display: flex;
}

@media (max-width: 1600px) {
  .smaller-modal {
    width: 720px;
  }
}
@media (max-width: 1500px) {
  .smaller-modal {
    width: 620px;
  }
}
@media (max-width: 1275px) {
  .smaller-modal {
    width: 520px;
  }
}
@media (max-width: 1200px) {
  .smaller-modal {
    width: 550px;
    margin-left: 3rem;
  }
}
</style>