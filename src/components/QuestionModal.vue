<template>
  <div class="modal">
      <h3 class="question">{{ question[store.language]}}</h3>
      <div class="choices">
          <div  class="modal-button" @click="$emit('answer', 1)" v-for="choice in choices" :key="choice" style="display:float"> <div class="inner-text">{{getChoice(choice)}}</div></div>
      </div>
  </div>
</template>

<script>
import {store} from "../store.js"
export default {
    props: ["question","choices"],
    setup(props) {
    
        return {store};
    },
    methods: {
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
            return ''
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
</style>