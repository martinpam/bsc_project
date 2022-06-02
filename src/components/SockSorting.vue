<template>
  <div class="sorting">
      <div style="display: flex; justify-content: right; padding-right: 6rem" ><h3>{{t('MOVES') + ': ' + counters.moves}}</h3> <div style="minWidth: 40px"></div> <h3>{{ t('COMPARISONS') + ': ' + counters.comparisons}}</h3></div>
      <div class="box start" :class="{'two-rows' : socks.length > 12}">
          <Sock v-for="(sock,index) in socks" 
          :key="sock" :color="sock.color" 
          :lineAmount="sock.lineAmount" 
          :pattern="sock.pattern" 
          :patternColor="sock.patternColor"
          :id = "'sock-'+index"
          class="start-box-sock"
          />
      </div>
      <div class="outer-outer">
        <div class="compare-boxes-outer">
          <div v-for="sock in (algorithm !== 3 ? socks: algo3Classes.colors)" :key="sock" class="box compare extras"></div>
        </div>
        <div v-if="algorithm === 3" class="compare-boxes-outer hidden-outer">
          <div v-for="sock in algo3Classes.patterns" :key="sock" class="box compare compare-pattern extras"></div>
        </div>
        
        <div v-if="algorithm === 3" class="compare-boxes-outer hidden-outer">
          <div  v-for="sock in  algo3Classes.patternColors" :key="sock" class="box compare compare-patternColor extras"></div>
        </div>
        <div v-if="algorithm === 3" class="compare-boxes-outer hidden-outer">
          <div v-for="sock in algo3Classes.lineAmounts" :key="sock" class="box compare compare-lineAmount extras"></div>
        </div>
      </div>
     
      
      <div class="box sorted"></div>
      <ButtonNavigation
      v-if="questionAnswered || !isStory"
      :story="false"
      ref="buttonnavi"
      :playing="playing"
      :fastForwarding="false"
      :showContinue="showContinue"
      @handleClickPlayPause="playPause()"
      @handleClickRestart="resetSimulation(true)"
      @handleClickContinueStory="$emit('handleClickContinueStory')"
      />
      <QuestionModal :question="simulation.question" :choices="simulation.choices" v-else @answer="a => submitAnswer(a)"/>
      
  </div>
</template>

<script>
import Sock from "../components/Sock.vue";
import  { shuffle }  from "../helpers/helperFunctions.js";
import  { copySockArray, t }  from "../helpers/helperFunctions.js";
import { ref } from "@vue/reactivity";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import runSimpleAlgo from "../helpers/SimpleAlgorithm.js";
import runSimpleDivideAndSweepAlgo from "../helpers/SimpleDivideAndSweepAlgorithm.js";
import runDivideAndSweepAlgo from "../helpers/DivideAndSweepAlgorithm.js";
import runRandomAlgo from "../helpers/RandomAlgorithm.js";
import {getAnimations} from "../helpers/AnimationBuilder.js";
import QuestionModal from './QuestionModal.vue';


