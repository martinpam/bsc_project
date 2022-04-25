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
    <div class="current-item" ref="currentItem">
        <div id="itemImageOuter">
          <img id="itemImage" :src="getItemUrl(currentItemName)" alt="milk" ref="itemImage"/>
        </div>
        <div id="itemText">&#10060;</div>
      </div>

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
    </div>
    <div v-else class="supermarket large" ref="supermarket">
         <div class="start special"></div>
      <div class="door-entry" ref="door"></div>
      <div class="door-exit" ref="exit"></div>
      <div class="shelf cooler articles-left"></div>
      <div class="shelf fruits articles-left"></div>
      <div class="shelf vegetables articles-right"></div>
      <div class="shelf freezer articles-right"></div>
      <div class="shelf vegetables vegetables2 articles-left"></div>
      <div class="shelf freezer freezer2 articles-left"></div>
      <div class="shelf cooler cooler2 articles-right"></div>
      <div class="shelf fruits fruits2 articles-right"></div>
       <div class="shelf drinks drinks2 articles-left"></div>
      <div class="shelf drinks articles-left"></div>
      <div class="shelf meat articles-right"></div>
      <div class="shelf cleaning articles-right"></div>
      <div class="shelf meat meat2 articles-left"></div>
      <div class="shelf cleaning cleaning2 articles-left"></div>
      <div class="shelf sweets articles-right"></div>
      <div class="shelf sweets sweets2 articles-right"></div>
      <div class="checkout" ref="checkout"></div>
      <div class="corridor" ref="corridor"></div>
     
    </div>
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
    console.log(shoppingListLive.value)
    const checkout = ref(null);
    const plannedCoordinates = [];
    const exit = ref(null);
    const currentItem = ref(null);
    const itemImage = ref(null);
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
      console.log("mounted", robotWidth.value, props.algorithm, props.size);
      cell.width = Math.max(door.value.clientWidth, door.value.clientHeight) * 2;
      cell.height =
        props.size === "large"
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
      itemImage
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
    }
  },
  methods: {
    resetSimulation() {
      this.shelfs = document.getElementsByClassName("shelf");
      this.cell.width = Math.max(this.exit.clientWidth, this.exit.clientHeight);
      this.cell.height =
        this.size === "large"
          ? this.shelfs[0].clientHeight / 3.3
          : this.shelfs[0].clientHeight / 3;
      console.log("updated to new chapter", this.cell);
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
      this.cell.width = Math.max(this.exit.clientWidth, this.exit.clientHeight);
      this.cell.height =
        this.size === "large"
          ? this.shelfs[0].clientHeight / 3.3
          : this.shelfs[0].clientHeight / 3;
      document.getElementById('itemImage').width = this.cell.width * 0.7;
      document.getElementById('itemImage').height = this.cell.width * 0.7;
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
      console.log("addFinishRound with nextItem ", nextItem);
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
          this.getPos(shelf).x - this.robotPosPlanned.x - this.cell.width + (this.size !== 'large' ? this.cell.width * 0.15 : this.cell.width * 0.15 )
        );
      }
      if (shelf.classList.contains("articles-right")) {
        return (
          this.getPos(shelf).x - this.robotPosPlanned.x + this.cell.width + (this.size !== 'large' ? this.cell.width * 0.25 : -this.cell.width * 0.15)
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
          let index = this.shelfs[i].classList[2].substring(this.shelfs[i].classList[2].length-1, this.shelfs[i].classList[2].length) == '2' ? 1 : 0;
           let currentItems = this.shelfData.filter(
        (s) => s.name === this.shelfs[i].classList[1]
      )[index].items;
          let categoryItems = [];
          if (this.algorithm === 4) {
            categoryItems.push(...this.shelfData.filter(
        (s) => s.name === this.shelfs[i].classList[1]
      )[0].items ) 
      console.log(categoryItems)
      if (this.size === 'large') {
          categoryItems.push(...this.shelfData.filter(
        (s) => s.name === this.shelfs[i].classList[1]
      )[1].items )
      }
    

          }
          console.log(categoryItems)
          if (this.algorithm !== 4 || categoryItems.some(item=> this.shoppingList.indexOf(item) >= 0)) {
            this.goToNextShelf(i);
          [foundTopItem, restart] = this.handleShelfSearch(i, foundTopItem, currentItems, categoryItems);
          if (restart) break;
          }
         
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
            let padding = this.size === 'small' ? 0.13 : this.size === 'medium' ? 0.2 : 0.07
            this.currentItem.style.top =
              this.getPos(this.animations[u + 1].shelf).y +
              this.animations[u + 1].cell * (this.size === 'large' ? this.cell.height / 3.3 * 2.5 : this.cell.height) +
              this.cell.height * 0.07 +
              "px";
            this.currentItem.style.left =
              this.getPos(this.animations[u + 1].shelf).x +
              this.cell.width * padding +
              "px";
            let itemText = document.getElementById("itemText");
            if (this.size === 'small') {
              itemText.style.top = '2.4rem';
              itemText.style.left = '2rem';
              itemText.style.fontSize = '3rem';
            } else if (this.size === 'medium') {
              itemText.style.top = '2rem';
              itemText.style.left = '1.6rem';
              itemText.style.fontSize = '2.5rem';
            } else {
              itemText.style.top = '1.2rem';
              itemText.style.left = '1.1rem';
              itemText.style.fontSize = '2rem';
            }
            
            if (this.animations[u + 1].successful === true) {
              itemText.innerHTML = "✔️";
            } else {
             itemText.innerHTML = "&#10060";
            }
          }
          if (this.animations[u + 1].finishedRound === true) {
            /* this.shoppingListLive.pop();
             this.currentItemName = this.shoppingListLive[this.shoppingListLive.length-1] */
            let prev = this.currentItemName;
            this.currentItemName = this.animations[u + 1].nextItem;
            console.log(
              "changed currentItemName from " +
                prev +
                "to" +
                this.currentItemName
            );
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
          this.cell.height * 0.1 -
          this.robotPosPlanned.y + (this.size == 'large' ? this.cell.height * 0.3 : 0 );
        this.addWalkingAnimation(0, 0, walk_y);
        walk_x = this.calculateWalkingDistance_x(this.shelfs[nextShelf]) ;
        this.addWalkingAnimation(0, walk_x, 0);
        walk_y = this.getPos(this.shelfs[nextShelf]).y - this.robotPosPlanned.y;
        this.addWalkingAnimation(0, 0, walk_y);
      }
    },
    handleShelfSearch(currentShelf, foundTopItem, items, categoryItems) {
      const shelfCells = this.size === "large" ? 4 : 3;


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
          this.addFinishedRoundAnimation(this.shoppingList[0]);
          for (let i = 0; i < shelfCells; i++) {
            console.log("looking through shopping list");
            if (this.shoppingList.length === 0) break;
            for (let u = 0; u < this.shoppingList.length; u++) {
              console.log("comparing ", items[i], this.shoppingList[u]);
              if (items[i] === this.shoppingList[u]) {
                console.log("showing success", this.shoppingList[u]);
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
                console.log("breaking out");
                break;
              } else {
                console.log("showing", this.shoppingList[u]);
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
        case 4:
           
           let shoppingListPartial = this.shoppingList.filter((item) => categoryItems.indexOf(item) >= 0)
           console.log(shoppingListPartial)
    
             this.addFinishedRoundAnimation(shoppingListPartial[0]);
            
           
          for (let i = 0; i < shelfCells; i++) {
            console.log("looking through shopping list");
            if (shoppingListPartial.length === 0) break;
            for (let u = 0; u < shoppingListPartial.length; u++) {
              console.log("comparing ", items[i], shoppingListPartial[u]);
              if (items[i] === shoppingListPartial[u]) {
                console.log("showing success", shoppingListPartial[u]);
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
                
                console.log(this.shoppingListPartial, this.shoppingList)
                this.shoppingList.splice(this.shoppingList.indexOf(shoppingListPartial[u]), 1);
                shoppingListPartial.splice(u, 1);
                console.log(this.shoppingListPartial, this.shoppingList)
                console.log("breaking out");
                break;
              } else {
                console.log("showing", shoppingListPartial[u]);
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
        case 5:
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
.vegetables2 {
  background-color: green;
  grid-area: h;
}
.fruits {
  background-color: greenyellow;
  grid-area: f;
}

.fruits2 {
  background-color: greenyellow;
  grid-area: j;
}
.freezer {
  background-color: blue;
  grid-area: g;
}
.freezer2 {
  background-color: blue;
  grid-area: a;
}
.cooler {
  background-color: lightblue;
  grid-area: c;
}
.cooler2 {
  background-color: lightblue;
  grid-area: b;
}
.meat {
  background-color: red;
  grid-area: m;
}
.meat2 {
  background-color: red;
  grid-area: n;
}
.sweets {
  background-color: chocolate;
  grid-area: s;
}
.sweets2 {
  background-color: chocolate;
  grid-area: r;
}
.cleaning {
  background-color: pink;
  grid-area: l;
}
.cleaning2 {
  background-color: pink;
  grid-area: o;
}
.drinks {
  background-color: violet;
  grid-area: d;
}
.drinks2 {
  background-color: violet;
  grid-area: k;
}
.checkout {
  background-color: gold;
  grid-area: p;
  border-radius: 12px;
}
.start {
  grid-area: S;
}
.special {
  background-color: brown;
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
  width: 0px;
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
  grid-template-columns: repeat(49, 1fr);
  grid-template-areas:
    "S . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
    "i . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
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
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e"
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . e"

 
}
.door {
  position: relative;
  top: 0px;
  left: 0px;
}
</style>
