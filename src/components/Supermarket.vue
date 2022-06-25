<template>
  <div class="supermarket-container">
    <img
      v-show="gameStarted"
      class="robot"
      ref="robot"
      src="../assets/images/robot-3.png"
      alt="r"
      :style="{
        width: cell.width * 0.65 + 'px',
        height: cell.height + 'px',
        zIndex: 7,
      }"
    />
    <div class="current-item" ref="currentItem">
      <div id="itemImageOuter">
        <img
          id="itemImage"
          :src="getItemUrl(currentItemName)"
          alt="milk"
          ref="itemImage"
        />
      </div>
      <div id="itemText">&#10060;</div>
    </div>

    <div v-if="size === 'SMALL'" class="supermarket small" ref="supermarket">
      <div class="door-entry" ref="door" style="transform: rotate(0deg)"></div>
      <div
        class="door-exit"
        ref="exit"
        style="transform: rotate(0deg) scaleX(-1)"
      ></div>
      <div :style="{'--vegetables':  '\''+ t('VEGETABLES')+ '\''}"  class="shelf vegetables articles-left text-small"></div>
      <div :style="{'--fruits':  '\''+ t('FRUITS')+ '\''}" class="shelf fruits articles-right text-small"></div>
      <div :style="{'--cooler':  '\''+ t('COOLER')+ '\''}" class="shelf cooler articles-left text-small"></div>
      <div :style="{'--freezer':  '\''+ t('FREEZER')+ '\''}" class="shelf freezer articles-right text-small"></div>
      <div :style="{'--checkout':  '\''+ t('CHECKOUT')+ '\''}"  class="checkout text-small-checkout" ref="checkout"></div>
      <div  class="corridor corridor1" ref="corridor"></div>
    </div>

    <div
      v-else-if="size === 'MEDIUM'"
      class="supermarket medium"
      ref="supermarket"
    >
      <div
        class="door-entry"
        ref="door"
        style="transform: rotate(0deg) scaleX(-1)"
      ></div>
      <div
        class="door-exit"
        ref="exit"
        style="transform: rotate(180deg) scaleX(-1)"
      ></div>
      <div :style="{'--cooler':  '\''+ t('COOLER')+ '\''}" class="shelf cooler articles-left text-medium" style="{'content':'asdf'}"></div>
      <div :style="{'--vegetables':  '\''+ t('VEGETABLES')+ '\''}" class="shelf vegetables articles-left text-medium"></div>

      <div :style="{'--freezer':  '\''+ t('FREEZER')+ '\''}" class="shelf freezer articles-right text-medium"></div>
      <div :style="{'--fruits':  '\''+ t('FRUITS')+ '\''}" class="shelf fruits articles-right text-medium"></div>
      <div :style="{'--meat':  '\''+ t('MEAT')+ '\''}" class="shelf meat articles-left text-medium"></div>
      <div :style="{'--cleaning':  '\''+ t('CLEANING')+ '\''}" class="shelf cleaning articles-left text-medium"></div>

      <div :style="{'--sweets':  '\''+ t('SWEETS')+ '\''}" class="shelf sweets articles-right text-medium"></div>
      <div :style="{'--drinks':  '\''+ t('DRINKS')+ '\''}" class="shelf drinks articles-right text-medium"></div>
      <div :style="{'--checkout':  '\''+ t('CHECKOUT')+ '\''}" class="checkout text-medium-checkout" ref="checkout"></div>
      <div class="corridor corridor1" ref="corridor"></div>
    </div>
    <div v-else-if="size==='LARGE'" class="supermarket large" ref="supermarket">
      <div class="door-entry" ref="door"></div>
      <div
        class="door-exit"
        ref="exit"
        style="transform: rotate(180deg) scaleX(-1)"
      ></div>
      <div :style="{'--cooler':  '\''+ t('COOLER')+ '\''}" class="shelf cooler articles-left text-large"></div>
      <div :style="{'--fruits':  '\''+ t('FRUITS')+ '\''}" class="shelf fruits articles-left text-large"></div>
      <div :style="{'--freezer':  '\''+ t('FREEZER')+ '\''}" class="shelf freezer articles-right text-large"></div>
    
      <div :style="{'--vegetables':  '\''+ t('VEGETABLES')+ '\''}" class="shelf vegetables articles-right text-large"></div>
       <div :style="{'--freezer':  '\''+ t('FREEZER')+ '\''}" class="shelf freezer freezer2 articles-left text-large"></div>
      <div :style="{'--vegetables':  '\''+ t('VEGETABLES')+ '\''}" class="shelf vegetables vegetables2 articles-left text-large"></div>
     <div :style="{'--cooler':  '\''+ t('COOLER')+ '\''}" class="shelf cooler cooler2 articles-right text-large"></div>
      
      <div :style="{'--fruits':  '\''+ t('FRUITS')+ '\''}" class="shelf fruits fruits2 articles-right text-large"></div>
       <div :style="{'--drinks':  '\''+ t('DRINKS')+ '\''}" class="shelf drinks articles-left text-large"></div>
      <div :style="{'--drinks':  '\''+ t('DRINKS')+ '\''}" class="shelf drinks drinks2 articles-left text-large"></div>
     
      <div :style="{'--meat':  '\''+ t('MEAT')+ '\''}" class="shelf meat articles-right text-large"></div>
      <div :style="{'--cleaning':  '\''+ t('CLEANING')+ '\''}" class="shelf cleaning articles-right text-large"></div>
      <div :style="{'--meat':  '\''+ t('MEAT')+ '\''}" class="shelf meat meat2 articles-left text-large"></div>
      <div :style="{'--cleaning':  '\''+ t('CLEANING')+ '\''}" class="shelf cleaning cleaning2 articles-left text-large"></div>
      <div :style="{'--sweets':  '\''+ t('SWEETS')+ '\''}" class="shelf sweets articles-right text-large"></div>
      <div :style="{'--sweets':  '\''+ t('SWEETS')+ '\''}" class="shelf sweets sweets2 articles-right text-large"></div>
      <div :style="{'--checkout':  '\''+ t('CHECKOUT')+ '\''}" class="checkout text-large-checkout" ref="checkout"></div>
      <div class="corridor corridor1" ref="corridor"></div>
      <div class="corridor corridor2"></div>
      <div class="corridor corridor3"></div>
    </div>
    <ButtonNavigation v-if="!challenge || (!finished && playing && !showQuestionModal)"
      :storySegment="isStory"
      :playing="playing"
      :gameStarted="gameStarted"
      :finished="finished"
      :fastForwarding="fastForwarding"
      :showContinue="showContinue"
      @handleClickPlayPause="playPause()"
      @handleClickRestart="startSimulation()"
      @handleClickFastForward="fastForward()"
      @handleClickContinueStory="$emit('handleClickContinueStory')"
    />
    <QuestionModal v-if="challenge" v-show="finished || showQuestionModal"
    :question="challenge.question"
    :choices="challenge.choices"
    :endMessage="challenge.endMessage"
    :animationFinished="finished"
    :correctAnswer="challenge.answer"
    :updateQuestions="updateQuestions"
    @retry="retryChallenge()"
    @answer="questionAnswered()"
    @continue="nextChallenge()"
    
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import QuestionModal from "../components/QuestionModal.vue";
import {t} from '../helpers/helperFunctions.js'

