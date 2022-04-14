<template>
  <div class="supermarket-container">
    <img
      v-show="gameStarted"
      class="robot"
      ref="robot"
      src="../assets/images/robot-3.png"
      alt="r"
      :style="{ width: robotWidth + 'px' }"
    />

    <div v-if="size === 'small'" class="supermarket small" ref="supermarket">
      <div class="door-entry" ref="door"></div>
      <div class="door-exit" ref="exit"></div>
      <div class="shelf vegetables articles-left"></div>
      <div class="shelf fruits articles-right"></div>
      <div class="shelf cooler articles-left"></div>
      <div class="shelf freezer articles-right"></div>
      <div class="checkout" ref="checkout"></div>
      <div class="corridor" ref="corridor"></div>
      <div class="current-item" ref="currentItem"><div id="itemImageOuter" ><img id="itemImage" :src="getItemUrl(currentItemName)" alt="milk"  ></div><div id="itemText">&#10060;</div></div>
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
import ButtonNavigation from "../components/ButtonNavigation.vue";
import getShelfData from "../composables/getShelfData.js";
import { onMounted } from "@vue/runtime-core";
export default {
  props: ["size", "algorithm", "shoppingList"],
  components: { ButtonNavigation },
  setup(props) {
    console.log(props);
    const { shelfData, error, load } = getShelfData(props.size);
    load();
    const supermarket = ref(null);
    const corridor = ref(null);
    const playing = ref(false);
    const fastForwarding = ref(false);
    const gameStarted = ref(false);
    const robotWidth = ref(0);
    const door = ref(null);
    const robot = ref(null);
    const shelfs = [];
    const shoppingListLive = ref([]);
    shoppingListLive.value.push(...props.shoppingList);
    const checkout = ref(null);
    const plannedCoordinates = [];
    const exit = ref(null);
    const currentItem = ref(null);
    const currentItemName = ref(shoppingListLive.value[shoppingListLive.value.length-1]);
    const cell = {
      height: 0,
      width: 0,
    };
    const robotPosPlanned = {
      x: 0,
      y: 0,
    };
    const animations = [];
    const walkingSpeed = ref(250);
    onMounted(() => {
      robotWidth.value = door.value.clientWidth * 0.65;
      console.log("mounted", robotWidth.value);
      cell.width = door.value.clientWidth;
      cell.height = door.value.clientHeight * 6;
      currentItem.value.height = cell.height/2;
      currentItem.value.width = cell.width/2;
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
      robotPosPlanned,
      plannedCoordinates,
      walkingSpeed,
      checkout,
      exit,
      shelfData,
      currentItem,
      currentItemName,
      shoppingListLive
    };
  },
  methods: {
    playPause() {
      this.playing = !this.playing;
      if (!this.gameStarted) this.startGame();
    },
    getItemUrl(itemName) {
      console.log("image change" , itemName)
      if (itemName !== undefined) {
        var items = require.context('../assets/icons/items', false, /\.png$/)
    return items('./' + itemName + ".png")
      }
    
  },
    startGame() {
      console.log("resetting simulation");
      this.gameStarted = true;
      this.shelfs = document.getElementsByClassName("shelf");
      this.setRobotStartPosition();
      this.fillAnimations();
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
        this.door.clientHeight / 2 +
        this.supermarket.getBoundingClientRect().y +
        "px";
      this.robot.style.left =
        this.door.clientWidth * 0.175 +
        this.supermarket.getBoundingClientRect().x +
        "px";
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
          x: parseInt(obj.style.left.substring(0, obj.style.left.length - 2)),
          y: parseInt(obj.style.top.substring(0, obj.style.top.length - 2)),
        };
      }
    },
    checkCorrectColumn(shelf) {
      if (shelf.classList.contains("articles-left")) {
        console.log(
          "items left",
          this.getPos(shelf),
          this.robotPosPlanned.x + this.cell.width * 0.825,
          this.robotPosPlanned.x
        );
        return (
          Math.abs(
            this.robotPosPlanned.x +
              this.cell.width * 0.825 -
              this.getPos(shelf).x
          ) < 2
        );
      }
      if (shelf.classList.contains("articles-right")) {
        console.log(
          "items right",
          this.getPos(shelf),
          this.robotPosPlanned.x - this.cell.width * 1.175,
          this.robotPosPlanned.x
        );
        return (
          Math.abs(
            this.robotPosPlanned.x -
              this.cell.width * 1.175 -
              this.getPos(shelf).x
          ) < 2
        );
      }
    },
    addWalkingAnimation(delay, walk_x, walk_y) {
      const duration = walk_x
        ? (Math.abs(walk_x) * 300) / this.walkingSpeed
        : (Math.abs(walk_y) * 300) / this.walkingSpeed;
      console.log(walk_x, walk_y, duration);
      const step = walk_x
        ? "translateX(" + walk_x + "px)"
        : "translateY(" + walk_y + "px)";
      this.animations.push({ animation :
        this.robot.animate([{ transform: step }], {
          duration: duration,
          delay: delay,
        })
      });
      console.log("before adding to robotPosPlanned", this.robotPosPlanned);
      this.robotPosPlanned.x += walk_x;
      this.robotPosPlanned.y += walk_y;
      console.log("after adding to robotPosPlanned", this.robotPosPlanned);
      this.plannedCoordinates.push({
        x: this.robotPosPlanned.x,
        y: this.robotPosPlanned.y,
      });
    },
    addFadingAnimation(fadeIn) {
      this.animations.push( { animation : 
        this.robot.animate([fadeIn ? { opacity: 1 } : { opacity: 0 }], {
          duration: 1000,
          fill: "forwards",
        })
      });
      this.plannedCoordinates.push(null);
    },
    addFinishedRoundAnimation() {
       this.animations.push( { animation : 
        this.robot.animate([{}], {
          duration: 0,
        })
      ,finishedRound: true},
      
      );
      this.plannedCoordinates.push(null);
    },
    calculateWalkingDistance_x(shelf) {
      console.log(this.getPos(shelf));
      if (shelf.classList.contains("articles-left")) {
        console.log("left");
        return (
          this.getPos(shelf).x -
          this.robotPosPlanned.x -
          this.door.clientWidth * 0.875
        );
      }
      if (shelf.classList.contains("articles-right")) {
        console.log("right");
        return (
          this.getPos(shelf).x -
          this.robotPosPlanned.x +
          this.door.clientWidth * 1.175
        );
      }
      console.log("error");
    },

    fillAnimations() {
      this.addFadingAnimation(true);
      this.robotPosPlanned = this.robotPos();
      while (this.shoppingList.length > 0) {
        let foundTopItem = false;
        for (let i = 0; i < this.shelfs.length; i++) {
          let walk_x = 0,
            walk_y = 0;
          //find next shelf
          console.log(this.checkCorrectColumn(this.shelfs[i]));
          if (this.checkCorrectColumn(this.shelfs[i])) {
            walk_y = this.getPos(this.shelfs[i]).y - this.robotPosPlanned.y;
            this.addWalkingAnimation(0, 0, walk_y);
          } else {
            walk_y = this.getPos(this.corridor).y - this.robotPosPlanned.y;
            this.addWalkingAnimation(0, 0, walk_y);
            walk_x = this.calculateWalkingDistance_x(this.shelfs[i]);
            console.log(walk_x);
            this.addWalkingAnimation(0, walk_x, 0);
            walk_y = this.getPos(this.shelfs[i]).y - this.robotPosPlanned.y;
            this.addWalkingAnimation(0, 0, walk_y);
          }
          //start searching shelf
          const shelfCells = Math.round(
            this.shelfs[i].clientHeight / this.cell.height
          );
          const items = this.shelfData.filter(
            (s) => s.name === this.shelfs[i].classList[1]
          )[0].items;
          if (!this.checkItem(items, 0)) {
            console.log(
              "did not find " +
                this.shoppingList[0] +
                "at " +
                this.shelfs[i].classList[1] +
                " slot " +
                0
            );
            this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], false, this.shelfs[i], 0 );
          } else {
            console.log(
              "found " +
                this.shoppingList[0] +
                "at " +
                this.shelfs[i].classList[1] +
                " slot " +
                0
            );
            foundTopItem = true;
            this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], true, this.shelfs[i], 0  );
                
          }
          for (let y = 1; y < shelfCells; y++) {
            if (this.getPos(this.shelfs[i]).y <= this.robotPosPlanned.y) {
              //robot is searching downwards
              this.addWalkingAnimation(
                0,
                0,
                this.shelfs[i].clientHeight / shelfCells
              );
              if (!this.checkItem(items, y)) {
                console.log(
                  "did not find " +
                    this.shoppingList[0] +
                    "at " +
                    this.shelfs[i].classList[1] +
                    " slot " +
                    y
                );
                this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], false, this.shelfs[i], y );
              } else {
                console.log(
                  "found " +
                    this.shoppingList[0] +
                    "at " +
                    this.shelfs[i].classList[1] +
                    " slot " +
                    y
                );
                foundTopItem = true;
                this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], true, this.shelfs[i], y );
              }
              console.log("added animation downwards");
              
            }
          }
          
        }
        if (foundTopItem) {
            this.shoppingList.pop();
            this.addFinishedRoundAnimation();
          }
      }

      //pay and leave
      this.addWalkingAnimation(
        0,
        0,
        this.getPos(this.checkout).y -
          this.robotPosPlanned.y +
          this.checkout.clientHeight * 1.2
      );
      this.addWalkingAnimation(
        0,
        this.getPos(this.checkout).x -
          this.robotPosPlanned.x +
          this.cell.height * 0.125,
        0
      );
      this.addWalkingAnimation(
        500,
        this.getPos(this.exit).x -
          this.robotPosPlanned.x +
          this.cell.height * 0.125,
        0
      );
      this.addWalkingAnimation(
        0,
        0,
        this.getPos(this.exit).y - this.robotPosPlanned.y
      );
      this.addFadingAnimation(false);

      for (let u = 0; u < this.animations.length; u++) {
        this.animations[u].animation.pause();
        this.animations[u].animation.onfinish = () => {
          if (this.plannedCoordinates[u]) {
            this.changeRobotPos(
              this.plannedCoordinates[u].x,
              this.plannedCoordinates[u].y
            );
          }
          if (u != this.animations.length - 1) this.animations[u + 1].animation.play();
          if (this.animations[u].type === 'search') {
            this.currentItem.style.display = 'none'
          }
          if (this.animations[u+1].type === 'search') {
            this.currentItem.style.display = 'block'
            this.currentItem.style.top = (this.getPos(this.animations[u+1].shelf).y + this.animations[u+1].cell * this.cell.height + this.cell.height * 0.07) + 'px';
            this.currentItem.style.left = (this.getPos(this.animations[u+1].shelf).x) + this.cell.width*0.175 + 'px';

            if (this.animations[u+1].successful === true) {
              document.getElementById('itemText').innerHTML  ='✔️';
            } else {
              document.getElementById('itemText').innerHTML  ='&#10060';
            }
         
            
            }
            if (this.animations[u+1].finishedRound === true) {
             this.shoppingListLive.pop();
             this.currentItemName = this.shoppingListLive[this.shoppingListLive.length-1]
             console.log('changed currentItemName')
          }  
        };  
      }
    },
    addSearchAnimation(itemName, successful, shelf, cell ) {
      this.animations.push({
        type : 'search',
        itemName : itemName,
        successful : successful,
        shelf: shelf,
        cell: cell,
        animation : this.currentItem.animate([{}], {
          duration: successful ? 1000 : 500,
        })
      }
        
      );
      this.plannedCoordinates.push(null);
    },
    checkItem(items, index) {
      switch (this.algorithm) {
        case 1:
          console.log("algo 1 checking item", this.shoppingList );
          if (items[index] === this.shoppingList[this.shoppingList.length-1]) {
            return true;
          }
          return false;
          break;
        case 2:
          console.log("algo 2 checking item");

          break;
        case 3:
          console.log("algo 3 checking item");

          break;
        case 4:
          console.log("algo 4 checking item");

          break;
        case 5:
          console.log("algo 5 checking item");

          break;
      }
    },
    changeRobotPos(x, y) {
      console.log(this.robot.style.top, this.robot.style.left, x, y);
      this.robot.style.top = y + "px";
      this.robot.style.left = x + "px";
      console.log(this.robot.style.top, this.robot.style.left);
    },
    startSearch() {
      this.animations[0].animation.play();
      console.log(this.animations, this.shelfData);
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
.freezer {
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
  width: 960px;
  height: 620px;
  text-align: left;
  grid-template-rows: auto;
  display: grid;
}

.current-item {
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 80px;
  font-size: 2.7rem;
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
  width: 70px;
  height: 70px;
  position: absolute;

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
