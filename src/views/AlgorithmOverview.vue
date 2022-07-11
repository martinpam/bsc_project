<template>
  <div>
    <div class="nav-outer">
      <router-link class="container" :to="'/' + mdl[0].link">
        <img
          src="../assets/icons/arrow-left-long-solid.svg"
          class="navigation-button smaller"
        />
      </router-link>
    </div>
    <div class="header-overview">
      <div class="previous-chapter" @click="currentSimulation--">
        <h2 v-show="currentSimulation != 0 && !isLaboratory && !isStory">
          &lt;&lt;
        </h2>
      </div>
      <h2 v-if="!isLaboratory && !challengeId">
        {{ t(mdl[0].name) +' '+ t('CHAPTER') }}
        {{ allSimulations[currentSimulation].name }}
      </h2>
      <h2 v-else-if="isLaboratory">{{t('LABORATORY') + ' - ' + t(mdl[0].name) }}</h2>
      <h2 v-else :class="{'challenge-header':moduleName!=='socks'}">{{t('CHALLENGE') + ' - ' + mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).name[store.language] }}</h2>
      <div class="next-chapter" @click="currentSimulation++">
        <h2
          v-show="
            currentSimulation != allSimulations.length - 1 &&
            lva
          "
        >
          &gt;&gt;
        </h2>
      </div>
    </div>
    <div class="grid">
      <div class="left-side">
        <div class="algorithm-container">
          <div class="chooser">
            <h3
              v-if="currentChosenAlgorithm != 1 && isLaboratory"
              @click="currentChosenAlgorithm--"
              class="previous-chapter"
            >
              &lt;&lt;
            </h3>
            <h3 v-else class="previous-chapter"></h3>
            <h3 v-if="!isLaboratory&&(!challengeId ||moduleName==='socks')">
              {{t('ALGORITHM') + ': ' + mdl[0].algorithms.find(a=> a.algorithmNr === challenge.algorithm).name }}
            </h3>
            <h3 v-else-if="!challengeId">{{t('ALGORITHM') + ': ' +mdl[0].algorithms.find(a=> a.algorithmNr === currentChosenAlgorithm).name   }}</h3>
            <h3
              v-show="currentChosenAlgorithm != 6 && !(currentChosenAlgorithm === 5 && mdl[0].link ==='socks') && isLaboratory"
              @click="currentChosenAlgorithm++"
              class="next-chapter"
            >
              &gt;&gt;
            </h3>
          </div>
          <CodeBox
            v-if="!isLaboratory&&!challengeId"
            class="code"
            :algorithm="
              mdl[0].algorithms[allSimulations[currentSimulation].algorithm - 1]
                .lines
            "
          />
          <CodeBox
            v-else-if="challengeId"
            class="code"
            :algorithm="
              mdl[0].algorithms[mdl[0].challenges[parseInt(challengeId)-1].algorithm-1].lines
            "
          />
          <CodeBox
            v-else
            class="code"
            :algorithm="mdl[0].algorithms[currentChosenAlgorithm - 1].lines"
          />
        </div>
        <div
          v-if="moduleName === 'supermarket'"
          class="shopping-list-container"
        >
          <div v-if="isLaboratory" class="add-button" @click="openModal()">
            <img
              id="edit-icon"
              src="../assets/icons/edit.png"
              alt=""
              srcset=""
            />
          </div>

          <div class="shopping-outer">
            <div
              class="text-box"
              :class="{
                twoCols:
                  (isLaboratory && currentChosenShoppingList.length > 5) ||
                  (allSimulations[currentSimulation].shoppingList.length > 5) || 
                  (challenge && challenge.shoppingList.length>5),
                'shopping-outer-story': isStory,
              }"
            >
              <div v-if="!isLaboratory && !challengeId">
                <div
                  class="shopping-list-text"
                  :class="{ bought: boughtItems.indexOf(item) >= 0 }"
                  v-for="(item, index) in allSimulations[currentSimulation]
                    .shoppingList"
                  :key="item"
                >
                  {{ t(item) }}
                  {{
                    allSimulations[currentSimulation].algorithm === 5 ||
                    currentChosenAlgorithm === 5
                      ? "( " + t(currentCategories[index]) + " )"
                      : ""
                  }}
                </div>
              </div>
              <div v-else-if="challengeId">
                <div
                  class="shopping-list-text"
                  :class="{ bought: boughtItems.indexOf(item) >= 0 }"
                  v-for="(item, index) in mdl[0].challenges.find(challenge => challenge.challengeId === challengeId)
                    .shoppingList"
                  :key="item"
                >
                  {{ t(item) }}
                  {{
                    (challenge && 
                    challenge.algorithm === 5 )
                      ? "( " + t(getCurrentCategories()[index]) + " )"
                      : ""
                  }}
                </div>
              </div>
              <div v-else>
                <div
                  class="shopping-list-text"
                  :class="{ bought: boughtItems.indexOf(item) >= 0 }"
                  v-for="(item, index) in currentChosenShoppingList"
                  :key="item"
                >
                  {{ t(item) }}
                  {{
                    currentChosenAlgorithm === 5
                      ? "( " + t(getCurrentCategories()[index]) + " )"
                      : ""
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          
          <div class="chooser">
            <h3
              v-if="currentChosenSockCollection !== 'SMALL' && isLaboratory"
              @click="
                currentChosenSockCollection =
                  currentChosenSockCollection === 'MEDIUM'
                    ? 'SMALL'
                    : currentChosenSockCollection === 'LARGE'
                    ? 'MEDIUM'
                    : currentChosenSockCollection === 'HUGE'
                    ? 'LARGE'
                    : 'HUGE'
              "
              class="previous-chapter"
            >
              &lt;&lt;
            </h3>
            <h3 v-else class="previous-chapter"></h3>
            <h3 v-if="!isLaboratory&&!challengeId">
              {{t('COLLECTION')+': '+ t(allSimulations[currentSimulation].collection) }}
            </h3>
            <h3 v-else-if="!challengeId">{{t('COLLECTION')+': '+ t(currentChosenSockCollection) }}</h3>
            <h3
              v-show="currentChosenSockCollection !== 'CUSTOM' && isLaboratory"
              @click="
                currentChosenSockCollection =
                  currentChosenSockCollection === 'SMALL'
                    ? 'MEDIUM'
                    : currentChosenSockCollection === 'MEDIUM'
                    ? 'LARGE'
                    : currentChosenSockCollection === 'LARGE'
                    ? 'HUGE'
                    : 'CUSTOM'
              "
              class="next-chapter"
            >
              &gt;&gt;
            </h3>
          </div>

          <div class="sock-collection">
            <div
              v-for="sock in socks"
              :key="sock"
              class="two-socks-box"
              :class="{'two-socks-box-custom':currentChosenSockCollection ==='CUSTOM'}"
            >
              <Sock
                :color="sock.color"
                :lineAmount="sock.lineAmount"
                :patternColor="sock.patternColor"
                :pattern="sock.pattern"
              />
              <div class="sock-minus"><img @click="removeSock(sock)"   v-if="currentChosenSockCollection ==='CUSTOM'" src="../assets/icons/remove.png" class="sock-minus-icon"></div>
              <Sock
                v-if="sock.type === 'double'"
                :color="sock.color"
                :lineAmount="sock.lineAmount"
                :patternColor="sock.patternColor"
                :pattern="sock.pattern"
                :class="{'second-sock-custom' : currentChosenSockCollection ==='CUSTOM', 'second-sock':currentChosenSockCollection !=='CUSTOM' }"
              />
               <div class="sock-minus"><img  @click="removeSock(sock)" v-if="sock.type==='double' && currentChosenSockCollection ==='CUSTOM'" src="../assets/icons/remove.png" class="sock-minus-icon"></div>
               
            </div>
            
            
          </div>
          <div class="add-button-outer">
            <div
              v-if="isLaboratory && currentChosenSockCollection === 'CUSTOM'"
              class="add-button"
              @click="openSockCustomizer()"
            >
              <img
                id="plus-icon"
                src="../assets/icons/plus.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="right-side">
        <div
          class="supermarket-container"
          v-if="!showModal && moduleName === 'supermarket'"
        >
          <div class="chooser">
            <h3
              v-if="currentChosenSupermarket != 'SMALL' && isLaboratory"
              @click="
                currentChosenSupermarket =
                  currentChosenSupermarket === 'MEDIUM' ? 'SMALL' : 'MEDIUM'
              "
              class="previous-chapter"
            >
              &lt;&lt;
            </h3>
            <h3 v-else class="previous-chapter"></h3>
            <h3 v-if="!isLaboratory&&!challengeId">
              {{t('SUPERMARKET')+': '+ t(allSimulations[currentSimulation].supermarket) }}
            </h3>
            <h3 v-else-if="!challengeId">{{t('SUPERMARKET')+': '+ t(currentChosenSupermarket) }}</h3>
            <h3
              v-show="currentChosenSupermarket != 'LARGE' && isLaboratory"
              @click="
                currentChosenSupermarket =
                  currentChosenSupermarket === 'MEDIUM' ? 'LARGE' : 'MEDIUM'
              "
              class="next-chapter"
            >
              &gt;&gt;
            </h3>
          </div>
          <div>
            <Supermarket
              v-if="!isLaboratory &&!challengeId"
              :shelfData="
                mdl[0].supermarketLayouts.filter(
                  (l) =>
                    l.name === allSimulations[currentSimulation].supermarket
                )[0].shelfs
              "
              :isStory="isStory"
              :size="allSimulations[currentSimulation].supermarket"
              :algorithm="allSimulations[currentSimulation].algorithm"
              :shoppingListProp="allSimulations[currentSimulation].shoppingList"
              :allShelfs="
                mdl[0].supermarketLayouts.filter((l) => l.name === 'LARGE')[0]
                  .shelfs
              "
              @handleClickContinueStory="$emit('handleClickContinueStory')"
              @resetBoughtItems="boughtItems = []"
              :boughtItems="boughtItems"
            />
            <Supermarket
              v-else-if="challengeId"
              :shelfData="
                mdl[0].supermarketLayouts.filter(
                  (l) =>
                    l.name === mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).supermarket
                )[0].shelfs
              "
              :isStory="isStory"
              :size="mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).supermarket"
              :algorithm="mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).algorithm"
              :shoppingListProp="mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).shoppingList"
              :allShelfs="
                mdl[0].supermarketLayouts.filter((l) => l.name === 'LARGE')[0]
                  .shelfs
              "
              @handleClickContinueStory="$emit('handleClickContinueStory')"
              @resetBoughtItems="boughtItems = []"
              @nextChallenge="challengeId = (parseInt(challengeId)+1).toString()"
              :boughtItems="boughtItems"
              :challenge="mdl[0].challenges.find(challenge => challenge.challengeId === challengeId)"
            />

            <Supermarket
              v-else
              :boughtItems="boughtItems"
              @resetBoughtItems="boughtItems = []"
              :shelfData="
                mdl[0].supermarketLayouts.filter(
                  (l) => l.name === currentChosenSupermarket
                )[0].shelfs
              "
              :size="currentChosenSupermarket"
              :algorithm="currentChosenAlgorithm"
              :shoppingListProp="currentChosenShoppingList"
              :allShelfs="
                mdl[0].supermarketLayouts.filter((l) => l.name === 'LARGE')[0]
                  .shelfs
              "
            />
          </div>
        </div>
        <div v-else-if="showModal && moduleName === 'supermarket'">
          <h2>{{t('ALL_ARTICLES')}}</h2>
          <div class="all-items-outer">
            <div class="all-items">
              <div
                class="category"
                v-for="category in allCategories"
                :key="category"
              >
                <div class="category-container">
                  <div class="category-header">{{ t(category.name) }}</div>
                  <div
                    class="item"
                    v-for="item in category.items.filter((i) => i !== '')"
                    :key="item"
                  >
                    <div
                      class="action"
                      @click="removeItem(item)"
                      v-if="currentChosenShoppingList.indexOf(item) >= 0"
                    >
                      <img
                        class="action-icon"
                        src="../assets/icons/negative.png"
                      />
                    </div>
                    <div class="action" @click="addItem(item)" v-else>
                      <img class="action-icon" src="../assets/icons/plus.png" />
                    </div>
                    <div class="item-name">{{ t(item) }}</div>
                    <div
                      class="item-availability"
                      :class="{ 'in-stock': isAvailable(item) }"
                    >
                      {{ isAvailable(item) ? "in-stock" : "out-of-stock" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="moduleName === 'socks'">
          <div v-show="!showSockCustomizer">
            <SockSorting 
            :trigger="trigger" 
            :challenge="mdl[0].challenges.find(challenge => challenge.challengeId === challengeId)" 
            :isStory="isStory" @handleClickContinueStory="$emit('handleClickContinueStory')" 
            :simulation="allSimulations[currentSimulation]"  
              :socksProp="socks" 
              :algorithm="challengeId? mdl[0].challenges.find(challenge => challenge.challengeId === challengeId).algorithm : isStory ? allSimulations[currentSimulation].algorithm : currentChosenAlgorithm"
              />
          </div>
          <div v-show="showSockCustomizer">
            <h2 class="customizer-text">{{t('SOCK_CUSTOMIZER')}}</h2>
            <div class="customizer">
              <div class="customizer-left">
                <div class="color-picker">
                  <div class="color-flex">
                  <div class="color-chooser" :class="{'color-chooser-chosen' : socksColorToChoose === 'color'}"  @click="socksColorToChoose='color'"><h3>{{t('SOCK')}}</h3></div>
                  <div class="color-chooser" :class="{'color-chooser-chosen' : socksColorToChoose === 'patternColor'}" @click="socksColorToChoose='patternColor'"><h3>{{t('PATTERN')}}</h3></div>
                  </div>
                  <div class="customizer-button color-button" @click="chooseColor(color)" :style="{'background-color' : color}" :class="{'choosen-color' : currentChosenSockColor === color && socksColorToChoose === 'color' || currentChosenSockPatternColor === color && socksColorToChoose === 'patternColor'}" v-for="color in mdl[0].colors" :key="color">
                  </div>
                </div>
              </div>
              <div>
                <Sock
                  :isCustomizer="true"
                  :color="currentChosenSockColor"
                  :lineAmount="currentChosenSockLineAmount"
                  :pattern="currentChosenSockPattern"
                  :patternColor="currentChosenSockPatternColor"
                />
                <div class="add-sock-box">
            
                  <div @click="addSocks('double')" class="add-sock-button customizer-button"><p>{{t('ADD_PAIR')}}</p> </div>
                </div>
                </div>
                <div class="customizer-right">
          
          
                <div class="outer-picker">
                  <h3>{{t('PATTERN')}}</h3>
                  <div class="selection-box">
                    <div @click="currentChosenSockPattern='None'" class="customizer-button"><p>None</p></div>
                    <div @click="currentChosenSockPattern='heart'" class="customizer-button pattern-icon"><p>&#10084;</p></div>
                    <div @click="currentChosenSockPattern='dots'" class="customizer-button pattern-icon"><p>&#11044;</p></div>
                    <div @click="currentChosenSockPattern='JKU'" class="customizer-button"><img id='jku-icon' src="../assets/icons/jku.png"/></div>
                  </div>
                  <h3>{{t('STRIPES')}}</h3>
                  <div class="selection-box">
                    <div @click="currentChosenSockLineAmount=0" class="customizer-button"><p>0</p></div>
                    <div @click="currentChosenSockLineAmount=1" class="customizer-button"><p>1</p></div>
                    <div @click="currentChosenSockLineAmount=2" class="customizer-button"><p>2</p></div>
                    <div @click="currentChosenSockLineAmount=3" class="customizer-button"><p>3</p></div>
                  </div>
                </div>
              </div>
            </div>
          
          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import getModule from "../composables/getModule";
import CodeBox from "../components/CodeBox.vue";
import SockSorting from "../components/SockSorting.vue";
import Supermarket from "../components/Supermarket.vue";
import Sock from "../components/Sock.vue";
import { onMounted } from "@vue/runtime-core";
import { store } from '../store.js'
import {t} from "../helpers/helperFunctions.js"
import  {isSameSock}  from "../helpers/helperFunctions.js"
export default {
  props: ["moduleName", "laboratory", "isStory", "chapterId","lva", "challengeId"],
  name: "AlgorithmOverview",
  components: { CodeBox, Supermarket, Sock, SockSorting },
  setup(props) {
    console.log(props)
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    const isLaboratory = ref(false);
    isLaboratory.value = props.laboratory === "laboratory" ? true : false;
    const allSimulations = ref([]);
    const showModal = ref(false);
    const showSockCustomizer = ref(false);
    const socksColorToChoose = ref('color');
    const challenge = ref(mdl.value[0].challenges[parseInt(props.challengeId)-1])
    const currentChosenAlgorithm = ref(1);

    const currentChosenSockCollection = ref("SMALL");
    const currentChosenSupermarket = ref("SMALL");
    const currentChosenShoppingList = ref(["MILK", "APPLE", "BANANA", "SALAD"]);
    const boughtItems = ref([]);
    const currentChosenSockColor = ref('green');
    const currentChosenSockPatternColor = ref('blue');
    const currentChosenSockPattern = ref('JKU');
    const currentChosenSockLineAmount = ref(0);
    const chooseColor = (color) => {
      if (socksColorToChoose.value === 'color') {
        currentChosenSockColor.value = color;
      } else {
        currentChosenSockPatternColor.value = color;
      }

    }
   
    const getAllCategories = () => {
      if (props.moduleName !== "supermarket") return [];
      console.log("called");
      let allShelfs = mdl.value[0].supermarketLayouts.filter(
        (l) => l.name === "LARGE"
      )[0].shelfs;
      let res = [];
      let added = [];
      let i = 0;
      console.log(allShelfs,mdl.value[0].supermarketLayouts)
      allShelfs.forEach((element) => {
        if (added.indexOf(element.name) === -1) {
          res.push(element);
          added.push(element.name, i);
          i++;
        } else {
          res[added[added.indexOf(element.name) + 1]].items.push(
            ...element.items
          );
        }
      });
      return res;
    };
    const allCategories = getAllCategories();

    const openModal = () => {
      showModal.value = !showModal.value;
    };
    const openSockCustomizer = () => {
      showSockCustomizer.value = !showSockCustomizer.value;
    };

    const addItem = (item) => {
      if (currentChosenShoppingList.value.length < 10) {
        currentChosenShoppingList.value.push(item);
      }
    };
    const removeItem = (item) => {
      currentChosenShoppingList.value.splice(
        currentChosenShoppingList.value.indexOf(item),
        1
      );
    };
    const isAvailable = (item) => {
      if (props.moduleName !== "supermarket") return 0;
      return (
        mdl.value[0].supermarketLayouts
          .filter((l) => l.name === currentChosenSupermarket.value)[0]
          .shelfs.filter((shelf) => shelf.items.indexOf(item) >= 0).length > 0
      );
    };

    
    const getCurrentSimulation = () => {
      for (let chapter in mdl.value[0].chapters) {
        allSimulations.value.push(
          ...mdl.value[0].chapters[chapter].simulations
        );
      }
      let index = 0;
      console.log(allSimulations.value)
      for (let i = 0; i < allSimulations.value.length; i++) {
        if (allSimulations.value[i].name === props.chapterId) {
          index = i;
        }
      }
      
      return index;
    }
    const currentSimulation = ref(getCurrentSimulation())
    currentChosenSockCollection.value = allSimulations.value[currentSimulation.value].collection
    console.log(currentSimulation.value, allSimulations.value, allSimulations.value[currentSimulation.value])
      
       const customSocks =(props.moduleName == "socks") ?   mdl.value[0].sockCollections.find(c => c.name === 'CUSTOM').socks : []
    
    const getSocks = () => {
      console.log(isLaboratory.value, customSocks,currentChosenSockCollection.value, mdl.value[0].sockCollections, currentSimulation.value, props)
      let socks;
       if (props.moduleName === "socks") {
      socks =  (props.challengeId ? mdl.value[0].challenges.find(challenge => challenge.challengeId === props.challengeId).socks :currentChosenSockCollection.value !== 'CUSTOM' ?  mdl.value[0].sockCollections.find(
                      (c) => c.name === currentChosenSockCollection.value
                    ).socks : customSocks)
    }
    return socks;
    }
    const socks = ref(getSocks());

    const calcPotentialSockAmount = (typeNext) => {
      let res = 0;
      for (let i = 0; i < socks.value.length; i++) {
        res = res + (socks.value[i].type === 'single' ? 1 : 2)
      }
      res = res + (typeNext === 'single' ? 1 : 2);
      return res; 

    }

    const addSocks = (type) => {
      if (calcPotentialSockAmount(type) > 24) return;
      console.log(type)
      const sock = {color: currentChosenSockColor.value, lineAmount: currentChosenSockLineAmount.value, pattern: currentChosenSockPattern.value, patternColor: currentChosenSockPatternColor.value, type: type}
      if (type === 'double') {
        customSocks.push(sock)
      } else {
        const singleSock = customSocks.find(s => {
          return (isSameSock(sock, s) && s.type === 'single')
          })
        console.log(singleSock)
        if (!singleSock) {customSocks.push(sock)}
        else singleSock.type = 'double'
      }
      trigger.value = !trigger.value
    }



    const getCurrentCategories = () => {
      if (props.moduleName === 'socks') return;
     
      let shoppingListCurrent = challenge.value? challenge.value.shoppingList
        :  isLaboratory.value
        ? currentChosenShoppingList.value
        : allSimulations.value[currentSimulation.value].shoppingList;
      let res = [];
      for (let i = 0; i < shoppingListCurrent.length; i++) {
        for (let u = 0; u < allCategories.length; u++) {
          if (allCategories[u].items.indexOf(shoppingListCurrent[i]) >= 0) {
            res.push(allCategories[u].name);
          }
        }
      }
      console.log(res)
      return res;
    };
    const removeSock = (sock) => {
      const index = customSocks.indexOf(sock);
      if (sock.type === 'single') {
        customSocks.splice(index,1)
      } else {
        const anotherSock = customSocks.find(s => {
          return (
            s.color === sock.color &&
            s.pattern === sock.pattern &&
            s.patternColor === sock.patternColor &&
            s.lineAmount === sock.lineAmount &&
            s.type === 'single'
          )
        }
       
        );
        if (anotherSock) {
          anotherSock.type = 'double'
          customSocks.splice(index,1)
        } else {
          customSocks[index].type = 'single'
        }
        
      }
      trigger.value = !trigger.value
    }
    const currentCategories = getCurrentCategories();
    const trigger = ref(false);
    return {
      mdl,
      getAllCategories,
      currentChosenSockCollection,
      openSockCustomizer,
      showSockCustomizer,
      trigger,
      boughtItems,
      challenge,
      getCurrentCategories,
      currentCategories,
      allCategories,
      openModal,
      removeItem,
      getCurrentSimulation,
      addItem,
      isAvailable,
      showModal,
      currentSimulation,
      customSocks,
      socks,
      addSocks,
      removeSock,
      getSocks,
      allSimulations,
      isLaboratory,
      onMounted,
      store,
      currentChosenAlgorithm,
      currentChosenSupermarket,
      currentChosenShoppingList,
      currentChosenSockColor,
      currentChosenSockPatternColor,
      currentChosenSockLineAmount,
      currentChosenSockPattern,
      socksColorToChoose,
      chooseColor,
      t
    };
  },
  watch: {
    currentSimulation() {
      this.currentCategories = this.getCurrentCategories();
      console.log('simulation changed')
      this.currentChosenSockCollection = this.allSimulations[this.currentSimulation].collection
      this.currentChosenAlgorithm = this.allSimulations[this.currentSimulation].algorithm
      this.socks = this.getSocks();

    },
    currentChosenShoppingList() {
      this.currentCategories = this.getCurrentCategories();
    },
    currentChosenSockCollection() {
 
      this.socks = this.getSocks();
    },
    customSocks() {
      this.trigger= !this.trigger
    },
  
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Schoolbell&display=swap");
.next-chapter {
  min-width: 50px;
  cursor: pointer;
}
.previous-chapter {
  min-width: 50px;
  cursor: pointer;
}

.grid {
  display: flex;
  padding-top: 1rem;
}

.two-socks-box {
  display: flex;
}

.code{
  width: 655px;
  background-color: #0e0e0e;
  margin-bottom: 0;
  margin-left: 0;
  border-radius: 12px;
  overflow: scroll;
  margin-right: 0;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.code-box::-webkit-scrollbar {
  display: none;
}
.supermarket-container {
  border-radius: 12px;
  margin-right: 0.1rem;
  margin-left: 0.1rem;
}
.algorithm-container {
  margin-bottom: 1rem;
}
.category-container {
  background-color: beige;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: left;
  border-radius: 12px;
}

#jku-icon {
  width: 30px;
  margin-top: 15px;
  filter: invert(99%) sepia(0%) saturate(4380%) hue-rotate(89deg) brightness(127%) contrast(98%);
}
.item {
  display: flex;

  padding-left: 1rem;
  padding-right: 1rem;
}

.smaller {
  height: 40px;
  position: absolute;
  
  padding-left: 0.5rem;
}
.nav-outer {
  text-align: left;
}

.shopping-outer {
  padding-top: 5.3rem;
}
.text-box {
  padding-left: 5%;
}
.item-availability {
  text-align: center;
  width: 8rem;
  background-color: indianred;
  border-radius: 20px;
  height: 1.5rem;
  color: beige;
  margin-left: 1rem;

}

.shopping-list-text {
  position: relative;
  font-family: "Schoolbell", cursive;
  font-size: 1.7rem;
  text-align: left;
  margin-bottom: 0.47rem;
}

@media (max-width: 1700px) {
  .shopping-list-text {
    margin-bottom: 0.5rem;
  }
  .shopping-outer {
    padding-top: 5.2rem;
  }
}
@media (max-width: 1500px) {
  .shopping-list-text {
    margin-bottom: 0.5rem;
  }
  .shopping-outer {
    padding-top: 5.2rem;
  }
  .code {
    width: 500px;
  }
  
}
@media (max-width: 1200px) {
  .shopping-list-text {
    margin-bottom: 0.9rem;
    font-size: 1.4rem;
  }
  .shopping-outer {
    padding-top: 5.4rem;
  }
  .code {
    width: 400px;
  }
  
  
}
@media (max-width: 1000px) {
  .shopping-list-text {
    margin-bottom: 0.24rem;
    font-size: 1.2rem;
  }
  .shopping-outer {
    padding-top: 3.3rem;
  }
  .shopping-list-container {
    max-height: 195px;
  }
  #edit-icon {
    max-height: 30px;
  }
}

h3 {
  margin-block-start: 0.3rem;
}

.customizer-right {
  margin-top: -4.5rem;
}

.sock-minus {
 
       right: 5.3rem;
    position:relative;
 
     cursor: pointer;
}



.sock-minus-icon {
 width:30px;
   height:30px;
   z-index: 10;
}

.sock-minus-icon:hover {
   filter: brightness(50%);
}
.category-header {
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
  font-weight: bold;
  text-align: center;
  padding-top: 0.3rem;
}
.right-side {

}

.action {
  width: 2rem;
  font-size: 1.4rem;
}
.action-icon {
  width: 1.5rem;
  cursor: pointer;
}

.item-name {
  text-align: left;
  width: 8rem;
}
.socks-all-collections {
  display: flex;
}
.sock-collection{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 650px;
  flex-wrap: wrap;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.add-button-outer {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 650px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.sock-collection::-webkit-scrollbar {
  display: none;
}
.item-availability {
  text-align: center;
  width: 8rem;
  background-color: indianred;
  border-radius: 20px;
  height: 1.5rem;
  color: beige;
  margin-left: 1rem;
}


.bought {
  text-decoration: line-through 2px red;
}

.in-stock {
  background-color: mediumseagreen;
}

.twoCols {
  column-count: 2;
  column-width: 12rem;
}

.add-button {
  position: absolute;
  cursor: pointer;
  padding-top: 0rem;
  padding-left: 1.2rem;
  z-index: 1;
}
.second-sock {
 margin-left: -50px;
}
.supermarket:after {
  content: "";
  display: block;
}
.category-container {
  break-inside: avoid;
  width: 21rem;
}
.customizer {
  width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.customizer-text {
  text-align: center;
}

#edit-icon, #plus-icon {
  height: 50px;
}

.all-items {
  column-count: 2;
  margin: 0 auto;
}

@media (min-width: 1700px) {
  
  .customizer {
    width: 1000px;
  }
  .all-items {
    width: 750px;
  }
}
@media (max-width: 1600px) {
  
  .customizer, .sorting {
    width: 900px;
  }
  .all-items {
    width: 750px;
  }
}
@media (max-width: 1500px) {
 
  .customizer,.sorting {
    width: 768px;
  }
  .all-items {
    width: 650px;
  }
  .category-container{
    width: 15rem;
    font-size: 0.95rem;
  }

  .item-name {
    padding-top: 0.2rem;
    padding-left: 0.2rem;
  }
}
@media (max-width: 1200px) {
  .all-items,
  .customizer {
    width: 640px;
  }
}
@media (max-width: 1000px) {
  .all-items,
  .customizer {
    width: 528px;
  }
}

.customizer-button {
 
  height: 40px;
  min-width: 40px;
  cursor: pointer;
  text-align: center;
  background-color: #3f3f3f;
  box-shadow: 1px 1px 1px #3f3f3f;
    border-radius: 3px;
    margin: 0 auto;
    margin-top: -10px;
    text-decoration: none;
}

.color-flex {
  display: flex;
}
.customizer-button p {
  margin-top: 11px;
  color: white;
  text-decoration: none;
}

.add-sock-button {
  min-width: 150px;
  min-height: 60px;
}

.add-sock-button p {
  font-size: 1.5rem;
  margin-top: 0.95rem;
}

.two-socks-box-custom {
  margin-right: -2rem;
}

.pattern-icon p {
  margin-top: 9px;
}

.choose {
  width: 88px;
}

.color-picker {
  flex-wrap: wrap;
  width: 200px;
  display: flex;
  margin-top: -9rem;
}

.outer-picker {
  margin-top: -5rem;
}
.challenge-header {
  margin-bottom: -0.3rem;
  min-width: 400px;
}
.color-chooser {
  width: 96px;
  text-align: middle;
  cursor: pointer;
}

.color-chooser-chosen {
  text-decoration: underline;
}

.add-sock-box {
  display: flex;
  width: 415px;
}
.color-button {
  margin: 4px;
  width: 30px;
  box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.choosen-color {
  border: solid white;
}

.selection-box {
  display: flex;
  justify-content: space-between;
  width: 180px;
  align-items: center;
  margin-bottom: 2rem;
}

.second-sock-custom {
  margin-left: -80px;
}

.all-items-outer {

}

#shopping-list {
  width: 98%;
  padding: 0 auto;
  text-align: center;
  margin-left: -0.3rem;
}
.shopping-list-container {
  width: 97.5%;
  align-items: center;
  margin-top: -0.1rem;
  background-image: url("../assets/images/notetop.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 295px;
}
.header-overview {
  display: flex;
  width: 440px;
  margin: 0 auto;
  justify-content: space-between;
  text-align: center;
  margin-bottom: -1rem;
}

.chooser {
  display: flex;
  margin: 0 auto;
  margin-top: -0.75rem;
  text-align: center;
  width: 70%;
  align-items: center;
  justify-content: center;
}


.right-side, .left-side{
  margin: 0 auto;
}
</style>