import { onMounted } from "@vue/runtime-core";
export default {
  props: [
    "size",
    "algorithm",
    "shoppingListProp",
    "shelfData",
    "allShelfs",
    "isStory",
    "boughtItems",
    "challenge"
  ],
  components: { ButtonNavigation, QuestionModal },
  setup(props) {
    console.log(props);
  
    const shoppingList = ref([]);
    shoppingList.value.push(...props.shoppingListProp);
    const supermarket = ref(null);
    const showContinue = ref(false);
    const showQuestionModal = ref(true);
    const corridor = ref(null);
    const playing = ref(false);
    const fastForwarding = ref(false);
    const gameStarted = ref(false);
    const robotWidth = ref(0);
    const door = ref(null);
    const robot = ref(null);
    const shelfs = [];
    const shoppingListLive = ref([]);
    shoppingListLive.value.push(...props.shoppingListProp);
    console.log(shoppingListLive.value);
    const checkout = ref(null);
    const plannedCoordinates = [];
    const exit = ref(null);
    const currentItem = ref(null);
    const updateQuestions = ref(false);
    const itemImage = ref(null);
    const shortestPathGreedy = ref([]);
    const currentAnimation = ref(0);
    const currentItemName = ref(
      shoppingListLive.value[shoppingListLive.value.length - 1]
    );
    const cell = {
      height: 0,
      width: 0,
    };
    const robotPosPlanned = {
      x: 0,
      y: 0,
    };
    const animations = ref([]);
    const walkingSpeed = ref(200);
    const finished = ref(false)
    const MAX_ROUNDS = 1;
    const rounds = ref(0);
    const endlessRoundStarter = ref(0);
    onMounted(() => {
      console.log(currentItemName.value, shoppingList.value, props.shoppingListProp, props.size)
      console.log(document.children, "mounted", robotWidth.value, props.algorithm, props.size, document.getElementsByClassName("shelf")[0]);
      cell.width =
        Math.max(door.value.clientWidth, door.value.clientHeight) * 2;
      cell.height =
        props.size === 'LARGE'
          ? document.getElementsByClassName("shelf")[0].clientHeight / 3.3
          : document.getElementsByClassName("shelf")[0].clientHeight / 3;
    });

    return {
      supermarket,
      playing,
      fastForwarding,
      gameStarted,
      robotWidth,
      door,
      robot,
      shelfs,
      finished,
      cell,
      corridor,
      updateQuestions,
      animations,
      robotPosPlanned,
      showContinue,
      plannedCoordinates,
      walkingSpeed,
      checkout,
      t,
      exit,
      showQuestionModal,
      currentItem,
      currentItemName,
      shoppingListLive,
      shoppingList,
      currentAnimation,
      MAX_ROUNDS,
      endlessRoundStarter,
      rounds,
      itemImage,
      shortestPathGreedy,
    };
  },
  watch: {
    // whenever shoppingList changes, update simulation
    shoppingListProp(newShoppingList, oldShoppingList) {
      this.resetSimulation();
    },
    algorithm() {
      this.resetSimulation();
      
    },
    size() {
      this.resetSimulation();
    },
    challenge() {
      this.resetSimulation();
       if (this.challenge) {
     this.startSimulation()
     this.showQuestionModal = true;
    }
    }
  },
  mounted() {
    window.addEventListener('resize', this.resetSimulation);
    if (this.challenge) {
     this.startSimulation()
     this.showQuestionModal = true;
    }

  },
  unmounted() {
    window.removeEventListener('resize', this.resetSimulation);
  },

  methods: {
    resetSimulation() {
      this.robot.style.opacity =0
      this.finished = false;
      this.showQuestionModal = this.challenge? true: false;
      this.showContinue = false;
      this.shelfs = document.getElementsByClassName("shelf");
      this.cell.width = Math.max(this.exit.clientWidth, this.exit.clientHeight);
      this.cell.height =
        this.size === 'LARGE'
          ? this.shelfs[0].clientHeight / 3.3
          : this.shelfs[0].clientHeight / 3;
      this.shoppingListLive = [];
      this.shoppingList = [];
      this.shoppingListLive.push(...this.shoppingListProp);
      this.shoppingList.push(...this.shoppingListProp);
      let itemsToDelete = document.querySelectorAll(
        ".algorithm-six-item, .line-outer, .target-point, .start-point"
      );

      for (let i = 0; i < itemsToDelete.length; i++) {
        itemsToDelete[i].parentNode.removeChild(itemsToDelete[i]);
      }
      this.shortestPathGreedy = [];
      this.shelfs = document.getElementsByClassName("shelf");
      this.plannedCoordinates = [];
      this.robotPosPlanned = null;
      this.currentItemName =
        this.shoppingListLive[this.shoppingListLive.length - 1];
      this.currentAnimation = 0;

      this.playing = false;
      this.rounds = 0;
      this.gameStarted = false;
      this.currentItem.style.display = "none";
      this.$emit("resetBoughtItems");
      this.animations.forEach((element) => {
        element.animation.cancel();
      });
      this.animations = [];
      this.MAX_ROUNDS = 2;
      if (this.challenge) {
        
      }
    },
    playPause() {
      this.playing = !this.playing;
      if (!this.gameStarted) this.startSimulation();
      if (!this.playing && this.gameStarted) {
        this.animations[this.currentAnimation].animation.pause();
      } else {
        this.animations[this.currentAnimation].animation.play();
      }
    },
    questionAnswered(){
      this.playPause();
      this.showQuestionModal = false;
    },
    retryChallenge(){
      
      this.resetSimulation()
      this.startSimulation()
      
    },
    nextChallenge() {
      this.resetSimulation()
      this.$router.push({path:'/supermarket/challenges/'+(parseInt(this.challenge.challengeId)+1)})
      this.updateQuestions = !this.updateQuestions;
    },
    continueStory() {
      this.$emit("handleClickContinueStory");
    },
    getItemUrl(itemName) {
      if (itemName !== undefined) {
        var items = require.context("../assets/icons/items", false, /\.png$/);
        return items("./" + itemName.toLowerCase() + ".png");
      }
    },
    startSimulation() {
      
      this.resetSimulation();
      this.gameStarted = true;
      this.playing = true;
      this.shelfs = document.getElementsByClassName("shelf");
      this.cell.width = Math.max(this.exit.clientWidth, this.exit.clientHeight);
      this.cell.height =
        this.size === 'LARGE'
          ? this.shelfs[0].clientHeight / 3.3
          : this.shelfs[0].clientHeight / 3;
      document.getElementById("itemImage").width = this.cell.width * 0.7;
      document.getElementById("itemImage").height = this.cell.width * 0.7;
      this.setRobotStartPosition();
      this.fillAnimations();
      console.log('animations pre' ,this.animations, this.challenge.stopAtAnimation)
      if (this.challenge) {
        this.currentAnimation = this.challenge.stopAtAnimation;


        
      }
      console.log('animations post' ,this.animations)
      this.startSearch();
    },
    robotPos() {
      return {
        x: parseInt(
          this.robot.style.left.substring(0, this.robot.style.left.length - 2)
        ),
        y: parseInt(
          this.robot.style.top.substring(0, this.robot.style.top.length - 2)
        ),
      };
    },
    setRobotStartPosition() {
      this.robot.style.top =
        document.getElementsByClassName("door-entry")[0].getBoundingClientRect()
          .top +
        2 +
        "px";
      this.robot.style.left =
        document.getElementsByClassName("door-entry")[0].getBoundingClientRect()
          .left +
        (this.size === 'MEDIUM' ? this.cell.width / 4 : 0) +
        2 +
        "px";
    },
    fastForward() {
      this.fastForward = !this.fastForward;
    },
    getPos(obj) {
      if (obj !== this.robot) {
        return {
          x: obj.getBoundingClientRect().x,
          y: obj.getBoundingClientRect().y,
        };
      } else {
        return {
          x: parseInt(obj.style.left.substring(0, obj.style.left.length - 2)),
          y: parseInt(obj.style.top.substring(0, obj.style.top.length - 2)),
        };
      }
    },
    checkCorrectColumn(shelf) {
      if (shelf.classList.contains("articles-left")) {
        return (
          Math.abs(
            this.robotPosPlanned.x +
            this.cell.width * 0.825 -
            this.getPos(shelf).x
          ) <   (this.size === 'LARGE' ? this.cell.width * 0.33 : this.cell.width * 0.1)
        );
      }
      if (shelf.classList.contains("articles-right")) {
        return (
          Math.abs(
            this.robotPosPlanned.x -
            this.cell.width * 1.175 -
            this.getPos(shelf).x
          ) <  this.cell.width * 0.33
        );
      }
    },
    addWalkingAnimation(delay, walk_x, walk_y) {
      const duration = walk_x
        ? ((Math.abs(walk_x) * 300) / this.walkingSpeed) *
        (this.size === 'MEDIUM' ? 1.2 : this.size === 'LARGE' ? 1.5 : 1)
        : ((Math.abs(walk_y) * 300) / this.walkingSpeed) *
        (this.size === 'MEDIUM' ? 1.2 : this.size === 'LARGE' ? 1.5 : 1);
      const step = walk_x
        ? "translateX(" + walk_x + "px)"
        : "translateY(" + walk_y + "px)";
      this.animations.push({
        animation: this.robot.animate([{ transform: step }], {
          duration: duration,
          delay: delay,
          
        }),
        walking: true,
          x: walk_x,
          y: walk_y,
      });
      this.robotPosPlanned.x += walk_x;
      this.robotPosPlanned.y += walk_y;
      this.plannedCoordinates.push({
        x: this.robotPosPlanned.x,
        y: this.robotPosPlanned.y,
      });
    },
    addFadingAnimation(fadeIn) {
      this.animations.push({
        animation: this.robot.animate(
          [fadeIn ? { opacity: 1 } : { opacity: 0 }],
          {
            duration:  1000,
            fill: "forwards",
          }
        ),
      });
      this.plannedCoordinates.push(null);
    },
    addFinishedRoundAnimation(nextItem) {
      this.animations.push({
        animation: this.robot.animate([{}], {
          duration: 0,
        }),
        finishedRound: true,
        nextItem: nextItem,
      });
      this.plannedCoordinates.push(null);
    },
    calculateWalkingDistance_x(shelf) {
      if (shelf.classList.contains("articles-left")) {
        return (
          this.getPos(shelf).x -
          this.robotPosPlanned.x -
          this.cell.width +
          (this.size !== 'LARGE'
            ? this.cell.width * 0.15
            : this.cell.width * 0.15)
        );
      }
      if (shelf.classList.contains("articles-right")) {
        return (
          this.getPos(shelf).x -
          this.robotPosPlanned.x +
          this.cell.width +
          (this.size !== 'LARGE'
            ? this.cell.width * 0.25
            : -this.cell.width * 0.15)
        );
      }
    },

    fillAnimations() {
      this.robotPosPlanned = this.robotPos();

      this.addFadingAnimation(true);
      if (this.algorithm === 6) {
        this.handleTSP();
      }
      while (
        this.shoppingList.length > 0 &&
        this.rounds < this.MAX_ROUNDS &&
        this.algorithm !== 6
      ) {
        this.rounds++;
        let foundTopItem = false;
        let restart = false;

        for (let i = 0; i < this.shelfs.length; i++) {
          if (this.shoppingList.length === 0) {
            break;
          }
          let index =
            this.shelfs[i].classList[2].substring(
              this.shelfs[i].classList[2].length - 1,
              this.shelfs[i].classList[2].length
            ) == "2"
              ? 1
              : 0;
          let currentItems = this.shelfData.filter(
            (s) => s.name.toLowerCase() === this.shelfs[i].classList[1]
          )[index].items;
          let categoryItems = [];
         
            categoryItems.push(
              ...this.allShelfs.filter(
                (s) => s.name.toLowerCase() === this.shelfs[i].classList[1]
              )[0].items
            );
            if (this.size === 'LARGE') {
              categoryItems.push(
                ...this.allShelfs.filter(
                  (s) => s.name.toLowerCase() === this.shelfs[i].classList[1]
                )[1].items
              );
            }
        
          if (
            this.algorithm !== 5 ||
            categoryItems.some((item) => this.shoppingList.indexOf(item) >= 0)
          ) {
            this.goToNextShelf(i);
            [foundTopItem, restart] = this.handleShelfSearch(
              i,
              foundTopItem,
              currentItems,
              categoryItems
            );
            console.log(foundTopItem, restart, )
            if (restart) break;
          }
        }

        if (this.endlessRoundStarter <= 0)
          this.endlessRoundStarter = this.animations.length;

        if (this.algorithm >= 4) this.rounds = this.MAX_ROUNDS;
      }

      //pay and leave
      if (this.algorithm < 4 && this.shoppingList.length !== 0) {
        this.repeatAnimations();
      }
      if (this.algorithm !== 6) {
        
          let walk_x, walk_y;
          walk_y =
            this.getPos(this.corridor).y -
            this.cell.height * 0.1 -
            this.robotPosPlanned.y;
          this.addWalkingAnimation(0, 0, walk_y);

          if (this.algorithm !== 1) {
            walk_x =
            this.getPos(this.checkout).x +
            (this.size === 'SMALL' ? this.cell.width * 0.2 : (-this.cell.width * 0.8)) -
            this.robotPosPlanned.x;
            this.addWalkingAnimation(0, walk_x, 0);
            if (this.size === 'SMALL') {
               walk_y =
            this.getPos(this.checkout).y +
            this.cell.height * 0.2 -
            this.robotPosPlanned.y;
          this.addWalkingAnimation(0, 0, walk_y);
            }
             walk_y =
            this.getPos(this.exit).y +
            this.cell.height * 0.2 -
            this.robotPosPlanned.y;
          this.addWalkingAnimation(500, 0, walk_y);
          } else {
            walk_y =
            this.getPos(this.exit).y +
            this.cell.height * 0.2 -
            this.robotPosPlanned.y;
          this.addWalkingAnimation(0, 0, walk_y);
          }
          


          
          walk_x =
            this.getPos(this.exit).x +
            (this.size === 'SMALL' ? this.cell.width * 0.2 : this.cell.width * 0.05) -
            this.robotPosPlanned.x;
          this.addWalkingAnimation(0, walk_x, 0);
        
      }

      this.addFadingAnimation(false);
      this.animations.push({
        exit: true,
        animation: this.currentItem.animate([{}], {
          duration: 0,
        }),
      });
     // this.plannedCoordinates.push(null);
      for (let u = 0; u < this.animations.length; u++) {
        this.animations[u].animation.pause();
        this.animations[u].animation.onfinish = () => {
          this.currentAnimation++;
          console.log(this.plannedCoordinates[u], u)
          if (this.plannedCoordinates[u]) {
            
            this.changeRobotPos(
              this.plannedCoordinates[u].x,
              this.plannedCoordinates[u].y
            );
          }
          if (u != this.animations.length - 1 && (!this.challenge || u !== this.challenge.stopAtAnimation)) {
            this.animations[u + 1].animation.play();
        
          }
          if (this.challenge && u === this.challenge.stopAtAnimation) {
            this.robot.style.opacity =1
            this.playPause()
            for (let i = 0; i < this.challenge.stopAtAnimation; i++) {
              if (this.animations[i].successful) {
                this.boughtItems.push(this.animations[i].itemName);
              }
              if (this.animations[i].finishedRound) {
                 this.currentItemName = this.animations[i].nextItem;
              }
            }
            
            
          }
            
          if (this.animations[u].type === "search") {
            this.currentItem.style.display = "none";
          }
          if (
            this.animations[u + 1].type &&
            this.animations[u + 1].type === "search"
          ) {
            this.currentItem.style.display = "block";
            let padding =
              this.size === 'SMALL'
                ? 0.13
                : this.size === 'MEDIUM'
                  ? 0.2
                  : 0.07;
            this.currentItem.style.top =
              this.getPos(this.animations[u + 1].shelf).y +
              this.animations[u + 1].cell *
              (this.size === 'LARGE'
                ? (this.cell.height / 3.3) * 2.5
                : this.cell.height) +
              this.cell.height * 0.07 +
              "px";
            this.currentItem.style.left =
              this.getPos(this.animations[u + 1].shelf).x +
              this.cell.width * padding +
              "px";
            let itemText = document.getElementById("itemText");
            const comp = 1729;
            let width = document.body.clientWidth;
            width = width > comp ? comp : width;

            
            if (this.size === 'SMALL') {
              itemText.style.top = 2.4/comp*width+"rem";
              itemText.style.left = 2/comp*width+"rem";
              itemText.style.fontSize = 3/comp*width+"rem";
            } else if (this.size === 'MEDIUM') {
              itemText.style.top = 2/comp*width+"rem";
              itemText.style.left = 1.6/comp*width+"rem";
              itemText.style.fontSize = 2.5/comp*width+"rem";
            } else {
              itemText.style.top = 1.2/comp*width+"rem";
              itemText.style.left = 1.1/comp*width+"rem";
              itemText.style.fontSize = 2.0/comp*width+"rem";
            }

            if (this.animations[u + 1].successful === true) {
              itemText.innerHTML = "✔️";
              this.boughtItems.push(this.animations[u + 1].itemName);
            } else {
              itemText.innerHTML = "&#10060;";
            }
          }
          if (this.animations[u + 1].finishedRound === true) {
            this.currentItemName = this.animations[u + 1].nextItem;
          }

          if (this.animations[u + 1].exit === true) {
            this.gameStarted = false;
            this.playing = false;
            this.finished = true;
            console.log('last')
            this.showContinue = true;
           //this.resetSimulation();
          }

           console.log(this.animations)
           let allStartPoints = document.getElementsByClassName('start-point');
           console.log(allStartPoints)
           if (this.animations[u+1].walking === true) {
            for (let point = 0; point < allStartPoints.length; point++) {
              if (this.getPos(allStartPoints[point])) {
                console.log((this.getPos(allStartPoints[point]).x - this.cell.width*0.5) , this.plannedCoordinates[u+1].x*0.91,this.plannedCoordinates[u+1].x*1.09)
                console.log((this.getPos(allStartPoints[point]).y - this.cell.height*0.5) , this.plannedCoordinates[u+1].y*0.91,this.plannedCoordinates[u+1].y*1.09)
                const minX = (this.getPos(allStartPoints[point]).x - this.cell.width*0.5) > this.plannedCoordinates[u+1].x*0.91
                const maxX = (this.getPos(allStartPoints[point]).x - this.cell.width*0.5) < this.plannedCoordinates[u+1].x*1.09
                const minY = (this.getPos(allStartPoints[point]).y - this.cell.height*0.5) > this.plannedCoordinates[u+1].y*0.91
                const maxY = (this.getPos(allStartPoints[point]).y - this.cell.height*0.5) < this.plannedCoordinates[u+1].y*1.09
                console.log(minX, maxX, minY, maxY)
                if (minX && maxX && minY && maxY) {
                  console.log('at start point')
                  let itemName = allStartPoints[point].classList[0].slice(0,allStartPoints[point].classList[0].length-12)
                  console.log(itemName)
                  this.boughtItems.push(itemName)
                }
              }
            
            }
          }

          if (this.animations[u].allPaths !== null &&this.animations[u].allPaths !== undefined &&this.animations[u].allPaths.length > 0) {
            let targetPoints = document.getElementsByClassName("target-point");
            for (let t = 0; t < targetPoints.length; t++) {
              targetPoints[t].innerHTML = "";
            }

            for (let i = 0; i < this.animations[u].allPaths.length; i++) {
              for (
                let m = 0;
                m < this.animations[u].allPaths[i].path.length;
                m++
              ) {
                if (
                  this.checkIsInShortest(this.animations[u].allPaths[i].path[m])
                ) {
                  this.animations[u].allPaths[i].path[
                    m
                  ].children[0].style.backgroundColor = "#33ccff";
                  this.animations[u].allPaths[i].path[
                    m
                  ].children[0].style.zIndex = 1;
                } else {
                  this.animations[u].allPaths[i].path[m].style.display = "none";
                }
              }
            }
          }

          if (this.animations[u + 1].allPaths && this.animations[u + 1].allPaths.length > 0) {
            for (let i = 0; i < this.animations[u + 1].allPaths.length; i++) {
              for (
                let m = 0;
                m < this.animations[u + 1].allPaths[i].path.length;
                m++
              ) {
                this.animations[u + 1].allPaths[i].path[
                  m
                ].children[0].style.backgroundColor = this.getColor(
                  (1 / this.animations[u + 1].allPaths.length) * i
                );

                this.animations[u + 1].allPaths[i].path[m].style.display =
                  "block";
                this.animations[u + 1].allPaths[i].path[
                  m
                ].children[0].style.zIndex = 12 - i;
                //add target point between items
                if (this.animations[u + 1].allPaths[i].to !== "checkout") {
                  const searchFor =
                    this.animations[u + 1].allPaths[i].path[m].classList[0] +
                    " target-point";

                  let point = document.getElementsByClassName(searchFor)[0];
           
                  if (point) {
                     point.style.zIndex = 13;
                  point.innerHTML =
                    "<div style='font-size: 2.6rem; margin-top:-1.5rem; margin-left:-0.87rem;'>&#9679;</div>";
                  }
                 
                }
              }
              if (this.animations[u + 1].allPaths[i].from !== "robot") {
                let searchFor =
                  this.animations[u + 1].allPaths[i].from + "-start-point";
                let point = document.getElementsByClassName(searchFor)[0];
                if (point) {
                   point.style.zIndex = 13;
                point.innerHTML =
                  "<div style='font-size: 2.6rem; margin-top:-1.5rem; margin-left:-0.87rem; color:blue'>&#9679;</div>";
                }
               
              }
            }
          }
         
        
           if (this.animations[u + 1].endlessLoop === true) {
            this.animations[this.endlessRoundStarter].animation.play();
            this.showContinue = true;
            this.animations[u + 1].animation.pause();
          }
          
        };
      }
    },
    checkIsInShortest(path) {
      for (let i = 0; i < this.shortestPathGreedy.length; i++) {
        if (this.shortestPathGreedy[i].children[0].parentNode === path)
          return true;
      }
      return false;
    },
    getColor(value) {
      //value from 0 to 1
      var hue = ((1 - value) * 120).toString(10);
      return ["hsl(", hue, ",100%,50%)"].join("");
    },
    totalWidth(path) {
      let length = 0;

      for (let i = 0; i < path.length; i++) {
        length += parseInt(
          path[i].children[0].style.width.substring(
            0,
            path[i].children[0].style.width.length - 2
          )
        );

        if (
          parseInt(
            path[i].children[0].style.width.substring(
              0,
              path[i].children[0].style.width.length - 2
            )
          ) === 0
        ) {
        }
      }
      return length;
    },
    handleTSP() {
      let items = this.showItems();
      let locations = [];
      locations.push(...items, this.checkout);

      let x1, y1, x2, y2, from, to;
      let allPaths = [];
      const shortestFound = [];

      //handle robot to items
      for (let x = 0; x < items.length; x++) {
        let lines = [];
        x1 = this.robotPosPlanned.x + this.cell.width * 0.35;
        y1 = this.robotPosPlanned.y + this.cell.height * 0.35;
        from = "robot";

        //check robot correct column already

        if (this.checkCorrectColumn(items[x].shelf)) {
          x2 = x1;
          y2 = this.getPos(items[x].item).y + this.cell.height / 2;
          to = this.shoppingList[x];
          let line = this.linedraw(x1, y1, x2, y2);
          line.classList.add(from + "-" + to);
          line.classList.add("line-outer");
          line.style.display = "none";
          lines.push(line);
        } else {
          //get nearest horizontal corridor
          y2 = this.getNearestCorridorHeight(this.robot, items[x]);
          x2 = x1;
          to = this.shoppingList[x];
          let line1 = this.linedraw(x1, y1, x2, y2);
          line1.classList.add(from + "-" + to);
          line1.classList.add("line-outer");
          line1.style.display = "none";
          lines.push(line1);
          //line from corridor to item x pos
          x1 = x2;
          y1 = y2;

          x2 =
            items[x].location === "articles-left"
              ? this.getPos(items[x].item).x - this.cell.width / 2.2
              : this.getPos(items[x].item).x + this.cell.width * 1.2;
          let line2 = this.linedraw(x1, y1, x2, y2);
          line2.classList.add(from + "-" + to);
          line2.classList.add("line-outer");
          line2.style.display = "none";
          lines.push(line2);
          //from corridor to item pos y
          x1 = x2;
          y1 = y2;
          y2 = this.getPos(items[x].item).y + this.cell.height / 2;
          let line3 = this.linedraw(x1, y1, x2, y2);
          line3.classList.add(from + "-" + to);
          line3.classList.add("line-outer");
          line3.style.display = "none";
          lines.push(line3);
        }

        let targetPoint = document
          .getElementsByClassName("supermarket-container")[0]
          .appendChild(document.createElement("div"));

        targetPoint.classList.add(from + "-" + to);
        targetPoint.classList.add("target-point");
        targetPoint.style.position = "absolute";
        targetPoint.style.left = x2 + "px";
        targetPoint.style.top = y2 + "px";

        allPaths.push({
          from: from,
          to: to,
          path: lines,
          length: this.totalWidth(lines),
        });
      }

      allPaths.sort((a, b) => a.length - b.length);

      this.shortestPathGreedy.push(...allPaths[0].path);
      shortestFound.push(allPaths[0].to);

      this.addShowItemLineAnimation(allPaths);

      let finishedSearch = false;
      while (!finishedSearch) {
        let i = 0;
        for (let item in items) {
          if (
            items[item].itemName === shortestFound[shortestFound.length - 1]
          ) {
            break;
          } else {
            i++;
          }
        }

        x1 =
          items[i].location === "articles-left"
            ? this.getPos(items[i].item).x - this.cell.width / 2.2
            : this.getPos(items[i].item).x + this.cell.width * 1.2;
        y1 = this.getPos(items[i].item).y + this.cell.height / 2;
        x2, y2;
        from = items[i].itemName;

        allPaths = [];
        let startPoint = document
          .getElementsByClassName("supermarket-container")[0]
          .appendChild(document.createElement("div"));
        startPoint.classList.add(from + "-start-point");
        startPoint.classList.add("start-point");
        startPoint.style.position = "absolute";
        startPoint.style.left = x1 + "px";
        startPoint.style.top = y1 + "px";
        for (let u = 0; u < locations.length; u++) {
          let lines = [];

          x1 =
            items[i].location === "articles-left"
              ? this.getPos(items[i].item).x - this.cell.width / 2.2
              : this.getPos(items[i].item).x + this.cell.width * 1.2;
          y1 = this.getPos(items[i].item).y + this.cell.height / 2;
          x2, y2;
          from = items[i].itemName;

          //

          if (
            locations[u].item &&
            locations[u].itemName !== items[i].itemName &&
            shortestFound.indexOf(locations[u].itemName) === -1
          ) {
            to = locations[u].itemName;

            //check if items in same column
            let expectedX =
              locations[u].location === "articles-left"
                ? this.getPos(locations[u].item).x - this.cell.width / 2.2
                : this.getPos(locations[u].item).x + this.cell.width * 1.2;

            if (Math.abs(x1 - expectedX) < 20) {
              x2 = x1;
              y2 = this.getPos(locations[u].item).y + this.cell.height / 2;

              let line = this.linedraw(x1, y1, x2, y2);
              line.classList.add(from + "-" + to);
              line.classList.add("line-outer");
              line.style.display = "none";
              lines.push(line);
            } else if (this.checkSameSector(items[i], locations[u].item)) {
              //handle same sector logic
               y2 = y1
                 x2 =
                locations[u].location === "articles-left"
                  ? this.getPos(locations[u].item).x - this.cell.width / 2.2
                  : this.getPos(locations[u].item).x + this.cell.width * 1.2;
              let line2 = this.linedraw(x1, y1, x2, y2);
             
              line2.classList.add(from + "-" + to);
              line2.classList.add("line-outer");
              line2.style.display = "none";
              lines.push(line2);
              //from corridor to item pos y

              x1 = x2;
              y1 = y2;
              y2 = this.getPos(locations[u].item).y + this.cell.height / 2;
              let line3 = this.linedraw(x1, y1, x2, y2);

              line3.classList.add(from + "-" + to);
              line3.classList.add("line-outer");
              line3.style.display = "none";
              lines.push(line3);


            } else {
              //need to get out of corridor
              //get nearest horizontal corridor
              y2 = this.getNearestCorridorHeight(items[i], locations[u].item);
              x2 = x1;
              let line1 = this.linedraw(x1, y1, x2, y2);

              line1.classList.add(from + "-" + to);
              line1.classList.add("line-outer");
              line1.style.display = "none";
              lines.push(line1);
              //line from corridor to item x pos

              x1 = x2;
              y1 = y2;
              x2 =
                locations[u].location === "articles-left"
                  ? this.getPos(locations[u].item).x - this.cell.width / 2.2
                  : this.getPos(locations[u].item).x + this.cell.width * 1.2;
              let line2 = this.linedraw(x1, y1, x2, y2);
             
              line2.classList.add(from + "-" + to);
              line2.classList.add("line-outer");
              line2.style.display = "none";
              lines.push(line2);
              //from corridor to item pos y

              x1 = x2;
              y1 = y2;
              y2 = this.getPos(locations[u].item).y + this.cell.height / 2;
              let line3 = this.linedraw(x1, y1, x2, y2);

              line3.classList.add(from + "-" + to);
              line3.classList.add("line-outer");
              line3.style.display = "none";
              lines.push(line3);
            }
            let targetPoint = document
              .getElementsByClassName("supermarket-container")[0]
              .appendChild(document.createElement("div"));

            targetPoint.classList.add(from + "-" + to);
            targetPoint.classList.add("target-point");
            targetPoint.style.position = "absolute";
            targetPoint.style.left = x2 + "px";
            targetPoint.style.top = y2 + "px";

            allPaths.push({
              from: from,
              to: to,
              path: lines,
              length: this.totalWidth(lines),
            });
          }
        }

        allPaths.sort((a, b) => a.length - b.length);
        console.log(allPaths)
        if (allPaths.length > 0) {
          this.shortestPathGreedy.push(...allPaths[0].path);

          shortestFound.push(allPaths[0].to);
          this.addShowItemLineAnimation(allPaths);
        }
        if (shortestFound.length === items.length) finishedSearch = true;
      }
      let startPointLast = document
        .getElementsByClassName("supermarket-container")[0]
        .appendChild(document.createElement("div"));
      startPointLast.classList.add(
        shortestFound[shortestFound.length - 1] + "-start-point"
      );
      startPointLast.classList.add("start-point");
      startPointLast.style.position = "absolute";
      startPointLast.style.left = x2 + "px";
      startPointLast.style.top = y2 + "px";

      //path from last item to register
      y1 = y2;
      x1 = x2;
      let lines = [];
      allPaths = [];

      from = shortestFound[shortestFound.length - 1];
      to = "checkout";
      //get nearest horizontal corridor
      y2 = this.getNearestCorridorHeight(null, this.checkout);
      x2 = x1;
      let line1 = this.linedraw(x1, y1, x2, y2);

      line1.classList.add(from + "-" + to);
      line1.classList.add("line-outer");
      line1.style.display = "none";
      lines.push(line1);
      //line from corridor to item x pos
      x1 = x2;
      y1 = y2;
      x2 = this.getPos(this.checkout).x + this.checkout.clientWidth / 2;
      let line2 = this.linedraw(x1, y1, x2, y2);

      line2.classList.add(from + "-" + to);
      line2.classList.add("line-outer");
      line2.style.display = "none";
      lines.push(line2);
      //from corridor to item pos y

      x1 = x2;
      y1 = y2;
      y2 = this.getPos(this.checkout).y + this.cell.height / 2;
      let line3 = this.linedraw(x1, y1, x2, y2);

      line3.classList.add(from + "-" + to);
      line3.classList.add("line-outer");
      line3.style.display = "none";
      lines.push(line3);
      allPaths.push({
        from: shortestFound[shortestFound.length - 1],
        to: "checkout",
        path: lines,
        length: this.totalWidth(lines),
      });
      this.addShowItemLineAnimation(allPaths);
      shortestFound.push("checkout");
      this.shortestPathGreedy.push(...allPaths[0].path);
      //from checkout to door
      x1 = x2;
      y1 = y2;
      lines = [];
      allPaths = [];
      let line4, line5;
      if (this.size === 'SMALL') {
        x2 = this.getPos(this.exit).x + this.cell.width * 0.5;
        line4 = this.linedraw(x1, y1, x2, y1);
        line5 = this.linedraw(x2, y1, x2, y1);
      } else {
        y2 = this.getPos(this.exit).y;
        line4 = this.linedraw(x1, y1, x1, y2);
        line5 = this.linedraw(x1, y2, x1, y2);
      }

      line4.classList.add("checkout" + "-" + "exit-last");
      line4.classList.add("line-outer");
      line4.style.display = "none";
      lines.push(line4);

      line5.classList.add("checkout" + "-" + "exit-last");
      line5.classList.add("line-outer");
      line5.style.display = "none";
      lines.push(line5);

      allPaths.push({
        from: "checkout",
        to: "exit",
        path: lines,
        length: this.totalWidth(lines),
      });
      this.shortestPathGreedy.push(...allPaths[0].path);
      this.addShowItemLineAnimation(allPaths);

      //start walking

      for (let i = 0; i < this.shortestPathGreedy.length - 1; i++) {
        let line = this.shortestPathGreedy[i + 1].children[0];
        let x =
          parseInt(line.style.left.substring(0, line.style.left.length - 2)) -
          this.cell.width / 2;
        let y =
          parseInt(line.style.top.substring(0, line.style.top.length - 2)) -
          this.cell.height / 2;

        let walk_y = y - (this.robotPosPlanned.y + this.robot.clientHeight / 2);
        let walk_x = x - (this.robotPosPlanned.x + this.robot.clientWidth / 2);
        if (Math.abs(walk_y) < Math.abs(walk_x)) {
          walk_y = 0;
        } else {
          walk_x = 0;
        }
        console.log(walk_y, walk_x)
        this.addWalkingAnimation(300, walk_x, walk_y);
      }
    },
    checkSameSector(from, to) {
      //check if 2 items are both below the middle or both above the middle and their x distance is below 2 cell widths
      console.log(from, to)
     let to_x = this.getPos(to).x;
      let distanceRight = (to_x - from.xCoord)
      let distanceLeft = (from.xCoord -to_x)
     let minDistance = this.size === 'LARGE' ? this.cell.width*2.03  : this.cell.width*2.03  
     let maxDistance = this.size === 'LARGE' ?  this.cell.width*2.97 : this.cell.width*3.5
      if ((from.location === 'articles-left' && distanceLeft > minDistance && distanceLeft < maxDistance) ||
          (from.location === 'articles-right' && distanceRight > minDistance && distanceRight < maxDistance)) {
            return true;
          } 
      return false;
    },
    addShowItemLineAnimation(allPaths, isShortest) {
      this.animations.push({
        allPaths: allPaths,
        isShortest: isShortest,

        animation: this.exit.animate([{}], {
          duration:  800,
        }),
      });
      this.plannedCoordinates.push(null);
    },
    getNearestCorridorHeight(from, to) {
      const allCorridors = document.getElementsByClassName("corridor");
      if (to === this.checkout || this.size !== 'LARGE') {
        return this.getPos(allCorridors[0]).y + this.cell.height / 2;
      }
      let y_to = to.yCoord ? to.yCoord : this.getPos(to).y;
      let y_from = from.yCoord ? from.yCoord : this.getPos(from).y;
      console.log(from, to, y_to, y_from)
      
      
      
      let smallest = 10000;
      let nearest;
      for (let i = 0; i < allCorridors.length; i++) {
        let distanceTo = Math.abs(
          y_to - this.getPos(allCorridors[i]).y
        );
        let distanceFrom = Math.abs(
          y_from - this.getPos(allCorridors[i]).y
        );

        if ((distanceTo + distanceFrom) < smallest) {
          smallest = (distanceTo + distanceFrom);
          nearest = allCorridors[i];
        }
      }

      return this.getPos(nearest).y + this.cell.height / 2;
    },
    linedraw(x1, y1, x2, y2) {
      var degree; var m; var lineLength;
      if (x2 < x1) {
      
        lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        m = (y2 - y1) / (x2 - x1);
       degree = 180
      } else {
        lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        m = (y2 - y1) / (x2 - x1);
        degree = (Math.atan(m) * 180) / Math.PI;
      }

     

      let line = document
        .getElementsByClassName("supermarket-container")[0]
        .appendChild(document.createElement("div"));
      line.innerHTML =
        "<div class='line' style='transform-origin: top left; z-index: 5;   transform: rotate(" +
        degree +
        "deg); width: " +
        lineLength +
        "px; height: 1.5px; border: solid 0.5px; background: red; display: block; position: absolute; top: " +
        y1 +
        "px; left: " +
        x1 +
        "px;'></div>";

      return line;
    },
    showItems() {
      let res = [];
      for (let i = 0; i < this.shoppingList.length; i++) {
        let category;
        let prevcategory;
        let index = -1;
        let itemPosition;
        for (let u = 0; u < this.shelfData.length; u++) {
          if (this.shelfData[u].items.indexOf(this.shoppingList[i]) >= 0) {
            category = this.shelfData[u].name;
            index = 0;
            itemPosition = this.shelfData[u].items.indexOf(
              this.shoppingList[i]
            );
            if (prevcategory === category) index = 1;
          }
          prevcategory = this.shelfData[u].name;
        }

        let shelf = document.getElementsByClassName(category.toLowerCase())[index];
        
        let item = document.createElement("img");
        item.classList.add(this.shoppingList[i]);
        item.classList.add("algorithm-six-item");
        item.src = this.getItemUrl(this.shoppingList[i]);
        item.style.position = "absolute";
        item.style.zIndex = 4;
        item.width = this.cell.width * 0.7;
        item.height = this.cell.width * 0.7;
        let padding =
          this.size === 'SMALL' ? 0.13 : this.size === 'MEDIUM' ? 0.2 : 0.07;
        let yCoord =
          this.getPos(shelf).y +
          itemPosition *
          (this.size === 'LARGE'
            ? (this.cell.height / 3.3) * 2.5
            : this.cell.height) +
          this.cell.height * 0.07;
        let xCoord = this.getPos(shelf).x + this.cell.width * padding;
        item.style.top = yCoord + "px";

        item.style.left = xCoord + "px";
        document
          .getElementsByClassName("supermarket-container")[0]
          .appendChild(item);
        res.push({
          item: item,
          itemName: this.shoppingList[i],
          location: shelf.classList[shelf.classList.length - 2],
          shelf: shelf,
          xCoord: xCoord,
          yCoord: yCoord,
        });
      }
      return res;
    },
    goToNextShelf(nextShelf) {
      let walk_x = 0,
        walk_y = 0;
      if (this.checkCorrectColumn(this.shelfs[nextShelf])) {
        console.log('correct shelf')
        walk_y = this.getPos(this.shelfs[nextShelf]).y - this.robotPosPlanned.y;

        this.addWalkingAnimation(0, 0, walk_y);
      } else {
        walk_y =
          this.getPos(this.corridor).y -
          this.cell.height * 0.1 -
          this.robotPosPlanned.y +
          (this.size == 'LARGE' ? this.cell.height * 0.2 : 0);
        this.addWalkingAnimation(0, 0, walk_y);
        walk_x = this.calculateWalkingDistance_x(this.shelfs[nextShelf]);
        this.addWalkingAnimation(0, walk_x, 0);
        walk_y = this.getPos(this.shelfs[nextShelf]).y - this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
      }
    },
    handleShelfSearch(currentShelf, foundTopItem, items, categoryItems) {
      const shelfCells = this.size === 'LARGE' ? 4 : 3;

      switch (this.algorithm) {
        case 1:
        case 2:
        case 3:
          this.addFinishedRoundAnimation(this.shoppingList[0]);
          for (let i = 0; i < shelfCells; i++) {
            if (items[i] === this.shoppingList[0]) {
              this.addSearchAnimation(
                this.shoppingList[0],
                true,
                this.shelfs[currentShelf],
                i
              );
              this.rounds = 0;
              foundTopItem = true;
              if (this.algorithm === 3) {
                this.shoppingList.splice(0, 1);
                this.addFinishedRoundAnimation(this.shoppingList[0]);
                return [foundTopItem, true];
              }
            } else {
              this.addSearchAnimation(
                this.shoppingList[0],
                false,
                this.shelfs[currentShelf],
                i
              );
            }
            if (i + 1 !== shelfCells) {
              this.addWalkingAnimation(
                0,
                0,
                this.shelfs[currentShelf].clientHeight / shelfCells
              );
            } else if (
              foundTopItem &&
              currentShelf === this.shelfs.length - 1
            ) {
              this.shoppingList.splice(0, 1);
              this.addFinishedRoundAnimation(this.shoppingList[0]);
            }
          }
          return [foundTopItem, false];

        case 4:
        this.addFinishedRoundAnimation(this.shoppingList[0]);
          for (let i = 0; i < shelfCells; i++) {
            if (this.shoppingList.length === 0) break;
            for (let u = 0; u < this.shoppingList.length; u++) {
              if (items[i] === this.shoppingList[u]) {
                this.addSearchAnimation(
                  this.shoppingList[u % this.shoppingList.length],
                  true,
                  this.shelfs[currentShelf],
                  i
                );
                this.rounds = 0;
                foundTopItem = true;

                this.addFinishedRoundAnimation(
                  this.shoppingList[(u + 1) % this.shoppingList.length]
                );
                this.shoppingList.splice(u, 1);

                break;
              } else {
                this.addSearchAnimation(
                  this.shoppingList[u % this.shoppingList.length],
                  false,
                  this.shelfs[currentShelf],
                  i
                );
              }
              this.addFinishedRoundAnimation(
                this.shoppingList[(u + 1) % this.shoppingList.length]
              );
            }

            if (i + 1 !== shelfCells && this.shoppingList.length > 0) {
              this.addWalkingAnimation(
                0,
                0,
                this.shelfs[currentShelf].clientHeight / shelfCells
              );
            }
          }
          return [foundTopItem, false];

          break;
        case 5:
          let shoppingListPartial = this.shoppingList.filter(
            (item) => categoryItems.indexOf(item) >= 0
          );

          this.addFinishedRoundAnimation(shoppingListPartial[0]);

          for (let i = 0; i < shelfCells; i++) {
            if (shoppingListPartial.length === 0) break;
            for (let u = 0; u < shoppingListPartial.length; u++) {
              if (items[i] === shoppingListPartial[u]) {
                this.addSearchAnimation(
                  shoppingListPartial[u % shoppingListPartial.length],
                  true,
                  this.shelfs[currentShelf],
                  i
                );
                this.rounds = 0;
                foundTopItem = true;
                if (shoppingListPartial.length > 0) {
                  this.addFinishedRoundAnimation(
                    shoppingListPartial[(u + 1) % shoppingListPartial.length]
                  );
                } else {
                }

                this.shoppingList.splice(
                  this.shoppingList.indexOf(shoppingListPartial[u]),
                  1
                );
                shoppingListPartial.splice(u, 1);

                break;
              } else {
                this.addSearchAnimation(
                  shoppingListPartial[u % shoppingListPartial.length],
                  false,
                  this.shelfs[currentShelf],
                  i
                );
              }
              this.addFinishedRoundAnimation(
                shoppingListPartial[(u + 1) % shoppingListPartial.length]
              );
            }

            if (i + 1 !== shelfCells && shoppingListPartial.length > 0) {
              this.addWalkingAnimation(
                0,
                0,
                this.shelfs[currentShelf].clientHeight / shelfCells
              );
            }
          }
          return [foundTopItem, false];
          break;
        case 6:
          break;
      }
    },
    addSearchAnimation(itemName, successful, shelf, cell) {
      this.animations.push({
        type: "search",
        itemName: itemName,
        successful: successful,
        shelf: shelf,
        cell: cell,
        animation: this.currentItem.animate([{}], {
          duration:  successful ? 1000 : 500,
        }),
      });
      this.plannedCoordinates.push(null);
    },

    changeRobotPos(x, y) {
      // console.log(this.robot.style.top, this.robot.style.left, x, y);
      this.robot.style.top = y + "px";
      this.robot.style.left = x + "px";
      //   console.log(this.robot.style.top, this.robot.style.left);
    },
    startSearch() {
      this.animations[this.currentAnimation].animation.play();
    },
    repeatAnimations() {
      this.animations.push({
        endlessLoop: true,
        animation: this.currentItem.animate([{}], {
          duration: 0,
        }),
      });
    },
  },
};
</script>

