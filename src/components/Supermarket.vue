<template>
  <div class="supermarket-container">
      

      
   
        <img v-show="gameStarted"
            class="robot"
            ref="robot"
            src="../assets/images/robot-3.png"
            alt="r"
            :style="{ width: robotWidth + 'px' }"
        />
        
      
    <div v-if="size === 'small'" class="supermarket small" ref="supermarket">
      <div class="door-entry" ref="door"></div>
      <div class="door-exit"></div>
      <div class="shelf vegetables articles-left"></div>
      <div class="shelf fruits articles-right" ></div>
      <div class="shelf frozen articles-left"></div>
      <div class="shelf cooler articles-right"></div>
      <div class="checkout"></div>
      <div class="corridor" ref="corridor"></div>
    </div>

    <div v-else-if="size === 'medium'" class="supermarket medium" />
    <div v-else class="supermarket large" />
    <ButtonNavigation
      :story="false"
      :playing="playing"
      :fastForwarding="fastForwarding"
      @handleClickPlayPause="playPause()"
      @handleClickRestart="startGame()"
      @handleClickFastForward="fastForward()"
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import Door from "../components/supermarket-components/Door.vue";
import ButtonNavigation from "../components/ButtonNavigation.vue";
import { onMounted } from "@vue/runtime-core";
export default {
  props: ["size", 'algorithm'],
  components: { Door, ButtonNavigation },
  setup() {
    const supermarket = ref(null);
    const corridor = ref(null);
    const playing = ref(false);
    const fastForwarding = ref(false);
    const gameStarted = ref(false);
    const robotWidth = ref(0);
    const door = ref(null);
    const robot = ref(null);
    const shelfs = [];
    const cell = {
      height: 0,
      width: 0,
    }
    const animations = [];
    onMounted(() => {
      robotWidth.value = door.value.clientWidth * 0.65;
      console.log("mounted", robotWidth.value);
      cell.width = door.value.clientWidth;
      cell.height = door.value.clientHeight * 6;
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
      cell,
      corridor,
      animations,
    };
  },
  methods: {
    playPause() {
      this.playing = !this.playing;
      if (!this.gameStarted) this.startGame();
    },
    startGame() {
      console.log("resetting simulation");
      this.gameStarted = true;
      this.shelfs = document.getElementsByClassName('shelf');
      this.setRobotStartPosition();
      this.fillAnimations();
      this.startSearch();
    },
    robotPos() {
      return {
        x: parseInt(this.robot.style.left.substring(0, this.robot.style.left.length -2)), 
        y: parseInt(this.robot.style.top.substring(0, this.robot.style.top.length -2))
      }
    },
    setRobotStartPosition() {
      this.robot.style.top =
          this.door.clientHeight / 2 + this.supermarket.getBoundingClientRect().y + 'px' ;
      this.robot.style.left =
          this.door.clientWidth * 0.175 +  this.supermarket.getBoundingClientRect().x + "px";

    },
    fastForward() {
      console.log("click fastforward");
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
          x: parseInt(obj.style.left.substring(0, obj.style.left.length -2)),
          y: parseInt(obj.style.top.substring(0, obj.style.top.length -2)),
        }
      }
      
    },
    checkCorrectColumn(shelf, currentX) {
        if (shelf.classList.contains('articles-left')) {
          console.log('items left')
          return Math.ceil(currentX + this.cell.width*0.825) === Math.ceil(this.getPos(shelf).x)
        }
        if (shelf.classList.contains('articles-right')) {
          console.log('items right')
          return Math.ceil(currentX - this.cell.width*1.175) === Math.ceil(this.getPos(shelf).x)
        }
       
    },
    addAnimation(duration, delay, walk_x, walk_y) {
      const step = walk_x ? 'translateX('+ walk_x  +'px)' : 'translateY('+ walk_y  +'px)'
      this.animations.push(this.robot.animate(
            [{transform: step}],
            {
              duration: duration,
              delay: delay,
              fill: 'forwards',
           
            },
        )
      );
      this.animations[this.animations.length-1].pause();
      if (this.animations.length > 1) {
        console.log('adding on finish')
        this.animations[this.animations.length-2].onfinish = () => {
          console.log(this.robotPos())
          this.addToRobotPos(walk_x, walk_y)
          console.log(this.robotPos())
          this.animations[this.animations.length-1].play();
        }
      }
    },
    
    fillAnimations() {
      for (let i = 0; i < 2; i++) {
        let walk_x = 0, walk_y = 0;
        if (this.checkCorrectColumn(this.shelfs[i], this.robotPos().x)) {
          walk_y = this.getPos(this.shelfs[i]).y - this.robotPos().y;
          this.addAnimation(2000,300,0,walk_y);
        } else {
          walk_y = this.getPos(this.corridor).y - this.robotPos().y;
          this.addAnimation(500,0,0,walk_y);
         // walk_x = this.getPos(this.shelfs[i]).x - currentX;
        //  this.addAnimation(2000,300,walk_x,0);
        }
      }
    },
    addToRobotPos(x,y) {
      console.log(x,y,this.robot.style.top, this.robot.style.left)
      //this.robot.style.top = parseInt(this.robot.style.top.substring(0, this.robot.style.top.length-2 )) + y +'px' ;
     // this.robot.style.left = parseInt(this.robot.style.left.substring(0, this.robot.style.left.length-2 )) + x +'px' ;
      console.log(x,y,this.robot.style.top, this.robot.style.left)
      console.log(this.robotPos())
    },
    startSearch() {  
        this.animations[0].play();
        console.log(this.animations)
    },
  },
};
</script>

<style scoped>
.robot {
  position: absolute;
  text-align: left;
}

.supermarket-container {
  display: block;
  text-align: left;
}

.door-entry {
  background-color: brown;
  grid-area: d;
}
.door-exit {
  background-color: brown;
  grid-area: e;
}
.vegetables {
  background-color: green;
  grid-area: v;
}
.fruits {
  background-color: greenyellow;
  grid-area: f;
}
.frozen {
  background-color: blue;
  grid-area: g;
}
.cooler {
  background-color: lightblue;
  grid-area: c;
}
.checkout {
  background-color: gold;
  grid-area: p;
  border-radius: 12px;
}
.shelf {
  border-radius: 12px;
}

.corridor {
  grid-area: q;
}

.supermarket {
  background-color: grey;
  width: 100%;
  height: 620px;
  text-align: left;
  grid-template-rows: auto;
  display: grid;
}
@keyframes turner {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}

.small {
  grid-template-columns: repeat(48, 1fr);
  grid-template-areas:
    "d d d d d d . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . e e e e e e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
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
  background-color: blue;
  width: 480px;
  height: 310px;
}
.large {
  background-color: green;
  width: 480px;
  height: 310px;
}
.door {
  position: relative;
  top: 0px;
  left: 0px;
}
</style>
