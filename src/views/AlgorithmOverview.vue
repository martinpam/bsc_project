<template>
  <div>
    <div class="header-overview">
      <div class="previous-chapter" @click="currentSimulation--" ><h1 v-show="currentSimulation!=0" >&lt;&lt;</h1></div>
      <h1>{{ mdl[0].name_de }} Kapitel {{allSimulations[currentSimulation].name}}</h1>
      <div class="next-chapter"  @click="currentSimulation++"><h1 v-show="currentSimulation!=(allSimulations.length-1) ">&gt;&gt;</h1></div>
    </div>
    <div class="grid">
        <div class="left-side">
           <div class="algorithm-container">
          <h3>Algorithmus: {{ allSimulations[currentSimulation].algorithm }}</h3>
          <CodeBox class="code-box"
            :algorithm="
              mdl[0].algorithms[allSimulations[currentSimulation].algorithm - 1]
                .lines
            "
          />
        </div>
        <div class="shopping-list-container">
          <h3>
            Einkaufsliste:
          </h3>
          {{ allSimulations[currentSimulation].shoppingList }}
        </div>
        </div>
        <div class="right-side">
         <div class="supermarket-container">
          <h3>Supermarkt: {{ allSimulations[currentSimulation].supermarket }} </h3>
          <Supermarket :size="allSimulations[currentSimulation].supermarket" :algorithm="allSimulations[currentSimulation].algorithm" :shoppingList="allSimulations[currentSimulation].shoppingList"/>
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
export default {
  props: ["moduleName"],
  name: "AlgorithmOverview",
  components: { CodeBox, Supermarket },
  setup(props) {
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    const currentSimulation = ref(0);
    const allSimulations = ref([]);
    console.log(mdl.value[0]);
    for (let chapter in mdl.value[0].chapters) {
      allSimulations.value.push(...mdl.value[0].chapters[chapter].simulations);
    }
    return { mdl, currentSimulation, allSimulations };
  },
};
</script>

<style>
.next-chapter {
  min-width: 80px;
  cursor: pointer;
}
.previous-chapter {
  min-width: 80px;
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

.supermarket:after {
    content: "";
    display: block;

}
.header-overview {
  display: flex;
  width: 670px;
  margin: 0 auto;
  justify-content: space-between;
}



.code-box {
    width: 95%;
}
</style>