<style scoped>
.robot {
  position: absolute;
  text-align: left;
  opacity: 0;
}




.supermarket-container {
  display: block;
  text-align: left;
}

.door-entry {
  grid-area: i;
  background: url("../assets/images/door.png");
  background-repeat: no-repeat;
  background-size: contain;
}
.door-exit {
  background-color: brown;
  background: url("../assets/images/door.png");
  background-repeat: no-repeat;
  background-size: contain;
  grid-area: e;
}
.vegetables {
  background-color: #66ff66;
  grid-area: v;
}

.vegetables:after,
.vegetables2:after {
  content: var(--vegetables);
}

.vegetables2 {
  background-color: #66ff66;
  grid-area: h;
}

.fruits {
  background-color: #00cc00;
  grid-area: f;
}

.fruits:after,
.fruits2:after {
  content: var(--fruits);
}

.fruits2 {
  background-color: #00cc00;
  grid-area: j;
}
.freezer {
  background-color: #33ccff;
  grid-area: g;
}
.freezer2 {
  background-color: #33ccff;
  grid-area: a;
}
.freezer:after,
.freezer2:after {
  content: var(--freezer);
}

.cooler {
  background-color: lightblue;
  grid-area: c;
}
.cooler2 {
  background-color: lightblue;
  grid-area: b;
}
.cooler:after,
.cooler2:after {
  content: var(--cooler);
}
.meat {
  background-color: #ff6666;
  grid-area: m;
}
.meat2 {
  background-color: #ff6666;
  grid-area: n;
}
.meat:after,
.meat2:after {
  content: var(--meat);
}
.sweets {
  background-color: #b35900;
  grid-area: s;
}
.sweets2 {
  background-color: #b35900;
  grid-area: r;
}
.sweets:after,
.sweets2:after {
  content: var(--sweets);
}
.cleaning {
  background-color: pink;
  grid-area: l;
}
.cleaning2 {
  background-color: pink;
  grid-area: o;
}
.cleaning:after,
.cleaning2:after {
  content: var(--cleaning);
}
.drinks {
  background-color: violet;
  grid-area: d;
}
.drinks2 {
  background-color: violet;
  grid-area: k;
}
.drinks:after,
.drinks2:after {
  content: var(--drinks);
}


