<template>
  <div class="supermarket-container">
    <img
      v-show="gameStarted"
      class="robot"
      ref="robot"
      src="../assets/images/robot-3.png"
      alt="r"
      :style="{ width: cell.width * 0.65 + 'px', height: cell.height + 'px' }"
    />

    <div v-if="size === 'small'" class="supermarket small" ref="supermarket">
      <div class="start"></div>
      <div class="door-entry" ref="door"></div>
      <div class="door-exit" ref="exit"></div>
      <div class="shelf vegetables articles-left"></div>
      <div class="shelf fruits articles-right"></div>
      <div class="shelf cooler articles-left"></div>
      <div class="shelf freezer articles-right"></div>
      <div class="checkout" ref="checkout"></div>
      <div class="corridor" ref="corridor"></div>
      <div class="current-item" ref="currentItem">
        <div id="itemImageOuter">
          <img id="itemImage" :src="getItemUrl(currentItemName)" alt="milk" />
        </div>
        <div id="itemText">&#10060;</div>
      </div>
    </div>

    <div
      v-else-if="size === 'medium'"
      class="supermarket medium"
      ref="supermarket"
    >
      <div class="start"></div>
      <div class="door-entry" ref="door"></div>
      <div class="door-exit" ref="exit"></div>
      <div class="shelf cooler articles-left"></div>
      <div class="shelf vegetables articles-left"></div>
      <div class="shelf freezer articles-right"></div>
      <div class="shelf meat articles-left"></div>
      <div class="shelf cleaning articles-left"></div>
      <div class="shelf fruits articles-right"></div>
      <div class="shelf sweets articles-right"></div>
      <div class="shelf drinks articles-right"></div>
      <div class="checkout" ref="checkout"></div>
      <div class="corridor" ref="corridor"></div>
      <div class="current-item" ref="currentItem">
        <div id="itemImageOuter">
          <img id="itemImage" :src="getItemUrl(currentItemName)" alt="milk" />
        </div>
        <div id="itemText">&#10060;</div>
      </div>
    </div>
    <div v-else class="supermarket large" />
    <ButtonNavigation
      :story="false"
      :playing="playing"
      :fastForwarding="fastForwarding"
      @handleClickPlayPause="playPause()"
      @handleClickRestart="startSimulation()"
      @handleClickFastForward="fastForward()"
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import ButtonNavigation from "../components/ButtonNavigation.vue";

