<template>
  <div>
    <div class="header-overview">
      <div  class="previous-chapter" @click="currentSimulation--" ><h1 v-show="currentSimulation!=0  && !isLaboratory" >&lt;&lt;</h1></div>
      <h2 v-if="!isLaboratory">{{ mdl[0].name_de }}  Kapitel {{allSimulations[currentSimulation].name}}</h2>
      <h2 v-else>Labor - {{ mdl[0].name_de }}</h2>
      <div class="next-chapter"  @click="currentSimulation++"><h1 v-show="currentSimulation!=(allSimulations.length-1) && !isLaboratory ">&gt;&gt;</h1></div>
    </div>
    <div class="grid">
        <div class="left-side">
           <div class="algorithm-container">
          <div class="chooser">
            <h3 v-if="currentChosenAlgorithm!=1 && isLaboratory" @click="currentChosenAlgorithm--" class="previous-chapter">&lt;&lt;</h3>
            <h3 v-else class="previous-chapter">  </h3>
            <h3 v-if="!isLaboratory">Algorithmus: {{ allSimulations[currentSimulation].algorithm }}</h3>
            <h3 v-else>Algorithmus: {{ currentChosenAlgorithm }}</h3>
            <h3 v-show="currentChosenAlgorithm!=5 && isLaboratory" @click="currentChosenAlgorithm++" class="next-chapter">&gt;&gt;</h3>
          </div>
          <CodeBox v-if="!isLaboratory" class="code-box"
            :algorithm="
              mdl[0].algorithms[allSimulations[currentSimulation].algorithm - 1]
                .lines
            "
          />
          <CodeBox v-else class="code-box"
            :algorithm="
              mdl[0].algorithms[currentChosenAlgorithm-1]
                .lines
            "
          />
        </div>
        <div class="shopping-list-container">
          <div class="add-button" @click="openModal()">&#43;</div>
          <div class="shopping-outer" 
          :class="{
            'twoCols' : isLaboratory && currentChosenShoppingList.length > 4 || allSimulations[currentSimulation].shoppingList.length > 4, 
            'threeCols' : isLaboratory && currentChosenShoppingList.length > 8 || allSimulations[currentSimulation].shoppingList.length > 8, 
            
            }">
            <div v-if="!isLaboratory"> <div class="shopping-list-text" v-for="item in allSimulations[currentSimulation].shoppingList" :key="item">{{item}}</div></div>
            <div v-else><div class="shopping-list-text" v-for="item in currentChosenShoppingList" :key="item">{{item}}</div></div>
          </div>
          <img id="shopping-list" src="../assets/images/notetop.png" alt="" srcset="">
        </div>
        </div>
        <div class="right-side">
         <div class="supermarket-container" v-if="!showModal" >
          <div class="chooser">
            <h3 v-if="currentChosenSupermarket!='small' && isLaboratory" @click="currentChosenSupermarket = currentChosenSupermarket === 'medium' ? 'small' : 'medium'" class="previous-chapter">&lt;&lt;</h3>
            <h3 v-else class="previous-chapter">  </h3>
            <h3 v-if="!isLaboratory">Supermarkt: {{ allSimulations[currentSimulation].supermarket }}</h3>
            <h3 v-else>Supermarkt: {{ currentChosenSupermarket }} </h3> 
            <h3  v-show="currentChosenSupermarket!='large' && isLaboratory" @click="currentChosenSupermarket = currentChosenSupermarket === 'medium' ? 'large' : 'medium'" class="next-chapter">&gt;&gt;</h3>
          </div>
          <div >
            <Supermarket v-if="!isLaboratory" :shelfData="mdl[0].supermarketLayouts.filter((l) => l.name === allSimulations[currentSimulation].supermarket)[0].shelfs" :size="allSimulations[currentSimulation].supermarket" :algorithm="allSimulations[currentSimulation].algorithm" :shoppingListProp="allSimulations[currentSimulation].shoppingList"/>
            <Supermarket v-else :shelfData="mdl[0].supermarketLayouts.filter((l) => l.name === currentChosenSupermarket)[0].shelfs" :size="currentChosenSupermarket" :algorithm="currentChosenAlgorithm" :shoppingListProp="currentChosenShoppingList"/>
          </div>
          
        </div>
        <div v-else >
          <h2>alle Artikel</h2>
            <div class="all-items">
              <div class="category" v-for="category in allCategories" :key="category">
                 <div class="category-container">
                   <div class="category-header">{{category.name}}</div>
                   
                   <div class="item" v-for="item in category.items.filter((i) => i !=='')" :key="item">
                   
                       <div class="action" @click="removeItem(item)" v-if=" currentChosenShoppingList.indexOf(item) >= 0"> <img class="action-icon" src="../assets/icons/negative.png"> </div>
                       <div class="action" @click="addItem(item)" v-else> <img class="action-icon" src="../assets/icons/plus.png"> </div>
                        <div class="item-name">{{item}}</div>
                        <div class="item-availability" :class="{  'in-stock' : isAvailable(item)}">{{ isAvailable(item) ? 'in-stock' : 'out-of-stock'}}</div>
                  

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
import Supermarket from "../components/Supermarket.vue";
import { onMounted } from "@vue/runtime-core";
export default {
  props: ["moduleName", "laboratory"],
  name: "AlgorithmOverview",
  components: { CodeBox, Supermarket },
  setup(props) {
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    const isLaboratory = ref(false);
    isLaboratory.value = props.laboratory === 'laboratory' ? true : false;
    console.log(isLaboratory.value)
    const currentSimulation = ref(2);
    const allSimulations = ref([]);
    const showModal = ref(false);
    const currentChosenAlgorithm = ref(1);
    const currentChosenSupermarket = ref('small');
    const currentChosenShoppingList = ref(['milk', 'apple', 'banana', 'salad' ]);
   
   

    const getAllCategories = () => {
      let allShelfs = mdl.value[0].supermarketLayouts.filter((l) => l.name === 'large')[0].shelfs
      let res = [];
      let added = [];
      let i = 0;
      allShelfs.forEach(element => {
        console.log(res, added)
        if (added.indexOf(element.name) === -1) {
          res.push(element);
          added.push(element.name, i);
          i++;
        } else {
          console.log(added[added.indexOf(element.name) +1])
          res[added[added.indexOf(element.name) +1]].items.push(...element.items)
        }
      
      });
      console.log(res)
      return res;
    }
     const allCategories = getAllCategories();

      const openModal = () => {
      showModal.value = !showModal.value
      console.log(allCategories)
      }


    const addItem = (item) => {
      currentChosenShoppingList.value.push(item);
    }
    const removeItem = (item) => {
      currentChosenShoppingList.value.splice(currentChosenShoppingList.value.indexOf(item), 1);
    }
    const isAvailable = (item) => {
      return mdl.value[0].supermarketLayouts.filter((l) => l.name === currentChosenSupermarket.value)[0].shelfs.filter((shelf) => shelf.items.indexOf(item) >= 0).length > 0;
    }
    console.log(mdl.value[0]);
    for (let chapter in mdl.value[0].chapters) {
      allSimulations.value.push(...mdl.value[0].chapters[chapter].simulations);
    }
    console.log(props)

    return { mdl, getAllCategories, allCategories, openModal, removeItem, addItem, isAvailable, showModal, currentSimulation, allSimulations, isLaboratory, onMounted , currentChosenAlgorithm, currentChosenSupermarket, currentChosenShoppingList};
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Schoolbell&display=swap');
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
    padding-top: 20px;
}
.left-side {
    width: 40%;
}
.right-side {
    width: 60%;
}
.supermarket-container {
    
    border-radius: 12px;
    margin-right: 25px;
    margin-left: 15px;
}
.algorithm-container {
  text-align: center;
  
}
.category-container {
  background-color: beige;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: left;
  border-radius: 12px;
  
  
}

.item {
  display: flex;

  padding-left: 1rem;
  padding-right: 1rem;
}

.shopping-list-text {
  position: relative;
  font-family: 'Schoolbell', cursive;
  font-size:1.7rem;
  text-align: left;
  margin-bottom: 0.4rem;

}

.category-header {
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
  font-weight: bold;
  text-align: center;
  padding-top: 0.3rem;
}
.shopping-outer {
  position: absolute;
  padding-top: 5rem;
  padding-left: 4rem;
  column-count: 1;
  column-width: 30rem;
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

.item-availability {
  text-align: center;
  width: 8rem;
  background-color: indianred;
  border-radius: 20px;
  height: 1.5rem;
  color: beige; 
}

.in-stock {
  background-color: mediumseagreen;
}



.twoCols {
  column-count: 2;
  column-width: 16rem;
}

.threeCols {
  column-count: 3;
  column-width: 10.5rem;
}

.add-button {
  position: absolute;
  left: 26.5rem;
  margin-top: -0.7rem;
  font-size: 5rem;
  cursor: pointer;
  z-index: 1;
}

.supermarket:after {
    content: "";
    display: block;

}

.all-items {
  column-count: 2;
  width: 42rem;
  margin: 0 auto;
}

.category-container {
  break-inside: avoid;
  width: 19rem;
}

#shopping-list {
  width: 95%;
   padding: 0 auto;
  text-align: center;
  padding-left: 0.8rem;

}
.shopping-list-container {
  width: 100%;
  align-items: center;
  margin-top: -0.1rem;
 
}
.header-overview {
  display: flex;
  width: 670px;
  margin: 0 auto;
  justify-content: space-between;
  text-align: center;
  margin-bottom: -1rem;
}

.chooser {
  display: flex;
  margin: 0 auto;
 
  text-align: center;
  width : 300px;
}


.code-box {
    width: 96%;
}


</style>