.checkout {
  background-color: gold;
  grid-area: p;
  border-radius: 12px;
}
.checkout:after {
  content: '$';
}

.start {
  grid-area: x;
  background-color: brown;
}
.special {
  background-color: brown;
}
.shelf {
  border-radius: 12px;

  writing-mode: vertical-lr;

  z-index: 1;
  text-orientation: mixed;
  text-align: center;
  color: #2c3e50;
}

.text-small {
  padding-left: 0.8rem;
  font-size: 1.9rem;
}
.text-medium {
  padding-left: 0.8rem;
  font-size: 1.7rem;
  
}
.text-large {
  padding-left: 0.5rem;
  font-size: 1.3rem;
}
.text-small-checkout {
  padding-left: 2.45rem;
  font-size: 1.9rem;
}
.text-medium-checkout {
  padding-left: 1.0rem;
  padding-top: 1.5rem;
  font-size: 1.7rem;
  
}
.text-large-checkout {
  padding-left: 0.3rem;
  padding-top: 0.85rem;
  font-size: 1.3rem;
}
.articles-right {
  transform: rotate(180deg);
}

.corridor1 {
  grid-area: q;
}

.corridor2 {
  grid-area: z;
}

.corridor3 {
  grid-area: y;
}

.supermarket {
  background-color: grey;
  text-align: left;
  grid-template-rows: auto;
  display: grid;
  grid-auto-rows: 1fr;
  width: 960px;
  height: 620px;
}
@media (min-width: 1700px) {
  .supermarket{
    width: 1056px;
     height: 650px;
  }   
  .text-small {
  padding-left: 0.8rem;
  font-size: 1.8rem;
}
.text-medium {
  padding-left: 0.8rem;
  font-size: 1.5rem;
}
.text-large {
  padding-left: 0.5rem;
  font-size: 1.2rem;
}
.text-small-checkout {
  padding-left: 2.75rem;
  font-size: 1.9rem;
}
.text-medium-checkout {
  padding-left: 1.1rem;
  padding-top: 1.5rem;
  font-size: 1.7rem;
  
}
.text-large-checkout {
  padding-left: 0.3rem;
  padding-top: 0.85rem;
  font-size: 1.3rem;
}
};
@media (max-width: 1500px) {
  .supermarket{
    width: 768px;
     height: 496px;
  }   
  .text-small {
  padding-left: 0.8rem;
  font-size: 1.8rem;
}
.text-medium {
  padding-left: 0.8rem;
  font-size: 1.5rem;
}
.text-large {
  padding-left: 0.5rem;
  font-size: 1.2rem;
}
.text-small-checkout {
  padding-left: 2.15rem;
  font-size: 1.7rem;
}
.text-medium-checkout {
  padding-left: 0.7rem;
  padding-top: 1.1rem;
  font-size: 1.7rem;
  
}
.text-large-checkout {
  padding-left: 0.2rem;
  padding-top: 0.65rem;
  font-size: 1.3rem;
}
};
@media (max-width: 1200px) {
  .supermarket{
    width: 640px;
     height: 410px;
  }   
  .text-small {
  padding-left: 0.8rem;
  font-size: 1.7rem;
}
.text-medium {
  padding-left: 0.8rem;
  font-size: 1.4rem;
}
.text-large {
  padding-left: 0.5rem;
  font-size: 1.1rem;
}
.text-small-checkout {
  padding-left: 1.65rem;
  font-size: 1.55rem;
}
.text-medium-checkout {
  padding-left: 0.5rem;
  padding-top: 0.8rem;
  font-size: 1.7rem;
  
}
.text-large-checkout {
  padding-left: 0.13rem;
  padding-top: 0.45rem;
  font-size: 1.3rem;
}
};
@media (max-width: 1100px) {
  .supermarket{
    width: 570px;
     height: 390px;
  }   
  .text-small-checkout {
  padding-left: 1.45rem;
  font-size: 1.35rem;
}
.text-medium-checkout {
  padding-left: 0.4rem;
  padding-top: 0.7rem;
  font-size: 1.7rem;
  
}
.text-large-checkout {
  padding-left: 0.13rem;
  padding-top: 0.45rem;
  font-size: 1.3rem;
}
};