import { onMounted } from "@vue/runtime-core";
export default {
  props: ["size", "algorithm", "shoppingListProp", "shelfData"],
  components: { ButtonNavigation },
  setup(props) {
    console.log(props);
    const shoppingList = ref([]);
    shoppingList.value.push(...props.shoppingListProp);
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
    shoppingListLive.value.push(...props.shoppingListProp);
    const checkout = ref(null);
    const plannedCoordinates = [];
    const exit = ref(null);
    const currentItem = ref(null);
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
    const walkingSpeed = ref(250);
    const MAX_ROUNDS = 2;
    const rounds = ref(0);
    const endlessRoundStarter = ref(0);
    onMounted(() => {
      console.log("mounted", robotWidth.value);
      cell.width = Math.max(door.value.clientWidth, door.value.clientHeight);
      cell.height =
        props.size === "large"
          ? document.getElementsByClassName("shelf")[0].clientHeight / 4
          : document.getElementsByClassName("shelf")[0].clientHeight / 3;
      currentItem.value.height = cell.height / 2;
      currentItem.value.width = cell.width / 2;
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
      currentItem,
      currentItemName,
      shoppingListLive,
      shoppingList,
      currentAnimation,
      MAX_ROUNDS,
      endlessRoundStarter,
      rounds,
    };
  },
  watch: {
    // whenever shoppingList changes, update simulation
    shoppingListProp(newShoppingList, oldShoppingList) {
      this.shelfs = document.getElementsByClassName("shelf");
      this.cell.width = Math.max(this.door.clientWidth, this.door.clientHeight);
      this.cell.height =
        this.size === "large"
          ? this.shelfs[0].clientHeight / 4
          : this.shelfs[0].clientHeight / 3;
      this.currentItem.height = this.cell.height / 2;
      this.currentItem.width = this.cell.width / 2;
      console.log("updated to new chapter", this.cell);
      this.resetSimulation();
    },
  },
  methods: {
    resetSimulation() {
      this.shoppingListLive = [];
      this.shoppingList = [];
      this.shoppingListLive.push(...this.shoppingListProp);
      this.shoppingList.push(...this.shoppingListProp);
      this.shelfs = document.getElementsByClassName("shelf");
      this.plannedCoordinates = [];
      this.robotPosPlanned = null;
      this.currentItemName =
        this.shoppingListLive[this.shoppingListLive.length - 1];
      this.currentAnimation = 0;
      this.playing = false;
      this.rounds = 0;
      this.gameStarted = false;
      this.animations.forEach((element) => {
        element.animation.cancel();
      });
      this.animations = [];
      this.MAX_ROUNDS = 2;
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
    getItemUrl(itemName) {
      if (itemName !== undefined) {
        var items = require.context("../assets/icons/items", false, /\.png$/);
        return items("./" + itemName + ".png");
      }
    },
    startSimulation() {
      console.log(this.animations);
      this.resetSimulation();
      console.log(this.animations);
      console.log("resetting simulation", this.shoppingList);
      this.gameStarted = true;
      this.playing = true;
      this.shelfs = document.getElementsByClassName("shelf");
      this.cell.width = Math.max(this.door.clientWidth, this.door.clientHeight);
      this.cell.height =
        this.size === "large"
          ? this.shelfs[0].clientHeight / 4
          : this.shelfs[0].clientHeight / 3;
      this.currentItem.height = this.cell.height / 2;
      this.currentItem.width = this.cell.width / 2;
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
      console.log("reset pos of robot to start");
      this.robot.style.top =
        document.getElementsByClassName("start")[0].getBoundingClientRect()
          .top +
        2 +
        "px";
      this.robot.style.left =
        document.getElementsByClassName("start")[0].getBoundingClientRect()
          .left +
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
        console.log(
          this.robotPosPlanned.x,
          this.cell.width * 0.825,
          this.getPos(shelf).x
        );
        return (
          Math.abs(
            this.robotPosPlanned.x +
              this.cell.width * 0.825 -
              this.getPos(shelf).x
          ) < 10
        );
      }
      if (shelf.classList.contains("articles-right")) {
        console.log(
          this.robotPosPlanned.x,
          this.cell.width * 1.175,
          this.getPos(shelf).x
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
      const step = walk_x
        ? "translateX(" + walk_x + "px)"
        : "translateY(" + walk_y + "px)";
      this.animations.push({
        animation: this.robot.animate([{ transform: step }], {
          duration: duration,
          delay: delay,
        }),
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
            duration: 1000,
            fill: "forwards",
          }
        ),
      });
      this.plannedCoordinates.push(null);
    },
    addFinishedRoundAnimation(nextItem) {
      console.log('addFinishRound with nextItem ' , nextItem)
      this.animations.push({
        animation: this.robot.animate([{}], {
          duration: 0,
        }),
        finishedRound: true,
        nextItem: nextItem
      });
      this.plannedCoordinates.push(null);
    },
    calculateWalkingDistance_x(shelf) {
      if (shelf.classList.contains("articles-left")) {
        return (
          this.getPos(shelf).x - this.robotPosPlanned.x - this.cell.width + 20
        );
      }
      if (shelf.classList.contains("articles-right")) {
        return (
          this.getPos(shelf).x - this.robotPosPlanned.x + this.cell.width + 30
        );
      }
      console.log("error");
    },

    fillAnimations() {
      this.addFadingAnimation(true);
      this.robotPosPlanned = this.robotPos();
      while (this.shoppingList.length > 0 && this.rounds < this.MAX_ROUNDS) {
        console.log(this.rounds);
        this.rounds++;
        let foundTopItem = false;
        let restart = false;
        for (let i = 0; i < this.shelfs.length; i++) {
          this.goToNextShelf(i);
          [foundTopItem, restart] = this.handleShelfSearch(i, foundTopItem);
          if (restart) break;
        }

        if (this.endlessRoundStarter <= 0)
          this.endlessRoundStarter = this.animations.length;
      }

      //pay and leave
      if (this.algorithm < 3 && this.shoppingList.length !== 0) {
        this.repeatAnimations();
      }

      if (this.size === "small") {
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
            this.cell.height * 0.175,
          0
        );
        this.addWalkingAnimation(
          0,
          0,
          this.getPos(this.exit).y - this.robotPosPlanned.y
        );
      } else {
        //medium or large
        let walk_x, walk_y;
        walk_y =
          this.getPos(this.corridor).y -
          this.cell.height * 0.1 -
          this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
        walk_x =
          this.getPos(this.checkout).x -
          this.cell.width * 0.9 -
          this.robotPosPlanned.x;
        this.addWalkingAnimation(0, walk_x, 0);
        walk_y =
          this.getPos(this.exit).y +
          this.cell.height * 0.2 -
          this.robotPosPlanned.y;
        this.addWalkingAnimation(500, 0, walk_y);
        walk_x =
          this.getPos(this.exit).x -
          this.cell.width * 0.4 -
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

      for (let u = 0; u < this.animations.length; u++) {
        this.animations[u].animation.pause();
        this.animations[u].animation.onfinish = () => {
          this.currentAnimation++;
          if (this.plannedCoordinates[u]) {
            this.changeRobotPos(
              this.plannedCoordinates[u].x,
              this.plannedCoordinates[u].y
            );
          }
          if (u != this.animations.length - 1)
            this.animations[u + 1].animation.play();
          if (this.animations[u].type === "search") {
            this.currentItem.style.display = "none";
          }
          if (
            this.animations[u + 1].type &&
            this.animations[u + 1].type === "search"
          ) {
            this.currentItem.style.display = "block";
            this.currentItem.style.top =
              this.getPos(this.animations[u + 1].shelf).y +
              this.animations[u + 1].cell * this.cell.height +
              this.cell.height * 0.07 +
              "px";
            this.currentItem.style.left =
              this.getPos(this.animations[u + 1].shelf).x +
              this.cell.width * 0.175 +
              "px";

            if (this.animations[u + 1].successful === true) {
              document.getElementById("itemText").innerHTML = "✔️";
            } else {
              document.getElementById("itemText").innerHTML = "&#10060";
            }
          }
          if (this.animations[u + 1].finishedRound === true) {
            /* this.shoppingListLive.pop();
             this.currentItemName = this.shoppingListLive[this.shoppingListLive.length-1] */
             let prev = this.currentItemName
            this.currentItemName = this.animations[u + 1].nextItem;
            console.log("changed currentItemName from " + prev  +  "to" + this.currentItemName);
          }

          if (this.animations[u + 1].exit === true) {
            this.gameStarted = false;
            this.playing = false;
          }

          if (this.animations[u + 1].endlessLoop === true) {
            console.log(this.endlessRoundStarter);
            this.animations[this.endlessRoundStarter].animation.play();
            this.animations[u + 1].animation.pause();
          }
        };
      }
    },
    goToNextShelf(nextShelf) {
      let walk_x = 0,
        walk_y = 0;
      console.log(this.checkCorrectColumn(this.shelfs[nextShelf]));
      if (this.checkCorrectColumn(this.shelfs[nextShelf])) {
        walk_y = this.getPos(this.shelfs[nextShelf]).y - this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
      } else {
        walk_y =
          this.getPos(this.corridor).y -
          this.cell.width * 0.1 -
          this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
        walk_x = this.calculateWalkingDistance_x(this.shelfs[nextShelf]);
        this.addWalkingAnimation(0, walk_x, 0);
        walk_y = this.getPos(this.shelfs[nextShelf]).y - this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
      }
    },
    handleShelfSearch(currentShelf, foundTopItem) {
      const shelfCells = this.size === "large" ? 4 : 3;
      const items = this.shelfData.filter(
        (s) => s.name === this.shelfs[currentShelf].classList[1]
      )[0].items;

      switch (this.algorithm) {
        case 1:
        case 2:
          for (let i = 0; i < shelfCells; i++) {
            if (items[i] === this.shoppingList[this.shoppingList.length - 1]) {
              this.addSearchAnimation(
                this.shoppingList[this.shoppingList.length - 1],
                true,
                this.shelfs[currentShelf],
                i
              );
              this.rounds = 0;
              foundTopItem = true;
              if (this.algorithm === 2) {
                this.shoppingList.pop();
                this.addFinishedRoundAnimation(
                  this.shoppingList[this.shoppingList.length - 1]
                );
                return [foundTopItem, true];
              }
            } else {
              this.addSearchAnimation(
                this.shoppingList[this.shoppingList.length - 1],
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
              this.shoppingList.pop();
              this.addFinishedRoundAnimation(
                this.shoppingList[this.shoppingList.length - 1]
              );
            }
          }
          return [foundTopItem, false];

        case 3:
      
                this.addFinishedRoundAnimation(
                  this.shoppingList[0 ]
                );
          for (let i = 0; i < shelfCells; i++) {
            console.log("looking through shopping list");
            if (this.shoppingList.length === 0) break;
            for (let u = 0; u < this.shoppingList.length; u++) {
         
              console.log("comparing ", items[i], this.shoppingList[u]); //"shoppingList" : ["coffee","soy-milk", "yogurt"] 
              if (items[i] === this.shoppingList[u]) {                  // "items" : ["milk", "yogurt", "soy-milk"]
                console.log("showing success", this.shoppingList[u]);
                this.addSearchAnimation(
                  this.shoppingList[u%this.shoppingList.length],
                  true,
                  this.shelfs[currentShelf],
                  i
                );
                this.rounds = 0;
                foundTopItem = true;
                 
                
               
            

                this.addFinishedRoundAnimation(
                  this.shoppingList[(u+1)%this.shoppingList.length ]
                );
           this.shoppingList.splice(u,1)
                console.log("breaking out");
                break;
              } else {
                console.log("showing", this.shoppingList[u]);
                this.addSearchAnimation(
                  this.shoppingList[u%this.shoppingList.length],
                  false,
                  this.shelfs[currentShelf],
                  i
                );
              }
              this.addFinishedRoundAnimation(
                this.shoppingList[(u+1)%this.shoppingList.length]
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
        case 4:
          break;
        case 5:
          break;
      }
      /*
          if (this.algorithm == 1 || !foundTopItem) {
            if (!this.checkItem(items, 0)) {
            this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], false, this.shelfs[currentShelf], 0 );
          } else {
            foundTopItem = true;
            this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], true, this.shelfs[currentShelf], 0  );
            rounds = 0;

          }
          }

          for (let y = 1; y < shelfCells; y++) {
            if (this.algorithm > 1 && foundTopItem) break;
            if (this.getPos(this.shelfs[currentShelf]).y <= this.robotPosPlanned.y) {
              this.addWalkingAnimation(
                0,
                0,
                this.shelfs[currentShelf].clientHeight / shelfCells
              );
              if (!this.checkItem(items, y)) {
                this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], false, this.shelfs[i], y );
              } else {
                foundTopItem = true;
                this.addSearchAnimation(this.shoppingList[this.shoppingList.length-1], true, this.shelfs[i], y );
                rounds = 0;

              }
              console.log("added animation downwards");

            }
          }   if (this.algorithm > 1 && foundTopItem) break;  */
    },
    addSearchAnimation(itemName, successful, shelf, cell) {
      this.animations.push({
        type: "search",
        itemName: itemName,
        successful: successful,
        shelf: shelf,
        cell: cell,
        animation: this.currentItem.animate([{}], {
          duration: successful ? 1000 : 500,
        }),
      });
      this.plannedCoordinates.push(null);
    },
    checkItem(items, index) {
      switch (this.algorithm) {
        case 1:
          console.log("algo 1 checking item", this.shoppingList);
          if (
            items[index] === this.shoppingList[this.shoppingList.length - 1]
          ) {
            return true;
          }
          return false;
          break;
        case 2:
          console.log("algo 2 checking item");
          if (
            items[index] === this.shoppingList[this.shoppingList.length - 1]
          ) {
            return true;
          }
          return false;
          break;

        case 3:
          console.log("algo 3 checking item");
          for (let i = 0; i < shoppingList.length; i++)
            if (items[index] === this.shoppingList[i]) {
              return true;
            }
          return false;

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
      // console.log(this.robot.style.top, this.robot.style.left, x, y);
      this.robot.style.top = y + "px";
      this.robot.style.left = x + "px";
      //   console.log(this.robot.style.top, this.robot.style.left);
    },
    startSearch() {
      this.animations[0].animation.play();
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
  background-color: brown;
  grid-area: i;
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
.meat {
  background-color: red;
  grid-area: m;
}
.sweets {
  background-color: chocolate;
  grid-area: s;
}
.cleaning {
  background-color: pink;
  grid-area: l;
}
.drinks {
  background-color: violet;
  grid-area: d;
}
.checkout {
  background-color: gold;
  grid-area: p;
  border-radius: 12px;
}
.start {
  grid-area: S;
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
    "i i i i i i . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . e e e e e e"
    ". S . . . . . . . . . . . . . . . . . . . . . . . . . . . . . p p p p p . . . . . . . . . . . ."
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
  grid-template-columns: repeat(42, 1fr);
  grid-template-areas:
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    ". . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i S . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
    "i . . . . c c c c c g g g g g . . . . . . . . . . m m m m m s s s s s . . . . . . ."
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
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . e"
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . ."
    ". . . . . v v v v v f f f f f . . . . . . . . . . l l l l l d d d d d . . . . . . .";
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