export default {
    props: [
    "socksProp", "algorithm", "trigger", "isStory", "simulation"
  ],
  components: { Sock, ButtonNavigation, QuestionModal},
  setup(props) {
    //init sock array
    console.log(props)
    const fillAndShuffleSocks = () =>{
        let socks = copySockArray(props.socksProp)
      
      socks = socks.slice().map(s => {
        return s.type === 'single' ? s : [s, s]
        }).flat()
      for (let i = 0; i < socks.length; i++) {
        socks[i].type = 'single'
      }
      socks = shuffle(socks) 
      return socks;    
    } 

    let socks = fillAndShuffleSocks();
    const gameStarted = ref(false);
    const playing = ref(false);
    const isStory = ref(props.isStory)
    const questionAnswered = ref(false)
    const answer = ref(0);
    const currentAnimations = ref(null);
    const animations = ref([])
    const showContinue = ref(false)
    const counters = ref({moves: 0, comparisons: 0});
    const algo3Classes = [{
      colors: 0,
      patterns: 0,
      patternColors: 0,
      lineAmounts: 0
    }]

    return {socks, t,gameStarted, playing, answer, questionAnswered, fillAndShuffleSocks,  counters, animations, currentAnimations, algo3Classes, showContinue, isStory};
  },

  watch: {
    algorithm(){
        this.resetSimulation(true)     
    },
    socksProp() {
      console.log('sock prop changed')
        this.resetSimulation(true)
    },

    trigger() {
      this.resetSimulation(true)
    }
  },
  computed: {
    
  },


  methods: {
    playPause() {
      this.playing = !this.playing;
      if (!this.gameStarted) this.startSimulation(false);
      if (!this.playing && this.gameStarted) {
        this.animations.forEach((e, i) => console.log(e.animation.playState))
        this.currentAnimations = this.animations.filter(a => a.animation.playState === 'running').map(a => a.animation)
        this.currentAnimations.forEach((e,i) => e.pause())
      } else {
       this.currentAnimations.forEach((e,i) => e.play())
      }
    },
    startSimulation(full) {
        console.log('starting');
        this.resetSimulation(full);
        this.gameStarted = true;
        this.playing = true;


        this.fillAnimations();
        this.currentAnimations.push(this.animations[0].animation);
    },
    resetSimulation(full) {
      console.log(this.socksProp)
        const copy = copySockArray(this.socksProp)
        this.$refs.buttonnavi.updatePlay(copy.find(s => s.type === 'single') !== undefined && this.algorithm===4)
        this.gameStarted = false;
        this.playing = false;
        this.counters.moves = 0;
        this.counters.comparisons = 0;
        this.currentAnimations = [];
        this.disablePlay = (this.containsSingleSock && this.algorithm===4)
        console.log(this.containsSingleSock, this.algorithm)
        this.animations.forEach((element) => {
        element.animation.cancel();
        });
        let itemsToDelete = document.querySelectorAll(
        '.fake-sock'
      );
      console.log('before deleting', itemsToDelete)
      for (let i = 0; i < itemsToDelete.length; i++) {
        console.log('deleting',itemsToDelete[i])
        itemsToDelete[i].parentNode.removeChild(itemsToDelete[i]);
      }
      
        this.animations = [];
        if (full) this.socks = this.fillAndShuffleSocks();
        document.getElementsByClassName('start')[0].style.height = this.socks.length > 12 ? '230px' : '120px'
        document.getElementsByClassName('start')[0].style.width = '800px'
      document.getElementsByClassName('sorted')[0].style.height =  '120px'
 

      if (this.algorithm === 3) {
        this.algo3Classes.colors = this.getUniqueColors();
        this.algo3Classes.patterns = this.getUniquePatterns()*this.getUniqueColors();
        this.algo3Classes.patternColors = this.getUniquePatterns()*this.getUniqueColors()*this.getUniquePatternColors();
        this.algo3Classes.lineAmounts = this.getUniquePatterns()*this.getUniqueColors()*this.getUniquePatternColors()*this.getUniqueLineAmounts();
      }
    },
    submitAnswer(answer) {
      this.questionAnswered = true;
      this.answer = answer;
    },
    
    getUniqueColors() {
      const allColors = this.socks.map(s => s.color)
      const uniqueSet = new Set(allColors);
      return uniqueSet.size
    },  
    getUniquePatternColors() {
      const allPatternColors = this.socks.map(s => s.patternColor)
      const uniqueSet = new Set(allPatternColors);
      return uniqueSet.size
    }, 
    getUniquePatterns() {
      const allPatterns = this.socks.map(s => s.pattern)
      const uniqueSet = new Set(allPatterns);
      return uniqueSet.size
    }, 
    getUniqueLineAmounts() {
      const allLineAmounts = this.socks.map(s => s.lineAmount)
      const uniqueSet = new Set(allLineAmounts);
      return uniqueSet.size
    }, 
    
    fillAnimations() {
        let playBook = [];
        switch (this.algorithm) {
            case 1:
                playBook = runSimpleAlgo(this.socks)
                break;
            case 2:
                playBook = runSimpleDivideAndSweepAlgo(this.socks)
                break;
            case 3:
                playBook = runDivideAndSweepAlgo(this.socks)
                break;
            case 4:
                playBook = runRandomAlgo(this.socks)
                break;            
        }
        console.log(playBook);
        this.animations = getAnimations(playBook, this.counters);
        
        for (let i = 0; i < this.animations.length; i++) {
            this.animations[i].animation.pause()

          if (this.animations[i].last) {
              this.animations[i].animation.onfinish = () => {
                if (this.animations.length !== (i+1)) {
                   this.animations[i+1].animation.play()
                if (this.animations[i].select || this.animations[i].unselect) {
                  console.log(this.animations[i])
                  this.socks[this.animations[i].index].highlighted = this.animations[i].select;
                  console.log(this.socks)
                }
                } else {
                  console.log(this.showContinue, this.isStory)
                  if (this.isStory) this.showContinue = true;
                  console.log('did it', this.showContinue)
                }
               
              }
          }
        }
        
        console.log(this.animations)
        this.animations[0].animation.play();
    }
  }
}
</script>

<style>
    .box {
        background-color: burlywood;
        width: 80%;
        height: 120px;
        display: flex;
        margin: 0 auto;
        border-radius:8px;
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
   

    .outer-outer  {
      min-height: 130px;
    }
    
    .hidden-outer {
      min-height: 0px;
    }

    .extras:empty {
      display: none;
    }

</style>