@media (max-width: 1000px) {
  .supermarket{
    width: 528px;
     height: 341px;
  }  
    .text-small-checkout {
  padding-left: 1.35rem;
  font-size: 1.25rem;
}
.text-medium-checkout {
  padding-left: 0.4rem;
  padding-top: 0.7rem;
  font-size: 1.5rem;
  
}
.text-large-checkout {
  padding-left: 0.05rem;
  padding-top: 0.35rem;
  font-size: 1.0rem;
} 
  .text-small {
  padding-left: 0.8rem;
  font-size: 1.35rem;
}
.text-medium {
  padding-left: 0.6rem;
  font-size: 1.2rem;
}
.text-large {
  padding-left: 0.2rem;
  font-size: 0.9rem;
}

};

.current-item {
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 0px;
  font-size: 2.7rem;
  z-index: 2;
}

#itemImageOuter {
  position: absolute;
}
#itemText {
  position: absolute;
  top: 1.7rem;
  left: 1.7rem;
}

#itemImage {
  position: absolute;
}


.small {
  grid-template-columns: repeat(48, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i i i i i i . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . e e e e e e"
    "i i i i i i . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . e e e e e e"
    "i i i i i i . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e e e e e e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q"
    "q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . ."
    ". . . . . . v v v v v v f f f f f f . . . . . . . . . . . . c c c c c c g g g g g g . . . . . .";
}
.medium {
  grid-template-columns: repeat(42, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i i i i . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i i i i . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i i i i . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i i i i . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i i i i . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . p p"
    "q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q p p"
    "q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q p p"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . p p"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . e e e e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . e e e e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . e e e e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . e e e e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . e e e e";
}
.large {
  grid-template-columns: repeat(49, 1fr);
  grid-template-areas:
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i i i z . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i i i . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i i i . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    ". . . c c c g g g . . . . . . a a a b b b . . . . . . d d d m m m . . . . . . n n n s s s . . . ."
    "q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q q p"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . p"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . f f f v v v . . . . . . h h h j j j . . . . . . k k k l l l . . . . . . o o o r r r . . . ."
    ". . . y . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e e e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e e e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e e e";
}
.door {
  position: relative;
  top: 0px;
  left: 0px;
}
</style>
