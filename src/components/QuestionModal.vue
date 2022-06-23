<template>
  <div v-if="!showContinue" class="modal" >
      <h3 class="question">{{ simulation.question[store.language]}}</h3>
      <div class="choices">
          <div  class="modal-button" @click="submitAnswer(choice)" v-for="choice in simulation.choices" :key="choice" style="display:float"> <div class="inner-text">{{getChoice(choice)}}</div></div>
      </div>
  </div>
  <div v-else class="modal clickable" @click="handleClick()">
      <div class="remove">&#10006;</div>

       <div class="answer-part">
           <div class="left-side">
               <div class="your-answer"><h2 >{{t('YOUR_ANSWER')}}</h2></div> <div class="answer-text" :class="{'correct': correct, 'incorrect': !correct}">{{answerText}}</div>
           </div>
           <div class="right-side">
               <div class="correct-answer"><h2>{{t('CORRECT_ANSWER')}}</h2></div> <div class="answer-text">{{correctAnswerText}}</div>
           </div>
           
       </div>
        <div v-if="simulation.hint&&!correct" class="hint">{{simulation.hint[store.language]}}</div>
        <div v-else-if="!correct" class="hint"><h3>{{t('HINT_INCORRECT')}}</h3> </div>
        <div v-else class="hint"><h3>{{t('HINT_CORRECT')}}</h3> </div>
       
  </div>
</template>

<script>
import {store} from "../store.js"
import {  ref } from "vue";
import  { t }  from "../helpers/helperFunctions.js";
export default {
    props: ["simulation","counters","showContinue"],
    setup(props) {
        const answeredByUser = ref(null);
        const answerText = ref(null)
        const correctAnswerText = ref(null)
        const correct = ref(null)
        return {store,answeredByUser,answerText,correctAnswerText,correct,t};
    },
    watch: {
        showContinue(newValue, oldValue) {
            if (newValue === true) {
                this.correctAnswerText = this.simulation.question.type === 'movements' ?  this.counters.moves :
                                         this.simulation.question.type === 'comparisons' ?  this.counters.comparisons :
                                         this.simulation.answer;
            console.log(this.correctAnswerText)
            if (this.simulation.question.type === 'text') {
                 this.correct = this.answerText === this.correctAnswerText;
            } else {
                const temp = this.simulation.question.type === 'movements' ? this.counters.moves :  this.counters.comparisons
                if (this.answeredByUser.lessThan) this.correct = this.answeredByUser.lessThan > temp;
                if (this.answeredByUser.moreThan) this.correct = this.answeredByUser.lessThan < temp;
                else (this.correct = (temp >= this.answeredByUser.from && temp <= this.answeredByUser.until))
            }
            }
        }
    },
    methods: {
        submitAnswer(answer) {       
            this.answeredByUser = answer;
            this.answerText = this.getChoice(this.answeredByUser)
            this.$emit('answer', 1)
        },
        handleClick() {
            console.log('clicking')
            if (this.showContinue) {
              this.$emit('closeModal')   
            }
            
        },
        getChoice(choice) {
            if (choice.lessThan) {
                return '<' + choice.lessThan
            }
            if (choice.moreThan) {
                return '>' + choice.moreThan
            }
            if (choice.from) {
                return choice.from + '-' + choice.until
            }
            console.log(choice)
            return choice
        }
    }
}
</script>

<style  scoped>

    .modal {
        width: 80%;
        background-color: darkgrey;
        height: 200px;
        margin: 0 auto;
        margin-top: 1rem;
        border-radius: 8px;
    }
    .modal-button {
        width: 110px;
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
    cursor:pointer;
    }
    .inner-text {
    text-decoration: none;
    color: white;
    font-size: 20px; 
    position: relative;
    top: 35%;
  }
    .choices {
        display: flex;
    }
    .question {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .answer-part {
        display: flex;
        padding-top: 0.5rem;
        
    }
    .clickable {
        cursor: pointer;
    }
    .answer-text {
        font-size: 6rem;
        margin-top: -0.7rem ;

    }
    .correct {
        color: green;
    }
    .incorrect {
        color: red;
    }
    .remove {
        position: absolute;
       
        padding-left: 7px;
        font-size: 1.5rem;
        color: grey;
    }
</style>